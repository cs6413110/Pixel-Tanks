class Shot {
  static settings = {bullet: [20, 6], shotgun: [20, 4.8], grapple: [0, 12], powermissle: [100, 9, 50], megamissle: [200, 9, 100], healmissle: [-150, 9, 99]};
  static args = ['x', 'y', 'r', 'type', 'team', 'rank', 'host'];
  static raw = ['team', 'r', 'type', 'x', 'y', 'sx', 'sy', 'id'];
  constructor() {
    for (const p of Shot.raw) Object.defineProperty(this, p, {get: () => {
      try {
        return this.raw[p]
      } catch(e) {
        console.log(this.raw);
      }
    }, set: v => this.setValue(p, v), configurable: true});
    this.cells = new Set();
  }
  init(x, y, r, type, team, rank, host) {
    for (const i in Shot.args) this[Shot.args[i]] = arguments[i];
    this.raw = {};
    this.e = Date.now();
    this.id = Math.random();
    this.md = this.damage = Shot.settings[this.type][0]*(rank*10+300)/500;
    this.x = this.sx = (this.xm = Math.cos(r)*Shot.settings[this.type][1])*11.66;
    this.y = this.sy = (this.ym = Math.sin(r)*Shot.settings[this.type][1])*11.66;
    for (let x = Math.max(0, Math.min(29, Math.floor(this.x/100))); x <= Math.max(0, Math.min(29, Math.floor((this.x+10)/100))); x++) {
      for (let y = Math.max(0, Math.min(29, Math.floor(this.y/100))); y <= Math.max(0, Math.min(29, Math.floor((this.y+10)/100))); y++) {
        host.cells[x][y].add(this);
        this.cells.add(`${x}x${y}`);
      }
    }
    return this;
  }
  collide(e) {
    let size = Shot.settings[this.type][2], o = size/2+10, isBlock = e instanceof Block, pullGrapple = (isBlock || !e) && this.type === 'grapple';
    if (size) this.host.d.push(new Damage(this.x-o, this.y-o, size, size, this.damage, this.team, this.host)); // damage change to square instead of rect hitbox?
    if (this.type === 'dynamite' || this.type === 'usb' || this.type === 'grapple') {
      const g = pullGrapple ? this.host.pt.find(t => t.username === Engine.getUsername(this.team)) : e;
      this.target = g;
      this.offset = [g.x-this.x, g.y-this.y];
      if (pullGrapple) this.update = () => {};
      if (this.type === 'grapple') {
        if (g.grapple) g.grapple.bullet.destroy();
        g.grapple = {target: pullGrapple ? {x: e.x, y: e.y} : this.host.pt.find(t => t.username === Engine.getUsername(this.team)), bullet: this};
      }
      return false;
    } else if (this.type === 'fire') {
      if (isBlock) return this.host.b.push(A.template('Block').init(e.x, e.y, Infinity, 'fire', this.team, this.host));
      if (!e.immune) e.fire = {team: this.team, time: Date.now()};
    } else if (size) {
      this.host.d.push(new Damage(x-o, y-o, size, size, this.damage, this.team, this.host));
    } else if (Engine.getTeam(e.team) !== Engine.getTeam(this.team) && e) {
      if (isBlock) e.damage(this.damage); else e.damageCalc(this.x, this.y, this.damage, Engine.getUsername(this.team));
    }
    return true;
  }
  score(e) {
    if (e instanceof Block) return 1;
    if (e instanceof AI) return Engine.getTeam(e.team) === Engine.getTeam(this.team) || this.type === 'grapple' ? 5 : 2;
    if (e instanceof Tank) return (this.type === 'grapple' ? 0 : 1)+(Engine.getTeam(e.team) === Engine.getTeam(this.team) ? 4 : 3);
  }
  collision() {
    if (this.x < 0 || this.y < 0 || this.x > 3000 || this.y > 3000) this.collide();
    for (const cell of this.cells) {
      const c = cell.split('x');
      for (const e of [...this.host.cells[c[0]][c[1]]].sort((a, b) => this.score(b) - this.score(a))) {
        let size = e instanceof Block || e.role === 0 ? 100 : 80;
        if (!e.ded && !e.c && Engine.collision(this.x, this.y, 10, 10, e.x, e.y, size, size)) return this.collide(e);
      }
    }
    return false;
  }
  update() {
    const time = Math.floor((Date.now()-this.e)/5), x = this.target?.x || time*this.xm+this.sx, y = this.target?.y || time*this.ym+this.sy, x1 = 0|(x/100), x2 = 0|((x+10)/100), y1 = 0|(y/100), y2 = 0|((y+10)/100);
    if (0|(this.x/100) !== x1 || 0|(this.y/100) !== y2 || 0|((this.x+10)/100) !== x2 || 0|((this.y+10)/100) !== y2) {
      del: for (const cell of this.cells) {
        let c = cell.split('x'), xv = c[0], yv = c[1];
        for (let x = x1; x < x2; x++) for (let y = y1; y < y2; y++) if (x === xv && y === yv) continue del;
        this.host.cells[xv][yv].delete(this);
        this.cells.delete(`${xv}x${yv}`);
      }
      for (let x = x1; x < x2; x++) for (let y = y1; y < y2; y++) {
        if (!this.cells.has(x+'x'+y)) {
          this.host.cells[x][y].add(this);
          this.cells.add(`${x}x${y}`);
        }
      }
    }
    this.x = x;
    this.y = y;
    if (this.collision() || (this.target?.ded || this.host.pt.find(t => t.username === Engine.getUsername(this.team))?.ded)) return this.destroy();
    if (this.type === 'shotgun') {
      this.d = Math.sqrt((this.x-this.sx)**2+(this.y-this.sy)**2);
      if (this.d >= 300) return this.destroy();
      this.damage = (1-this.d/300)*this.md;  
    } else if (this.type === 'dynamite') this.r += 5;
  }
  setValue(p, v) {
    this.updatedLast = Date.now();
    this.raw[p] = v;
  }
  destroy() {
    this.host.s.splice(this.host.s.indexOf(this), 1);
    for (const cell of this.cells) {
      const c = cell.split('x');
      this.host.cells[c[0]][c[1]].delete(this);
    }
  }
}
