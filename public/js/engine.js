try {
  PF = require('pathfinding');
} catch (e) {}

const finder = new PF.AStarFinder({ allowDiagonal: true, dontCrossCorners: true });
const pathfind = (sx, sy, tx, ty, map) => finder.findPath(sx, sy, tx, ty, map);
const raycast = (x1, y1, x2, y2, walls) => {
  const dx = x1-x2, dy = y1-y2, adx = Math.abs(dx), ady = Math.abs(dy), minx = Math.min(x1, x2), miny = Math.min(y1, y2), maxx = Math.max(x1, x2), maxy = Math.max(y1, y2), px = new Set(), py = new Set();
  walls = walls.filter(({x, y}) => {
    const xw = x + 100, yw = y + 100;
    if (x >= minx && xw <= maxx && y >= miny && yw <= maxy) {
      if (x >= minx && x <= maxx) px.add(x);
      if (xw >= minx && xw <= maxx) px.add(xw);
      if (y >= miny && y <= maxy) py.add(y);
      if (xw >= miny && yw <= maxy) py.add(yw);
      return true;
    }
    return false;
  });
  walls = walls.filter(({x, y}) => collision(x, y, 100, 100, minx, miny, adx, ady));
  for (const {x, y} of walls) {
    const xw = x+100, yw = y+100;
    if (x >= minx && x <= maxx) px.add(x);
    if (xw >= minx && xw <= maxx) px.add(xw);
    if (y >= miny && y <= maxy) py.add(y);
    if (xw >= miny && yw <= maxy) py.add(yw);
  }
  if (dx === 0) {
    for (const p of py) {
      for (const {x, y} of walls) {
        if (collision(x, y, 100, 100, x1-.5, p-.5, 1, 1)) return false;
      }
    }
  } else {
    const s = dy/dx, o = y1-s*x1;
    for (const {x, y} of walls) {
      for (const p of py) {
        if (collision(x, y, 100, 100, (p-o)/s-1, p-1, 2, 2)) return false;
      }
      for (const p of px) {
        if (collision(x, y, 100, 100, p-1, s*p+o-1, 2, 2)) return false;
      }
    }
  }
  return true;
}
const parseTeamExtras = s => s.replace('@leader', '').split('@requestor#')[0];
const getUsername = s => parseTeamExtras(s).split(':')[0];
const getTeam = s => parseTeamExtras(s).split(':')[1];
const collision = (x, y, w, h, x2, y2, w2, h2) => (x + w > x2 && x < x2 + w2 && y + h > y2 && y < y2 + h2);
const toAngle = (x, y) => (-Math.atan2(x, y)*180/Math.PI+360)%360;
const toPoint = angle => {
  const theta = (-angle) * Math.PI / 180, y = Math.cos(theta), x = Math.sin(theta);
  return x === 0 ? {x, y: y/Math.abs(y)} : {x: x/Math.abs(x), y: y/Math.abs(x)}
}

class Engine {
  constructor(levels) {
    this.spawn = { x: 0, y: 0 };
    this.spawns = [{x: 0, y: 0}, {x: 0, y: 0}];
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
    this.pt.push(new Tank(data, this));
  }

  update(data) {
    const t = this.pt.find(t => t.username === data.username);
    if (!t) return;
    data = data.data;
    const { emote, r, baseFrame, use, x, y, fire, airstrike} = data;
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
    if (t.immune && (t.class === 'fire' || t.class === 'builderd')) {
      const team = parseTeamExtras(t.team), type = t.class === 'fire' ? 'fire' : 'weak';
      if ((t.x + 80) % 100 > 80 && [45, 90, 135].includes(t.baseRotation)) this.b.push(new Block(Math.floor(t.x / 100) * 100 + 100, Math.floor(t.y / 100) * 100, 100, type, team, this));
      if (t.x % 100 < 20 && [225, 270, 315].includes(t.baseRotation)) this.b.push(new Block(Math.floor(t.x / 100) * 100 - 100, Math.floor(t.y / 100) * 100, 100, type, team, this));
      if ((t.y + 80) % 100 > 80 && [135, 180, 225].includes(t.baseRotation)) this.b.push(new Block(Math.floor(t.x / 100) * 100, Math.floor(t.y / 100) * 100 + 100, 100, type, team, this));
      if (t.y % 100 < 20 && [315, 0, 45].includes(t.baseRotation)) this.b.push(new Block(Math.floor(t.x / 100) * 100, Math.floor(t.y / 100) * 100 - 100, 100, type, team, this));
    }
    for (const e of use) {
      if (e === 'dynamite') {
        for (let i = this.s.length-1; i >= 0; i--) {
          const s = this.s[i];
          if (getUsername(s.team) !== t.username || s.type !== 'dynamite') continue;
          this.d.push(new Damage(s.x-100, s.y-100, 200, 200, 100, s.team, this));
          s.destroy();
        }
      } else if (e === 'toolkit') {
        if (t.healTimeout !== undefined) {
          clearTimeout(t.healTimeout);
          t.healTimeout = undefined;
        } else {
          t.healTimeout = setTimeout(() => {
            t.hp = t.maxHp;
            t.healTimeout = undefined;
          }, 7500);
        }
      } else if (e === 'tape') {
        t.hp = Math.min(t.maxHp, t.hp+t.maxHp/4);
      } else if (e === 'glu') {
        clearInterval(t.gluInterval);
        clearTimeout(t.gluTimeout);
        t.glueInterval = setInterval(() => {
          t.hp = Math.min(t.maxHp, t.hp+3.5);
        }, 100);
        t.gluTimeout = setTimeout(() => clearInterval(t.glueInterval), 5000);
      } else if (e.includes('block#')) {
        const coords = [{ r: [337.5, 360], dx: -10, dy: 80 }, { r: [0, 22.5], dx: -10, dy: 80 }, { r: [22.5, 67.5], dx: -100, dy: 80 }, { r: [67.5, 112.5], dx: -100, dy: -10 }, { r: [112.5, 157.5], dx: -100, dy: -100 }, { r: [157.5, 202.5], dx: -10, dy: -100 }, { r: [202.5, 247.5], dx: 80, dy: -100 }, { r: [247.5, 292.5], dx: 80, dy: -10 }, { r: [292.5, 337.5], dx: 80, dy: 80 }];
        const type = e.replace('block#', '');
        for (const coord of coords) {
          if (r >= coord.r[0] && r < coord.r[1]) {
            this.b.push(new Block(t.x+coord.dx, t.y+coord.dy, {strong: 200, weak: 100, gold: 300, spike: 0}[type], type, t.team, this));
            break;
          }
        }
      } else if (e === 'flashbang') {
        for (const tank of this.pt) {
          const bangTime = (500-Math.sqrt((t.x-tank.x)**2+(t.y-tank.y)**2)/500)*10;
          if (bangTime > 0) {
            tank.flashbanged = true;
            clearTimeout(tank.flashbangTimeout);
            tank.flashbangTimeout = setTimeout(() => {
              tank.flashbanged = false;
            }, tank.username === t.username ? 500 : bangTime);
          }
        }
      } else if (e === 'bomb') {
        for (let i = this.b.length-1; i >= 0; i--) {
          const b = this.b[i];
          if (collision(t.x, t.y, 80, 80, b.x, b.y, 100, 100)) b.destroy();
        }
      } else if (e === 'turret') {
        this.ai = this.ai.filter(ai => getUsername(ai.team) !== t.username);
        this.ai.push(new AI(Math.floor(t.x / 100) * 100 + 10, Math.floor(t.y / 100) * 100 + 10, 0, t.rank, t.team, this));
      } else if (e === 'buff') {
        t.buff = true;
        setTimeout(() => { t.buff = false }, 10000);
      } else if (e === 'healSwitch') {
      } else if (e === 'shield') {
        t.shields = Math.min(300, Math.max(0, t.shields)+100);
      }
    }
    if (airstrike) {
      this.b.push(new Block(airstrike.x, airstrike.y, Infinity, 'airstrike', parseTeamExtras(t.team), this));
    }
    if (fire.length > 0) {
      t.pushback = -6;
      for (const s of fire) this.s.push(new Shot(t.x + 40, t.y + 40, s.x, s.y, s.type, s.r, parseTeamExtras(t.team), this));
    }
  }

  tick() {
    this.ontick();
    this.map.nodes.forEach(row => row.forEach(node => {
      node.walkable = true;
      node.f = 0;
      node.g = 0;
      node.h = 0;
      node.parent = null;
    }));
    for (const b of this.b) if (b.x >= 0 && b.y >= 0 && b.x <= 2900 && b.y <= 2900) this.map.setWalkableAt(Math.floor(b.x / 100), Math.floor(b.y / 100), b.x % 100 !== 0 && b.y % 100 !== 0);
    for (const ai of this.ai) ai.update();
    for (const s of this.s) s.update()

    for (const t of this.pt) {
      if (t.dedEffect) t.dedEffect.time = Date.now() - t.dedEffect.start;
      if (t.pushback !== 0) t.pushback += 0.5;
      if (t.fire && getTeam(t.fire.team) !== getTeam(t.team)) t.damageCalc(t.x, t.y, .25, getUsername(t.fire.team));
      for (const tank of this.pt) {
        if (t.class === 'medic' && !t.ded && !tank.ded && (t.x - tank.x) ** 2 + (t.y - tank.y) ** 2 < 250000) tank.hp = Math.min(tank.hp + .3, tank.maxHp);
        if (!t.immune || t.ded) continue;
        if (!tank.canBashed) continue;
        if ((t.class === 'warrior' && getTeam(t.team) !== getTeam(tank.team)) || (t.class === 'medic' && getTeam(t.team) === getTeam(tank.team))) {
          if (!collision(t.x, t.y, 80, 80, tank.x, tank.y, 80, 80)) continue;
          tank.damageCalc(tank.x, tank.y, t.class === 'warrior' ? 50 : -30, t.username);
          tank.canBashed = false;
          setTimeout(() => {
            tank.canBashed = true;
          }, 400);
        }
      }
      for (let i = this.b.length-1; i >= 0; i--) {
        const b = this.b[i];
        if (collision(t.x, t.y, 80, 80, b.x, b.y, 100, 100) && !t.ded && !t.immune) {
          if (b.type === 'fire') {
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
            }, 4000);
          } else if (b.type === 'spike' && getTeam(b.team) !== getTeam(t.team)) {
            t.damageCalc(t.x, t.y, 1, getUsername(b.team));
          }
        }
      }
      if (t.damage) t.damage.y--;
      if (t.grapple) t.grappleCalc();
    }
  }

  levelReader(level) {
    const key = { 'B5': ['void', Infinity], 'B4': ['barrier', Infinity], 'B3': ['gold', 300], 'B2': ['strong', 200], 'B1': ['weak', 100]};
    for (let l = 0; l < level.length; l++) {
      for (let q = 0; q < level[l].length; q++) {
        const e = level[l][q];
        if (e === 'S') {
          this.spawn = { x: q * 100, y: l * 100 };
        } else if (e === 'A') {
          this.spawns[0] = {x: q*100, y: l*100};
        } else if (e === 'B') {
          this.spawns[1] = {x: q*100, y: l*100};
        } else if (key[e]) {
          this.b.push(new Block(q * 100, l * 100, key[e][1], key[e][0], ':', this));
        }
      }
    }
  }
}

class Tank {
  constructor(data, host) {
    this.raw = {};
    this.render = {b: new Set(), s: new Set(), pt: new Set(), d: new Set(), ai: new Set()};
    ['rank', 'username', 'cosmetic', 'color', 'damage', 'maxHp', 'hp', 'shields', 'team', 'x', 'y', 'r', 'ded', 'pushback', 'baseRotation', 'baseFrame', 'fire', 'damage', 'animation', 'buff', 'invis', 'id', 'class'].forEach(p => {
      Object.defineProperty(this, p, {
        get() {
          return this.raw[p];
        },
        set(v) {
          this.setValue(p, v);
        },
        configurable: true,
      });
    });
    this.id = Math.random();
    this.lastUpdate = 0;
    if (data.socket) this.socket = data.socket; // multiplayer patch
    this.username = data.username;
    this.rank = data.rank;
    this.class = data.class;
    this.cosmetic = data.cosmetic;
    this.deathEffect = this.deathEffect;
    this.color = data.color;
    this.damage = false;
    this.maxHp = data.rank*10+300;
    this.hp = this.maxHp;
    this.canBashed = true;
    this.shields = 0;
    this.team = data.username+':'+Math.random();
    this.x = host.spawn.x;
    this.y = host.spawn.y;
    this.r = 0;
    this.pushback = 0;
    this.baseRotation = 0;
    this.baseFrame = 0;
    this.fire = false;
    this.host = host;
    host.override(this);
  }

  setValue(p, v) {
    if (this.raw[p] === v) return;
    this.updatedLast = Date.now();
    this.raw[p] = v;
  }

  damageCalc(x, y, a, u) {
    if ((this.immune && a > 0) || this.ded) return;
    if (this.shields > 0 &&  a > 0) return this.shields -= a;
    this.hp = Math.max(Math.min(this.maxHp, this.hp-a), 0);
    clearTimeout(this.damageTimeout);
    this.damageTimeout = setTimeout(() => {this.damage = false}, 1000);
    this.damage = {d: (this.damage ? this.damage.d : 0)+a, x, y};
    if (this.hp <= 0 && this.host.ondeath) this.host.ondeath(this, this.host.pt.find(t => t.username === u));
  }

  grappleCalc() {
    const dx = this.grapple.target.x - this.x;
    const dy = this.grapple.target.y - this.y;
    if (dx ** 2 + dy ** 2 > 400) {
      const angle = Math.atan2(dy, dx);
      const mx = Math.cos(angle) * 20;
      const my = Math.sin(angle) * 20;
      if (this.collision(this.x+mx, this.y)) this.x += mx;
      if (this.collision(this.x, this.y+my)) this.y += my;
      this.grapple.bullet.sx = this.x+40;
      this.grapple.bullet.sy = this.y+40;
      this.host.override(this, [{ key: 'x', value: this.x }, { key: 'y', value: this.y }]);
      if ((!this.collision(this.x+mx, this.y) || Math.abs(mx) < 2) && (!this.collision(this.x, this.y+my) || Math.abs(my) < 2)) {
        this.grapple.bullet.destroy();
        this.grapple = false;
      }
    } else {
      this.grapple.bullet.destroy();
      this.grapple = false;
    }
  }

  collision(x, y) {
    if (x < 0 || y < 0 || x + 80 > 3000 || y + 80 > 3000) return false;
    for (const b of this.host.b) if (collision(x, y, 80, 80, b.x, b.y, 100, 100) && b.c) return false;
    return true;
  }
}

class Block {
  constructor(x, y, health, type, team, host) {
    this.raw = {};
    ['x', 'y', 'maxHp', 'hp', 'type', 's', 'team', 'id'].forEach(p => {
      Object.defineProperty(this, p, {
        get() {
          return this.raw[p];
        },
        set(v) {
          this.setValue(p, v);
        },
        configurable: true,
      });
    });
    this.id = Math.random();
    this.x = x;
    this.y = y;
    this.maxHp = health;
    this.hp = health;
    this.type = type;
    this.host = host;
    this.s = false;
    this.c = !['spike', 'fire', 'airstrike'].includes(type); // collision
    this.team = team;
    if (['fire', 'airstrike'].includes(type)) this.sd = setTimeout(() => this.destroy(), type === 'fire' ? 2500 : 6000);
    if (type === 'airstrike') {
      for (let i = 0; i < 20; i++) {
        setTimeout(() => {
          if (this.host.b.includes(this)) this.host.d.push(new Damage(this.x + Math.floor(Math.random()*200)-100, this.y + Math.floor(Math.random()*200)-100, 200, 200, 200, this.team, this.host));
        }, 5000 + Math.random() * 500);
      }
    }
  }

  setValue(p, v) {
    if (this.raw[p] === v) return;
    this.updatedLast = Date.now();
    this.raw[p] = v;
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
    const index = this.host.b.indexOf(this);
    if (index !== -1) this.host.b.splice(index, 1);
  }
}

class Shot {
  constructor(x, y, xm, ym, type, rotation, team, host) {
    const settings = { damage: { bullet: 20, shotgun: 20, grapple: 0, powermissle: 100, megamissle: 200, healmissle: -100, dynamite: 0, fire: 0 }, speed: { bullet: 1, shotgun: .8, grapple: 2, powermissle: 1.5, megamissle: 1.5, healmissle: 1.5, dynamite: .8, fire: .9 } };
    const t = host.pt.find(t => t.username === getUsername(team));
    this.raw = {};
    ['team', 'r', 'type', 'x', 'y', 'sx', 'sy', 'id'].forEach(p => {
      Object.defineProperty(this, p, {
        get() {
          return this.raw[p];
        },
        set(v) {
          this.setValue(p, v);
        },
        configurable: true,
      });
    });
    this.id = Math.random();
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

  setValue(p, v) {
    if (this.raw[p] === v) return;
    this.updatedLast = Date.now();
    this.raw[p] = v;
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
        t.grapple = { target: host.pt.find(tank => tank.username === getUsername(this.team)), bullet: this };
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
        }, 4000);
      } else {
        if (key[type]) {
          host.d.push(new Damage(x - key[type] / 2 + 10, y - key[type] / 2 + 10, key[type], key[type], this.damage, this.team, host));
        } else if (getTeam(t.team) !== getTeam(this.team)) {
          t.damageCalc(x, y, this.damage, getUsername(this.team));
        }
        return true;
      }
    }

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
        } else if (getTeam(ai.team) !== getTeam(this.team)) {
          ai.damage(this.damage);
        }
        return true;
      }
    }

    for (let i = blocks.length-1; i >= 0; i--) {
      const b = blocks[i];
      if (!b.c || !collision(b.x, b.y, 100, 100, x, y, 10, 10)) continue;
      if (type === 'grapple') {
        const t = this.host.pt.find(t => t.username === getUsername(this.team));
        if (t.grapple) t.grapple.bullet.destroy();
        t.grapple = { target: b, bullet: this };
        this.update = () => {};
        return false;
      } else if (type === 'dynamite') {
        this.update = () => {}
        return false;
      } else if (type === 'fire') {
        host.b.push(new Block(b.x, b.y, Infinity, 'fire', this.team, host));
        return true;
      } else {
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
        const t = host.pt.find(t => t.username === getUsername(this.team));
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
    this.raw = {};
    ['x', 'y', 'w', 'h', 'f', 'id'].forEach(p => {
      Object.defineProperty(this, p, {
        get() {
          return this.raw[p];
        },
        set(v) {
          this.setValue(p, v);
        },
        configurable: true,
      });
    });
    this.id = Math.random();
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.a = a;
    this.team = team;
    this.host = host;
    this.f = 0;
    for (const t of host.pt) if (getUsername(team) !== getUsername(t.team)) if (collision(x, y, w, h, t.x, t.y, 80, 80)) t.damageCalc(x, y, getTeam(team) !== getTeam(t.team) ? Math.abs(a) : Math.min(a, 0), getUsername(team));
    for (let i = host.b.length-1; i >= 0; i--) if (collision(x, y, w, h, host.b[i].x, host.b[i].y, 100, 100)) host.b[i].damage(a);
    for (let i = host.ai.length-1; i >= 0; i--) if (collision(x, y, w, h, host.ai[i].x, host.ai[i].y, 80, 80)) if (getTeam(host.ai[i].team) !== getTeam(team)) host.ai[i].damage(a);
    setInterval(() => this.f++, 18);
    setTimeout(() => this.destroy(), 200);
  }

  setValue(p, v) {
    if (this.raw[p] === v) return;
    this.updatedLast = Date.now();
    this.raw[p] = v;
  }

  destroy() {
    const index = this.host.d.indexOf(this);
    if (index !== -1) this.host.d.splice(index, 1);
  }
}

class AI {
  constructor(x, y, role, rank, team, host) {
    this.raw = {};
    ['role', 'x', 'y', 'r', 'baseRotation', 'baseFrame', 'mode', 'rank', 'hp', 'maxHp', 'pushback', 'cosmetic', 'id'].forEach(p => {
      Object.defineProperty(this, p, {
        get() {
          return this.raw[p];
        },
        set(v) {
          this.setValue(p, v);
        },
        configurable: true,
      });
    });
    this.id = Math.random();
    this.role = role;
    this.x = x;
    this.y = y;
    this.r = 0;
    this.tr = 0;
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
    const t = host.pt.find(t => t.username === getUsername(this.team));
    this.cosmetic = t ? t.cosmetic : '';
  }

  setValue(p, v) {
    if (this.raw[p] === v) return;
    this.updatedLast = Date.now();
    this.raw[p] = v;
  }

  update() {
    this.identify();
    if (this.role !== 0) this.move();
    if (this.obstruction && !this.target.s) {
      this.tr = toAngle(this.obstruction.x-(this.x+40), this.obstruction.y-(this.y+40));
      if (this.canPowermissle && Math.random() <= 1/300) this.fire(this.obstruction.x, this.obstruction.y, 'powermissle');
      if (this.canFire && Math.random() <= 1/20) this.fire(this.obstruction.x, this.obstruction.y);
    } else if (this.mode !== 0) {
      this.tr = toAngle(this.target.x - this.x, this.target.y - this.y);
      if (this.canPowermissle && Math.random() <= 1/300) this.fire(this.target.x, this.target.y, 'powermissle');
      if (this.canFire && Math.random() <= 1/20) this.fire(this.target.x, this.target.y);
    }
    this.r = role === 0 ? this.tr : (this.r+((this.tr-this.r+360)%360 < (this.r-this.tr+360)%360 ? 2 : -2)+360)%360;
    if (this.pushback !== 0) this.pushback += 0.5;
  }

  move() {
    const {x, y, path, baseRotation} = this;
    if ((x-10)%100 === 0 && (y-10)%100 === 0) this.onBlock();
    if (!path.p.length) return;
    const now = Date.now(), l = path.p.length-1, frames = Math.min(Math.floor((now-path.t)/15), (path.p.length-1)*25), l*25), f = Math.floor(frames/25), n = Math.min(f+1, l), dx = path.p[n][0]-path.p[f][0], dy = path.p[n][1]-path.p[f][1], offset = 4*(frames%25), x = 10+path.p[f][0]*100+offset*dx, y = 10+path.p[f][1]*100+offset*dy;
    this.baseRotation = [[135, 180, 225], [90, this.baseRotation, 270], [45, 0, 315]][dy+1][dx+1];
    this.tr = this.baseRotation;
    this.obstruction = this.collision(x, y);
    if (!this.obstruction) {
      if (this.canBoost) {
        this.canBoost = false;
        this.immune = Date.now();
        setTimeout(() => {this.immune = false}, 500);
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
      const p = pathfind(sx, sy, x, y, this.host.map.clone());
      if (!limiter.includes(p.length)) {
        coords.splice(r, 1);
        i++;
        if (i >= 5 && mode !== 0) return this.path = {p: pathfind(sx, sy, tx, ty, this.host.map.clone()).slice(0, 5), m: this.mode, t: Date.now(), o: Date.now()};
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
        if (getTeam(team) === getTeam(t.team)) {
          allies.push({x: t.x, y: t.y, distance: Math.sqrt((t.x-this.x)**2+(t.y-this.y)**2)});
        } else {
          targets.push({x: t.x, y: t.y, distance: Math.sqrt((t.x-this.x)**2+(t.y-this.y)**2)});
        }
      }
    }
    for (const ai of host.ai) {
      if (getTeam(team) === getTeam(ai.team)) {
        allies.push({x: ai.x, y: ai.y, distance: Math.sqrt((ai.x-this.x)**2+(ai.y-this.y)**2)});
      } else {
        targets.push({x: ai.x, y: ai.y, distance: Math.sqrt((ai.x-this.x)**2+(ai.y-this.y)**2)});
      }
    }
    targets.sort((a, b) => a.distance - b.distance);
    for (const t of targets) if (raycast(this.x+40, this.y+40, t.x+40, t.y+40, this.host.b)) {
      target = t;
      break;
    }
    if (this.role === 3 && !this.bond && allies.length > 0) {
      allies.sort((a, b) => a.distance - b.distance);
      for (const a of allies) if (raycast(this.x+40, this.y+40, t.x+40, t.y+40, this.host.b)) {
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
    if (!type) type = Math.sqrt((tx - this.x) ** 2 + (ty - this.y) ** 2) && role !== 0 < 150 ? 'shotgun' : 'bullet';
    const cooldown = {powermissle: 0, shotgun: 600, bullet: 200}[type];
    this.pushback = -3;
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
  module.exports = {Engine, Block, Shot, AI, Damage, Tank, getTeam, parseTeamExtras, getUsername};
} catch (e) {}
