try {
  PF = require('pathfinding');
} catch (e) {}

const finder = new PF.AStarFinder({ allowDiagonal: true, dontCrossCorners: true });
const pathfind = (sx, sy, tx, ty, map) => finder.findPath(sx, sy, tx, ty, map);
const raycast = (x1, y1, x2, y2, walls) => {
  const dx = x1-x2, dy = y1-y2, adx = Math.abs(dx), ady = Math.abs(dy), minx = Math.min(x1, x2), miny = Math.min(y1, y2), maxx = Math.max(x1, x2), maxy = Math.max(y1, y2), px = [], py = [];
  walls = walls.filter(({x, y, type}) => {
    if (!['void', 'barrier', 'strong', 'weak', 'gold'].includes(type)) return;
    if (collision(x, y, 100, 100, minx, miny, adx, ady)) {
      if (collision(x, y, 100, 100, x1-1, y1-1, 2, 2) || collision(x, y, 100, 100, x2-1, y2-1, 2, 2)) return false;
      const xw = x + 100, yw = y + 100;
      if (x >= minx && x <= maxx) px.push(x);
      if (xw >= minx && xw <= maxx) px.push(xw);
      if (y >= miny && y <= maxy) py.push(y);
      if (xw >= miny && yw <= maxy) py.push(yw);
      return true;
    }
    return false;
  });
  if (dx === 0) {
    for (const p of py) for (const {x, y} of walls) if (collision(x, y, 100, 100, x1-.5, p-.5, 1, 1)) return false;
  } else {
    const s = dy/dx, o = y1-s*x1;
    for (const {x, y} of walls) {
      for (const p of py) if (collision(x, y, 100, 100, (p-o)/s-1, p-1, 2, 2)) return false;
      for (const p of px) if (collision(x, y, 100, 100, p-1, s*p+o-1, 2, 2)) return false;
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
    this.s = [];
    this.pt = [];
    this.d = [];
    this.i = [];
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
    data = data.data; // reduce data copying
    const { emote, r, baseFrame, use, x, y, fire} = data; // destructuring is lag so remove
    t.baseRotation = data.baseRotation;
    t.immune = data.immune;
    t.animation = data.animation;
    t.emote = emote;
    t.invis = data.invis;
    t.baseFrame = data.baseFrame;
    if (!t.grapple) {
      t.x = x;
      t.y = y;
      const cells = new Set();
      for (let dx = x/100, dy = y/100, i = 0; i < 4; i++) {
        const cx = Math.max(0, Math.min(29, Math.floor(i < 2 ? dx : dx + .79))), cy = Math.max(0, Math.min(29, Math.floor(i % 2 ? dy : dy + .79)));
        this.cells[cx][cy].add(t);
        cells.add(`${cx}x${cy}`);
      }
      for (const cell of [...t.cells].filter(c => !cells.has(c))) {
        const [x, y] = cell.split('x');
        this.cells[x][y].delete(t);
      }
      t.cells = cells;
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
          this.d.push(new Damage(s.x-50, s.y-50, 100, 100, 100, s.team, this));
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
          }, t.class === 'medic' ? 5000 : 7500);
        }
      } else if (e === 'tape') {
        t.hp = Math.min(t.maxHp, t.hp+t.maxHp/4);
      } else if (e === 'glu') {
        clearInterval(t.gluInterval);
        clearTimeout(t.gluTimeout);
        t.gluInterval = setInterval(() => {
          t.hp = Math.min(t.maxHp, t.hp+.5);
        }, 15);
        t.gluTimeout = setTimeout(() => clearInterval(t.gluInterval), 5000);
      } else if (e.includes('block#')) {
        const coords = [{ r: [337.5, 360], dx: -10, dy: 80 }, { r: [0, 22.5], dx: -10, dy: 80 }, { r: [22.5, 67.5], dx: -100, dy: 80 }, { r: [67.5, 112.5], dx: -100, dy: -10 }, { r: [112.5, 157.5], dx: -100, dy: -100 }, { r: [157.5, 202.5], dx: -10, dy: -100 }, { r: [202.5, 247.5], dx: 80, dy: -100 }, { r: [247.5, 292.5], dx: 80, dy: -10 }, { r: [292.5, 337.5], dx: 80, dy: 80 }];
        const type = e.replace('block#', '');
        for (const coord of coords) {
          if (r >= coord.r[0] && r < coord.r[1]) {
            this.b.push(new Block(t.x+coord.dx, t.y+coord.dy, {strong: 200, weak: 100, gold: 300, spike: 50}[type], type, t.team, this));
            break;
          }
        }
      } else if (e === 'flashbang') {
        for (const tank of this.pt) {
          const bangTime = (500-Math.sqrt((t.x-tank.x)**2+(t.y-tank.y)**2))*5;
          if (bangTime > 0) {
            tank.flashbanged = true;
            clearTimeout(tank.flashbangTimeout);
            tank.flashbangTimeout = setTimeout(() => {
              tank.flashbanged = false;
            }, tank.username === t.username ? 500 : bangTime);
          }
        }
      } else if (e === 'break') {
        for (const cell of t.cells) {
          const c = cell.split('x'), cx = c[0], cy = c[1];
          for (const entity of this.cells[cx][cy]) if (entity instanceof Block && collision(x, y, 80, 80, entity.x, entity.y, 100, 100)) setTimeout(() => entity.destroy());
        }
      } else if (e === 'bomb') {
        const cx = Math.floor((t.x+40)/100), cy = Math.floor((t.y+40)/100);
      } else if (e === 'turret') {
        for (const ai of this.ai) {
          if (getUsername(ai) === t.username) setTimeout(() => ai.destroy());
        }
        this.ai.push(new AI(Math.floor(t.x / 100) * 100 + 10, Math.floor(t.y / 100) * 100 + 10, 0, t.rank, t.team, this));
      } else if (e === 'buff') {
        t.buff = true;
        setTimeout(() => { t.buff = false }, 10000);
      } else if (e === 'shield') {
        t.shields = 100;
      } else if (e.includes('airstrike')) {
        const a = e.replace('airstrike', '').split('x');
        this.b.push(new Block(Number(a[0]), Number(a[1]), Infinity, 'airstrike', parseTeamExtras(t.team), this));
      } else if (e.includes('healwave')) {
        const a = e.replace('healwave', '').split('x');
        const hx = Math.floor(a[0]/100), hy = Math.floor(a[1]/100);
        for (let i = hx-2; i<=hx+2; i++) for (let l = hy-2; l<=hy+2; l++) for (const entity of this.cells[i][l]) {
          this.logs.push({m: i+', '+l, c: '#0000FF'});
          if (entity instanceof Tank) {
            if (getTeam(entity.team) === getTeam(t.team)) {
              entity.damageCalc(entity.x, entity.y, -Math.max(50, (entity.maxHp-entity.hp)/3), this.username);
            }
          }
        }
      }
    }
    if (fire.length > 0) {
      t.pushback = -6;
      for (const s of fire) this.s.push(new Shot(t.x + 40, t.y + 40, s.x, s.y, s.type, s.r, parseTeamExtras(t.team), t.rank*(t.buff ? 1.2 : 1), this));
    }
  }

  tick() {
    this.ontick();
    for (const s of this.s) s.update();
    for (let i = this.ai.length-1; i >= 0; i--) this.ai[i].update();
    for (const t of this.pt) t.update();
  }

  levelReader(level) {
    this.b = [];
    this.cells = [];
    for (let y = 0; y < 30; y++) {
      this.cells[y] = [];
      for (let x = 0; x < 30; x++) {
        this.cells[y][x] = new Set();
      }
    }
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
        } else if (e.split('')[0] === 'A' && e.split('').length === 2) {
          this.ai.push(new AI(q*100+10, l*100+10, Number(e.split('')[1]), 0/*rank*/, ':', this));
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
    ['rank', 'username', 'cosmetic', 'color', 'damage', 'maxHp', 'hp', 'shields', 'team', 'x', 'y', 'r', 'ded', 'pushback', 'baseRotation', 'baseFrame', 'fire', 'damage', 'animation', 'buff', 'invis', 'id', 'class', 'flashbanged', 'dedEffect'].forEach(p => {
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
    this.deathEffect = data.deathEffect;
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
    this.cells = new Set();
    for (let dx = this.x/100, dy = this.y/100, i = 0; i < 4; i++) {
      const cx = Math.max(0, Math.min(29, Math.floor(i < 2 ? dx : dx + .79))), cy = Math.max(0, Math.min(29, Math.floor(i % 2 ? dy : dy + .79)));
      host.cells[cx][cy].add(this);
      this.cells.add(cx+'x'+cy);
    }
    host.override(this);
  }

  setValue(p, v) {
    this.updatedLast = Date.now();
    this.raw[p] = v;
  }

  update() {
    const team = getTeam(this.team);
    if (this.dedEffect) {
      this.dedEffect.time = Date.now() - this.dedEffect.start;
      this.setValue('dedEffect', this.dedEffect); // REMOVE THIS TEMPORARY
    }
    if (this.pushback !== 0) this.pushback += 0.5;
    if (this.fire && getTeam(this.fire.team) !== getTeam(this.team)) this.damageCalc(this.x, this.y, .25, getUsername(this.fire.team));
    if (this.damage) this.damage.y--;
    if (this.grapple) this.grappleCalc();
    for (const cell of this.cells) {
      const [x, y] = cell.split('x');
      for (const entity of this.host.cells[x][y]) {
        const teamMatch = team === getTeam(entity.team);
        if (entity.username !== this.username && this.immune && !this.ded && entity.canBashed && (entity instanceof Tank || entity instanceof AI)) {
          if ((this.class === 'warrior' && !teamMatch) || (this.class === 'medic' && teamMatch)) {
            if (collision(this.x, this.y, 80, 80, entity.x, entity.y, 80, 80)) {
              entity.damageCalc(entity.x, entity.y, this.class === 'warrior' ? 75 : -30, this.username);
              entity.canBashed = false;
              setTimeout(() => {entity.canBashed = true}, 800);
            }
          }
        } else if (entity instanceof Block) {
          if (!this.ded && !this.immune && collision(this.x, this.y, 80, 80, entity.x, entity.y, 100, 100)) {
            if (entity.type === 'fire') {
              if (this.fire) {
                clearTimeout(this.fireTimeout);
                this.fire = {team: entity.team, frame: this.fire.frame};
              } else {
                this.fire = {team: entity.team, frame: 0};
                this.fireInterval ??= setInterval(() => this.fire.frame ^= 1, 50);
              }
              this.fireTimeout = setTimeout(() => {
                clearInterval(this.fireInterval);
                this.fire = false;
              }, 4000);
            } else if (entity.type === 'spike' && !teamMatch) {
              this.damageCalc(this.x, this.y, .5, getUsername(entity.team));
            }
          }
        }
      }
    }
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
        this.x = Math.floor(this.x/4)*4;
        this.y = Math.floor(this.y/4)*4
      }
    } else {
      this.grapple.bullet.destroy();
      this.grapple = false;
      this.x = Math.floor(this.x/4)*4;
      this.y = Math.floor(this.y/4)*4
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
    this.x = x;
    this.y = y;
    this.maxHp = health;
    this.hp = health;
    this.type = type;
    this.host = host;
    this.team = team;
    this.raw = {};
    this.id = Math.random();
    this.s = false;
    this.c = !['fire', 'airstrike'].includes(type);
    if (type === 'fire' || type === 'airstrike') this.sd = setTimeout(() => this.destroy(), type === 'fire' ? 2500 : 6000);
    if (type === 'airstrike') {
      for (let i = 0; i < 80; i++) setTimeout(() => {
        if (this.host.b.includes(this)) this.host.d.push(new Damage(this.x + Math.floor(Math.random()*250)-50, this.y + Math.floor(Math.random()*250)-50, 100, 100, 50, this.team, this.host));
      }, 5000+Math.random()*500);
    }
    this.cells = new Set();
    let dx = this.x/100, dy = this.y/100;
    for (let i = 0; i < 4; i++) {
      const cx = Math.max(0, Math.min(29, Math.floor(i < 2 ? dx : dx + .99))), cy = Math.max(0, Math.min(29, Math.floor(i % 2 === 0 ? dy : dy + .99)));
      host.cells[cx][cy].add(this);
      this.cells.add(cx+'x'+cy);
    }
    if (this.x % 100 === 0 && this.y % 100 === 0 && this.x >= 0 && this.x <= 2900 && this.y >= 0 && this.y <= 2900) host.map.setWalkableAt(Math.floor(dx), Math.floor(dy), false);
    this.u();
  }

  u() {
    this.updatedLast = Date.now();
    for (const property of ['x', 'y', 'maxHp', 'hp', 'type', 's', 'team', 'id']) this.raw[property] = this[property];
  }

  damage(d) {
    if (this.hp === Infinity) return;
    this.hp = Math.max(this.hp-d, 0);
    this.s = true;
    clearTimeout(this.bar);
    this.bar = setTimeout(() => {
      this.s = false;
      this.u();
    }, 3000);
    this.u();
    if (this.hp === 0) this.destroy();
  }

  destroy() {
    clearTimeout(this.sd);
    clearTimeout(this.bar);
    const index = this.host.b.indexOf(this);
    if (index !== -1) this.host.b.splice(index, 1);
    for (const cell of this.cells) {
      const [x, y] = cell.split('x');
      this.host.cells[x][y].delete(this);
      let deletePathfindGrid = true;
      for (const e of this.host.cells[x][y]) if (e instanceof Block && e.x % 100 === 0 && e.y % 100 === 0) deletePathfindGrid = false;
      if (deletePathfindGrid && this.x % 100 === 0 && this.y % 100 === 0) this.host.map.setWalkableAt(x, y, true);
    }
  }
}

const bullet_settings = {
  damage: {
    bullet: 20,
    shotgun: 20,
    grapple: 0,
    powermissle: 100,
    megamissle: 200,
    healmissle: -100,
    dynamite: 0,
    fire: 0,
  },
  speed: {
    bullet: 1,
    shotgun: .8,
    grapple: 2,
    powermissle: 1.5,
    megamissle: 1.5,
    healmissle: 1.5,
    dynamite: .8,
    fire: .9,
  },
  size: {
    healmissle: 50,
    powermissle: 50,
    megamissle: 100,
  }
};

class Shot {
  constructor(x, y, xm, ym, type, rotation, team, rank, host) {
    this.team = team;
    this.r = rotation; // USELESS?
    this.type = type;
    this.host = host;
    this.e = Date.now();
    this.raw = {};
    this.id = Math.random();
    this.damage = bullet_settings.damage[type]*(rank*10+300)/500;
    this.md = this.damage;
    const factor = 6/Math.sqrt(xm**2+ym**2);
    this.xm = xm*factor*bullet_settings.speed[type];
    this.ym = ym*factor*bullet_settings.speed[type];
    const data = Shot.calc(x, y, xm, ym);
    this.x = data.x-5;
    this.y = data.y-5;
    this.sx = this.x;
    this.sy = this.y;
    this.cells = new Set();
    for (let dx = this.x/100, dy = this.y/100, i = 0; i < 4; i++) {
      const cx = Math.max(0, Math.min(29, Math.floor(i < 2 ? dx : dx+.09))), cy = Math.max(0, Math.min(29, Math.floor(i % 2 ? dy : dy+.09)));
      host.cells[cx][cy].add(this);
      this.cells.add(cx+'x'+cy);
    }
    this.u();
  }

  static calc(x, y, xm, ym) {
    const r = 70;
    const a = xm === 0 ? 1000000 : ym / xm;
    const b = xm === 0 ? 0 : (a > 0 ? -1 : 1);
    const c = Math.sqrt(r**2+(r*a)**2);
    const d = r*c;
    const cx = -r*b*d/c**2;
    const cy = Math.abs(r*a)*d/c**2;
    return {x: x+cx*(ym >= 0 ? 1 : -1), y: y+cy*(ym >= 0 ? 1 : -1)};
  }

  collision() {
    const { host, x, y, type, cells} = this;
    if (x < 0 || x > 3000 || y < 0 || y > 3000) {
      if (type === 'grapple') {
        const t = host.pt.find(t => t.username === getUsername(this.team));
        if (t.grapple) t.grapple.bullet.destroy();
        t.grapple = { target: { x: x, y: y }, bullet: this };
        this.update = () => {};
        return false;
      } else if (type === 'dynamite') {
        this.update = () => {}
        return false;
      } else {
        if (bullet_settings.size[type]) host.d.push(new Damage(x - bullet_settings.size[type] / 2 + 10, y - bullet_settings.size[type] / 2 + 10, bullet_settings.size[type], bullet_settings.size[type], this.damage, this.team, host));
        return true;
      }
    }
    for (const cell of cells) { 
      const [cx, cy] = cell.split('x');
      for (const e of host.cells[cx][cy]) {
        if (e instanceof Tank) {
          if (e.ded || !collision(x, y, 10, 10, e.x, e.y, 80, 80)) continue;
          if (type === 'grapple') {
            if (e.grapple) e.grapple.bullet.destroy();
            e.grapple = {target: host.pt.find(tank => tank.username === getUsername(this.team)), bullet: this};
            this.target = e;
            this.offset = [e.x-x, e.y-y];
            this.update = () => {
              this.x = this.target.x - this.offset[0];
              this.y = this.target.y - this.offset[1];
              this.u();
            };
            return false;
          } else if (type === 'dynamite') {
            this.target = e;
            this.offset = [e.x-x, e.y-y];
            this.update = () => {
              this.x = this.target.x - this.offset[0];
              this.y = this.target.y - this.offset[1];
              this.u();
              if (this.target.ded) this.destroy();
              if (this.host.pt.find(t => t.username === getUsername(this.team))?.ded) this.destroy();
            }
            return false;
          } else if (type === 'fire') {
            if (e.immune) return true;
            if (e.fire) clearTimeout(e.fireTimeout);
            e.fire = { team: this.team, frame: e.fire?.frame || 0 };
            e.fireInterval ??= setInterval(() => e.fire.frame ^= 1, 50); // OPTIMIZE make gui effects render by date time not by server interval
            e.fireTimeout = setTimeout(() => {
              clearInterval(e.fireInterval);
              e.fire = false;
            }, 4000);
            return true;
          } else {
            if (bullet_settings.size[type]) {
              host.d.push(new Damage(x - bullet_settings.size[type] / 2 + 10, y - bullet_settings.size[type] / 2 + 10, bullet_settings.size[type], bullet_settings.size[type], this.damage, this.team, host));
            } else if (getTeam(e.team) !== getTeam(this.team)) {
              e.damageCalc(x, y, this.damage, getUsername(this.team));
            }
            return true;
          }
        } else if (e instanceof Block) {
          if (!e.c || !collision(e.x, e.y, 100, 100, x, y, 10, 10)) continue;
          if (type === 'grapple' || type === 'dynamite') {
            if (type === 'grapple') {
              const t = this.host.pt.find(t => t.username === getUsername(this.team));
              if (t.grapple) t.grapple.bullet.destroy();
              t.grapple = {target: e, bullet: this}
            }
            this.update = () => {}
            return false;
          } else {
            if (type === 'fire') host.b.push(new Block(e.x, e.y, Infinity, 'fire', this.team, host));
            if (bullet_settings.size[type]) {
              host.d.push(new Damage(x - bullet_settings.size[type] / 2 + 10, y - bullet_settings.size[type] / 2 + 10, bullet_settings.size[type], bullet_settings.size[type], this.damage, this.team, host));
            } else if (type !== 'fire') {
              e.damage(this.damage);
            }
            return true;
          }
        } else if (e instanceof AI) {
          if (!collision(x, y, 10, 10, e.x, e.y, 80, 80)) continue;
          if (type === 'dynamite') {
            this.target = e;
            this.offset = [e.x-x, e.y-y];
            this.update = () => {
              this.x = this.target.x - this.offset[0];
              this.y = this.target.y - this.offset[1];
              this.u();
            }
            return false;
          } else if (type === 'fire') {
            if (e.fire) clearTimeout(e.fireTimeout);
            e.fire = {team: this.team, frame: e.fire?.frame || 0};
            e.fireInterval ??= setInterval(() => e.fire.frame ^= 1, 50);
            e.fireTimeout = setTimeout(() => {
              clearInterval(e.fireInterval);
              e.fire = false;
            }, 4000);
            return true;
          } else {
            if (bullet_settings.size[type]) {
              host.d.push(new Damage(x - bullet_settings.size[type] / 2 + 10, y - bullet_settings.size[type] / 2 + 10, bullet_settings.size[type], bullet_settings.size[type], this.damage, this.team, host));
            } else if (getTeam(e.team) !== getTeam(this.team)) {
              e.damageCalc(x, y, this.damage);
            }
            return true;
          }
        }
      }
    }
    return false;
  }

  update() {
    const time = Math.floor((Date.now()-this.e)/5), oldx = this.x, oldy = this.y;
    this.x = time*this.xm+this.sx;
    this.y = time*this.ym+this.sy;
    if (Math.floor(oldx/100) !== Math.floor(this.x/100) || Math.floor(oldy/100) !== Math.floor(this.y/100) || Math.floor((oldx+10)/100) !== Math.floor((this.x+10)/100) || Math.floor((oldy+10)/100) !== Math.floor((this.y+10)/100)) { 
      const cells = new Set();
      for (let dx = this.x/100, dy = this.y/100, i = 0; i < 4; i++) {
        const cx = Math.max(0, Math.min(29, Math.floor(i < 2 ? dx : dx + .09))), cy = Math.max(0, Math.min(29, Math.floor(i % 2 ? dy : dy + .09)));
        this.host.cells[cx][cy].add(this);
        cells.add(cx+'x'+cy);
      }
      for (const cell of [...this.cells].filter(c => !cells.has(c))) {
        const [x, y] = cell.split('x');
        this.host.cells[x][y].delete(this);
      }
      this.cells = cells;
    }
    if (this.collision()) this.destroy();
    if (this.type === 'shotgun') {
      this.d = Math.sqrt((this.x - this.sx) ** 2 + (this.y - this.sy) ** 2);
      this.damage = this.md - (this.d / 300) * this.md;  
      if (this.d >= 300) this.destroy();
    } else if (this.type === 'dynamite') this.r += 5;
    this.u();
  }

  u() {
    this.updatedLast = Date.now();
    for (const property of ['team', 'r', 'type', 'x', 'y', 'sx', 'sy', 'id']) this.raw[property] = this[property];
  }

  destroy() {
    const index = this.host.s.indexOf(this);
    if (index !== -1) this.host.s.splice(index, 1);
    for (const cell of this.cells) {
      const [x, y] = cell.split('x');
      this.host.cells[x][y].delete(this);
    }
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
    this.raw = {};
    this.id = Math.random();
    this.f = 0;
    this.cells = new Set();
    for (let dx = this.x/100, dy = this.y/100, i = 0; i < 4; i++) {
      const cx = Math.max(0, Math.min(29, Math.floor(i < 2 ? dx : dx+w/100-.01))), cy = Math.max(0, Math.min(29, Math.floor(i % 2 ? dy : dy+h/100-.01)));
      host.cells[cx][cy].add(this);
      this.cells.add(cx+'x'+cy);
    }
    const cache = new Set();
    for (const cell of this.cells) {
      const [cx, cy] = cell.split('x');
      for (const e of host.cells[cx][cy]) {
        if (cache.has(e.id)) continue;
        cache.add(e.id);
        if (e instanceof Tank) {
          if (getUsername(team) !== getUsername(e.team)) {
            if (collision(x, y, w, h, e.x, e.y, 80, 80)) e.damageCalc(x, y, getTeam(team) !== getTeam(e.team) ? Math.abs(a) : Math.min(a, 0), getUsername(team));
          }
        } else if (e instanceof Block) {
          if (collision(x, y, w, h, e.x, e.y, 100, 100)) e.damage(a);
        } else if (e instanceof AI) {
          if (collision(x, y, w, h, e.x, e.y, e.role === 0 ? 100 : 80, e.role === 0 ? 100 : 80)) {
            if (getTeam(team) !== getTeam(e.team)) e.damageCalc(e.x, e.y, a);
          }
        }
      }
    }
    this.i = setInterval(() => {
      this.f++;
      this.u();
    }, 18);
    setTimeout(() => this.destroy(), 200);
  }
  
  u() {
    this.updatedLast = Date.now();
    for (const property of ['x', 'y', 'w', 'h', 'f', 'id']) this.raw[property] = this[property];
  }

  destroy() {
    clearInterval(this.i);
    const index = this.host.d.indexOf(this);
    if (index !== -1) this.host.d.splice(index, 1);
    for (const cell of this.cells) {
      const [x, y] = cell.split('x');
      this.host.cells[x][y].delete(this);
    }
  }
}

class AI {
  constructor(x, y, role, rank, team, host) {
    this.raw = {};
    ['role', 'x', 'y', 'r', 'baseRotation', 'baseFrame', 'mode', 'rank', 'hp', 'maxHp', 'pushback', 'cosmetic', 'id', 'fire', 'damage', 'team', 'color'].forEach(p => {
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
    this.barrelSpeed = Math.random()*3+2;
    this.stupidity = Math.random()*1+1;
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
    this.canFire = true;
    this.canPowermissle = true;
    this.canItem = true;
    this.canClass = true;
    this.canBoost = true;
    this.color = '#'+Math.floor(Math.random()*16777215).toString(16);
    this.damage = false;
    this.canBashed = true;
    this.fire = false;
    this.immune = 0;
    this.item = '';
    this.class = '';
    const t = host.pt.find(t => t.username === getUsername(this.team));
    this.cosmetic = t ? t.cosmetic : '';
    this.cells = new Set();
    for (let dx = this.x/100, dy = this.y/100, i = 0; i < 4; i++) {
      const cx = Math.max(0, Math.min(29, Math.floor(i < 2 ? dx : dx + (role === 0 ? .99 : .79)))), cy = Math.max(0, Math.min(29, Math.floor(i % 2 ? dy : dy + (role === 0 ? .99 : .79))));
      host.cells[cx][cy].add(this);
      this.cells.add(cx+'x'+cy);
    }
  }

  setValue(p, v) {
    if (this.raw[p] === v) return;
    this.updatedLast = Date.now();
    this.raw[p] = v;
  }

  update() {
    if (this.mode === 3) return this.r += 3;
    if (Math.random() <= 1/(3*this.stupidity)) this.identify();
    if (this.role !== 0) this.move();
    const cells = new Set();
    for (let dx = this.x/100, dy = this.y/100, i = 0; i < 4; i++) {
      const cx = Math.max(0, Math.min(29, Math.floor(i < 2 ? dx : dx + (this.role === 0 ? .99 : .79)))), cy = Math.max(0, Math.min(29, Math.floor(i % 2 ? dy : dy + (this.role === 0 ? .99 : .79))));
      this.host.cells[cx][cy].add(this);
      cells.add(cx+'x'+cy);
    }
    for (const cell of [...this.cells].filter(c => !cells.has(c))) {
      const [x, y] = cell.split('x');
      this.host.cells[x][y].delete(this);
    }
    this.cells = cells;
    if (this.obstruction && !this.target.s) {
      this.tr = toAngle(this.obstruction.x-(this.x+40), this.obstruction.y-(this.y+40));
      if (this.canPowermissle && Math.random() <= 1/(600*this.stupidity)) this.fireCalc(this.obstruction.x, this.obstruction.y, 'powermissle');
      if (this.canFire && Math.random() <= 1/(10*this.stupidity)) this.fireCalc(this.obstruction.x, this.obstruction.y);
    } else if (this.mode !== 0) {
      this.tr = toAngle(this.target.x - this.x, this.target.y - this.y);
      if (this.canPowermissle && Math.random() <= 1/(600*this.stupidity)) this.fireCalc(this.target.x, this.target.y, 'powermissle');
      if (this.canFire && Math.random() <= 1/(10*this.stupidity)) this.fireCalc(this.target.x, this.target.y);
    }
    const diff = (this.tr-this.r+360)%360, dir = diff < 180 ? 1 : -1;
    this.r = diff > this.barrelSpeed ? (this.r+dir*this.barrelSpeed+360)%360 : this.tr;
    if (this.dedEffect) this.dedEffect.time = Date.now()-this.dedEffect.start;
    if (this.pushback !== 0) this.pushback += 0.5;
    if (this.fire && getTeam(this.fire.team) !== getTeam(this.team)) this.damageCalc(this.x, this.y, .25);
    for (const t of this.host.pt) {
      //if (this.class === 'medic' && !t.ded && (this.x-t.x)**2 + (this.y-t.y)**2 < 250000 && getTeam(this.team) === getTeam(t.team)) t.hp = Math.min(t.hp+.3, t.maxHp);
      if (this.immune+500 < Date.now() || !t.canBashed) continue;
      if ((this.class === 'warrior' && getTeam(this.team) !== getTeam(t.team)) || (this.class === 'medic' && getTeam(this.team) === getTeam(t.team))) {
        if (!collision(this.x, this.y, 80, 80, t.x, t.y, 80, 80)) continue;
        t.damageCalc(t.x, t.y, this.class === 'warrior' ? 75 : -30, getUsername(this.team));
        t.canBashed = false;
        setTimeout(() => {t.canBashed = true}, 800);
      }
    }
    for (const ai of this.host.ai) {
      if (this.class === 'medic' && (this.x-ai.x)**2 + (this.y-ai.y)**2 < 250000 && getTeam(this.team) === getTeam(ai.team)) ai.hp = Math.min(ai.hp+.3, ai.maxHp);
      if (this.immune+500 < Date.now() || !ai.canBashed) continue;
      if ((this.class === 'warrior' && getTeam(this.team) !== getTeam(ai.team)) || (this.class === 'medic' && getTeam(this.team) === getTeam(ai.team))) {
        if (!collision(this.x, this.y, 80, 80, ai.x, ai.y, 80, 80)) continue;
        ai.damageCalc(ai.x, ai.y, this.class === 'warrior' ? 75 : -30, getUsername(this.team));
        ai.canBashed = false;
        setTimeout(() => {ai.canBashed = true}, 800);
      }
    }
    for (const {x, y, type, team} of this.host.b) {
      if (collision(this.x, this.y, 80, 80, x, y, 100, 100) && this.immune+500 < Date.now()) {
        if (type === 'fire') {
          if (this.fire) {
            clearTimeout(this.fireTimeout);
            this.fire = {team, frame: this.fire.frame};
          } else {
            this.fire = {team, frame: 0};
            this.fireInterval = setInterval(() => {
              this.fire.frame = this.fire.frame === 0 ? 1 : 0;
            }, 50);
          }
          this.fireTimeout = setTimeout(() => {
            clearInterval(this.fireInterval);
            this.fire = false;
          }, 4000);
        } else if (type === 'spike' && getTeam(team) !== getTeam(this.team)) {
          this.damageCalc(this.x, this.y, .5);
        }
      }
    }
    if (this.damage) this.damage.y--;
    //if (this.grapple) t.grappleCalc(); no grapple for ai yet
  }

  move() {
    const {x, y, path, baseRotation} = this;
    if ((x-10)%100 === 0 && (y-10)%100 === 0) this.onBlock();
    if (!path) return;
    if (!path.p.length) return;
    const now = Date.now();
    const len = path.p.length-1;
    let frames = Math.min(Math.floor((now-path.t)/15), len*25);
    if (this.immune+500 > path.t) frames = Math.min(frames+3*Math.floor(Math.min(now-Math.max(this.immune, path.t), this.immune+500-path.t)/15), len*25);
    const f = Math.floor(frames/25);
    const n = Math.min(f+1, len);
    const dx = path.p[n][0]-path.p[f][0];
    const dy = path.p[n][1]-path.p[f][1];
    const offset = 4*(frames%25);
    const nx = 10+path.p[f][0]*100+offset*dx;
    const ny = 10+path.p[f][1]*100+offset*dy;
    this.baseRotation = [[135, 180, 225], [90, baseRotation, 270], [45, 0, 315]][dy+1][dx+1];
    this.tr = this.baseRotation;
    this.obstruction = this.collision(nx, ny);
    if (!this.obstruction) {
      if (this.canBoost && Math.random() < 1/(300*this.stupidity)) {
        this.canBoost = false;
        this.immune = Date.now();
        setTimeout(() => {this.canBoost = true}, 5000);
      }
      this.x = nx;
      this.y = ny;
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
    if (this.path.p.length === 0) {
      this.generatePath();
    }
    if (this.path.p.length !== 0) {
      const final = this.path.p[this.path.p.length - 1];
      if ((this.x - 10) / 100 === final[0] && (this.y - 10) / 100 === final[1]) {
        this.generatePath();
      }
    }
    if (this.path.m !== this.mode) {
      this.generatePath();
    }
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
    let target = false, previousTargetExists = false;
    for (const t of host.pt) {
      if (!t.ded && !t.invis) {
        if (t.id === this.target.id) previousTargetExists = true;
        if (getTeam(team) === getTeam(t.team)) {
          allies.push({x: t.x, y: t.y, id: t.id, distance: Math.sqrt((t.x-this.x)**2+(t.y-this.y)**2)});
        } else {
          targets.push({x: t.x, y: t.y, id: t.id, distance: Math.sqrt((t.x-this.x)**2+(t.y-this.y)**2)});
        }
      }
    }
    for (const ai of host.ai) {
      if (ai.id === this.target.id) previousTargetExists = true;
      if (getTeam(team) === getTeam(ai.team)) {
        allies.push({x: ai.x, y: ai.y, id: ai.id, distance: Math.sqrt((ai.x-this.x)**2+(ai.y-this.y)**2)});
      } else {
        targets.push({x: ai.x, y: ai.y, id: ai.id, distance: Math.sqrt((ai.x-this.x)**2+(ai.y-this.y)**2)});
      }
    }
    targets.sort((a, b) => a.distance - b.distance);
    for (const t of targets) if (raycast(this.x+40, this.y+40, t.x+40, t.y+40, this.host.b)) {
      target = t;
      break;
    }
    if (this.role === 3 && !this.bond && allies.length > 0) {
      allies.sort((a, b) => a.distance - b.distance);
      for (const a of allies) if (a.id !== this.id) if (raycast(this.x+40, this.y+40, a.x+40, a.y+40, this.host.b)) {
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
        }, previousTargetExists ? 10000 : 0);
      }
      return;
    }
    if (this.target) this.target.c = clearTimeout(this.target.c);
    target.s = true;
    this.target = target;
    this.mode = (this.hp < .3 * this.maxHp && this.role !== 1) ? 2 : 1;
  }

  fireCalc(tx, ty, type) {
    if (!type) type = this.role !== 0 && Math.sqrt((tx - this.x) ** 2 + (ty - this.y) ** 2) < 150 ? 'shotgun' : 'bullet';
    const cooldown = {powermissle: 0, shotgun: 600, bullet: 200}[type];
    this.pushback = -3;
    let l = type === 'shotgun' ? -10 : 0;
    while (l<(type === 'shotgun' ? 15 : 1)) {
      const { x, y } = toPoint(this.r+l);
      this.host.s.push(new Shot(this.x + 40, this.y + 40, x, y, type, this.r+l, this.team, this.rank, this.host));
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

  damageCalc(x, y, d) {
    if (this.immune+500 > Date.now()) return;
    clearTimeout(this.damageTimeout);
    this.damageTimeout = setTimeout(() => {this.damage = false}, 1000);
    this.damage = {d: (this.damage ? this.damage.d : 0)+d, x, y};
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
    for (const cell of this.cells) {
      const [x, y] = cell.split('x');
      this.host.cells[x][y].delete(this);
    }
  }
}

try {
  module.exports = {Engine, AI, Block, Shot, Damage, Tank, getTeam, parseTeamExtras, getUsername};
} catch (e) {}
