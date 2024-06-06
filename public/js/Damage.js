class Damage {
  static args = ['x', 'y', 'w', 'h', 'a', 'team', 'host'];
  static raw = ['x', 'y', 'w', 'h', 'f'];
  constructor() {
    this.cells = new Set();
  }
  init(x, y, w, h, a, team, host) {
    this.id = host.genId(4);
    for (let i = Damage.args.length-1; i >= 0; i--) this[Damage.args[i]] = arguments[i];
    this.f = 0;
    host.loadCells(this, x, y, w, h);
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
      this.host.updateEntity(this, ['f']);
    }, 18); // remove pls me this is pain // ye its pain but can't remove yet :(
    this.host.updateEntity(this, Damage.raw);
    setTimeout(() => this.destroy(), 200);
  }
  reset() {
    // loop through unnecessary and set to undefined? Or maybe it doesn't matter since it will be auto reset on recycle?
    this.cells.clear();
  }
  destroy() {
    this.host.destroyEntity(this);
    clearInterval(this.i);
    this.host.d.splice(this.host.d.indexOf(this), 1);
    for (const cell of this.cells) {
      const c = cell.split('x');
      this.host.cells[c[0]][c[1]].delete(this);
    }
    this.release();
  }
}
