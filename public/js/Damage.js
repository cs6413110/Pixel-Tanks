class Damage {
  static args = ['x', 'y', 'w', 'h', 'a', 'team', 'host'];
  static raw = ['x', 'y', 'w', 'h'];
  constructor() {
    this.cells = new Set();
  }
  init(x, y, w, h, a, team, host) {
    this.id = host.genId(4);
    for (const i in Damage.args) this[Damage.args[i]] = arguments[i];
    this.time = Date.now();
    host.loadCells(this, x, y, w, h);
    const cache = new Set();
    for (const cell of this.cells) {
      const c = cell.split('x');
      for (const e of host.cells[c[0]][c[1]]) {
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
    this.host.updateEntity(this, Damage.raw);
    setTimeout(() => this.destroy(), 200);
  }
  reset() {
    for (const p of Damage.args) this[p] = undefined;
    this.cells.clear();
  }
  destroy() {
    this.host.destroyEntity(this);
    let i = this.host.d.indexOf(this);
    if (i !== -1) this.host.d.splice(i, 1);
    for (const cell of this.cells) {
      const c = cell.split('x');
      this.host.cells[c[0]][c[1]].delete(this);
    }
    this.release();
  }
} // maybe remove this as an entity?
