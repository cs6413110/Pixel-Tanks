class Block {
  static args = ['x', 'y', 'hp', 'type', 'team', 'host'];
  static raw = ['x', 'y', 'maxHp', 'hp', 'type', 's', 'team', 'id'];
  constructor() {
    this.cells = new Set();
    this.t = [];
    for (const p of Block.raw) Object.defineProperty(this, p, {get: () => this.raw[p], set: v => this.setValue(p, v), configurable: true});
  }
  init(x, y, hp, type, team, host) {
    this.raw = {};
    this.id = Math.random();
    for (const i in Block.args) this[Block.args[i]] = arguments[i];
    host.logs.push({m: JSON.stringify(this.hp)+' '+JSON.stringify(this.maxHp)+' '+JSON.stringify(hp)+':'+this.hp+' '+this.maxHp+' '+hp, c: '#FFFFFF'});
    this.maxHp = hp;
    if (!(this.c = type !== 'fire' && type !== 'airstrike')) this.sd = setTimeout(() => this.destroy(), type === 'fire' ? 2500 : 5000);
    if (type === 'airstrike') for (let i = 0; i < 80; i++) this.t.push(setTimeout(() => this.host.d.push(new Damage(this.x+Math.floor(Math.random()*250)-50, this.y+Math.floor(Math.random()*250)-50, 100, 100, 50, this.team, this.host)), 5000+Math.random()*500));
    let dxmin = Math.floor(this.x/100), dymin = Math.floor(this.y/100), dxmax = Math.floor((this.x+99)/100), dymax = Math.floor((this.y+99)/100);
    for (let x = dxmin; x <= dxmax; x++) for (let y = dymin; y <= dymax; y++) {
      host.cells[x][y].add(this);
      this.cells.add(x+'x'+y);
    }
    if (this.c && this.x % 100 === 0 && this.y % 100 === 0 && this.x >= 0 && this.x <= 2900 && this.y >= 0 && this.y <= 2900) host.map.setWalkableAt(dxmin, dymin, false);
    return this;
  }
  setValue(p, v) {
    this.updatedLast = Date.now();
    this.raw[p] = v;
  }
  damage(d) {
    if (this.hp === Infinity) return;
    this.s = Date.now();
    if (this.hp = Math.min(this.maxHp, Math.max(this.hp-d, 0)) === 0) this.destroy();
  }
  reset() {
    for (const property of ['x', 'y', 'maxHp', 'hp', 'type', 'host', 'team', 's' ,'c', 'updatedLast', 'raw']) this[property] = undefined;
    this.cells.clear();
    this.t.length = 0;
  }
  destroy() {
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
