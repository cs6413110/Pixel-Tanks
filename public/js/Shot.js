class Shot {
  static settings = {bullet: [20, 18], shotgun: [20, 14.4], grapple: [0, 36], fire: [0, 16.2], dynamite: [0, 14.4], usb: [0, 14.4], powermissle: [100, 27, 50], megamissle: [200, 27, 100], healmissle: [-150, 27, 99]};
  static args = ['x', 'y', 'r', 'type', 'team', 'rank', 'host'];
  static raw = ['team', 'r', 'type', 'x', 'y', 'sx', 'sy', 'id'];
  constructor() {
    this.cells = new Set();
    for (const p of Shot.raw) Object.defineProperty(this, p, {get: () => this.raw[p], set: v => this.setValue(p, v), configurable: true});
  }
  init(x, y, r, type, team, rank, host) {
    this.raw = {};
    for (const i in Shot.args) this[Shot.args[i]] = arguments[i];
    this.e = Date.now();
    this.id = Math.random();
    this.md = this.damage = Shot.settings[this.type][0]*(rank*10+300)/500;
    this.x = this.sx = x+(this.xm = Math.cos(Math.PI*r/180)*Shot.settings[this.type][1])*4.5;
    this.y = this.sy = y+(this.ym = Math.sin(Math.PI*r/180)*Shot.settings[this.type][1])*4.5;
    for (let x = Math.max(0, Math.min(29, Math.floor(this.x/100))); x <= Math.max(0, Math.min(29, Math.floor((this.x+10)/100))); x++) {
      for (let y = Math.max(0, Math.min(29, Math.floor(this.y/100))); y <= Math.max(0, Math.min(29, Math.floor((this.y+10)/100))); y++) {
        host.cells[x][y].add(this);
        this.cells.add(`${x}x${y}`);
      }
    }
    if (this.collision()) this.destroy(); else host.s.push(this);
  }
  collide(e) {
    let size = Shot.settings[this.type][2], o = size/2+10, isBlock = e instanceof Block, pullGrapple = (isBlock || !e) && this.type === 'grapple';
    if (size) this.host.d.push(new Damage(this.x-o, this.y-o, size, size, this.damage, this.team, this.host)); // damage change to square instead of rect hitbox?
    if (this.type === 'dynamite' || this.type === 'usb' || this.type === 'grapple') {
      const g = pullGrapple ? this.host.pt.find(t => t.username === Engine.getUsername(this.team)) : e;
      if (!(this.target = g) || (this.type === 'usb' && isBlock)) return true;
      this.offset = [g.x-this.x, g.y-this.y];
      if (pullGrapple) this.update = () => {};
      if (this.type === 'grapple') {
        if (g.grapple) g.grapple.bullet.destroy();
        g.grapple = {target: pullGrapple ? {x: e.x, y: e.y} : this.host.pt.find(t => t.username === Engine.getUsername(this.team)), bullet: this};
      } else if (this.type === 'usb') setTimeout(() => this.destroy, 20000);
      return false;
    } else if (this.type === 'fire') {
      if (isBlock) return this.host.b.push(A.template('Block').init(e.x, e.y, Infinity, 'fire', this.team, this.host));
      if (e && !e.immune) e.fire = {team: this.team, time: Date.now()};
    } else if (size) {
      this.host.d.push(new Damage(this.x-o, this.y-o, size, size, this.damage, this.team, this.host));
    } else if (e && Engine.getTeam(e.team) !== Engine.getTeam(this.team)) {
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
    for (const cell of this.cells) {
      const c = cell.split('x');
      for (const e of [...this.host.cells[c[0]][c[1]]].sort((a, b) => this.score(a) - this.score(b))) {
        if ((e instanceof Block && e.c) || ((e instanceof Tank || e instanceof AI) && !e.ded) && Engine.collision(this.x, this.y, 10, 10, e.x, e.y, size = e instanceof Block || e.role === 0 ? 100 : 80, size)) return this.collide(e);
      }
    }
    return false;
  }
  update() {
    const time = Math.floor((Date.now()-this.e)/15), x = this.target ? this.target.x-this.offset[0] : time*this.xm+this.sx, y = this.target ? this.target.y-this.offset[1] : time*this.ym+this.sy, x1 = Math.floor(x/100), x2 = Math.floor((x+10)/100), y1 = Math.floor(y/100), y2 = Math.floor((y+10)/100);
    if (x < 0 || y < 0 || x+10 >= 3000 || y+10 >= 3000) if (!this.target && this.collide()) return this.destroy();
    if (Math.floor(this.x/100) !== x1 || Math.floor(this.y/100) !== y2 || Math.floor((this.x+10)/100) !== x2 || Math.floor((this.y+10)/100) !== y2) {
      del: for (const cell of this.cells) {
        let c = cell.split('x'), xv = c[0], yv = c[1];
        for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) if (x === xv && y === yv) continue del;
        this.host.cells[xv][yv].delete(this);
        this.cells.delete(`${xv}x${yv}`);
      }
      for (let x = x1; x <= x2; x++) for (let y = y1; y <= y2; y++) {
        if (this.cells.has(`${x}x${y}`)) continue;
        this.host.cells[x][y].add(this);
        this.cells.add(`${x}x${y}`);
      }
    }
    this.x = x;
    this.y = y;
    if (this.target) return;
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
  reset: () => this.cells.clear()
  destroy() {
    this.host.s.splice(this.host.s.indexOf(this), 1);
    for (const cell of this.cells) {
      const c = cell.split('x');
      this.host.cells[c[0]][c[1]].delete(this);
    }
  }
}
