class Shot {
  constructor(x, y, xm, ym, type, rotation, team, rank, host) {
    this.team = team;
    this.r = rotation;
    this.type = type;
    this.host = host;
    this.e = Date.now();
    this.raw = {};
    this.id = Math.random();
    this.md = this.damage = Shot.settings.damage[type]*(rank*10+300)/500;
    const factor = 6/Math.sqrt(xm**2+ym**2);
    this.xm = xm*factor*Shot.settings.speed[type];
    this.ym = ym*factor*Shot.settings.speed[type];
    const data = Shot.calc(x, y, xm, ym);
    this.sx = this.x = data.x-5;
    this.sy = this.y = data.y-5;
    this.cells = new Set();
    for (let dx = this.x/100, dy = this.y/100, i = 0; i < 4; i++) {
      const cx = Math.max(0, Math.min(29, Math.floor(i < 2 ? dx : dx+.09))), cy = Math.max(0, Math.min(29, Math.floor(i % 2 ? dy : dy+.09)));
      host.cells[cx][cy].add(this);
      this.cells.add(cx+'x'+cy);
    }
    this.u();
  }

  static settings = {
    damage: {
      bullet: 20,
      shotgun: 20,
      grapple: 0,
      powermissle: 100,
      megamissle: 200,
      healmissle: -100,
      dynamite: 0,
      fire: 0,
      usb: 0,
    },
    speed: {
      bullet: 1,
      shotgun: .8,
      grapple: 2,
      powermissle: 1.5,
      megamissle: 1.5,
      healmissle: 1.5,
      dynamite: .8,
      fire: .9,
      usb: .8,
    },
    size: {
      healmissle: 50,
      powermissle: 50,
      megamissle: 100,
    }
  }

  static calc(x, y, xm, ym) {
    const r = 70;
    const a = xm === 0 ? 1000000 : ym / xm;
    const b = xm === 0 ? 0 : (a > 0 ? -1 : 1);
    const c = Math.sqrt(r**2+(r*a)**2);
    const d = r*c;
    const cx = -r*b*d/c**2;
    const cy = Math.abs(r*a)*d/c**2;
    return {x: x+cx*(ym >= 0 ? 1 : -1), y: y+cy*(ym >= 0 ? 1 : -1)};
  }

  collision() {
    const { host, x, y, type, cells} = this;
    if (x < 0 || x > 3000 || y < 0 || y > 3000) {
      if (type === 'grapple') {
        const t = host.pt.find(t => t.username === Engine.getUsername(this.team));
        if (t.grapple) t.grapple.bullet.destroy();
        t.grapple = { target: { x: x, y: y }, bullet: this };
        this.update = () => {};
        return false;
      } else if (type === 'dynamite') {
        this.update = () => {}
        return false;
      } else {
        if (Shot.settings.size[type]) host.d.push(new Damage(x - Shot.settings.size[type] / 2 + 10, y - Shot.settings.size[type] / 2 + 10, Shot.settings.size[type], Shot.settings.size[type], this.damage, this.team, host));
        return true;
      }
    }
    for (const cell of cells) { 
      const [cx, cy] = cell.split('x');
      for (const e of host.cells[cx][cy]) {
        if (e instanceof Tank) {
          if (e.ded || !Engine.collision(x, y, 10, 10, e.x, e.y, 80, 80)) continue;
          if (type === 'grapple') {
            if (e.grapple) e.grapple.bullet.destroy();
            e.grapple = {target: host.pt.find(tank => tank.username === Engine.getUsername(this.team)), bullet: this};
            this.target = e;
            this.offset = [e.x-x, e.y-y];
            this.update = this.dynaUpdate;
            return false;
          } else if (type === 'dynamite' || type === 'usb') {
            this.target = e;
            this.offset = [e.x-x, e.y-y];
            this.update = this.dynaUpdate;
            if (type === 'usb') setTimeout(() => this.destroy(), 15000);
            return false;
          } else if (type === 'fire') {
            if (e.immune) return true;
            if (e.fire) clearTimeout(e.fireTimeout);
            e.fire = { team: this.team, frame: e.fire?.frame || 0 };
            e.fireInterval ??= setInterval(() => e.fire.frame ^= 1, 50); // OPTIMIZE make gui effects render by date time not by server interval
            e.fireTimeout = setTimeout(() => {
              clearInterval(e.fireInterval);
              e.fire = false;
            }, 4000);
            return true;
          } else {
            if (Shot.settings.size[type]) {
              host.d.push(new Damage(x - Shot.settings.size[type] / 2 + 10, y - Shot.settings.size[type] / 2 + 10, Shot.settings.size[type], Shot.settings.size[type], this.damage, this.team, host));
            } else if (Engine.getTeam(e.team) !== Engine.getTeam(this.team)) {
              e.damageCalc(x, y, this.damage, Engine.getUsername(this.team));
            }
            return true;
          }
        } else if (e instanceof Block) {
          if (!e.c || !Engine.collision(e.x, e.y, 100, 100, x, y, 10, 10)) continue;
          if (type === 'grapple' || type === 'dynamite') {
            if (type === 'grapple') {
              const t = this.host.pt.find(t => t.username === Engine.getUsername(this.team));
              if (t.grapple) t.grapple.bullet.destroy();
              t.grapple = {target: e, bullet: this}
            }
            this.update = () => {};
            return false;
          } else {
            if (type === 'fire') host.b.push(new Block(e.x, e.y, Infinity, 'fire', this.team, host));
            if (Shot.settings.size[type]) {
              host.d.push(new Damage(x - Shot.settings.size[type] / 2 + 10, y - Shot.settings.size[type] / 2 + 10, Shot.settings.size[type], Shot.settings.size[type], this.damage, this.team, host));
            } else if (type !== 'fire') {
              e.damage(this.damage);
            }
            return true;
          }
        } else if (e instanceof AI) {
          if (!Engine.collision(x, y, 10, 10, e.x, e.y, 80, 80)) continue;
          if (type === 'dynamite' || type === 'usb') {
            this.target = e;
            this.offset = [e.x-x, e.y-y];
            this.update = this.dynaUpdate;
            if (type === 'usb') setTimeout(() => this.destroy(), 15000);
            return false;
          } else if (type === 'fire') {
            if (e.fire) clearTimeout(e.fireTimeout);
            e.fire = {team: this.team, frame: e.fire?.frame || 0};
            e.fireInterval ??= setInterval(() => e.fire.frame ^= 1, 50);
            e.fireTimeout = setTimeout(() => {
              clearInterval(e.fireInterval);
              e.fire = false;
            }, 4000);
            return true;
          } else {
            if (Shot.settings.size[type]) {
              host.d.push(new Damage(x - Shot.settings.size[type] / 2 + 10, y - Shot.settings.size[type] / 2 + 10, Shot.settings.size[type], Shot.settings.size[type], this.damage, this.team, host));
            } else if (Engine.getTeam(e.team) !== Engine.getTeam(this.team)) {
              e.damageCalc(x, y, this.damage, Engine.getUsername(this.team));
            }
            return true;
          }
        }
      }
    }
    return false;
  }

  dynaUpdate() {
    this.oldx = this.x;
    this.oldy = this.y;
    this.x = this.target.x - this.offset[0];
    this.y = this.target.y - this.offset[1];
    this.cellUpdate();
    this.u();
    if (this.target.ded) this.destroy();
    if (this.host.pt.find(t => t.username === Engine.getUsername(this.team))?.ded) this.destroy();
  }

  cellUpdate() {
    try {
    if (Math.floor(this.oldx/100) !== Math.floor(this.x/100) || Math.floor(this.oldy/100) !== Math.floor(this.y/100) || Math.floor((this.oldx+10)/100) !== Math.floor((this.x+10)/100) || Math.floor((this.oldy+10)/100) !== Math.floor((this.y+10)/100)) { 
      const cells = new Set();
      for (let dx = this.x/100, dy = this.y/100, i = 0; i < 4; i++) {
        const cx = Math.max(0, Math.min(29, Math.floor(i < 2 ? dx : dx + .09))), cy = Math.max(0, Math.min(29, Math.floor(i % 2 ? dy : dy + .09)));
        this.host.cells[cx][cy].add(this);
        cells.add(cx+'x'+cy);
      }
      for (const cell of [...this.cells].filter(c => !cells.has(c))) {
        const [x, y] = cell.split('x');
        this.host.cells[x][y].delete(this);
      }
      this.cells = cells;
    }
    } catch(e) {
      this.host.logs.push({m: `Bullet Cell Updating error occurred. Destroying bullet + logging debug info. Bullet was a ${this.type} bullet. Its coords were ${this.x}, ${this.y} and its old position was ${this.oldx}, ${this.oldy}. Its delta coords were ${this.dx}, ${this.dy}. `, c: '#FFFFFF});
      this.destroy();
    }
  }

  update() {
    const time = Math.floor((Date.now()-this.e)/5);
    this.oldx = this.x;
    this.oldy = this.y;
    this.x = time*this.xm+this.sx;
    this.y = time*this.ym+this.sy;
    this.cellUpdate();
    if (this.collision()) this.destroy();
    if (this.type === 'shotgun') {
      this.d = Math.sqrt((this.x - this.sx) ** 2 + (this.y - this.sy) ** 2);
      this.damage = this.md - (this.d / 300) * this.md;  
      if (this.d >= 300) this.destroy();
    } else if (this.type === 'dynamite') this.r += 5;
    this.u();
  }

  u() {
    this.updatedLast = Date.now();
    for (const property of ['team', 'r', 'type', 'x', 'y', 'sx', 'sy', 'id']) this.raw[property] = this[property];
  }

  destroy() {
    const index = this.host.s.indexOf(this);
    if (index !== -1) this.host.s.splice(index, 1);
    for (const cell of this.cells) {
      const [x, y] = cell.split('x');
      this.host.cells[x][y].delete(this);
    }
  }
}
if (module) module.exports = Shot;
