const settings = {
  authserver: 'localhost',
  players_per_room: 20,
  upsl: 120,
  port: 8080,
  chat: true,
  joining: true,
}

const fs = require('fs'), fetch = require('node-fetch');
const {Client, GatewayIntentBits} = require('discord.js');
const {exec} = require('child_process');
const {pack} = require('msgpackr/pack');
const {unpack} = require('msgpackr/unpack');
const {WebSocketServer} = require('ws');
const {dalle, gpt, bing} = require('gpti');

console.log('Starting Server');
console.log('Compiling Engine');
fs.writeFileSync('engine.js', [`const PF = require('pathfinding');`, fs.readFileSync('./public/js/Engine.js'), fs.readFileSync('./public/js/Tank.js'), fs.readFileSync('./public/js/Block.js'), fs.readFileSync('./public/js/Shot.js'), fs.readFileSync('./public/js/AI.js'), fs.readFileSync('./public/js/Damage.js'), fs.readFileSync('./public/js/A.js'), 'module.exports = {Engine, Tank, Block, Shot, AI, Damage, A}'].join(''));
console.log('Compiled Engine');
const {Engine, Tank, Block, Shot, AI, Damage, A} = require('./engine.js');
console.log('Loading Server Properties');
const Storage = {key: ['owners', 'admins', 'vips', 'mutes', 'bans', 'filter']};
for (const p of Storage.key) Storage[p] = fs.existsSync(p+'.json') ? JSON.parse(fs.readFileSync(p+'.json')) : [];
console.log('Loaded Server Properties');
process.stdin.resume();
const save = () => {
  for (const p of Storage.key) fs.writeFileSync(p+'.json', JSON.stringify(Storage[p]));
}
for (const p of ['exit', 'SIGINT', 'SIGUSR1', 'SIGUSR2', 'uncaughtException']) process.on(p, save);
process.on('uncaughtException', (err, origin) => {
  for (const socket of sockets) if (['bradley', 'Celestial', 'cs641311'].includes(socket.username)) socket.send({status: 'error', message: `Error: ${err} Origin: ${origin}`});
  console.error(err);
  process.exit(0);
});
const m = o => Math.max(0, Math.min(59, o)), m2 = o => Math.max(-1, Math.min(60, o));
Array.prototype.r = function(o) {
  let i = this.indexOf(o);
  if (i !== -1) this.splice(i, 1);
}

let sockets = new Set(), servers = {}, ffaLevels = [
  'R968I9X6QX2I9R33IX2IXZX5Q5X5IX4IR33IX4IXI5X3GX5IXIX2IR33I2X3IXIX3IX4ZGX3IXI2XIR33IX4IXIX3IX3GX6GX3IR33IZI4XI3GIX4QX4IXI4R33IX15QX3IX5IR33IX6I2X7QXI2X6IR33IXZ4XI10QI2XZ2X3IR33X2Z4X2QX4QX2IXIX2Z2Q3XR33X4Z2X2I2XIX6IX2Z2X2Q2R33X8IX2GZI2GIXIXQZ2XGX2R33I4X4IX2IX3ZX2IQ2Z2XGX2R33X3IX4IQXIXSXIXQIX2Z2XG2XR33X3IQ2X2IX2ZX3IX2IX2Z2X4R33X3IXQ2XIXIGI2ZGX2IX8R33X3IXQ3IX6IXI2X2I4X2R33X3IX4IXIX2QX4QX2IX2IX2R33IGI2X3I2QI10XIX2IXIR33IX6I2X9I2XIGI2XIR33IX5IX4I3X4QX7IR33I4XIX5GXIXGXGQ2XI4ZIR33IX3GX6IXIX2ZX2QXIX4IR33IXI2XIQ2ZX2IXGXGXGXQ2IX3I2R33IX2IXIXZQ2XI3X6QIX4IR33IX4IX3QX11ZXIX2IR33I9X9I9R1045',
  'R1096I23R37IX5IX7GXIX5IR37IXZXQXIXGXI3XGXIXQXZXIR37IX2GX2IXGX7IX2GX2IR37IXQXZXI5XI5XZXQXIR37IX21IR37IXI19XIR37IXIR17IXIR36XQZI19ZQXR33X3QX2QIX6ZX6IQX2QX3R30X4IX2I3G2X7G2I3X2IX4R29XQXIX3IXQX3I2ZI2X3IXQX3IXQXR28X2QXIX3IXIX3IX3IX3IXIX3IXQX2R27XGQX5IXIX3ZXSXZX3IXIX5QGXR27X2QXIX3IXIX3IX3IX3IXIX3IXQX2R28XQXIX3QXIX3I2ZI2X3QXIX3IXQXR29X4IX2I3G2X7G2I3X2IX4R30X3QX2QIX6ZX6IQX2QX3R33XQZI19XQXR36IXIR17IXIR37IXI19XIR37IX21IR37IXQ2X2I5XI5XZ2X2IR37IXQGZXIX9IXZGQXIR37IX2Z2XIXZXIXIXZXIX2Q2XIR37IX5IX9IX5IR37I23R921',
  'X3IX3IX3IX2R2XQX12R30X3IX3IX3I2XR2XIXGX2QXIX2IX2R30X3IX3IX3IX2R2QIXGXQ2X2IZI2XR30I2ZI3ZI3ZIXIR2XIXG2XQXZX5R30X14R2XIX5Z2X2QX2R30XI2X2Z6X3R2QIX4Z2X6R30X2IX2Z6X3R2XIXI2XZX2I2X3R30XI2X2ZXZXZ2XQXR2XIX3ZX4IX3R30X2IX9QXR2QIX2Z2X7QR30X2IX9QXR2XIXZ2I2X2G3XQR30XI2X3QXQX5R2XIXZI3X4GX2R30X4IXQXQ2X4R2QIX12R30X4IXIX2QX3GZ2QI12XR30X4IX2IX4QZQZ2GQX2QX2QX2QXQR42Z2SXQZR54ZQX2Z2R42Z2IZ3QZ5GZ2QZQX12R30IQ2GZ3QZ2QZ2QZ2GX2I2X3QX3IXR30IZIZQZ3I2ZIZ2R2X3I2ZX8R30ZQI2QGZ2Q2IQIGR2X5Z3X6R30IZ2IQ2Z2IQ3IZR2Q2X6Z4X2R30Z2I2Z5I3Z2R2XQ2X8ZX2R30IQIQZ2GQZQZQZ2R2X14R30Z3GZ2QZ3GZ2QR9X7R30ZI7Z2QZ3R2X8IXIXIQR30ZQ2ZGZ2IZ6R2XZXZ2XZXI5XR30I2Q2Z2QIQZ5R2XZXZX2Z2IX3IXR30ZGZQZQZIQZ2GQZR2X2Z3XZ2IX3IXR30Z5IZIZQ2Z3R2X2ZX2ZXZQX3IXR30Q2Z2QIZ6QZR2X2ZX5I5XR1830',
  'R1638I17R42I2X15I2R41IX2ZXGX3GX3GXZX2IR41IX2IX5IX5IX2IR41I6XQXIXQXI6R40I2X4GX3IX3GX4I2R39IX2QX2IX3GX3IX2QX2IR39IX4ZI2X5I2ZX4IR38I2QI3ZXI3SI3XZI3QI2R38IX4ZI2X5I2ZX4IR39IX2QX2IX3GX3IX2QX2IR39I2X4GX3IX3GX4I2R40I6XQXIXQXI6R41IX2IX5IX5IX2IR41IX2ZXGX3GX3GXZX2IR41I2X15I2R42I17R985',
], duelsLevels = [
  'X43RX5R2X8R2XRXRX14R3X5RX3R2X11R2XRX3RX7RXRX3R3X9R2X3RXRX8RX6RX11RX15R2X4RXRX17R2X3RX13RX2RX7BX31RXRX15R3X12R2X27R2X22R2X2R2X4RX15RX7RX3RX17RX5R3X5R2X6R2XRXRX3R2X3RX5RX17RX3RX11RX4RX11RX10RX31R2XR2X31RX2RXR2X5RX13RX26R2X2R2X14RXRX2R2XRXRX13RX17RX28RX10R2X3RX21RX22R2X6RX7RX11RX2RX2RXRX2RX21RX5RX10RX7R2X23RX11RX15RXRX3RX15RX8R3X13R2X3RX29RX7RX3R2XRX8RX6RX35RX6RXR2X4RX10RX8RX15RX7RX11R4X11RXR2X4RX5RXR2X3RX11RX44RXRX13RX13R2XR2X41RX13RX12RX33RX9R3X8R2X2RXRX21R2X10RXR3X3RX14R3X22RX4R2X6RX4RX15R5XR2XRX4RX3R2X2RX2RX4RX9R4X17GXRX4R2X5R3X6RX14R2X4R2X2RX2R2X5R2XR2X7RX11RX2R2X11RX16RX2R5X12RX4RX2RX14RX19R2X38RX21RX24RX13RX19R2X18R2X6RX13RX17RXRXRX14RX8RX14RX4RX10RX7RX8RX12RX21RX3RX2RX9R3X2RX74RX14R4X40R2X12R2X4RX38RX14RX43RX13RX9RX32RX15RX11RXR2X6RX5RX3RXRX8RX16RX36RX2R3X17RX60RX24RX35RX15RXRX4RX2RX13R2XRX18RX8R3X15RX17R2X14RXR3X2RX20RX4RX11RX43RX2RX13RX44RX25R2X10R2XRXR2X29RX10RX2R3XR2XRX2RX9RX23RX11RX26RX16RXRX13RX26RXRX13RX48R2X3RX2RX11AX6RX46RX53R3X5RX18RX13RX4R2X2RX2RXR2XRX12RX8RX4R2XRXRX3R3XRX45RX110'
], tdmLevels = [
  'R1280IR19IR37I2GI2R15I2GI2R34IX5IR13IX5IR33IX5IR13IX5IR33IX2GX2IR6XR6IX2GX2IR33IX5IR4X2ZX2R4IX5IR33IX5I2RX3Z3X3RI2X5IR34I2GIXIX4IZ3IX4IXIGI2R37I2Q2X5Z3X5Q2I2R40IX2Q2X3Z3X3Q2X2IR42I3XQ2X5Q2XI3R43XZX2I4GI4X2ZXR43X4IX3IX3IX4R43X4IXAXIXBXIX4R43XZX2IX3IX3IX2ZXR43XZ2XIXI2GI2XIXZ2XR43XZIX5IX5IZXR43XZ2X5IX5Z2XR43X2Z2X4IX4Z2X2R45X6IX6R49X4IX4R53X5R55I2XI2R55I2GI2R54IX5IR53IX5IR53IX2GX2IR53IX5IR53IX5IR54I2GI2R57IR509',
  'R1153I13R47IX11IR47IXI2X2IX2I2XIR47IXI2X2IX2I2XIR47IXI2X2IX2I2XIR40I8XI2X2IX2I2XI8R33IX6IX11IX6IR33IXI4QI6QI6QI4XIR30I4GIX9ZXZX9IGI4R27IX4IXIX5IX2GX2Q3X3IXIX4IR27IXGX2IXI2XI4XZXZX2Q3XI2XIX2GXIR27IX4IX2IX7GX3QX3IX2IX4IR27IXIX2IX2ZX4I3XIXQ2X3ZX2IX2IXIR27IXIX4QAQX5IXIX5QBQX4IXIR27IXIX2IX2ZX3Q2XIXI3X4ZX2IX2IXIR27IX4IX2IX3QX3GX7IX2IX4IR27IXGX2IXI2XQ3X2ZXZXI4XI2XIX2GXIR27IX4IXIX3Q3X2GX2IX5IXIX4IR27I4GIX9ZXZX9IGI4R30IXI4QI6QI6QI4XIR33IX6IX11IX6IR33I8XI2X2IX2I2XI8R40IXI2X2IX2I2XIR47IXI2X2IX2I2XIR47IXI2X2IX2I2XIR47IX11IR47I13R874',
  'R1638I17R42I2X15I2R41IX2ZXGX3GX3GXZX2IR41IX2IX5IX5IX2IR41I6XQXIXQXI6R40I2X4GX3IX3GX4I2R39IX2QX2IX3GX3IX2QX2IR39IX4ZI2X5I2ZX4IR38I2QI3ZAI7BZI3QI2R38IX4ZI2X5I2ZX4IR39IX2QX2IX3GX3IX2QX2IR39I2X4GX3IX3GX4I2R40I6XQXIXQXI6R41IX2IX5IX5IX2IR41IX2ZXGX3GX3GXZX2IR41I2X15I2R42I17R985'
];

const logger = fs.createWriteStream('log.txt', {flags: 'a'}), log = l => logger.write(`${l}\n`);
const hasAccess = (username, clearanceLevel) => { // 1 => full auth only, 2 => admins and above, 3 => vips and above, 4 => any
  const isAdmin = Storage.admins.includes(username), isVIP = Storage.vips.includes(username);
  return (clearanceLevel === 4 || Storage.owners.includes(username)) || (clearanceLevel === 3 && (isVIP || isAdmin)) || (clearanceLevel === 2 && isAdmin);
}
const auth = async(username, token) => {
  const response = await fetch('http://'+settings.authserver+`/verify?username=${username}&token=${token}`);
  const text = await response.text();
  console.log(text);
  return text === 'true';
}, clean = msg => msg.split(' ').reduce((a, word) => a.concat([Storage.filter.some(badword => word.toLowerCase().includes(badword)) ? '@!#$%' : word]), []).join(' ');
const deathMessages = [`{victim} was killed by {killer}`, `{victim} was put out of their misery by {killer}`, `{victim} was assassinated by {killer}`, `{victim} was comboed by {killer}`, `{victim} was eliminated by {killer}`, `{victim} was crushed by {killer}`, `{victim} was sniped by {killer}`, `{victim} was exploded by {killer}`, `{victim} was executed by {killer}`, `{victim} was deleted by {killer}`, `{victim} proved no match for {killer}`, `{victim} was outplayed by {killer}`, `{victim} was obliterated by {killer}`, `{victim} fell prey to {killer}`, `{victim} became another number in {killer}'s kill streak`, `{victim} got wrecked by {killer}`];
const joinMessages = [`{player} joined the game`, `{player} is now online`, `{player} has joined the battle`];
const rageMessages = [`{player} left the game`, `{player} quit`, `{player} disconnected`, `{player} lost connection`];


let tickspeed, old = Date.now(), getTickspeed = () => {
  tickspeed = Date.now()-old;
  old = Date.now()
  setTimeout(() => getTickspeed());
}
getTickspeed(Date.now());


class Multiplayer extends Engine {
  constructor(l) {
    super(l);
    this.zone = ['battlegrounds', 'cave', 'ice', 'deep', 'gem'][Math.floor(Math.random()*5)];
    Object.defineProperty(this, 'global', {get: () => this.rawglobal, set: v => {
      this.rawglobal = v;
      for (const t of this.pt) {
        t.msg.global = v;
        this.send(t);
      }
    }, configurable: true});
  }
  override(t, ox, oy) {
    this.updateEntity(t, Tank.u);
    this.loadCells(t, t.x, t.y, 80, 80);
    if (t.socket && (Math.floor((ox+40)/100) !== Math.floor((t.x+40)/100) || Math.floor((oy+40)/100) !== Math.floor((t.y+40)/100))) this.chunkload(t, ox, oy, t.x, t.y);
    t.socket.send({event: 'override', data: [{key: 'x', value: t.x}, {key: 'y', value: t.y}]});
  }
  chunkload(t, ox, oy, x, y) {
    const w = 21, h = 15;
    const ocx = Math.floor((ox+40)/100)+.5, ocy = Math.floor((oy+40)/100)+.5, ncx = Math.floor((x+40)/100)+.5, ncy = Math.floor((y+40)/100)+.5;
    const xd = ocx-ncx, yd = ocy-ncy, yda = yd < 0 ? -1 : 1, xda = xd < 0 ? -1 : 1, yl = Math.min(h, Math.abs(yd))*yda;
    const ymin = ncy-h/2, ymax = ncy+h/2-1, xmin = ncx-w/2, xmax = ncx+w/2-1;
    for (let nys = (yda > 0 ? 0 : -1)+ncy-h/2*yda, y = m(nys), l = false; (yda > 0 ? (y < m2(nys+h*yda)) : (y > m2(nys+h*yda))); y += yda) {
      if (yda < 0 ? y <= nys+yl : y >= nys+yl) l = true;
      for (let nxs = (xda > 0 ? 0 : -1)+ncx-w/2*xda, x = m(nxs); (xda > 0 ? (x < m2(nxs+(l ? Math.min(w, Math.abs(xd)) : w)*xda)) : (x > m2(nxs+(l ? Math.min(w, Math.abs(xd)) : w)*xda))); x += xda) {
        for (const e of this.cells[x][y]) this.load(t, e);
      }
    }
    for (let oys = (yda > 0 ? -1 : 0)+ocy+h/2*yda, y = m(oys), l = false; (yda < 0 ? (y < m2(oys-h*yda)) : (y > m2(oys-h*yda))); y -= yda) {
      if (yda > 0 ? y <= oys-yl : y >= oys-yl) l = true;
      for (let oxs = (xda > 0 ? -1 : 0)+ocx+w/2*xda, x = m(oxs); (xda < 0 ? (x < m2(oxs-(l ? Math.min(w, Math.abs(xd)) : w)*xda)) : (x > m2(oxs-(l ? Math.min(w, Math.abs(xd)) : w)*xda))); x -= xda) {
        entity: for (const e of this.cells[x][y]) {
          for (const cell of e.cells) {
            const c = cell.split('x');
            if (xmin <= c[0] && c[0] <= xmax && ymin <= c[1] && c[1] <= ymax) continue entity;
          }
          this.unload(t, e);
        }
      }
    }
    this.send(t);
  }

  add(socket, data) {
    data.socket = socket; // this can moved to the join handler?
    let join = this.joinMsg(data.username);
    toDiscord(join);
    this.logs.push({m: join, c: '#66FF00'});
    super.add(data);
  }

  send(t) {
    if (t.busy) return t.delayed = true;
    if (t.lastSend && t.lastSend+1000/settings.upsl > Date.now()) {
      clearTimeout(t.sendTimer);
      t.sendTimer = setTimeout(() => this.send(t), (t.lastSend+1000/settings.upsl)-Date.now());
    }
    t.msg.logs = this.logs.slice(t.logs).concat(t.privateLogs);
    t.msg.tickspeed = tickspeed;
    t.logs = this.logs.length;
    t.privateLogs.length = 0;
    if (t.msg.logs.length || t.msg.u.length || t.msg.d.length || t.msg.global) {
      t.busy = true;
      t.delayed = false;
      t.socket._send(pack(t.msg), {}, () => {
        t.busy = false;
        if (t.delayed) this.send(t);
      });
      t.lastSend = Date.now();
      t.msg.u.length = t.msg.d.length = 0;
      t.msg.global = t.msg.logs = undefined;
    }
  }
  loadCells(e, ex, ey, w, h) { // optimize
    const old = e.cells ? A.template('arr').concat(...e.cells) : null;
    super.loadCells(e, ex, ey, w, h);
    for (const t of this.pt) {
      const mx = Math.floor((t.x+40)/100)-10, my = Math.floor((t.y+40)/100)-7, w = 21, h = 15;
      let o = false, n = false;
      if (old) for (const cell of old) {
        const a = cell.split('x');
        if (mx <= a[0] && a[0] < mx+w && my <= a[1] && a[1] < my+h) o = true;
      }
      for (const cell of e.cells) {
        const a = cell.split('x');
        if (mx <= a[0] && a[0] < mx+w && my <= a[1] && a[1] < my+h) n = true;
      }
      if (n && !o) this.load(t, e); else if (o && !n) this.unload(t, e); else continue;
      this.send(t);
    }
  }
  updateEntity(e, c) {
    for (const t of this.pt) {
      const mx = Math.floor((t.x+40)/100)-10, my = Math.floor((t.y+40)/100)-7, w = 21, h = 15;
      for (const cell of e.cells) {
        const a = cell.split('x');
        if (mx <= a[0] && a[0] < mx+w && my <= a[1] && a[1] < my+h) {
          this.merge(t, e, c);
          this.send(t);
        }
      }
    }
  }
  static num = n => typeof n !== 'number' ? n : Math.round(n*10)/10;
  load(t, e) {
    let i = t.msg.u.findIndex(u => u[0] === e.id);
    if (i !== -1) t.msg.u.splice(i, 1);
    t.msg.d.r(e.id);
    t.msg.u.push(e.constructor[e.type === 'barrier' || e.type === 'void' ? 'raw2' : 'raw'].reduce((a, c) => a.concat(c, Multiplayer.num(e[c])), A.template('arr').concat(e.id)));
  }
  unload(t, e) {
    let i = t.msg.u.findIndex(u => u[0] === e.id);
    if (i !== -1) t.msg.u.splice(i, 1);
    t.msg.d.push(e.id);
  }
  merge(t, e, c) {
    let i = t.msg.u.findIndex(u => u[0] === e.id);
    if (i !== -1) {
      c = A.template('arr').concat(c);
      for (let l = 1; l < t.msg.u[i].length; l += 2) {
        let m = c.indexOf(t.msg.u[i][l]);
        if (m !== -1) {
          t.msg.u[i][l+1] = Multiplayer.num(e[t.msg.u[i][l]]);
          c.splice(m, 1);
        }
      }
      for (const p of c) t.msg.u[i].push(p, Multiplayer.num(e[p]));
    } else t.msg.u.push(c.reduce((a, p) => a.concat(p, e[p]), A.template('arr').concat(e.id)));
  }
  destroyEntity(e) {
    pt: for (const t of this.pt) {
      const mx = Math.floor((t.x+40)/100)-10, my = Math.floor((t.y+40)/100)-7, w = 21, h = 15;
      for (const cell of e.cells) {
        const c = cell.split('x');
        if (mx <= c[0] && c[0] < mx+w && my <= c[1] && c[1] < my+h) {
          t.msg.d.push(e.id);
          this.send(t);
          continue pt;
        }
      }
    }
  }
  disconnect(socket, code, reason) {
    let team, isLeader;
    this.pt = this.pt.filter(t => {
      if (t.username === socket.username) {
        team = Engine.getTeam(t.team);
        isLeader = t.team.includes('@leader');
        for (const cell of t.cells) {
          const [x, y] = cell.split('x');
          this.cells[x][y].delete(t);
        }
        if (t.grapple) t.grapple.bullet.destroy();
        this.destroyEntity(t);
        t.release();
        return false;
      }
      return true;
    });
    for (let i = this.ai.length-1; i >= 0; i--) if (Engine.getUsername(this.ai[i].team) === socket.username) this.ai[i].destroy();
    let leave = this.rageMsg(socket.username);
    toDiscord(leave);
    this.logs.push({m: leave, c: '#E10600'});
    if (this.pt.length === 0) {
      this.i.forEach(i => clearInterval(i));
      delete servers[socket.room];
    } else if (isLeader) for (const t of this.pt) if (Engine.getTeam(t.team) === team) return t.team += '@leader';
  }

  deathMsg(victim, killer) {
    log(`${killer} killed ${victim}`); // temp log file death
    return deathMessages[Math.floor(Math.random()*deathMessages.length)].replace('{victim}', victim).replace('{killer}', killer);
  }

  joinMsg(player) {
    return joinMessages[Math.floor(Math.random()*joinMessages.length)].replace('{player}', player);
  }

  rageMsg(player) {
    return rageMessages[Math.floor(Math.random()*rageMessages.length)].replace('{player}', player);
  }
}

class FFA extends Multiplayer {
  constructor() {
    super(ffaLevels);
  }
  ontick() {}
}

class DUELS extends Multiplayer {
  constructor() {
    super(duelsLevels);
    this.round = 1;
    this.mode = 0; // 0 -> waiting for other player, 1 -> 10 second ready timer, 2-> match active
    this.wins = {};
  }

  add(socket, data) {
    super.add(socket, data);
    if (this.pt.length === 1) {
      this.global = 'Waiting For Player...';
    } else {
      this.readytime = Date.now();
      this.mode++;
    }
  }

  ontick() {
    if ([0, 1].includes(this.mode)) {
      let ox = this.pt[0].x, oy = this.pt[0].y;
      this.pt[0].x = this.spawns[0].x;
      this.pt[0].y = this.spawns[0].y;
      this.override(this.pt[0], ox, oy);
    }
    if (this.mode === 1) {
      let ox = this.pt[1].x, oy = this.pt[1].y;
      this.pt[1].x = this.spawns[1].x;
      this.pt[1].y = this.spawns[1].y;
      this.override(this.pt[1], ox, oy);
      this.global = 'Round '+this.round+' in '+(5-Math.floor((Date.now()-this.readytime)/1000));
      if (5-(Date.now()-this.readytime)/1000 <= 0) {
        for (let i = this.s.length-1; i >= 0; i--) if (this.s[i].type !== 'grapple') this.s[i].destroy();
        for (let i = this.ai.length-1; i >= 0; i--) this.ai[i].destroy();
        this.global = '======FIGHT======';
        this.mode = 2;
      }
    }
  }

  ondeath(t, m={}) {
    super.ondeath(t, m);
    this.wins[m.username] = this.wins[m.username] === undefined ? 1 : this.wins[m.username]+1;
    if (this.wins[m.username] === 3) {
      this.global = m.username+' Wins!';
      setTimeout(() => {
        t.socket.send({event: 'gameover', type: 'defeat'});
        m.socket.send({event: 'gameover', type: 'victory'});
        t.socket.close();
        m.socket.close();
      }, 5000);
    } else {
      this.global = m.username+' Wins Round '+this.round;
      setTimeout(() => {
        this.pt.forEach(tank => {
          clearInterval(tank.fireInterval);
          clearTimeout(tank.fireTimeout);
          tank.hp = tank.maxHp;
          tank.shields = 0;
          tank.ded = false;
          tank.socket.send({event: 'ded'});
        });
        for (let i = this.s.length-1; i >= 0; i--) this.s[i].destroy();
        for (let i = this.ai.length-1; i >= 0; i--) this.ai[i].destroy();
        this.d = [];
        this.levelReader(duelsLevels[0]);
        this.round++;
        this.mode = 1; 
        this.readytime = Date.now();
      }, 5000);
    }
  }

  disconnect(socket, code, reason) {
    if ([1, 2].includes(this.mode)) {
      this.round = 1;
      this.mode = 0;
      this.wins = {};
    }
    this.pt.forEach(t => {
      t.socket.send({event: 'ded'}); // heal and reset cooldowns
      t.hp = t.maxHp;
    }); 
    super.disconnect(socket, code, reason);
  }
}

class TDM extends Multiplayer {
  constructor() {
    super(['SX3599'])
    this.global = '===Waiting For Players===';
    this.round = 1;
    this.mode = 0; // 0 -> Lobby/Waiting for players, 1 -> About to enter round, 2 -> in game
    this.wins = {RED: 0, BLUE: 0};
  }

  add(socket, data) {
    super.add(socket, data);
    const t = this.pt[this.pt.length-1];
    let red = 0, blue = 0;
    this.pt.forEach(tank => {
      if (tank.color === '#FF0000') red++; else blue++;
    });
    if (red > blue) t.color = '#0000FF';
    if (red < blue) t.color = '#FF0000';
    if (red === blue) t.color = (Math.random() < .5 ? '#FF0000' : '#0000FF');
    t.team = t.username+':LOBBY';
    if (this.pt.length === 4) {
      this.readytime = Date.now();
      this.time = 60; // 1 minute starting time
    }
  }

  ontick() {
    if (this.mode === 0) {
      if ((this.time-(Date.now()-this.readytime)/1000) <= 0) {
        this.mode = 1; // game start
        for (let i = this.s.length-1; i >= 0; i--) this.s[i].destroy();
        for (let i = this.ai.length-1; i >= 0; i--) this.ai[i].destroy();
        this.readytime = Date.now();
        this.time = 5;
        this.pt.forEach(t => {
          clearInterval(t.fireInterval);
          clearTimeout(t.fireTimeout);
          t.shields = 0;
          t.team = t.username+':'+(t.color === '#FF0000' ? 'RED' : 'BLUE');
          t.socket.send({event: 'ded'});
        });
        this.levelReader(tdmLevels[Math.floor(Math.random()*tdmLevels.length)]);
      } else if (this.pt.length >= 4) this.global = this.time-Math.floor((Date.now()-this.readytime)/1000);
    } else if (this.mode === 1) {
      this.pt.forEach(t => {
        const spawn = Engine.getTeam(t.team) === 'BLUE' ? 0 : 1;
        let ox = t.x, oy = t.y;
        t.x = this.spawns[spawn].x;
        t.y = this.spawns[spawn].y;
        this.override(t, ox, oy);
      });
      this.global = 'Round '+this.round+' in '+(this.time-Math.floor((Date.now()-this.readytime)/1000));
      if ((this.time-(Date.now()-this.readytime)/1000) <= 0) {
        this.global = '======(RED)'+this.wins.RED+' v.s '+this.wins.BLUE+'(BLUE)======';
        this.mode = 2;
        this.pt.forEach(t => t.socket.send({event: 'ded'}));
      }
    }
  }

  ondeath(t, m={}) {
    super.ondeath(t, m);
    let allies = 0;
    this.pt.forEach(tank => {
      if (!tank.ded) {
        if (Engine.getTeam(tank.team) === Engine.getTeam(t.team)) {
          allies++;
        }
      }
    });
    if (allies === 0) {
      const winner = Engine.getTeam(t.team) === 'BLUE' ? 'RED' : 'BLUE';
      this.wins[winner]++;
      if (this.wins[winner] === 3) {
        this.global = winner+' Wins!';
        setTimeout(() => {
          this.pt.forEach(t => {
            t.socket.send({event: 'gameover', type: winner === Engine.getTeam(t.team) ? 'victory' : 'defeat'});
            t.socket.close();
          });
        }, 5000);
      } else {
        this.global = winner+' Wins Round '+this.round;
        setTimeout(() => {
          this.pt.forEach(tank => {
            clearInterval(tank.fireInterval);
            clearTimeout(tank.fireTimeout);
            tank.hp = tank.maxHp;
            tank.shields = 0;
            tank.ded = false;
          });
          for (let i = this.s.length-1; i >= 0; i--) this.s[i].destroy();
          for (let i = this.ai.length-1; i >= 0; i--) this.ai[i].destroy();
          this.d = [];
          this.levelReader(tdmLevels[Math.floor(Math.random()*tdmLevels.length)]);
          this.round++;
          this.mode = 1; 
          this.readytime = Date.now();
        }, 5000);
      }   
    }
  }

  disconnect(socket, code, reason) {
    const v = this.pt.find(t => t.username === socket.username);
    const m = this.pt.find(t => Engine.getTeam(t.team) !== Engine.getTeam(v.team));
    this.ondeath(v, m);
    super.disconnect(socket, code, reason);
  }
}

class Defense extends Multiplayer {
  constructor() {
   super([[["B0","B0","B0","B0","B0","B0","B3","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0"],["B0","B6","B0","B0","B3","B0","B3","B0","B3","B0","B0","B0","B0","B4","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B0","B6","B0"],["B0","B0","B0","B0","B3","B0","B0","B0","B3","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B3","B3","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B6","B0","B0","B3","B3","B3","B3","B3","B3","B4","B4","B0","B5","B5","B5","B5","B5","B5","B0","B7","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B3","B1","B1","B1","B1","B1","B1","B1","B3","B0","B5","B5","B5","B5","B5","B5","B0","B4","B0"],["B3","B3","B0","B5","B5","B5","B0","B0","B4","B0","B0","B3","B1","B1","B1","B1","B1","B1","B1","B3","B0","B7","B0","B0","B5","B5","B5","B0","B4","B0"],["B0","B0","B0","B5","B5","B5","B0","B0","B4","B0","B0","B1","B1","B1","B1","B1","B1","B1","B1","B3","B0","B4","B0","B0","B5","B5","B5","B0","B4","B0"],["B0","B3","B3","B5","B5","B5","B7","B4","B4","B0","B0","B0","B3","B3","B3","B3","B3","B3","B3","B0","B0","B4","B4","B4","B5","B5","B5","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B0","B0","B0","B0","B6","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B1","B4","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B1","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B4","B3","B3","B3","B3","B3","B0","B4","B1","B0","B2","B2","B2","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B4","B0","B0","B2","B2","B0","B0","B1","B4","B0","B1","S","B0","B1","B0","B4","B1","B0","B0","B6","B0","B0","B0","B4","B0","B0","B0"],["B0","B0","B0","B4","B0","B0","B0","B6","B0","B0","B1","B4","B0","B1","B0","B0","B1","B0","B4","B1","B0","B0","B2","B2","B0","B0","B4","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B2","B2","B2","B0","B1","B4","B0","B3","B3","B3","B3","B3","B4","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B1","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B1","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B6","B0","B0","B0","B0","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B5","B5","B5","B4","B4","B4","B0","B0","B0","B3","B3","B3","B3","B3","B3","B0","B0","B0","B4","B4","B7","B5","B5","B5","B3","B3","B0"],["B0","B4","B0","B5","B5","B5","B0","B0","B4","B0","B0","B3","B1","B1","B1","B1","B1","B1","B1","B0","B0","B4","B0","B0","B5","B5","B5","B0","B0","B0"],["B0","B4","B0","B5","B5","B5","B0","B0","B7","B0","B0","B3","B1","B1","B1","B1","B1","B1","B3","B0","B0","B4","B0","B0","B5","B5","B5","B0","B3","B3"],["B0","B4","B0","B5","B5","B5","B5","B5","B5","B0","B0","B3","B1","B1","B1","B1","B1","B1","B3","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B7","B0","B5","B5","B5","B5","B5","B5","B0","B0","B4","B4","B3","B3","B3","B3","B3","B0","B0","B6","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B3","B3","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B3","B0","B0","B0","B3","B0","B0","B0","B0"],["B0","B6","B0","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B4","B0","B0","B0","B0","B3","B0","B3","B0","B3","B0","B0","B6","B0"],["B0","B0","B0","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B3","B0","B0","B0","B0","B0","B0"]]]);
    this.global = 'Waiting for Players...';
    this.wave = 1;
    this.mode = 0; // 0 -> Lobby/Waiting for players, 1 -> Interwave period, 2 -> in game
    this.readytime = Date.now();
    this.time = 10;
  }

  add(socket, data) {
    super.add(socket, data);
    const t = this.pt[this.pt.length-1];
    t.team = data.username+(this.mode === 0 ? ':LOBBY' : ':PLAYERS');
  }

  startNewWave() {
    for (const t of this.pt) {
      clearInterval(t.fireInterval);
      clearTimeout(t.fireTimeout);
      t.ded = false;
      t.hp = t.maxHp;
      t.shields = 0;
      t.socket.send({event: 'ded'});
    }
    let wavePoints = this.wave*50, spawnable = [];
    // spawn generation will be based off of this.cells
    for (const x in this.cells) {
      for (const y in this.cells[x]) {
        let canSpawn = true;
        for (const entity of this.cells[x][y]) if (entity instanceof Block) canSpawn = false;
        if (canSpawn) spawnable.push({x, y});
      }
    }
    const amount = Math.floor(Math.random()*wavePoints/10);
    for (let i = 0; i < amount; i++) {
      const spawn = spawnable[Math.floor(Math.random()*spawnable.length)];
      wavePoints -= 10;
      const rank = Math.max(0, Math.min(20, Math.floor(Math.random()*wavePoints/2)));
      wavePoints -= rank*2;
      A.template('AI').init(spawn.x+10, spawn.y+10, 1, rank, 'AI', this);
    }
    this.updateStatus();
  }

  ontick() {
    if (this.mode === 0) {
      if ((this.time-(Date.now()-this.readytime)/1000) <= 0) {
        this.mode++;
        for (const t of this.pt) t.team = t.team.split(':')[0]+':PLAYERS';
        for (let i = this.ai.length-1; i >= 0; i--) this.ai[i].destroy();
        this.levelReader([["B0","B0","B0","B0","B0","B0","B3","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0"],["B0","B6","B0","B0","B3","B0","B3","B0","B3","B0","B0","B0","B0","B4","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B0","B6","B0"],["B0","B0","B0","B0","B3","B0","B0","B0","B3","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B3","B3","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B6","B0","B0","B3","B3","B3","B3","B3","B3","B4","B4","B0","B5","B5","B5","B5","B5","B5","B0","B7","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B3","B1","B1","B1","B1","B1","B1","B1","B3","B0","B5","B5","B5","B5","B5","B5","B0","B4","B0"],["B3","B3","B0","B5","B5","B5","B0","B0","B4","B0","B0","B3","B1","B1","B1","B1","B1","B1","B1","B3","B0","B7","B0","B0","B5","B5","B5","B0","B4","B0"],["B0","B0","B0","B5","B5","B5","B0","B0","B4","B0","B0","B1","B1","B1","B1","B1","B1","B1","B1","B3","B0","B4","B0","B0","B5","B5","B5","B0","B4","B0"],["B0","B3","B3","B5","B5","B5","B7","B4","B4","B0","B0","B0","B3","B3","B3","B3","B3","B3","B3","B0","B0","B4","B4","B4","B5","B5","B5","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B0","B0","B0","B0","B6","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B1","B4","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B1","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B4","B3","B3","B3","B3","B3","B0","B4","B1","B0","B2","B2","B2","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B4","B0","B0","B2","B2","B0","B0","B1","B4","B0","B1","S","B0","B1","B0","B4","B1","B0","B0","B6","B0","B0","B0","B4","B0","B0","B0"],["B0","B0","B0","B4","B0","B0","B0","B6","B0","B0","B1","B4","B0","B1","B0","B0","B1","B0","B4","B1","B0","B0","B2","B2","B0","B0","B4","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B2","B2","B2","B0","B1","B4","B0","B3","B3","B3","B3","B3","B4","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B1","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B1","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B6","B0","B0","B0","B0","B1","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B5","B5","B5","B4","B4","B4","B0","B0","B0","B3","B3","B3","B3","B3","B3","B0","B0","B0","B4","B4","B7","B5","B5","B5","B3","B3","B0"],["B0","B4","B0","B5","B5","B5","B0","B0","B4","B0","B0","B3","B1","B1","B1","B1","B1","B1","B1","B0","B0","B4","B0","B0","B5","B5","B5","B0","B0","B0"],["B0","B4","B0","B5","B5","B5","B0","B0","B7","B0","B0","B3","B1","B1","B1","B1","B1","B1","B3","B0","B0","B4","B0","B0","B5","B5","B5","B0","B3","B3"],["B0","B4","B0","B5","B5","B5","B5","B5","B5","B0","B0","B3","B1","B1","B1","B1","B1","B1","B3","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B7","B0","B5","B5","B5","B5","B5","B5","B0","B0","B4","B4","B3","B3","B3","B3","B3","B0","B0","B6","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B3","B3","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B3","B0","B0","B0","B3","B0","B0","B0","B0"],["B0","B6","B0","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B4","B0","B0","B0","B0","B3","B0","B3","B0","B3","B0","B0","B6","B0"],["B0","B0","B0","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B3","B0","B0","B0","B0","B0","B0"]]);
        this.i.push(setTimeout(() => {
          this.mode++;
          this.startNewWave();
        }, 10000));
      }
      this.global = 'Starting in '+(this.time-Math.floor((Date.now()-this.readytime)/1000));
    } else if (this.mode === 1) {
      this.global = '===Prepare for next wave===';
    }
  }

  useAbility(t, a) {
    super.useAbility(t, a);
    if (this.mode === 2) this.updateStatus();
  }

  updateStatus() {
    let enemies = 0;
    for (const ai of this.ai) if (Engine.getTeam(ai.team) === 'AI') enemies++;
    this.global = '===Wave #'+this.wave+' ('+enemies+' Enemies Left)===';
    if (enemies > 0) return;
    this.mode = 1;
    this.i.push(setTimeout(() => {
      this.mode++;
      this.wave++;
      this.startNewWave();
    }, 10000));
  }
  
  ondeath(t, m) {
    super.ondeath(t, m);
    if (t.socket) {
      let playerAlive = false;
      for (const t of this.pt) if (!t.ded) playerAlive = true;
      if (!playerAlive) {
        this.logs.push({m: 'You lost so crashing :) bc no rewards bc breadley is lazzzyyyyy', c: '#FFFFFF'});
        for (const t of this.pt) t.socket.close();
      }
    }
  }
}
const joinKey = {'ffa': FFA, 'duels': DUELS, 'tdm': TDM, 'defense': Defense};
const Commands = {
  admin: [Object, 1, 2, data => {
    if (!Storage.admins.includes(data[1])) Storage.admins.push(data[1]);
  }],
  vip: [Object, 2, 2, data => {
    if (!Storage.vips.includes(data[1])) Storage.vips.push(data[1]);
  }],
  removeadmin: [Object, 1, 2, data => {
    if (Storage.admins.includes(data[1])) Storage.admins.splice(Storage.admins.indexOf(data[1]), 1);
  }],
  removevip: [Object, 2, 2, data => {
    if (Storage.vips.includes(data[1])) Storage.vips.splice(Storage.vips.indexOf(data[1]), 1);
  }],
  reload: [Object, 2, 2, data => {
    for (const s of Object.values(servers)) for (const t of s.pt) if (t.username === data[1]) t.socket.send({event: 'force'});
  }],
  playerlist: [Object, 4, 1, (data, socket, server, t, logs) => {
    for (const tank of server.pt) logs.push({m: tank.username, c: '#ffffff'});
  }],
  requestunmute: [Object, 4, 1, (data, socket, server) => {
    if (!Storage.mutes.includes(socket.username)) return socket.send({status: 'error', message: `You aren't muted!`});
    if (socket.muteTimer && socket.muteTimer+100000 > Date.now()) return socket.send({status: 'error', message: `Wait 10 seconds before using this again!`});
    socket.muteTimer = Date.now();
    for (const s of Object.values(servers)) for (const t of s.pt) if (Storage.admins.includes(t.username) || Storage.owners.includes(t.username)) t.privateLogs.push({m: this.username+' requested to be unmuted!', c: '#ffff00'});
  }],
  msg: [Object, 4, -1, (data, socket, server, t, logs) => {
    if (Storage.mutes.includes(t.username)) return socket.send({status: 'error', message: 'You are muted!'});
    let m;
    for (const s of Object.values(servers)) for (const pt of s.pt) if (pt.username === data[1]) m = pt;
    const message = {m: `[${t.username}->${data[1]}] ${clean(data.slice(2).join(' '))}`, c: '#FFFFFF'};
    if (t) {
      logs.push(message);
      server.send(t);
    }
    if (m) {
      m.privateLogs.push(message);
      server.send(m);
    }
  }],
  createteam: [FFA, 4, 2, (data, socket, server, t) => {
    if (Storage.mutes.includes(t.username)) return socket.send({status: 'error', message: `You can't make teams when you're muted!`});
    if (clean(data[1]) !== data[1]) return socket.send({status: 'error', message: 'Team name contains profanity'});
    if (server.pt.find(t => Engine.getTeam(t.team) === data[1])) return socket.send({status: 'error', message: 'This team already exists.'});
    if (data[1].includes('@leader') || data[1].includes('@requestor#') || data[1].includes(':') || data[1].length > 20) return socket.send({status: 'error', message: 'Team name not allowed.'});
    t.team = t.username+':'+data[1]+'@leader';
    for (const ai of server.ai) if (Engine.getUsername(ai.team) === t.username) ai.team = t.username+':'+data[1];
  }],
  join: [FFA, 4, 2, (data, socket, server, t, logs) => {
    if (t.team.includes('@leader')) return socket.send({status: 'error', message: 'You must disband your team to join. (/leave)'});
    if (!server.pt.find(t => Engine.getTeam(t.team) === data[1] && t.team.includes('@leader'))) return socket.send({status: 'error', message: 'This team does not exist.'});
    t.team += '@requestor#'+data[1];
    server.logs.push({m: t.username+' requested to join team '+data[1]+'. The team owner can use /accept '+t.username+' to accept them.', c: '#0000FF'});
  }],
  accept: [FFA, 4, 2, (data, socket, server, t, logs) => {
    const leader = t, requestor = server.pt.find(t => t.username === data[1]);
    if (!requestor) return socket.send({status: 'error', message: 'Player not found.'});
    if (leader.team.includes('@leader') && requestor.team.includes('@requestor#') && Engine.getTeam(leader.team) === requestor.team.split('@requestor#')[1]) {
      requestor.team = data[1]+':'+Engine.getTeam(leader.team);
      for (const ai of server.ai) if (Engine.getUsername(ai.team) === requestor.username) ai.team = requestor.username+':'+Engine.getTeam(requestor.team);
      server.logs.push({m: data[1]+' has joined team '+Engine.getTeam(leader.team), c: '#40C4FF'});
    }
  }],
  leave: [FFA, 4, 1, (data, socket, server, t) => {
    const target = t, team = Engine.getTeam(target.team);
    for (const tank of server.pt) {
      if (Engine.match(t, tank) && (t.team.includes('@leader') || tank.username === t.username)) {
        tank.team = tank.username+':'+Math.random();
        for (const ai of server.ai) if (Engine.getUsername(ai.team) === tank.username) ai.team = tank.username+':'+Engine.getTeam(tank.team);
      }
    }
  }],
  filter: [Object, 3, 2, data => {
    if (!Storage.filter.includes(data[1].toLowerCase())) Storage.filter.push(data[1].toLowerCase());
  }],
  allow: [Object, 2, 2, data => {
    if (Storage.filter.includes(data[1].toLowerCase())) Storage.filter.splice(Storage.filter.indexOf(data[1].toLowerCase()), 1);
  }],
  t: [Object, 4, -1, (data, socket, server, t) => {
    if (Storage.mutes.includes(t.username)) return socket.send({status: 'error', message: 'You are muted!'});
    for (const tank of server.pt) if (Engine.match(t, tank)) tank.privateLogs.push({m: '[TEAM]['+t.username+'] '+clean(data.slice(1).join(' ')), c: '#FFFFFF'});
  }],
  gpt: [Object, 4, -1, () => {}],
  gptclear: [Object, 4, -1, () => {}],
  wgpt: [Object, 4, -1, () => {}],
  dalle2pro: [Object, 2, -1, () => {}],
  run: [Object, 1, -1, (data, socket, server, t, logs) => {
    exec(data.slice(1).join(' '), (e, o, er) => {
      if (e) if (e.length) logs.push({m: e, c: '#ff0000'});
      if (er.length) logs.push({m: er, c: '#ff0000'});
      if (o.length) logs.push({m: o, c: '#ffffff'});
    });
  }],
  newmap: [FFA, 3, -1, (data, socket, server) => {
    let levelID = data[1] ? Number(data[1]) : Math.floor(Math.random()*ffaLevels.length);
    if (isNaN(levelID) || levelID % 1 !== 0 || levelID >= ffaLevels.length) return socket.send({status: 'error', message: 'Out of range or invalid input.'});
    server.levelReader(ffaLevels[levelID]);
    for (const t of server.pt) {
      let ox = t.x, oy = t.y;
      t.x = server.spawn.x;
      t.y = server.spawn.y;
      server.override(t, ox, oy);
    }
    for (let i = server.ai.length-1; i >= 0; i--) {
      server.ai[i].x = server.spawn.x;
      server.ai[i].y = server.spawn.y;
    }
  }],
  loadmap: [FFA, 2, 2, (data, socket, server) => {
    //if (isNaN(levelID) || levelID % 1 !== 0 || levelID >= ffaLevels.length) return socket.send({status: 'error', message: 'Out of range or invalid input.'});
    server.levelReader(data[1]);
    for (const t of server.pt) {
      let ox = t.x, oy = t.y;
      t.x = server.spawn.x;
      t.y = server.spawn.y;
      server.override(t, ox, oy);
    }
    for (let i = server.ai.length-1; i >= 0; i--) {
      server.ai[i].x = server.spawn.x;
      server.ai[i].y = server.spawn.y;
    }
  }],
  ban: [Object, 2, -1, (data, socket, server, t) => {
    if (Storage.admins.includes(data[1]) || Storage.owners.includes(data[1])) return socket.send({status: 'error', message: `You can't ban another admin!`});
    Storage.bans.push(data[1]);
    let msg = ' banned by '+t.username+' for ' + (data[2] ? 'committing the felony: '+data.slice(2).join(' ') : 'no reason ez!');
    for (const s of Object.values(servers)) {
      const victim = server.pt.find(t => t.username === data[1]);
      if (victim) {
        s.logs.push({m: data[1]+' was'+msg, c: '#FF0000'});
        victim.socket.send({status: 'error', message: 'You were'+msg});
      }
    }
    for (const socket of sockets) if (socket.username === data[1]) setTimeout(() => socket.close());
  }],
  banlist: [Object, 2, -1, (data, socket, server, t, logs) => {
    logs.push({m: '-----Ban List-----', c: '#00FF00'});
    for (const ban of Storage.bans) logs.push({m: ban, c: '#00FF00'});
  }],
  pardon: [Object, 2, 2, (data, socket, server, t) => {
    Storage.bans.splice(Storage.bans.indexOf(data[1]), 1);
    server.logs.push({m: data[1]+' was pardoned by '+t.username, c: '#0000FF'});
  }],
  mute: [Object, 3, 2, (data, socket, server, t) => {
    if (Storage.mutes.includes(data[1])) return socket.send({status: 'error', message: 'They are already muted!'});
    Storage.mutes.push(data[1]);
    for (const s of Object.values(servers)) if (s.pt.some(t => t.username === data[1])) s.logs.push({m: data[1]+' was muted by '+t.username, c: '#FFFF22'});
  }],
  unmute: [Object, 3, 2, (data, socket, server, t) => {
    Storage.mutes.splice(Storage.mutes.indexOf(data[1]), 1);
    for (const s of Object.values(servers)) if (s.pt.some(t => t.username === data[1])) s.logs.push({m: data[1]+' was unmuted by '+t.username, c: '#0000FF'});
  }],
   reboot: [Object, 2, 1, function() {
    process.exit(1);
  }],
  sread: [Object, 1, 2, function(data) {
    const value = servers[this.room][data[1]];
    if (value !== undefined) servers[this.room].logs.push({m: typeof value === Object ? JSON.stringify(value) : value, c: '#FFFFFF'});
  }],
  kick: [Object, 3, 2, (data, socket, server, t) => {
    for (const socket of sockets) if (socket.username === data[1]) {
      socket.send({status: 'error', message: 'You have been kicked by '+t.username});
      setTimeout(() => socket.close());
    }
  }],
  kill: [Object, 2, -1, (data, socket) => {
    for (const s of Object.values(servers)) {
      let t = s.pt.find(t => t.username === (data[1] || socket.username));
      if (!t) return;
      t.immune = false;
      t.shield = false;
      t.reflect = false;
      t.damageCalc(t.x, t.y, 6000, socket.username);
    }
  }],
  killai: [Object, 1, 1, (data, socket, server) => {  
    for (let i = server.ai.length-1; i >= 0; i--) server.ai[i].destroy();
  }],
  ai: [Object, 2, 7, (data, socket, server) => {
    for (let i = 0; i < Number(data[5]); i++) A.template('AI').init(Math.floor(Number(data[1]) / 100) * 100 + 10, Math.floor(Number(data[2]) / 100) * 100 + 10, Number(data[3]), Math.min(20, Math.max(0, Number(data[4]))), data[6], server);
  }],
  spectate: [Object, 3, 2, data => {
    for (const server of Object.values(servers)) for (const t of server.pt) if (t.username === data[1]) t.ded = true;
  }],
  live: [Object, 2, -1, (data, socket) => {
    for (const server of Object.values(servers)) {
      let t = server.pt.find(t => t.username === (data[1] || socket.username));
      if (!t) return;
      t.hp = t.maxHp;
      t.ded = false;
      return t.socket.send({event: 'ded'});
    }
  }],
  switch: [TDM, 3, 2, (data, socket, server) => {
    if (server.mode === 0) for (const t of server.pt) if (t.username === (data.length === 1 ? socket.username : data[1])) t.color = t.color === '#FF0000' ? '#0000FF' : '#FF0000';
  }],
  start: [TDM, 3, 1, (data, socket, server) => {
    if (server.mode === 0) {
      server.readytime = Date.now();
      server.time = 0;
    }
  }],
  flushlogs: [Object, 2, -1, () => fs.writeFileSync('log.txt', '')],
  getlogs: [Object, 2, 2, (data, socket, server, t, logs) => {
    const log = fs.readFileSync('log.txt').toString().split('\n').slice(1).reverse();
    for (let i = Math.min(log.length, Number(data[1])); i >= 0; i--) logs.push({m: log[i], c: '#A9A9A9'});
  }],
  announce: [Object, 3, -1, (data, socket, server) => {
    for (const server of Object.values(servers)) {
      server.logs.push({m: '[Announcement]['+(hasAccess(socket.username, 1) ? 'Owner' : (hasAccess(socket.username, 2)) ? 'Admin' : 'VIP')+']['+socket.username+'] '+data.slice(1).join(' '), c: '#FFF87D'});
      for (const t of server.pt) server.send(t);
    }
  }],
  lockchat: [Object, 2, -1, () => {
    settings.chat = !settings.chat;
  }],
  lockdown: [Object, 2, -1, () => {
    settings.joining = !settings.joining;
  }],
  swrite: [Object, 1, 3, (data, socket) => {
    eval(`try {
      servers['${socket.room}']['${data[1]}'] = ${data[2]};
    } catch(e) {
      servers['${socket.room}'].pt.find(t => t.username === '${socket.username}').socket.send({status: 'error', message: 'Your command gave error: '+e});
    }`);
  }],
  twrite: [Object, 1, 4, (data, socket) => {
    eval(`try {
      const server = servers['${socket.room}'], tank = server.pt.find(t => t.username === '${data[1]}');
      tank['${data[2]}'] = ${data[3]};
    } catch(e) {
      servers['${socket.room}'].pt.find(t => t.username === '${socket.username}').socket.send({status: 'error', message: 'Your command gave error: '+e});
    }`);
  }],
  help: [Object, 4, 1, (data, socket, server, t, logs) => {
    const authKey = ['n/a', 'Owner', 'Admin', 'VIP', 'Everyone'];
    for (const command of Object.keys(Commands)) logs.push({m: `/${command} - ${Commands[command][2]} parameters. [${authKey[Commands[command][1]]}]`, c: '#00FF00'});
  }],
};

const wss = new WebSocketServer({port: settings.port});
wss.on('connection', socket => {
  socket._send = socket.send;
  socket.send = data => socket._send(pack(data));
  socket.kick = e => {
    socket.send({status: 'error', message: e});
    setTimeout(() => socket.close());
  }
  sockets.add(socket);
  socket.on('message', data => {
    try {
      data = unpack(data);
    } catch(e) {
      return socket.close();
    }
    if (!socket.username) socket.username = data.username;
    if (data.type === 'update') {
      if (Storage.bans.includes(data.username)) return socket.kick('You are banned!');
      if (servers[socket.room]) servers[socket.room].update(data); else return socket.kick(`You aren't in a room!`);
    } else if (data.type === 'join') {
      if (Storage.bans.includes(data.username)) return socket.kick('You are banned!');
      if (clean(data.username) !== data.username) return socket.kick(`Your username didn't pass the profanity check.`);
      if (!hasAccess(data.username, 3) && !settings.joining) return socket.kick('Joining is disabled!');
      /* else if (!auth(socket.username, data.token)) {
        socket.send({status: 'error', message: 'Token is invalid. Login with the correct authserver.'});
        return setTimeout(() => socket.close());
      }*/
      let server;
      for (const id in servers) { // OPTIMIZE THIS
        if (servers[id] instanceof joinKey[data.gamemode]) {
          if (data.gamemode === 'ffa' && servers[id].pt.length >= settings.players_per_room) continue;
          if (data.gamemode === 'duels' && servers[id].pt.length !== 1) continue;
          if (data.gamemode === 'tdm' && servers[id].mode !== 0) continue;
          if (data.gamemode === 'defense' && servers[id].pt.length > 10) continue;
          server = id;
          break;
        }
      }
      if (!server) servers[server = Math.random()] = new joinKey[data.gamemode]();
      if (servers[server].pt.some(t => t.username === socket.username)) return socket.kick('You are already in the server!');
      socket.room = server;
      data.tank.authority = ''; // OPTIMIZE THIS
      for (const level of ['VIP', 'Admin', 'Owner']) if (Storage[level.toLowerCase()+'s'].includes(data.username)) data.tank.authority = level;
      // PREPEND SOCKET TO DATA
      servers[server].add(socket, data.tank);
    } else if (data.type === 'ping') {
      socket.send({event: 'ping', id: data.id});
    } else if (data.type === 'chat') {
      if (!servers[socket.room] || (!hasAccess(socket.username, 3) && !settings.chat)) return;
      if (Storage.mutes.includes(socket.username)) return socket.send({status: 'error', message: 'You are muted!'});
      if (data.msg.length > 3000) return socket.send({status: 'error', message: 'You have exceed 3k size limit!'});
      let role;
      for (const level of ['VIP', 'Admin', 'Owner']) if (Storage[level.toLowerCase()+'s'].includes(socket.username)) role = level;
      let m = (role ? '['+role+'] ' : '')+`${socket.username}: ${clean(data.msg)}`
      toDiscord(m);
      servers[socket.room].logs.push({m, c: '#ffffff'});
      for (const t of servers[socket.room].pt) servers[socket.room].send(t);
    } else if (data.type === 'logs') {
      if (servers[data.room]) socket.send({event: 'logs', logs: servers[data.room].logs}); // Dead?
    } else if (data.type === 'command') {
      const f = Commands[data.data[0]], server = servers[socket.room], t = server.pt.find(t => t.username === socket.username);
      if (!f) return socket.send({status: 'error', message: 'Command not found.'});
      if (!(server instanceof f[0])) return socket.send({status: 'error', message: 'This command is not available in this server type.'});
      if (data.data.length !== f[2] && f[2] !== -1) return socket.send({status: 'error', message: 'Wrong number of arguments.'});
      if (!hasAccess(socket.username, f[1])) return socket.send({status: 'error', message: `You don't have access to this.`});
      log(`${socket.username} ran command: ${data.data.join(' ')}`);
      f[3](data.data, socket, server, t, t.privateLogs);
    } else if (data.type === 'list') {
      socket.send({event: 'list', players: servers[socket.room].pt.reduce((a, c) => a.concat(c.username), [])});
    } else if (data.type === 'stats') {
      let gamemodes = {FFA: [], DUELS: [], TDM: [], Defense: [], event: 'stats'};
      for (const id in servers) {
        gamemodes[servers[id].constructor.name][id] = [];
        for (const pt of servers[id].pt) {
          gamemodes[servers[id].constructor.name][id].push(pt.username);
        }
      }
      socket.send(gamemodes);
    }
  });
  socket.on('close', (code, reason) => {
    sockets.delete(socket);
    if (servers[socket.room]) servers[socket.room].disconnect(socket, code, reason);
  });
});
console.log('Listening on port '+settings.port);

const client = new Client({intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]});
const token = fs.readFileSync('discord.json', 'utf8').replace(/\n/g, ''), channel = '1301321677220741180'; // temp, move to file
const toDiscord = m => client.channels.cache.get(channel)?.send(m);
client.on('messageCreate', m => {
  if (m.channel.id !== channel || m.author.id === '1301716399999160392') return;
  if (m.content.startsWith('/')) {
    m.delete(1000);
    // potential freeze, unfreeze, gpts, newmap, killai, ai, swrite, twrite
    const discordAcceptable = ['admin', 'removeadmin', 'vip', 'removevip', 'reload', 'playerlist', 'msg', 'filter', 'allow', 'run', 'ban', 'banlist', 'pardon', 'mute', 'unmute', 'kick', 'kill', 'spectate', 'live', 'reboot', 'flushlogs', 'getlogs', 'announce', 'lockchat', 'lockdown', ];
    const socket = {username: m.author.username, send: d => {
      toDiscord(d.message);
    }}, data = m.content.replace('/', '').split(' '), t = {username: m.author.username}, logs = {push: d => {
      toDiscord(d.m);
    }};
    if (!discordAcceptable.includes(data[0])) return toDiscord('Invalid command. Not in list: '+discordAcceptable);
    const f = Commands[data[0]];
    if (data.length !== f[2] && f[2] !== -1) return socket.send({status: 'error', message: 'Wrong number of arguments.'});
    if (!hasAccess(m.author.id, f[1])) return socket.send({status: 'error', message: `You(${m.author.id}) don't have access to this.`});
    log(`(${m.author.id})${socket.username} ran command: ${data.join(' ')}`);
    return f[3](data, socket, {}, t, logs);
  }
  for (const server of Object.values(servers)) server.logs.push({m: '[DISCORD]['+m.author.username+'] '+m.content, c: '#ffffff'});
});
client.on('ready', () => console.log(`Logged in as ${client.user.tag}!`));
client.login(token);
