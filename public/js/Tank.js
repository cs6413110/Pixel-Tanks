class Tank {
  constructor(data, host) {
    this.raw = {};
    this.render = {release: () => {}, b: new Set(), pt: new Set(), ai: new Set(), s: new Set(), d: new Set()};
    ['rank', 'username', 'cosmetic', 'cosmetic_hat', 'cosmetic_body', 'color', 'damage', 'maxHp', 'hp', 'shields', 'team', 'x', 'y', 'r', 'ded', 'reflect', 'pushback', 'baseRotation', 'baseFrame', 'fire', 'damage', 'animation', 'buff', 'invis', 'id', 'class', 'flashbanged', 'dedEffect'].forEach(p => {
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
    if (data.socket) this.socket = data.socket;
    this.username = data.username;
    this.rank = data.rank;
    this.class = data.class;
    this.cosmetic = data.cosmetic;
    this.cosmetic_hat = data.cosmetic_hat;
    this.cosmetic_body = data.cosmetic_body;
    this.deathEffect = data.deathEffect;
    this.color = data.color;
    this.fire = this.damage = false;
    this.hp = this.maxHp = this.rank*10+300;
    this.canBashed = this.canInvis = true;
    this.team = data.username+':'+Math.random();
    this.x = host.spawn.x;
    this.y = host.spawn.y;
    this.shields = this.r = this.pushback = this.baseRotation = this.baseFrame = this.lastUpdate = 0;
    this.host = host;
    this.privateLogs = [];
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

  updateCell() {
    const cells = new Set();
    for (let dx = this.x/100, dy = this.y/100, i = 0; i < 4; i++) {
      const cx = Math.max(0, Math.min(29, Math.floor(i < 2 ? dx : dx + .79))), cy = Math.max(0, Math.min(29, Math.floor(i % 2 ? dy : dy + .79)));
      this.host.cells[cx][cy].add(this);
      cells.add(`${cx}x${cy}`);
    }
    for (const cell of [...this.cells].filter(c => !cells.has(c))) {
      const [x, y] = cell.split('x');
      this.host.cells[x][y].delete(this);
    }
    this.cells = cells;
  }

  update() {
    const team = Engine.getTeam(this.team);
    if (this.dedEffect) {
      this.dedEffect.time = Date.now() - this.dedEffect.start;
      this.setValue('dedEffect', this.dedEffect); // REMOVE THIS TEMPORARY
    }
    if (this.pushback !== 0) this.pushback += 0.5;
    if (this.fire && Engine.getTeam(this.fire.team) !== Engine.getTeam(this.team)) this.damageCalc(this.x, this.y, .25, Engine.getUsername(this.fire.team));
    if (this.damage) this.damage.y--;
    if (this.grapple) this.grappleCalc();
    if (this.reflect) {
      const hx = Math.floor((this.x+40)/100), hy = Math.floor((this.y+40)/100);
      for (let i = Math.max(0, hx-2); i <= Math.min(29, hx+2); i++) for (let l = Math.max(0, hy-2); l <= Math.min(29, hy+2); l++) {
        for (const entity of this.host.cells[i][l]) {
          if (entity instanceof Shot) {
            if (entity.target) return;
            const xd = entity.x-(this.x+40), yd = entity.y-(this.y+40), td = Math.sqrt(xd**2+yd**2);
            const aspectRatio = 6/td;
            if (td > 150) continue;
            entity.e = Date.now();
            entity.sx = entity.x;
            entity.sy = entity.y;
            entity.xm = xd*aspectRatio;
            entity.ym = yd*aspectRatio;
            entity.r = Engine.toAngle(xd, yd);
            if (entity.type !== 'grapple') entity.team = this.team;
          }
        }
      }
    }
    let spikeLimiter = true;
    for (const cell of this.cells) {
      const [x, y] = cell.split('x');
      for (const entity of this.host.cells[x][y]) {
        const teamMatch = team === Engine.getTeam(entity.team);
        if (entity instanceof Block) {
          if (!this.ded && !this.immune && Engine.collision(this.x, this.y, 80, 80, entity.x, entity.y, 100, 100)) {
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
            } else if (entity.type === 'spike' && !teamMatch && spikeLimiter !== undefined) spikeLimiter = this.damageCalc(this.x, this.y, 1, Engine.getUsername(entity.team));
          }
        }
      }
    }
  }

  damageCalc(x, y, a, u) {
    if ((this.immune && a > 0) || this.ded || this.reflect) return;
    const hx = Math.floor((this.x+40)/100), hy = Math.floor((this.y+40)/100);
    for (let i = Math.max(0, hx-1); i <= Math.min(29, hx+1); i++) for (let l = Math.max(0, hy-1); l <= Math.min(29, hy+1); l++) for (const entity of this.host.cells[i][l]) {
      if (entity instanceof Shot) if (entity.target) if (entity.target.id === this.id && entity.type === 'usb') a = Math.max(0, a+Math.min(Math.abs(a)/4, 5)*(Engine.getTeam(entity.team) === Engine.getTeam(this.team) ? -1 : 1));
    }
    if (this.shields > 0 && a > 0) return this.shields -= a;
    this.hp = Math.max(Math.min(this.maxHp, this.hp-a), 0);
    clearTimeout(this.damageTimeout);
    this.damageTimeout = setTimeout(() => {this.damage = false}, 1000);
    this.damage = {d: (this.damage ? this.damage.d : 0)+a, x, y};
    if (this.hp <= 0 && this.host.ondeath) this.host.ondeath(this, this.host.pt.concat(this.host.ai).find(t => t.username === u));
  }

  grappleCalc() {
    const dx = this.grapple.target.x - this.x, dy = this.grapple.target.y - this.y;
    if (dx ** 2 + dy ** 2 > 400) {
      const angle = Math.atan2(dy, dx);
      const mx = Math.round(Math.cos(angle) * 5)*4;
      const my = Math.round(Math.sin(angle) * 5)*4;
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
    this.updateCell();
  }

  collision(x, y) {
    if (x < 0 || y < 0 || x + 80 > 3000 || y + 80 > 3000) return false;
    for (const b of this.host.b) if (Engine.collision(x, y, 80, 80, b.x, b.y, 100, 100) && b.c) return false;
    return true;
  }
}
if (module) module.exports = Tank;
