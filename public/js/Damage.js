class Damage {
  static args = ['x', 'y', 'w', 'h', 'a', 'team', 'host'];
  static raw = ['x', 'y', 'w', 'h', 'f']; // x,y,w,h don't change so maybe doesn't matter if raw(for new system only).
  constructor() {
    this.cells = new Set();
    for (const p of Damage.raw) Object.defineProperty(this, p, {get: () => this.raw[p], set: v => this.setValue(p, v), configurable: true});
  }
  init(x, y, w, h, a, team, host) {
    this.raw = {};
    this.id = Math.random();
    for (const i in arguments) this[Damage.args[i]] = arguments[i];
    this.f = 0;
    for (let dx = this.x/100, dy = this.y/100, i = 0; i < 4; i++) { // upgrade this soon for more dynamic rect
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
    this.i = setInterval(() => (this.f++), 18); // remove pls me this is pain
    setTimeout(() => this.destroy(), 200);
  }
  setValue(p, v) {
    this.updatedLast = Date.now(); // replace
    this.raw[p] = v; // replace soon
    this.host.updateEntity(this.id, this.x, this.y, this.w, this.h, p, v); // new bindings
  }
  reset() {
    // loop through unnecessary and set to undefined? Or maybe it doesn't matter since it will be auto reset on recycle?
    this.cells.clear();
  }
  destroy() {
    clearInterval(this.i);
    this.host.d.splice(this.host.d.indexOf(this), 1);
    for (const cell of this.cells) {
      const [x, y] = cell.split('x');
      this.host.cells[x][y].delete(this);
    }
    this.release();
  }
}
