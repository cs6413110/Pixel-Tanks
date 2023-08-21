try {
  PF = require('pathfinding');
} catch (e) {}

const collision = (x, y, w, h, x2, y2, w2, h2) => (x + w > x2 && x < x2 + w2 && y + h > y2 && y < y2 + h2);
const toAngle = (x, y) => (-Math.atan2(x, y)*180/Math.PI+360)%360;
const toPoint = angle => {
  const theta = (-angle) * Math.PI / 180, y = Math.cos(theta), x = Math.sin(theta);
  return x === 0 ? {x, y: y/Math.abs(y)} : {x: x/Math.abs(x), y: y/Math.abs(x)}
}

class Compute {
  static initialize(t) {
    this.workers = [];
    for (let i = 0; i < t; i++) this.pushWorker();
  }

  static async pushWorker() {
    const worker = await spawn(new Worker('./compute.js'));
    worker.ready = true;
    this.workers.push(worker);
    return worker;
  }

  static async pushWork(id, ...params) {
    let worker = this.workers.find(w => w.ready);
    if (!worker) worker = this.pushWorker();
    worker.ready = false;
    const output = await worker[id](...params);
    worker.ready = true;
    return output;
  }
}
//Compute.initialize(4);

class Engine {
  constructor(levels) {
    this.spawn = { x: 0, y: 0 };
    this.ai = [];
    this.b = [];
    this.s = [];
    this.pt = [];
    this.d = [];
    this.i = [];
    this.t = [];
    this.logs = [];
    this.map = new PF.Grid(30, 30);
    this.levelReader(levels[Math.floor(Math.random() * levels.length)]);
    this.i.push(setInterval(() => this.tick(), 1000 / 60));
  }

  add(data) {
    data = { ...data, damage: false, maxHp: data.rank * 10 + 300, hp: data.rank * 10 + 300, deathsPerMovement: 0, canBashed: true, shields: 0, team: data.username + ':' + Math.random(), x: this.spawn.x, y: this.spawn.y, r: 0, pushback: 0, baseRotation: 0, baseFrame: 0, fire: false, healing: data.username};
    this.override(data);
    this.pt.push(data);
  }

  update(data) {
    const t = this.pt.find(t => t.username === data.username);
    data = data.data;
    const { emote, r, baseFrame, use, x, y, fire, airstrike} = data;
    if ((t.emote !== emote || t.r !== r || t.baseFrame !== baseFrame || use.length || fire.length) || (!t.grapple && (t.x !== x || t.y !== y))) t.deathsPerMovement = 0;
    t.baseRotation = data.baseRotation;
    t.immune = data.immune;
    t.animation = data.animation;
    t.emote = emote;
    t.invis = data.invis;
    t.baseFrame = baseFrame;
    if (!t.grapple) {
      t.x = x;
      t.y = y;
    }
    t.r = r;
    if (t.ded) return;
    if (t.immune && (t.class === 'fire' || t.class === 'builder')) {
      const team = this.parseTeamExtras(t.team), type = t.class === 'fire' ? 'fire' : 'weak';
      if ((t.x + 80) % 100 > 80 && [45, 90, 135].includes(t.baseRotation)) this.b.push(new Block(Math.floor(t.x / 100) * 100 + 100, Math.floor(t.y / 100) * 100, 100, type, team, this));
      if (t.x % 100 < 20 && [225, 270, 315].includes(t.baseRotation)) this.b.push(new Block(Math.floor(t.x / 100) * 100 - 100, Math.floor(t.y / 100) * 100, 100, type, team, this));
      if ((t.y + 80) % 100 > 80 && [135, 180, 225].includes(t.baseRotation)) this.b.push(new Block(Math.floor(t.x / 100) * 100, Math.floor(t.y / 100) * 100 + 100, 100, type, team, this));
      if (t.y % 100 < 20 && [315, 0, 45].includes(t.baseRotation)) this.b.push(new Block(Math.floor(t.x / 100) * 100, Math.floor(t.y / 100) * 100 - 100, 100, type, team, this));
    }
    if (use.includes('dynamite')) {
      for (let i = this.s.length-1; i >= 0; i--) {
        const s = this.s[i];
        if (this.getUsername(s.team) !== t.username || s.type !== 'dynamite') continue;
        this.d.push(new Damage(s.x-100, s.y-100, 200, 200, 100, s.team, this));
        s.destroy();
      }
    }
    if (use.includes('toolkit')) {
      if (t.healInterval) {
        t.healInterval = clearInterval(t.healInterval);
        clearTimeout(t.healTimeout);
      } else {
        t.healInterval = setInterval(() => {
          t.hp = Math.min(t.maxHp, t.hp + 1);
          const ai = this.ai.find(a => this.getUsername(a.team) === t.username);
          if (ai) ai.hp = Math.min(ai.maxHp, ai.hp + 1);
        }, 100);
        t.healTimeout = setTimeout(() => {
          t.hp = t.maxHp;
          const ai = this.ai.find(a => this.getUsername(a.team) === t.username);
          if (ai) ai.hp = ai.maxHp;
          t.healInterval = clearInterval(t.healInterval);
        }, 7500);
      }
    }
    if (use.includes('tape')) {
      t.hp = Math.min(t.maxHp, t.hp + t.maxHp / 4);
      const ai = this.ai.find(a => this.getUsername(a.team) === t.username);
      if (ai) ai.hp = Math.min(ai.maxHp, ai.hp + ai.maxHp / 4);
    }
    if (use.includes('glu')) {
      clearInterval(t.gluInterval);
      clearTimeout(t.gluTimeout);
      t.gluInterval = setInterval(() => {
        t.hp = Math.min(t.maxHp, t.hp + 3);
        const ai = this.ai.find(a => this.getUsername(a.team) === t.username);
        if (ai) ai.hp = Math.min(ai.maxHp, ai.hp + 3);
      }, 100);
      t.gluTimeout = setTimeout(() => clearInterval(t.gluInterval), 5000);
    }
    if (use.includes('block')) {
      const coordinates = [{ r: [337.5, 360], dx: -10, dy: 80 }, { r: [0, 22.5], dx: -10, dy: 80 }, { r: [22.5, 67.5], dx: -100, dy: 80 }, { r: [67.5, 112.5], dx: -100, dy: -10 }, { r: [112.5, 157.5], dx: -100, dy: -100 }, { r: [157.5, 202.5], dx: -10, dy: -100 }, { r: [202.5, 247.5], dx: 80, dy: -100 }, { r: [247.5, 292.5], dx: 80, dy: -10 }, { r: [292.5, 337.5], dx: 80, dy: 80 }];
      for (const coord of coordinates) {
        if (r >= coord.r[0] && r < coord.r[1]) {
          this.b.push(new Block(t.x + coord.dx, t.y + coord.dy, { strong: 200, weak: 100, gold: 300, mine: 0, spike: 0, fortress: 150 }[data.blockType], data.blockType, t.team, this));
          break;
        }
      }
    }
    if (use.includes('flashbang')) {
      this.pt.forEach(tank => {
        if (!collision(tank.x - 860, tank.y - 560, 1800, 1200, t.x, t.y, 80, 80) || tank.username === t.username) return;
        tank.flashbanged = true;
        clearTimeout(tank.flashbangTimeout);
        tank.flashbangTimeout = setTimeout(() => {
          tank.flashbanged = false;
        }, 1000);
      });
    }
    if (use.includes('bomb')) {
      for (let i = this.b.length-1; i >= 0; i--) {
        const b = this.b[i];
        if (collision(t.x, t.y, 80, 80, b.x, b.y, 100, 100)) b.destroy();
      }
    }
    if (use.includes('turret')) {
      this.ai = this.ai.filter(ai => this.getUsername(ai.team) !== t.username);
      this.ai.push(new AI(Math.floor(t.x / 100) * 100 + 10, Math.floor(t.y / 100) * 100 + 10, 0, t.rank, t.team, this));
    }
    if (use.includes('buff')) {
      t.buff = true;
      setTimeout(() => {
        t.buff = false;
      }, 15000);
    }
    if (use.includes('healSwitch')) {
      let a = [];
      this.pt.forEach(tank => {
        if (this.getTeam(tank.team) === this.getTeam(t.team)) a.push(tank.username);
      });
      t.healing = a[(a.indexOf(t.healing)+1)%a.length]; //lots of brain cells died for this line of code <R.I.P>
    }
    if (use.includes('shield')) t.shields = Math.min(500, t.shields + 100);
    if (airstrike) {
      this.b.push(new Block(airstrike.x, airstrike.y, Infinity, 'airstrike', this.parseTeamExtras(t.team), this));
    }
    if (fire.length > 0) {
      t.pushback = -6;
      for (const s of fire) this.s.push(new Shot(t.x + 40, t.y + 40, s.x, s.y, s.type, s.r, this.parseTeamExtras(t.team), this));
    }
  }

  tick() {
    const mapRedone = false;
    for (const ai of this.ai) ai.update();
    for (const s of this.s) s.update()

    for (const t of this.pt) {
      if (t.dedEffect) t.dedEffect.time = Date.now() - t.dedEffect.start;
      if (t.class === 'medic' && !t.ded && t.username !== t.healing) {
        const tank = this.pt.find(tank => tank.username === t.healing);
        if (!tank) {
          t.healing = t.username;
        } else if ((t.x - tank.x) ** 2 + (t.y - tank.y) ** 2 < 250000) tank.hp = Math.min(tank.hp + .2, tank.maxHp);
      }
      if (t.pushback !== 0) t.pushback += 0.5;
      if (t.fire && this.getTeam(t.fire.team) !== this.getTeam(t.team)) this.damagePlayer(t, { x: t.x, y: t.y, u: this.getUsername(t.fire.team), a: .5 });
      for (const tank of this.pt) {
        if (!tank.canBashed || t.ded) continue;
        if ((t.class === 'warrior' && this.getTeam(t.team) !== this.getTeam(tank.team)) || (t.class === 'medic' && this.getTeam(t.team) === this.getTeam(tank.team))) {
          if (!collision(t.x, t.y, 80, 80, tank.x, tank.y, 80, 80)) continue;
          this.damagePlayer(tank, { x: tank.x, y: tank.y, u: t.username, a: t.class === 'warrior' ? 100 : -30 });
          tank.canBashed = false;
          setTimeout(() => {
            tank.canBashed = true;
          }, 400);
        }
      }
      for (let i = this.b.length-1; i >= 0; i--) {
        const b = this.b[i];
        if (collision(t.x, t.y, 80, 80, b.x, b.y, 100, 100) && !t.ded && !t.immune) {
          if (b.type === 'mine' && b.a) {
            b.destroy();
          } else if (b.type === 'fire') {
            if (t.fire) {
              clearTimeout(t.fireTimeout);
              t.fire = { team: b.team, frame: t.fire.frame };
            } else {
              t.fire = { team: b.team, frame: 0 };
              t.fireInterval = setInterval(() => {
                t.fire.frame = t.fire.frame === 0 ? 1 : 0;
              }, 50);
            }
            t.fireTimeout = setTimeout(() => {
              clearInterval(t.fireInterval);
              t.fire = false;
            }, 2000);
          } else if (b.type === 'spike' && this.getTeam(b.team) !== this.getTeam(t.team)) {
            this.damagePlayer(t, { a: 1, x: t.x, y: t.y, u: this.getUsername(b.team) });
          }
        }
      }
      if (t.damage) t.damage.y--;
      if (t.grapple) this.grapple(t);
    }
  }

  grapple(t) {
    const dx = t.grapple.target.x - t.x;
    const dy = t.grapple.target.y - t.y;

    if (dx ** 2 + dy ** 2 > 400) {
      const angle = Math.atan2(dy, dx);
      const mx = Math.cos(angle) * 20;
      const my = Math.sin(angle) * 20;

      if (this.collision(t.x + mx, t.y)) t.x += mx;
      if (this.collision(t.x, t.y + my)) t.y += my;
      t.grapple.bullet.sx = t.x + 40;
      t.grapple.bullet.sy = t.y + 40;
      this.override(t, [{ key: 'x', value: t.x }, { key: 'y', value: t.y }]);
      if ((!this.collision(t.x + mx, t.y) || Math.abs(mx) < 2) && (!this.collision(t.x, t.y + my) || Math.abs(my) < 2)) {
        t.grapple.bullet.destroy();
        t.grapple = false;
      }
    } else {
      t.grapple.bullet.destroy();
      t.grapple = false;
    }
  }

  collision(x, y) {
    if (x < 0 || y < 0 || x + 80 > 3000 || y + 80 > 3000) return false;
    for (const b of this.b) if (collision(x, y, 80, 80, b.x, b.y, 100, 100) && b.c) return false;
    return true;
  }

  levelReader(level) {
    let l, q, key = { '=': ['void', Infinity], '#': ['barrier', Infinity], '2': ['strong', 200], '1': ['weak', 100], '0': ['spike', 0], '3': ['gold', 300] };
    for (l = 0; l < level.length; l++) {
      for (q = 0; q < level[l].split('').length; q++) {
        const p = level[l].split('');
        if (p[q] === '@') {
          this.spawn = { x: q * 100, y: l * 100 };
        } else if (key[p[q]]) {
          this.b.push(new Block(q * 100, l * 100, key[p[q]][1], key[p[q]][0], ':', this));
        }
      }
    }
  }

  damagePlayer(victim, damage) {
    if (victim.immune || victim.ded) return;
    if (victim.shields > 0 && damage.a > 0) return victim.shields -= damage.a;
    if (victim.buff) damage.a *= .8;
    victim.hp = Math.min(victim.maxHp, victim.hp - damage.a);
    if (victim.damage) clearTimeout(victim.damage.ti);
    victim.damage = { d: (victim.damage ? victim.damage.d : 0) + damage.a, x: damage.x, y: damage.y, ti: setTimeout(() => { victim.damage = false }, 1000) };
    if (victim.hp <= 0 && this.ondeath) this.ondeath(victim, this.pt.find(t => t.username === damage.u));
  }

  parseTeamExtras(s) {
    return s.replace('@leader', '').split('@requestor#')[0];
  }

  getUsername(s) {
    return this.parseTeamExtras(s).split(':')[0];
  }

  getTeam(s) {
    return this.parseTeamExtras(s).split(':')[1];
  }
}

class Block {
  constructor(x, y, health, type, team, host) {
    this.x = x;
    this.y = y;
    this.maxHp = health;
    this.hp = health;
    this.type = type;
    this.host = host;
    this.s = false;
    this.c = !['spike', 'mine', 'fire', 'airstrike'].includes(type); // collision
    this.team = team;
    if (['spike', 'mine', 'fire'].includes(type)) this.sd = setTimeout(() => this.destroy(), type === 'fire' ? 5000 : 30000);
    if (type === 'airstrike') {
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          this.host.d.push(new Damage(this.x + Math.floor(Math.random()*200)-100, this.y + Math.floor(Math.random()*200)-100, 200, 200, 200, this.team, this.host));
        }, 5000 + Math.random() * 500);
        setTimeout(() => this.destroy(), 6000);
      }
    } else if (type === 'mine') {
      this.a = false;
      setTimeout(() => {
        this.a = true;
      }, 3000);
    }
  }

  damage(d) {
    this.hp = Math.max(this.hp - d, 0);
    if (this.hp !== Infinity) {
      this.s = true;
      clearTimeout(this.bar);
      this.bar = setTimeout(() => {
        this.s = false;
      }, 3000);
    }
    if (this.hp <= 0) this.destroy();
  }

  destroy() {
    clearTimeout(this.sd);
    if (this.type === 'mine') this.host.d.push(new Damage(this.x, this.y, 100, 100, 50, this.team, this.host));
    const index = this.host.b.indexOf(this);
    if (index !== -1) this.host.b.splice(index, 1);
  }
}

class Shot {
  constructor(x, y, xm, ym, type, rotation, team, host) {
    const settings = { damage: { bullet: 20, shotgun: 20, grapple: 0, powermissle: 100, megamissle: 200, healmissle: -100, dynamite: 0, fire: 0 }, speed: { bullet: 1, shotgun: .8, grapple: 2, powermissle: 1.5, megamissle: 1.5, healmissle: 1.5, dynamite: .8, fire: .9 } };
    const t = host.pt.find(t => t.username === host.getUsername(team));
    this.damage = settings.damage[type] * t.maxHp / 500 * (t.buff ? 1.2 : 1);
    this.team = team;
    this.r = rotation;
    this.type = type;
    this.host = host;
    this.e = Date.now();
    const factor = 18 / Math.sqrt(xm ** 2 + ym ** 2);
    this.xm = xm * factor;
    this.ym = ym * factor;
    const data = Shot.calc(x, y, xm, ym);
    this.x = data.x;
    this.y = data.y;
    this.sx = this.x;
    this.sy = this.y;
    this.md = this.damage;
    this.xm *= settings.speed[this.type];
    this.ym *= settings.speed[this.type];
  }

  static calc(x, y, xm, ym) {
    const r = 40;
    const a = xm === 0 ? 0 : ym / xm;
    const b = a > 0 ? -1 : 1;
    const c = Math.sqrt(r ** 2 + (r * a) ** 2);
    const d = Math.sqrt(1100 * c ** 2);
    const x1 = -r * b * d / c ** 2;
    const x2 = r * b * d / c ** 2;
    const y1 = Math.abs(r * a) * d / c ** 2;
    const y2 = -Math.abs(r * a) * d / c ** 2;
    return { x: ym >= 0 ? x1 * 2 + x : x2 * 2 + x, y: ym >= 0 ? y1 * 2 + y : y2 * 2 + y };
  }

  collision() {
    const key = { bullet: false, shotgun: false, powermissle: 50, megamissle: 100, healmissle: 50, fire: false };
    const { host, x, y, type } = this;
    const blocks = this.host.b, ais = this.host.ai, pt = this.host.pt;
    for (const t of pt) {
      if (t.ded || !collision(x, y, 10, 10, t.x, t.y, 80, 80)) continue;
      if (type === 'grapple') {
        if (t.grapple) t.grapple.bullet.destroy();
        t.grapple = { target: host.pt.find(tank => tank.username === host.getUsername(this.team)), bullet: this };
        this.target = t;
        this.offset = [t.x - x, t.y - y];
        this.update = () => {
          this.x = this.target.x - this.offset[0];
          this.y = this.target.y - this.offset[1];
        };
        return false;
      } else if (type === 'dynamite') {
        this.target = t;
        this.offset = [t.x - x, t.y - y];
        this.update = () => {
          this.x = this.target.x - this.offset[0];
          this.y = this.target.y - this.offset[1];
        }
        return false;
      } else if (type === 'fire') {
        if (t.fire) clearTimeout(t.fireTimeout);
        t.fire = { team: this.team, frame: t.fire?.frame || 0 };
        t.fireInterval ??= setInterval(() => t.fire.frame ^= 1, 50);
        t.fireTimeout = setTimeout(() => {
          clearInterval(t.fireInterval);
          t.fire = false;
        }, 2000);
      } else {
        if (key[type]) {
          host.d.push(new Damage(x - key[type] / 2 + 10, y - key[type] / 2 + 10, key[type], key[type], this.damage, this.team, host));
        } else if (host.getTeam(t.team) !== host.getTeam(this.team)) {
          host.damagePlayer(t, { a: this.damage, x: x, y: y, u: host.getUsername(this.team) });
        }
        return true;
      }
    };

    for (let i = ais.length-1; i >= 0; i--) {
      const ai = ais[i];
      if (!collision(ai.x, ai.y, 80, 80, x, y, 10, 10)) continue;
      if (type === 'dynamite') {
        this.target = ai;
        this.offset = [ai.x - x, ai.y - y];
        this.update = () => {
          this.x = this.target.x - this.offset[0];
          this.y = this.target.y - this.offset[1];
        }
        return false;
      } else {
        if (key[type]) {
          host.d.push(new Damage(x - key[type] / 2 + 10, y - key[type] / 2 + 10, key[type], key[type], this.damage, this.team, host));
        } else if (host.getTeam(ai.team) !== host.getTeam(this.team)) {
          ai.damage(this.damage);
        }
        return true;
      }
    }

    for (let i = blocks.length-1; i >= 0; i--) {
      const b = blocks[i];
      if (!b.c || !collision(b.x, b.y, 100, 100, x, y, 10, 10)) continue;
      if (type === 'grapple') {
        if (b.type === 'fortress' && host.getTeam(b.team) === host.getTeam(this.team)) return false;
        const t = this.host.pt.find(t => t.username === host.getUsername(this.team));
        if (t.grapple) t.grapple.bullet.destroy();
        t.grapple = { target: b, bullet: this };
        this.update = () => {};
        return false;
      } else if (type === 'dynamite') {
        if (b.type === 'fortress' && host.getTeam(b.team) === host.getTeam(this.team)) return false;
        this.update = () => {}
        return false;
      } else if (type === 'fire') {
        host.b.push(new Block(b.x, b.y, Infinity, 'fire', this.team, host));
        return true;
      } else {
        if (b.type === 'fortress' && host.getTeam(b.team) === host.getTeam(this.team)) return false;
        if (key[type]) {
          host.d.push(new Damage(x - key[type] / 2 + 10, y - key[type] / 2 + 10, key[type], key[type], this.damage, this.team, host));
        } else {
          b.damage(this.damage);
        }
        return true;
      }
    }

    if (x < 0 || x > 3000 || y < 0 || y > 3000) {
      if (type === 'grapple') {
        const t = host.pt.find(t => t.username === host.getUsername(this.team));
        if (t.grapple) t.grapple.bullet.destroy();
        t.grapple = { target: { x: x, y: y }, bullet: this };
        this.update = () => { };
        return false;
      } else if (type === 'dynamite') {
        this.update = () => {}
        return false;
      } else {
        if (key[type]) {
          host.d.push(new Damage(x - key[type] / 2 + 10, y - key[type] / 2 + 10, key[type], key[type], this.damage, this.team, host));
        }
        return true;
      }
    }
    return false;
  }

  update() {
    const time = (Date.now() - this.e) / 15;
    this.x = time * this.xm + this.sx;
    this.y = time * this.ym + this.sy;
    if (this.collision()) this.destroy();
    this.d = Math.sqrt((this.x - this.sx) ** 2 + (this.y - this.sy) ** 2);
    if (this.type === 'shotgun') {
      this.damage = this.md - (this.d / 300) * this.md;
      if (this.d >= 300) this.destroy();
    }
    if (this.type === 'dynamite') this.r += 5;
  }

  destroy() {
    const index = this.host.s.indexOf(this);
    if (index !== -1) this.host.s.splice(index, 1);
  }
}

class Damage {
  constructor(x, y, w, h, a, team, host) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.a = a;
    this.team = team;
    this.host = host;
    this.f = 0;
    for (const t of host.pt) if (host.getUsername(team) !== host.getUsername(t.team)) if (collision(x, y, w, h, t.x, t.y, 80, 80)) host.damagePlayer(t, { ...this, u: host.getUsername(team), a: host.getTeam(team) !== host.getTeam(t.team) ? Math.abs(a) : Math.min(0, a)});
    for (let i = host.b.length-1; i >= 0; i--) if (collision(x, y, w, h, host.b[i].x, host.b[i].y, 100, 100)) host.b[i].damage(a);
    for (let i = host.ai.length-1; i >= 0; i--) if (host.getTeam(host.ai[i].team) !== host.getTeam(team)) host.ai[i].damage(a);
    setInterval(() => this.f++, 18);
    setTimeout(() => this.destroy(), 200);
  }

  destroy() {
    const index = this.host.d.indexOf(this);
    if (index !== -1) this.host.d.splice(index, 1);
  }
}

class AI {
  constructor(x, y, role, rank, team, host) {
    this.role = role;
    this.x = x;
    this.y = y;
    this.r = 0;
    this.inaccuracy = 0;
    this.baseRotation = 0;
    this.baseFrame = 0;
    this.mode = 0;
    this.rank = rank;
    this.team = team;
    this.host = host;
    this.hp = rank * 10 + 300;
    this.maxHp = this.hp;
    this.pushback = 0;
    this.target = false;
    this.obstruction = false;
    this.bond = false;
    this.path = false;
    this.delay = false;
    this.canFire = true;
    this.canPowermissle = true;
    this.canItem = true;
    this.canClass = true;
    this.canBoost = true;
    this.immune = false;
    this.item = '';
    this.class = '';
    const t = host.pt.find(t => t.username === host.getUsername(this.team));
    this.cosmetic = t ? t.cosmetic : '';
  }

  update() {
    this.identify();
    if (this.role !== 0) this.move();
    if (this.obstruction && !this.target.s) {
      this.r = toAngle(this.obstruction.x-(this.x+40), this.obstruction.y-(this.y+40))+this.inaccuracy;
      if (this.canPowermissle) this.fire(this.obstruction.x, this.obstruction.y, 'powermissle');
      if (this.canFire) this.fire(this.obstruction.x, this.obstruction.y);
    } else if (this.mode !== 0) {
      this.r = toAngle(this.target.x - this.x, this.target.y - this.y)+this.inaccuracy;
      if (this.canPowermissle) this.fire(this.target.x, this.target.y, 'powermissle');
      if (this.canFire) this.fire(this.target.x, this.target.y);
    }
    if (this.pushback !== 0) this.pushback += 0.5;
  }

  move() {
    if ((this.x - 10) % 100 === 0 && (this.y - 10) % 100 === 0) this.onBlock();
    let frames = Math.floor((Date.now() - this.path.t) / 15);
    if ((this.path.p.length - 1) * 25 < frames) {
      if (this.path.p.length === 0) return;
      frames = (this.path.p.length - 1) * 25;
    }
    const f = Math.floor(frames / 25), n = f + 1 === this.path.p.length ? f : f + 1;
    const dirx = this.path.p[n][0] - this.path.p[f][0];
    const diry = this.path.p[n][1] - this.path.p[f][1];
    this.baseRotation = [[135, 180, 225], [90, this.baseRotation, 270], [45, 0, 315]][diry + 1][dirx + 1];
    this.r = this.baseRotation;
    const x = this.path.p[f][0] * 100 + 10 + dirx * 4 * (frames % 25);
    const y = this.path.p[f][1] * 100 + 10 + diry * 4 * (frames % 25);
    this.obstruction = this.collision(x, y);
    if (!this.obstruction) {
      if (this.canBoost) {
        this.canBoost = false;
        this.immune = Date.now();
        setTimeout(() => {this.immune = false}, 800);
        setTimeout(() => {this.canBoost = true}, 5000);
      }
      this.x = x;
      this.y = y;
    } else {
      this.path.t = this.path.o+Date.now()-this.obstruction.t;
    }
  }

  collision(x, y) {
    for (const b of this.host.b) {
      if (collision(x, y, 80, 80, b.x, b.y, 100, 100) && b.c) {
        return {x: b.x+50, y: b.y+50, t: this.obstruction ? this.obstruction.t : Date.now()};
      }
    }
    return false;
  }

  onBlock() {
    if (!this.path) this.generatePath();
    if (this.path.p.length === 0) this.generatePath();//setTimeout(() => this.generatePath(), 300); // .3s delay for failed path generation
    if (this.path.p.length !== 0) {
      const final = this.path.p[this.path.p.length - 1];
      if ((this.x - 10) / 100 === final[0] && (this.y - 10) / 100 === final[1]) {
        this.generatePath()//setTimeout(() => this.generatePath(), [Math.floor(Math.random()*300)+50][this.mode]); // .1s delay for after path finished
      }
    }
    if (this.path.m !== this.mode) this.generatePath();
  }

  generatePath() {
    const {mode, role, bond, target, r} = this;
    const sx = (this.x - 10) / 100, sy = (this.y - 10) / 100;
    // coords, sort order, path length limiter, target point, epicenter point
    let coords, sortAsc, limiter, ranged, tpx, tpy, epx, epy, tx, ty;
    if ([1, 2].includes(mode)) {
      tx = Math.floor((target.x+40)/100);
      ty = Math.floor((target.y+40)/100);
      ranged = Math.max(sx-tx, sy-ty) > [1, 5, 5, 8][role-1];
    }
    if (role === 3 && bond) {
      epx = Math.floor((bond.x+40)/100);
      epy = Math.floor((bond.y+40)/100);
    } else if (mode === 0 || (mode === 1 && ranged) || mode === 2) {
      epx = sx;
      epy = sy;
    } else if (mode === 1 && !ranged) {
      epx = tx;
      epy = ty;
    }
    if ((role === 3 && bond) || (role === 1 && mode === 1 && !ranged)) {
      coords = [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]];
    } else if (mode === 0 || mode === 2) {
      coords = [[0, -3], [1, -3], [2, -2], [3, -1], [3, 0], [3, 1], [2, 2], [1, 3], [0, 3], [-1, 3], [-2, 2], [-3, 1], [-3, 0], [-3, -1], [-2, -2], [-1, -3]];
    } else if ((mode === 1 && (ranged || [2, 3].includes(role)))) {
      coords = [[0, -3], [1, -3], [2, -2], [3, -1], [3, 0], [3, 1], [2, 2], [1, 3], [0, 3], [-1, 3], [-2, 2], [-3, 1], [-3, 0], [-3, -1], [-2, -2], [-1, -3]];
    } else if (role === 4 && !ranged) {
      coords = [[0, -8], [1, -8], [2, -8], [3, -8], [4, -7], [5, -6], [6, -5], [7, -4], [8, -3], [8, -2], [8, -1], [8, 0], [8, 1], [8, 2], [8, 3], [7, 4], [6, 5], [5, 6], [4, 7], [3, 8], [2, 8], [1, 8], [0, 8], [-1, 8], [-2, 8], [-3, 8], [-4, 7], [-5, 6], [-6, 5], [-7, 4], [-8, 3], [-8, 2], [-8, 1], [-8, 0], [-8, -1], [-8, -2], [-8, -3], [-7, -4], [-6, -5], [-5, -6], [-4, -7], [-3, -8], [-2, -8], [-1, -8]];
    }
    if ((role === 3 && bond) || (mode === 1 && !ranged)) {
      tpx = sx;
      tpy = sy;
    } else if (mode === 0) {
      const d = toPoint(r);
      tpx = d.x+epx;
      tpy = d.y+epy;
    } else if (mode === 2 || (mode === 1 && ranged)) {
      tpx = tx;
      tpy = ty;
    }
    if (role === 3 && bond) {
      limiter = [2];
    } else if (([2, 3].includes(role) && !ranged) || [0, 2].includes(mode) || (mode === 1 && ranged)) {
      limiter = [2, 3, 4];
    } else if (role === 1 && !ranged) {
      limiter = [2, 3];
    } else {
      limiter = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    }
    sortAsc = mode !== 2;
    for (const i in coords) {
      const x = coords[i][0] + epx, y = coords[i][1] + epy;
      if (x >= 0 && y >= 0 && x < 30 && y < 30) coords[i] = { x, y, d: Math.sqrt((x-tpx)**2+(y-tpy)**2) };
    }
    coords = coords.filter(c => !Array.isArray(c));
    coords.sort((a, b) => sortAsc ? a.d - b.d : b.d - a.d);
    this.path = false;
    let i = 0;
    while (!this.path) {
      const paths = coords.slice(0, Math.min(5, coords.length));
      const r = this.choosePath(paths.length);
      const { x, y } = paths[r];
      const p = Compute.pushWork('pathfind', sx, sy, x, y, this.host.map.clone());
      if (!limiter.includes(p.length)) {
        coords.splice(r, 1);
        i++;
        if (i >= 5 && mode !== 0) return this.path = {p: Compute.pushWork('pathfind', sx, sy, tx, ty, this.host.map.clone()).slice(0, 5), m: this.mode, t: Date.now(), o: Date.now()};
        if (coords.length === 0) return this.path = { p: [], m: this.mode, t: Date.now(), o: Date.now()};
      } else {
        this.path = { p, m: this.mode, t: Date.now(), o: Date.now()};
      }
    }
  }

  choosePath(p) {
    return Math.floor(Math.random()*p);
    const r = Math.random();
    if (p === 1) return 0;
    if (p === 2) return r < .5 ? 0 : 1;
    if (p === 3) {
      if (r < .5) return 0;
      if (r < .75) return 1;
      return 2;
    }
    if (p === 4) {
      if (r < .5) return 0;
      if (r < .8) return 1;
      if (r < .9) return 2;
      return 3;
    }
    if (p === 5) {
      if (r < .5) return 0;
      if (r < .65) return 1;
      if (r < .8) return 2;
      if (r < .9) return 3;
      return 4;
    }
  }

  identify() {
    const { host, team } = this;
    const targets = [], allies = [];
    let target = false;
    for (const t of host.pt) {
      if (!t.ded) {
        if (host.getTeam(team) === host.getTeam(t.team)) {
          allies.push({x: t.x, y: t.y, distance: Math.sqrt((t.x-this.x)**2+(t.y-this.y)**2)});
        } else {
          targets.push({x: t.x, y: t.y, distance: Math.sqrt((t.x-this.x)**2+(t.y-this.y)**2)});
        }
      }
    }
    for (const ai of host.ai) {
      if (host.getTeam(team) === host.getTeam(ai.team)) {
        allies.push({x: ai.x, y: ai.y, distance: Math.sqrt((ai.x-this.x)**2+(ai.y-this.y)**2)});
      } else {
        targets.push({x: ai.x, y: ai.y, distance: Math.sqrt((ai.x-this.x)**2+(ai.y-this.y)**2)});
      }
    }
    targets.sort((a, b) => a.distance - b.distance);
    for (const t of targets) if (Compute.pushWork('raycast', this.x+40, this.y+40, t.x+40, t.y+40, this.host.b)) {
      target = t;
      break;
    }
    if (this.role === 3 && !this.bond && allies.length > 0) {
      allies.sort((a, b) => a.distance - b.distance);
      for (const a of allies) if (Compute.pushWork('raycast', this.x+40, this.y+40, t.x+40, t.y+40, this.host.b)) {
        this.bond = a;
        break;
      }
    }
    if (!target) {
      if (this.role === 0) this.r++;
      if (this.target) {
        this.target.s = false;
        if (!this.target.c) this.target.c = setTimeout(() => {
          this.mode = 0;
          this.target = false;
        }, 10000);
      }
      return;
    }
    if (this.target) this.target.c = clearTimeout(this.target.c);
    target.s = true;
    this.target = target;
    if (this.bond) return;
    this.mode = (this.hp < .3 * this.maxHp && this.role !== 1) ? 2 : 1;
  }

  fire(tx, ty, type) {
    if (!type) type = Math.sqrt((tx - this.x) ** 2 + (ty - this.y) ** 2) < 150 ? 'shotgun' : 'bullet';
    const cooldown = {powermissle: 0, shotgun: 600, bullet: 200}[type];
    this.pushback = -3;
    if (type === 'shotgun') {
      this.inaccuracy = Math.floor(Math.random()*80)-40;
    } else if (type === 'bullet') {
      this.inaccuracy = Math.floor(Math.random()*40)-20;
    } else {
      this.inaccuracy = Math.floor(Math.random()*20)-10;
    }
    let l = type === 'shotgun' ? -10 : 0;
    while (l<(type === 'shotgun' ? 15 : 1)) {
      const { x, y } = toPoint(this.r+l);
      this.host.s.push(new Shot(this.x + 40, this.y + 40, x, y, type, this.r+l, this.team, this.host));
      l += 5;
    }
    if (type === 'powermissle') {
      this.canPowermissle = false;
      setTimeout(() => { this.canPowermissle = true }, 10000);
    } else {
      this.canFire = false;
      setTimeout(() => { this.canFire = true }, cooldown);
    }
  }

  damage(d) {
    this.hp -= d;
    if (this.hp <= 0) return this.destroy();
    clearInterval(this.healInterval);
    clearTimeout(this.healTimeout);
    this.healTimeout = setTimeout(() => {
      this.healInterval = setInterval(() => {
        this.hp = Math.min(this.hp+.4, this.maxHp);
      }, 15);
    }, 10000);
  }

  destroy() {
    const index = this.host.ai.indexOf(this);
    if (index !== -1) this.host.ai.splice(index, 1);
  }
}

try {
  module.exports = {Engine, Block, Shot, AI, Damage};
} catch (e) {}
