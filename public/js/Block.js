class Block {
  static args = ['x', 'y', 'hp', 'type', 'team', 'host'];
  static raw = ['x', 'y', 'type', 'team', 'maxHp', 'hp'];
  static raw2 = ['x', 'y', 'type', 'team'];
  static update = ['s', 'hp'];
  constructor() {
    this.cells = new Set();
    this.t = []; // can be removed maybe?
  }
  init(x, y, hp, type, team, host) {
    this.id = host.genId(1);
    for (const i in Block.args) this[Block.args[i]] = arguments[i];
    this.maxHp = hp;
    if (!(this.c = type !== 'fire' && type !== 'airstrike' && type !== 'smoke' && type !== 'instastrike')) this.sd = setTimeout(() => this.destroy(), type === 'fire' ? 2500 : (type === 'instastrike' ? 50 : (type === 'smoke' ? 10000 : 6000)));
    if (type === 'spike') this.c = false;
    if (type === 'airstrike') for (let i = 0; i < 80; i++) this.t.push(setTimeout(() => this.host.d.push(A.template('Damage').init(this.x+Math.floor(Math.random()*250)-50, this.y+Math.floor(Math.random()*250)-50, 100, 100, 50, this.team, this.host)), 5000+Math.random()*500));
    if (type === 'instastrike') this.t.push(setTimeout(() => this.host.d.push(A.template('Damage').init(this.x, this.y, 200, 200, 400, this.team, this.host)), 0));
    if (type === 'smoke') for (let i = 0; i < 1600; i++) this.t.push(setTimeout(() => this.host.d.push(A.template('Damage').init(this.x+Math.floor(Math.random()*350)-150, this.y+Math.floor(Math.random()*350)-150, 200, 200, 0, this.team, this.host)), Math.random()*10000));
    if (this.c && this.x % 100 === 0 && this.y % 100 === 0 && this.x >= 0 && this.x <= 2900 && this.y >= 0 && this.y <= 2900) host.map.setWalkableAt(Engine.r(Math.floor(this.x/100)), Engine.r(Math.floor(this.y/100)), false);
    host.loadCells(this, this.x, this.y, 100, 100);
    host.updateEntity(this, type === 'void' || type === 'barrier' ? Block.raw2 : Block.raw);
    return this;
  }
  damage(d, type) {
    if (this.hp === Infinity) return;
    this.s = Date.now();
    if ((this.hp = Math.min(this.maxHp, this.hp-d)) <= 0) return this.destroy();
    this.host.updateEntity(this, Block.update);
  }
  reset() {
    for (const property of ['x', 'y', 'maxHp', 'hp', 'type', 'team', 's' ,'c', 'updatedLast', 'host']) this[property] = undefined;
    this.cells.clear();
    this.t.length = 0;
  }
  destroy() {
    this.host.destroyEntity(this);
    for (const t of this.t) clearTimeout(t);
    clearTimeout(this.sd);
    this.host.b.splice(this.host.b.indexOf(this), 1);
    cell: for (const cell of this.cells) {
      const [x, y] = cell.split('x');
      this.host.cells[x][y].delete(this);
      for (const e of this.host.cells[x][y]) if (e instanceof Block && e.x % 100 === 0 && e.y % 100 === 0) continue cell;
      this.host.map.setWalkableAt(x, y, true);
    }
    this.release();
  }
}
