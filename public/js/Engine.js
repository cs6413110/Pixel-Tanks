class Engine {
  constructor(levels) {
    this.spawn = {x: 0, y: 0};
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

  useAbility(t, a) {
    if (a === 'dynamite') {
      for (let i = this.s.length-1; i >= 0; i--) {
        const s = this.s[i];
        if (Engine.getUsername(s.team) !== t.username || s.type !== 'dynamite') continue;
        this.d.push(new Damage(s.x-50, s.y-50, 100, 100, 100, s.team, this));
        s.destroy();
      }
    } else if (a === 'toolkit') {
      if (t.healTimeout !== undefined) {
        clearTimeout(t.healTimeout);
        t.healTimeout = undefined;
      } else {
        t.healTimeout = setTimeout(() => {
          t.hp = t.maxHp;
          t.healTimeout = undefined;
        }, t.class === 'medic' ? 5000 : 7500);
       }
    } else if (a === 'tape') {
      t.hp = Math.min(t.maxHp, t.hp+t.maxHp/4);
    } else if (a === 'glu') {
      clearInterval(t.gluInterval);
      clearTimeout(t.gluTimeout);
      t.gluInterval = setInterval(() => {
        t.hp = Math.min(t.maxHp, t.hp+.5);
      }, 15);
      t.gluTimeout = setTimeout(() => clearInterval(t.gluInterval), 5000);
    } else if (a.includes('block#')) {
      const coords = [{ r: [337.5, 360], dx: -10, dy: 80 }, { r: [0, 22.5], dx: -10, dy: 80 }, { r: [22.5, 67.5], dx: -100, dy: 80 }, { r: [67.5, 112.5], dx: -100, dy: -10 }, { r: [112.5, 157.5], dx: -100, dy: -100 }, { r: [157.5, 202.5], dx: -10, dy: -100 }, { r: [202.5, 247.5], dx: 80, dy: -100 }, { r: [247.5, 292.5], dx: 80, dy: -10 }, { r: [292.5, 337.5], dx: 80, dy: 80 }];
      const type = a.replace('block#', '');
      for (const coord of coords) {
        if (t.r >= coord.r[0] && t.r < coord.r[1]) {
          this.b.push(new Block(t.x+coord.dx, t.y+coord.dy, {strong: 200, weak: 100, gold: 300, spike: 50}[type], type, t.team, this));
          break;
        }
      }
    } else if (a === 'flashbang') {
      for (const tank of this.pt) {
        const bangTime = (500-Math.sqrt((t.x-tank.x)**2+(t.y-tank.y)**2))*5;
        if (bangTime > 0 && (Engine.getTeam(tank.team) !== Engine.getTeam(t.team) || tank.username === t.username)) {
          tank.flashbanged = true;
          clearTimeout(tank.flashbangTimeout);
          tank.flashbangTimeout = setTimeout(() => {
            tank.flashbanged = false;
          }, tank.username === t.username ? 500 : bangTime);
        }
      }
      for (const ai of this.ai) {
        const bangTime = (500-Math.sqrt((t.x-ai.x)**2+(t.y-ai.y)**2))*5;
        if (bangTime > 0 && (Engine.getTeam(ai.team) !== Engine.getTeam(t.team) || ai.id === t.id)) {
          ai.stunned = true;
          clearTimeout(ai.flashbangTimeout);
          ai.flashbangTimeout = setTimeout(() => {
            ai.stunned = false;
          }, ai.id === t.id ? 500 : bangTime);
        }
      }
    } else if (a === 'break') {
      for (const cell of t.cells) {
        const c = cell.split('x'), cx = c[0], cy = c[1], breakable = ['gold', 'weak', 'strong', 'spike', 'barrier', 'void'];
        for (const entity of this.cells[cx][cy]) if (entity instanceof Block && Engine.collision(t.x, t.y, 80, 80, entity.x, entity.y, 100, 100) && breakable.includes(entity.type)) setTimeout(() => entity.destroy());
      }
    } else if (a === 'bomb') {
      if (t.grapple) {
        t.grapple.bullet.destroy();
        t.grapple = false;
      }
      const hx = Math.floor(t.x/100), hy = Math.floor(t.y/100);
      for (let i = Math.max(0, hx-1); i <= Math.min(29, hx+1); i++) for (let l = Math.max(0, hy-1); l <= Math.min(29, hy+1); l++) {
        for (const entity of this.cells[i][l]) {
          if (entity instanceof Block) {
            if (Engine.getTeam(entity.team) !== Engine.getTeam(t.team)) {
              entity.damage(150);
            }
          } else if (entity instanceof Shot) {
            if (Engine.getTeam(entity.team) !== Engine.getTeam(t.team) && (entity.type === 'dynamite' || entity.type === 'usb')) {
              entity.destroy();
            }
          }
        }
      }
    } else if (a === 'turret') {
      this.ai.push(new AI(Math.floor(t.x / 100) * 100 + 10, Math.floor(t.y / 100) * 100 + 10, 0, t.rank, t.team, this));
    } else if (a === 'buff') {
      t.buff = true;
      setTimeout(() => { t.buff = false }, 5000);
    } else if (a === 'shield') {
      t.shields = 100;
    } else if (a === 'reflector') {
      t.reflect = true;
      setTimeout(() => {
        t.reflect = false;
      }, 500);
    } else if (a.includes('airstrike')) {
      const h = a.replace('airstrike', '').split('x');
      this.b.push(new Block(Number(h[0]), Number(h[1]), Infinity, 'airstrike', Engine.parseTeamExtras(t.team), this));
    } else if (a === 'healwave') {
      let allies = [];
      for (const tank of this.pt) if (Engine.getTeam(tank.team) === Engine.getTeam(t.team) && (tank.x-t.x)**2+(tank.y-t.y)**2 < 90000 && t.id !== tank.id) allies.push(tank);
      for (const ai of this.ai) if (Engine.getTeam(ai.team) === Engine.getTeam(t.team) && (ai.x-t.x)**2+(ai.y-t.y)**2 < 90000 && t.id !== ai.id) allies.push(ai);
      for (const fren of allies) fren.hp += (fren.maxHp-fren.hp)/(2*Math.max(1, allies.length));
    }
  }

  update(data) {
    const t = this.pt.find(t => t.username === data.username);
    if (!t) return;
    data = data.data;
    const { emote, r, baseFrame, use, x, y, fire} = data;
    t.baseRotation = data.baseRotation;
    t.immune = data.immune;
    t.animation = data.animation;
    t.emote = emote;
    if (t.canInvis) t.invis = data.invis;
    t.baseFrame = data.baseFrame;
    if (!t.grapple) {
      t.x = x;
      t.y = y;
      t.updateCell();
      if (t.class === 'warrior' && t.immune && !t.ded) this.useAbility(t, 'break');
    }
    t.r = r;
    if (use.includes('respawn')) {
      t.socket.send({event: 'ded'});
      t.socket.send({event: 'override', data: [{key: 'x', value: this.spawn.x}, {key: 'y', value: this.spawn.y}]});
      t.x = this.spawn.x;
      t.y = this.spawn.y;
      t.ded = false;
      t.hp = t.maxHp;
    }
    if (t.ded) return;
    if (t.immune && t.class === 'fire') {
      for (const cell of t.cells) {
        const [cx, cy] = cell.split('x');
        let hasFire = false;
        for (const entity of this.cells[cx][cy]) if (entity instanceof Block && entity.type === 'fire' && Engine.getUsername(entity.team) === t.username && entity.x/100 === cx && entity.y/100 === cy) hasFire = true;
        if (!hasFire) this.b.push(new Block(cx*100, cy*100, 100, 'fire', Engine.parseTeamExtras(t.team), this));
      }
    }
    for (const exe of use) this.useAbility(t, exe);
    if (fire.length) {
      t.canInvis = t.invis = false;
      setTimeout(() => {t.canInvis = true}, 100);
      t.pushback = -6;
      for (const s of fire) this.s.push(new Shot(t.x + 40, t.y + 40, s.x, s.y, s.type, s.r, Engine.parseTeamExtras(t.team), t.rank*(t.buff ? (1.5*t.rank+15)/Math.max(t.rank, 1/2000) : 1), this));
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
          this.ai.push(new AI(q*100+10, l*100+10, Number(e.split('')[1]), 0/*rank*/, 'squad', this));
        } else if (key[e]) {
          this.b.push(new Block(q * 100, l * 100, key[e][1], key[e][0], ':', this));
        }
      }
    }
  }

  static getRandomColor() {
    let letters = '0123456789ABCDEF', color = '#';
    for (var i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
    return color;
  }

  static finder = new PF.AStarFinder({allowDiagonal: true, dontCrossCorners: true});

  static pathfind(sx, sy, tx, ty, map) {
    return Engine.finder.findPath(sx, sy, tx, ty, map);
  }

  static raycast(x1, y1, x2, y2, walls) {
    const dx = x1-x2, dy = y1-y2, adx = Math.abs(dx), ady = Math.abs(dy), minx = Math.min(x1, x2), miny = Math.min(y1, y2), maxx = Math.max(x1, x2), maxy = Math.max(y1, y2), px = [], py = [];
    walls = walls.filter(({x, y, type}) => {
      if (!['void', 'barrier', 'strong', 'weak', 'gold'].includes(type)) return;
      if (Engine.collision(x, y, 100, 100, minx, miny, adx, ady)) {
        if (Engine.collision(x, y, 100, 100, x1-1, y1-1, 2, 2) || Engine.collision(x, y, 100, 100, x2-1, y2-1, 2, 2)) return false;
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
      for (const p of py) for (const {x, y} of walls) if (Engine.collision(x, y, 100, 100, x1-.5, p-.5, 1, 1)) return false;
    } else {
      const s = dy/dx, o = y1-s*x1;
      for (const {x, y} of walls) {
        for (const p of py) if (Engine.collision(x, y, 100, 100, (p-o)/s-1, p-1, 2, 2)) return false;
        for (const p of px) if (Engine.collision(x, y, 100, 100, p-1, s*p+o-1, 2, 2)) return false;
      }
    }
    return true;
  }
  
  static parseTeamExtras = s => s.replace('@leader', '').split('@requestor#')[0];
  static getUsername = s => Engine.parseTeamExtras(s).split(':')[0];
  static getTeam = s => Engine.parseTeamExtras(s).split(':')[1];
  static collision = (x, y, w, h, x2, y2, w2, h2) => (x + w > x2 && x < x2 + w2 && y + h > y2 && y < y2 + h2);
  static toAngle = (x, y) => (-Math.atan2(x, y)*180/Math.PI+360)%360;
  static toPoint = angle => {
    const theta = (-angle) * Math.PI / 180, y = Math.cos(theta), x = Math.sin(theta);
    return x === 0 ? {x, y: y/Math.abs(y)} : {x: x/Math.abs(x), y: y/Math.abs(x)}
  }
}
if (module) module.exports = Engine;
