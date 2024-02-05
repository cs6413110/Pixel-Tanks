class Damage {
  static args = ['x', 'y', 'w', 'h', 'a', 'team', 'host'];
  constructor(x, y, w, h, a, team, host) {
    for (const i in arguments) this[Damage.args[i]] = arguments[i];
    this.raw = {};
    this.f = 0;
    this.id = Math.random();
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
        const teamMatch = Engine.getTeam(team) === Engine.getTeam(e.team);
        if (e instanceof Tank) {
          if (((!teamMatch && a > 0) || (teamMatch && a < 0)) && Engine.collision(x, y, w, h, e.x, e.y, 80, 80)) e.damageCalc(x, y, a, Engine.getUsername(team));
        } else if (e instanceof Block) {
          if (Engine.collision(x, y, w, h, e.x, e.y, 100, 100)) e.damage(a);
        } else if (e instanceof AI) {
          if (((!teamMatch && a > 0) || (teamMatch && a < 0)) && Engine.collision(x, y, w, h, e.x, e.y, e.role === 0 ? 100 : 80, e.role === 0 ? 100 : 80)) e.damageCalc(e.x, e.y, a, Engine.getUsername(team));
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
