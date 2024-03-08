const settings = {
  authserver: 'localhost',
  players_per_room: 10,
  ups: 50,
  port: 8080,
}

const fs = require('fs'), fetch = require('node-fetch');
const {pack} = require('msgpackr/pack');
const {unpack} = require('msgpackr/unpack');
const {WebSocketServer} = require('ws');
const {dalle, gpt} = require('gpti');

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



const logger = fs.createWriteStream('log.txt', {flags: 'a'}), log = l => logger.write(`${l}\n`);
const hasAccess = (username, clearanceLevel) => { // 1 => full auth only, 2 => admins and above, 3 => vips and above, 4 => any
  const isAdmin = Storage.admins.includes(username), isVIP = Storage.vips.includes(username);
  if (clearanceLevel === 4 || Storage.owners.includes(username)) return true;
  if (clearanceLevel === 3 && (isVIP || isAdmin)) return true;
  if (clearanceLevel === 2 && isAdmin) return true;
  return false;
}
const auth = async(username, token) => {
  const response = await fetch('http://'+settings.authserver+`/verify?username=${username}&token=${token}`);
  return await response.text() === 'true';
}, clean = msg => {
  for (const word of Storage.filter) msg = msg.replaceAll(word, '@#*%!');
  return msg;
}
const deathMessages = [
  `{victim} was killed by {killer}`,
  `{victim} was put out of their misery by {killer}`,
  `{victim} was assassinated by {killer}`,
  `{victim} was comboed by {killer}`,
  `{victim} was eliminated by {killer}`,
  `{victim} was crushed by {killer}`,
  `{victim} was sniped by {killer}`,
  `{victim} was exploded by {killer}`,
  `{victim} was executed by {killer}`,
  `{victim} was deleted by {killer}`,
  `{victim} proved no match for {killer}`,
  `{victim} was outplayed by {killer}`,
  `{victim} was obliterated by {killer}`,
  `{victim} fell prey to {killer}`,
  `{victim} was fed a healthy dose of explosives by {killer}`,
  `{victim} became another number in {killer}'s kill streak`,
  `{victim} got wrecked by {killer}`,
], joinMessages = [
  `{idot} joined the game`,
  `{idot} is now online`,
  `{idot} has joined the battle`,
  `{idot}`, //plz leave
], rageMessages = [
  `{idot} left the game`,
  `{idot} quit`,
  `{idot} disconnected`,
], tipMessages = [
  `TIP: time the reflector better next time!`,
  `TIP: Try switching class, maybe you're not good at that one!`,
  `TIP: These tips get shown when you die!`,
  `TIP: blame the lag`,
  `TIP: If fighting is sure to result in victory then you must fight! -Sun Tzu`,
  `TIP: Doing damage increases your chance of survival, while decreasing your enimies chance of survial`,
  `TIP: Taking damage reduces your chance of survival`,
  `TIP: Try dodging the bullets next time!`,
  `That was unwinnable, don't worry`,
  `TIP: git good!`,
  `TIP: don't die!`,
  `TIP: If you are in a block, press ESC and then press the LEAVE button. Works every time!`,
  `Bad internet? Hit the router with a wrench. Trust me :)`,
  `Must've been your keyboard`,
  `TIP: Try Using a mouse next time`,
  `How embarrassing...`,
];

let tickspeed = 'N/A';

class Multiplayer extends Engine {
  constructor(levels) {
    super(levels);
    this.sendkey = {'Block': 'b', 'Shot': 's', 'AI': 'ai', 'Tank': 'pt', 'Damage': 'd'};
    this.sendkeyValues = ['b', 's', 'ai', 'pt', 'd'];
    this.i.push(setInterval(() => this.cellSend(), 1000/settings.ups));
  }

  override(t) {
    t.socket.send({event: 'override', data: [{key: 'x', value: t.x}, {key: 'y', value: t.y}]});
  }

  add(socket, data) {
    data.socket = socket;
    log(`${socket.username} joined`);
    this.logs.push({m: this.joinMsg(data.username), c: '#66FF00'});
    super.add(data);
  }

  update(data) {
    super.update(data);
  }

  send() {
    for (const t of this.pt) {
      const render = {b: new Set(), pt: new Set(), ai: new Set(), s: new Set(), d: new Set(), logs: this.logs.length};
      const vx = t.x-860, vy = t.y-560, vw = 1880, vh = 1280;      
      const message = {b: [], pt: [], ai: [], s: [], d: [], logs: this.logs.slice(t?.render.logs || 0).concat(t.privateLogs), global: this.global, tickspeed, event: 'hostupdate', delete: {b: [], pt: [], ai: [], s: [], d: []}};
      t.privateLogs = [];
      let send = message.logs.length > 0;
      for (const p of ['b', 'pt', 'ai', 's', 'd']) {
        const ids = new Set(this[p].map(e => e.id));
        this[p].filter(e => Engine.collision(vx, vy, vw, vh, e.x, e.y, 100, 100)).forEach(e => {
          render[p].add(e.id);
          if (!t.render[p].has(e.id) || e.updatedLast > t.lastUpdate) {
            message[p].push(e.raw);
            send = true;
          }
        });
        t.render[p].forEach(id => {
          if (!render[p].has(id) || !ids.has(id)) {
            message.delete[p].push(id);
            send = true;
          }
        });
      }
      t.render = render;
      t.lastUpdate = Date.now();
      if (send) t.socket.send(message);
    }
  }

  cellSend() {
    for (const t of this.pt) {
      const fx = Math.floor(t.x/100), fy = Math.floor(t.y/100), sy = Math.max(fy-7, 0), ey = Math.min(fy+7, 30), sx = Math.max(fx-10, 0), ex = Math.min(fx+10, 30);
      const render = A.template('render'), message = A.template('message');
      render.logs = this.logs.length;
      message.logs = this.logs.slice(t.render?.logs || 0).concat(t.privateLogs);
      message.global = this.global;
      message.tickspeed = tickspeed;
      t.privateLogs.length = 0;
      let send = message.logs.length > 0;
      for (let cy = sy; cy < ey; cy++) {
        for (let cx = sx; cx < ex; cx++) {
          for (const entity of this.cells[cx][cy]) {
            const type = this.sendkey[entity.constructor.name];
            render[type].add(entity.id);
            if (!t.render[type].has(entity.id) || entity.updatedLast > t.lastUpdate) {
              message[type].push(entity.raw);
              send = true;
            }
          }
        }
      }
      for (const entity of this.sendkeyValues) {
        for (const id of t.render[entity]) {
          if (!render[entity].has(id)) {
            message.delete[entity].push(id);
            send = true;
          }
        }
      }
      if (t.render) t.render.release();
      t.render = render;
      t.lastUpdate = Date.now();
      if (send) t.socket.send(message);
      message.release();
    }
  }

  disconnect(socket, code, reason) {
    this.pt = this.pt.filter(t => {
      if (t.username === socket.username) {
        for (const cell of t.cells) {
          const [x, y] = cell.split('x');
          this.cells[x][y].delete(t);
        }
        if (t.grapple) t.grapple.bullet.destroy();
        return false;
      }
      return true;
    });
    for (let i = this.ai.length-1; i >= 0; i--) if (Engine.getUsername(this.ai[i].team) === socket.username) this.ai[i].destroy();
    log(`${socket.username} left`);
    this.logs.push({m: this.rageMsg(socket.username), c: '#E10600'});
    if (this.pt.length === 0) {
      this.i.forEach(i => clearInterval(i));
      delete servers[socket.room];
    }
  }

  deathMsg(victim, killer) {
    log(`${killer} killed ${victim}`); // temp log file death
    return deathMessages[Math.floor(Math.random()*deathMessages.length)].replace('{victim}', victim).replace('{killer}', killer);
  }

  tipMsg(player, killer) {
    return tipMessages[Math.floor(Math.random()*tipMessages.length)].replace('{victim}', player).replace('{killer}', killer);
  }

  joinMsg(player) {
    return joinMessages[Math.floor(Math.random()*joinMessages.length)].replace('{idot}', player);
  }

  rageMsg(player) {
    return rageMessages[Math.floor(Math.random()*rageMessages.length)].replace('{idot}', player);
  }
}

class FFA extends Multiplayer {
  constructor() {
    super(ffaLevels);
  } 

  ondeath(t, m={}) {
    this.logs.push({m: this.deathMsg(t.username, m.username), c: '#FF8C00'});
    try {
      t.privateLogs.push({m: this.tipMsg(t.username, m.username), c: '#80FFF9'});
    } catch(e) {
      const uslessCode = 'undefined';
    }
    for (let i = this.ai.length-1; i >= 0; i--) if (Engine.getUsername(this.ai[i].team) === t.username) this.ai[i].destroy();
    if (t.socket) t.ded = true;
    if (m.socket) m.socket.send({event: 'kill'});
    if (m.deathEffect) t.dedEffect = {x: t.x, y: t.y, r: t.r, id: m.deathEffect, start: Date.now(), time: 0}
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
      this.pt[0].x = this.spawns[0].x;
      this.pt[0].y = this.spawns[0].y;
      this.override(this.pt[0]);
    }
    if (this.mode === 1) {
      this.pt[1].x = this.spawns[1].x;
      this.pt[1].y = this.spawns[1].y;
      this.override(this.pt[1]);
      this.global = 'Round '+this.round+' in '+(5-Math.floor((Date.now()-this.readytime)/1000));
      if (5-(Date.now()-this.readytime)/1000 <= 0) {
        for (let i = this.s.length-1; i >= 0; i--) if (this.s[i].type !== 'grapple') this.s[i].destroy();
        for (let i = this.ai.length-1; i >= 0; i--) this.ai[i].destroy();
        this.global = '======FIGHT======';
        this.mode = 2;
      }
    }
  }

  ondeath(t, m) {
    t.ded = true;
    if (m.deathEffect) t.dedEffect = {x: t.x, y: t.y, r: t.r, id: m.deathEffect, start: Date.now(), time: 0}
    try {
      t.privateLogs.push({m: this.tipMsg(t.username, m.username), c: '#80FFF9'});
    } catch(e) {
      const uslessCode = 'undefined';
    }
    if (m.socket) m.socket.send({event: 'kill'});
    for (let i = this.ai.length-1; i >= 0; i--) if (Engine.getUsername(this.ai[i].team) === t.username) this.ai[i].destroy();
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
    super([[["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","S","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]]]);
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
      if (tank.color === '#FF0000') {
        red++;
      } else if (tank.color === '#0000FF') {
        blue++;
      }
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
        });
        this.levelReader(tdmLevels[Math.floor(Math.random()*tdmLevels.length)]);
      } else if (this.pt.length >= 4) this.global = this.time-Math.floor((Date.now()-this.readytime)/1000);
    } else if (this.mode === 1) {
      this.pt.forEach(t => {
        const spawn = Engine.getTeam(t.team) === 'BLUE' ? 0 : 1;
        t.x = this.spawns[spawn].x;
        t.y = this.spawns[spawn].y;
        this.override(t);
      });
      this.global = 'Round '+this.round+' in '+(this.time-Math.floor((Date.now()-this.readytime)/1000));
      if ((this.time-(Date.now()-this.readytime)/1000) <= 0) {
        this.global = '======(RED)'+this.wins.RED+' v.s '+this.wins.BLUE+'(BLUE)======';
        this.mode = 2;
      }
    }
  }

  ondeath(t, m) {
    t.ded = true;
    if (m.deathEffect) t.dedEffect = {
      x: t.x,
      y: t.y,
      r: t.r,
      id: m.deathEffect,
      start: Date.now(),
      time: 0,
    }
    if (m.username) this.logs.push({m: this.deathMsg(t.username, m.username), c: '#FF8C00'});
    try {
      t.privateLogs.push({m: this.tipMsg(t.username, m.username), c: '#80FFF9'});
    } catch(e) {
      const uslessCode = 'undefined';
    }
    if (m.socket) m.socket.send({event: 'kill'});
    for (let i = this.ai.length-1; i >= 0; i--) if (Engine.getUsername(this.ai[i].team) === t.username) this.ai[i].destroy();
    let allies = 0;
    this.pt.forEach(tank => {
      if (!tank.ded) {
        if (Engine.getTeam(tank.team) === Engine.getTeam(t.team)) {
          allies++;
        }
      }
    });
    if (allies === 0) {
      const winner = Engine.getTeam(m.team);
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
            t.socket.send({event: 'ded'});
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
}

class Defense extends Multiplayer {
  constructor() {
    super([[["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B4","B4","B4","B3","B4","B4","B3","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B4","B0"],["B0","B4","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B4","B0","B4","B0","B0","B0","B0","B4","B0","B0","B0","B2","B3","B3","B3","B2","B2","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B3","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B3","B0","B0","B3","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B0","B0","B0"],["B0","B4","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B3","B0","B0","B3","B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B0","B0","B0"],["B0","B4","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B2","B3","B3","B0","B3","B2","B0","B0","B0","B4","B0","B0","B0","B4","B0","B0","B0","B0"],["B0","B3","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B4","B4","B4","B4","B4","B4","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B4","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B3","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B2","B4","B4","B0","B0","B0","B0","B0","B0","B3","B0","B0","B0"],["B0","B0","B0","B3","B0","B0","B0","B0","B0","B0","B0","B2","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B1","B2","B2","B1","B0","B0"],["B0","B0","B0","B0","B3","B0","B0","B0","B0","B4","B0","B4","B0","B0","B0","B0","B0","B0","B4","B0","B4","B0","B0","B0","B1","B2","B2","B1","B0","B0"],["B0","B0","B1","B2","B2","B1","B0","B0","B0","B4","B0","B4","B0","B0","S","B0","B0","B0","B4","B0","B4","B0","B0","B0","B1","B2","B2","B1","B0","B0"],["B0","B0","B1","B2","B2","B1","B0","B0","B0","B4","B0","B4","B0","B0","B0","B0","B0","B0","B4","B0","B4","B0","B0","B0","B1","B2","B2","B1","B0","B0"],["B0","B0","B1","B2","B2","B1","B0","B0","B0","B4","B0","B4","B0","B0","B0","B0","B0","B0","B4","B0","B4","B0","B0","B0","B0","B3","B0","B0","B0","B0"],["B0","B0","B1","B2","B2","B1","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B2","B0","B0","B0","B0","B0","B0","B0","B3","B0","B0","B0"],["B0","B0","B0","B3","B0","B0","B0","B0","B0","B0","B4","B4","B2","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B3","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B4","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B4","B4","B4","B4","B4","B4","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B3","B0"],["B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B0","B0","B2","B3","B0","B3","B3","B2","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B4","B0"],["B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B0","B0","B0","B3","B0","B0","B3","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B4","B0"],["B0","B0","B0","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B3","B0","B0","B3","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B3","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B2","B2","B3","B3","B3","B2","B0","B0","B0","B4","B0","B0","B0","B0","B4","B0","B4","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B4","B0"],["B0","B4","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B3","B4","B4","B3","B4","B4","B4","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"]]]);
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
      this.ai.push(new AI(spawn.x+10, spawn.y+10, 1, rank, 'AI', this));
    }
    this.updateStatus();
  }

  ontick() {
    if (this.mode === 0) {
      if ((this.time-(Date.now()-this.readytime)/1000) <= 0) {
        this.mode++;
        for (const t of this.pt) t.team = t.team.split(':')[0]+':PLAYERS';
        for (let i = this.ai.length-1; i >= 0; i--) this.ai[i].destroy();
        this.levelReader([["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B4","B4","B4","B3","B4","B4","B3","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B4","B0"],["B0","B4","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B4","B0","B4","B0","B0","B0","B0","B4","B0","B0","B0","B2","B3","B3","B3","B2","B2","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B3","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B3","B0","B0","B3","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B0","B0","B0"],["B0","B4","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B3","B0","B0","B3","B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B0","B0","B0"],["B0","B4","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B2","B3","B3","B0","B3","B2","B0","B0","B0","B4","B0","B0","B0","B4","B0","B0","B0","B0"],["B0","B3","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B4","B4","B4","B4","B4","B4","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B4","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B3","B0","B0","B0","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B2","B4","B4","B0","B0","B0","B0","B0","B0","B3","B0","B0","B0"],["B0","B0","B0","B3","B0","B0","B0","B0","B0","B0","B0","B2","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B1","B2","B2","B1","B0","B0"],["B0","B0","B0","B0","B3","B0","B0","B0","B0","B4","B0","B4","B0","B0","B0","B0","B0","B0","B4","B0","B4","B0","B0","B0","B1","B2","B2","B1","B0","B0"],["B0","B0","B1","B2","B2","B1","B0","B0","B0","B4","B0","B4","B0","B0","S","B0","B0","B0","B4","B0","B4","B0","B0","B0","B1","B2","B2","B1","B0","B0"],["B0","B0","B1","B2","B2","B1","B0","B0","B0","B4","B0","B4","B0","B0","B0","B0","B0","B0","B4","B0","B4","B0","B0","B0","B1","B2","B2","B1","B0","B0"],["B0","B0","B1","B2","B2","B1","B0","B0","B0","B4","B0","B4","B0","B0","B0","B0","B0","B0","B4","B0","B4","B0","B0","B0","B0","B3","B0","B0","B0","B0"],["B0","B0","B1","B2","B2","B1","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B2","B0","B0","B0","B0","B0","B0","B0","B3","B0","B0","B0"],["B0","B0","B0","B3","B0","B0","B0","B0","B0","B0","B4","B4","B2","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B0","B0","B0","B3","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"],["B0","B4","B4","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B4","B4","B4","B4","B4","B4","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B3","B0"],["B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B0","B0","B2","B3","B0","B3","B3","B2","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B4","B0"],["B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B0","B0","B0","B3","B0","B0","B3","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B4","B0"],["B0","B0","B0","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B3","B0","B0","B3","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B3","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B2","B2","B3","B3","B3","B2","B0","B0","B0","B4","B0","B0","B0","B0","B4","B0","B4","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B4","B0"],["B0","B4","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B3","B4","B4","B3","B4","B4","B4","B0"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0"]]);
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
  
  ondeath(t, m={}) {
    if (t instanceof Tank) this.logs.push({m: this.deathMsg(t.username, m.username), c: '#FF8C00'});
    try {
      t.privateLogs.push({m: this.tipMsg(t.username, m.username), c: '#80FFF9'});
    } catch(e) {
      const uslessCode = 'undefined';
    }
    for (let i = this.ai.length-1; i >= 0; i--) if (Engine.getUsername(this.ai[i].team) === t.username) this.ai[i].destroy();
    this.updateStatus();
    if (t.socket) {
      t.ded = true;
      let playerAlive = false;
      for (const t of this.pt) if (!t.ded) playerAlive = true;
      if (!playerAlive) {
        this.logs.push({m: 'You lost so crashing :) bc no rewards bc breadley is lazzzyyyyy', c: '#FFFFFF'});
        for (const t of this.pt) t.socket.close();
      }
    }
    if (m.socket) m.socket.send({event: 'ded'}); // reset cooldowns without giving loot
    if (m.deathEffect) t.dedEffect = {x: t.x, y: t.y, r: t.r, id: m.deathEffect, start: Date.now(), time: 0}
  }
}

const Commands = {
  playerlist: [Object, 4, 1, function(data) {
    const t = servers[this.room].pt.find(t => t.username === this.username);
    for (const tank of servers[this.room].pt) t.privateLogs.push({m: tank.username, c: '#FFFFFF'});
  }],
  copylist: [Object, 4, 1, function(data) {
    const t = servers[this.room].pt.find(t => t.username === this.username)
    let s = '';
    for (const tank of servers[this.room].pt) s += tank.username+'   ';
    t.socket.send({status: 'error', message: s});
  }],
  msg: [Object, 4, -1, function(data) {
    if (Storage.mutes.includes(this.username)) return this.send({status: 'error', message: 'You are muted!'});
    const t = servers[this.room].pt.find(t => t.username === this.username), m = servers[this.room].pt.find(t => t.username === data[1]);
    const message = {m: `[${this.username}->${data[1]}] ${clean(data.slice(2).join(' '))}`, c: '#FFFFFF'};
    if (t) t.privateLogs.push(message);
    if (m) m.privateLogs.push(message);
  }],
  createteam: [FFA, 4, 2, function(data) {
    if (clean(data[1]) !== data[1]) return this.send({status: 'error', message: 'Team name contains profanity'});
    if (servers[this.room].pt.find(t => Engine.getTeam(t.team) === data[1])) return this.send({status: 'error', message: 'This team already exists.'});
    if (data[1].includes('@leader') || data[1].includes('@requestor#') || data[1].includes(':') || data[1].length > 20) return this.send({status: 'error', message: 'Team name not allowed.'});
    servers[this.room].pt.find(t => t.username === this.username).team = this.username+':'+data[1]+'@leader';
    for (const ai of servers[this.room].ai) if (Engine.getUsername(ai.team) === this.username) ai.team = this.username+':'+data[1];
  }],
  join: [FFA, 4, 2, function(data) {
    if (servers[this.room].pt.find(t => t.username === this.username).team.includes('@leader')) return this.send({status: 'error', message: 'You must disband your team to join. (/leave)'});
    if (!servers[this.room].pt.find(t => Engine.getTeam(t.team) === data[1] && t.team.includes('@leader'))) return this.send({status: 'error', message: 'This team does not exist.'});
    servers[this.room].pt.find(t => t.username === this.username).team += '@requestor#'+data[1];
    servers[this.room].logs.push({m: this.username+' requested to join team '+data[1]+'. Team owner can use /accept '+this.username+' to accept them.', c: '#0000FF'});
  }],
  accept: [FFA, 4, 2, function(data) {
    const leader = servers[this.room].pt.find(t => t.username === this.username), requestor = servers[this.room].pt.find(t => t.username === data[1]);
    if (!requestor) return this.send({status: 'error', message: 'Player not found.'});
    if (leader.team.includes('@leader') && requestor.team.includes('@requestor#') && Engine.getTeam(leader.team) === requestor.team.split('@requestor#')[1]) {
      requestor.team = data[1]+':'+Engine.getTeam(leader.team);
      for (const ai of servers[this.room].ai) if (Engine.getUsername(ai.team) === requestor.username) ai.team = requestor.username+':'+Engine.getTeam(requestor.team);
      servers[this.room].logs.push({ m: data[1]+' has joined team '+Engine.getTeam(leader.team), c: '#40C4FF' });
    }
  }],
  leave: [FFA, 4, 1, function(data) {
    const target = servers[this.room].pt.find(t => t.username === this.username), team = Engine.getTeam(target.team);
    servers[this.room].pt.forEach(t => {
      if (Engine.getTeam(t.team) === team && (target.team.includes('@leader') || this.username === t.username)) {
        t.team = t.username+':'+Math.random();
        for (const ai of servers[this.room].ai) if (Engine.getUsername(ai.team) === t.username) ai.team = t.username+':'+Engine.getTeam(t.team);
      }
    });
  }],
  freeze: [Object, 2, 2, function(data) {
    const t = servers[this.room].pt.find(t => t.username === data[1]);
    if (t) {
      const x = t.x, y = t.y;
      t.freezeInterval = setInterval(() => {
        t.x = x;
        t.y = y;
        servers[this.room].override(t);
      }, 15);
    }
  }],
  unfreeze: [Object, 2, 2, function(data) {
    const t = servers[this.room].pt.find(t => t.username === data[1]);
    if (t) clearInterval(t.freezeInterval);
  }],
  t: [Object, 4, -1, function(data) {
    if (Storage.mutes.includes(this.username)) return this.socket.send({status: 'error', message: 'You are muted!'}); 
    const team = Engine.getTeam(servers[this.room].pt.find(t => t.username === this.username).team), msg = {m: '[TEAM]['+this.username+'] '+clean(data.slice(1).join(' ')), c: '#FFFFFF'};
    for (const t of servers[this.room].pt) if (Engine.getTeam(t.team) === team) t.privateLogs.push(msg);
  }],
  gpt: [Object, 4, -1, function(data) {
    gpt({prompt: data.slice(1).join(' '), model: 'gpt-4'}, (err, data) => servers[this.room].pt.find(t => t.username === this.username).privateLogs.push({m: err === null ? data.gpt : err, c: '#DFCFBE'}));
  }],
  dalle: [Object, 3, -1, function(data) {
    dalle.v1({prompt: data.slice(1).join(' ')}, (err, data) => {
      if (data.images) for (const image of data.images) this.send({event: 'link', link: image});
    });
  }], 
  nuke: [Object, 2, 1, function(data) {
    for (let x = 0; x < 30; x += 2) for (let y = 0; y < 30; y += 2) servers[this.room].b.push(A.template('Block').init(x*100, y*100, Infinity, 'airstrike', ':', servers[this.room]));
  }],
  arson: [Object, 3, 1, function(data) {
    for (let x = 0; x < 30; x++) for (let y = 0; y < 30; y++) servers[this.room].b.push(A.template('Block').init(x*100, y*100, Infinity, 'fire', ':', servers[this.room]));
  }],
  acupuncture: [Object, 2, 1, function(data) {
    for (let x = 0; x < 30; x++) for (let y = 0; y < 30; y++) servers[this.room].b.push(A.template('Block').init(x*100, y*100, 50, 'spike', ':', servers[this.room]));
  }],
  newmap: [FFA, 3, -1, function(data) {
    let levelID = data[1] ? Number(data[1]) : Math.floor(Math.random()*ffaLevels.length);
    if (isNaN(levelID) || levelID % 1 !== 0 || levelID >= ffaLevels.length) return this.send({status: 'error', message: 'Out of range or invalid input.'});
    servers[this.room].levelReader(ffaLevels[levelID]);
    servers[this.room].pt.forEach(t => {
      t.x = servers[this.room].spawn.x;
      t.y = servers[this.room].spawn.y;
      t.socket.send({event: 'override', data: [{key: 'x', value: t.x}, {key: 'y', value: t.y}]});
    });
  }],
  ban: [Object, 2, 2, function(data) {
    if (Storage.admins.includes(data[1]) || Storage.owners.includes(data[1])) return this.send({status: 'error', message: `You can't ban another admin!`});
    Storage.bans.push(data[1]);
    servers[this.room].logs.push({m: data[1]+' was banned by '+this.username, c: '#FF0000'});
    servers[this.room].pt.find(t => t.username === data[1])?.socket.send({status: 'error', message: 'You are banned!'});
    for (const socket of sockets) if (socket.username === data[1]) setTimeout(() => socket.close());
  }],
  banlist: [Object, 2, -1, function(data) {
    const t = servers[this.room].pt.find(t => t.username === this.username);
    t.privateLogs.push({m: '-----Ban List-----', c: '#00FF00'});
    for (const ban of Storage.bans) t.privateLogs.push({m: ban, c: '#00FF00'});
  }],
  pardon: [Object, 2, 2, function(data) {
    Storage.bans.splice(Storage.bans.indexOf(data[1]), 1);
    servers[this.room].logs.push({m: data[1]+' was pardoned by '+this.username, c: '#0000FF'});
  }],
  mute: [Object, 3, 2, function(data) {
    if (Storage.mutes.includes(data[1])) return this.send({status: 'error', message: 'They are already muted!'});
    Storage.mutes.push(data[1]);
    servers[this.room].logs.push({m: data[1]+' was muted by '+this.username, c: '#FFFF22'});
  }],
  unmute: [Object, 3, 2, function(data) {
    Storage.mutes.splice(Storage.mutes.indexOf(data[1]), 1);
    servers[this.room].logs.push({m: data[1]+' was unmuted by '+this.username, c: '#0000FF'});
  }],
  kick: [Object, 3, 2, function(data) {
    for (const socket of sockets) if (socket.username === data[1]) {
      socket.send({status: 'error', message: 'You have been kicked by '+this.username});
      setTimeout(() => socket.close());
    }
  }],
  kill: [Object, 2, 2, function(data) {
    for (const server of Object.values(servers)) for (const t of server.pt) if (data[1] === t.username) for (let i = 0; i < 2; i++) t.damageCalc(t.x, t.y, 6000, this.username);
  }],
  killall: [Object, 2, 1, function(data) {
    for (const t of servers[this.room].pt) for (let i = 0; i < 2; i++) t.damageCalc(t.x, t.y, 6000, this.username);
  }],
  killai: [Object, 2, 1, function(data) {
    for (let i = servers[this.room].ai.length-1; i >= 0; i--) servers[this.room].ai[i].destroy();
  }],
  ai: [Object, 2, 7, function(data) {
    for (let i = 0; i < Number(data[5]); i++) servers[this.room].ai.push(new AI(Math.floor(Number(data[1]) / 100) * 100 + 10, Math.floor(Number(data[2]) / 100) * 100 + 10, Number(data[3]), Math.min(20, Math.max(0, Number(data[4]))), data[6], servers[this.room]));
  }],
  spectate: [Object, 3, 2, function(data) {
    for (const server of Object.values(servers)) for (const t of server.pt) if (t.username === data[1]) t.ded = true;
  }],
  live: [Object, 3, 2, function(data) {
    for (const server of Object.values(servers)) for (const t of server.pt) if (t.username === data[1]) t.ded = false;
  }],
  switch: [TDM, 3, 2, function(data) {
    if (servers[this.room].mode === 0) for (const t of servers[this.room].pt) if (t.username === (data.length === 1 ? this.username : data[1])) t.color = t.color === '#FF0000' ? '#0000FF' : '#FF0000';
  }],
  start: [TDM, 3, 1, function() {
    if (servers[this.room].mode === 0) {
      servers[this.room].readytime = Date.now();
      servers[this.room].time = 0;
    }
  }],
  reboot: [Object, 2, 1, function() {
    for (const socket of sockets) socket.send({status: 'error', message: 'Restarting Server!'});
    process.exit(1);
  }],
  announce: [Object, 3, -1, function(data) {
    for (const server of Object.values(servers)) server.logs.push({m: '[Announcement]['+this.username+'] '+data.slice(1).join(' '), c: '#FFF87D'});
  }],
  global: [Object, 2, -1, function(data) {
    for (const socket of sockets) socket.send({status: 'error', message: '[Global]['+this.username+'] '+data.slice(1).join(' ')});
  }],
  sread: [Object, 1, 2, function(data) {
    const value = servers[this.room][data[1]];
    if (value !== undefined) servers[this.room].logs.push({m: typeof value === Object ? JSON.stringify(value) : value, c: '#FFFFFF'});
  }],
  swrite: [Object, 1, 3, function(data) {
    eval(`try {
      servers['${this.room}']['${data[1]}'] = ${data[2]};
    } catch(e) {
      servers['${this.room}'].pt.find(t => t.username === '${this.username}').socket.send({status: 'error', message: 'Your command gave error: '+e});
    }`);
  }],
  tread: [Object, 1, 3, function(data) {
    for (const t of servers[this.room].pt) if (t.username === data[1]) {
      const value = t[data[2]];
      if (value !== undefined) servers[this.room].pt.find(tank => tank.username === this.username).privateLogs.push({m: typeof value === Object ? JSON.stringify(value) : value, c: '#FFFFFF'});
      return;
    }
  }],
  twrite: [Object, 1, 4, function(data) {
    eval(`try {
      const server = servers['${this.room}'], tank = server.pt.find(t => t.username === '${data[1]}');
      tank['${data[2]}'] = ${data[3]};
    } catch(e) {
      servers['${this.room}'].pt.find(t => t.username === '${this.username}').socket.send({status: 'error', message: 'Your command gave error: '+e});
    }`);
  }],
  help: [Object, 2, 1, function(data) {
    const t = servers[this.room].pt.find(t => t.username === this.username), authKey = ['n/a', 'Owner', 'Admin', 'VIP', 'Everyone']
    for (const command of Object.keys(Commands)) t.privateLogs.push({m: `/${command} - ${Commands[command][2]} parameters. [${authKey[Commands[command][1]]}]`, c: '#00FF00'});
  }],
  scream: [Object, 2, -1, function(data) {
    if (this.username !== 'bradley') return this.send({status: 'error', message: 'You are not a bradley!'});
    let victim = servers[this.room].pt.find(t => t.username === 'cs641311');
    if (victim === undefined) return this.send({status: 'error', message: 'Mission Failed! Wild I-ron not spotted!'});
    const messages = 100, span = 5000; // messages = # to send, span = time frame to send them over
    for (let i = 0; i < messages; i++) setTimeout(() => victim.privateLogs.push({m: 'Bread: '+data.slice(1).join(' ').toUpperCase(), c: Engine.getRandomColor()}), span/messages*i);
  }],
};

const helpList = Commands;

A.createTemplate('render', class {b = new Set(); pt = new Set(); ai = new Set(); s = new Set(); d = new Set()}, r => {
  for (const property of ['b', 'pt', 'ai', 's', 'd']) r[property].clear();
});
A.createTemplate('message', class {b = []; pt = []; ai = []; s = []; d = []; event = 'hostupdate'; delete = {b: [], pt: [], ai: [], s: [], d: []}}, m => {
  for (const property of ['b', 'pt', 'ai', 's', 'd']) {
    m[property].length = 0;
    m.delete[property].length = 0;
  }
});
A.createTemplate('arr', Array, a => (a.length = 0));
const joinKey = {'ffa': FFA, 'duels': DUELS, 'tdm': TDM, 'defense': Defense};
const Profile = (arr, update) => {
  const functions = [];
  for (let e of arr) {
    if (typeof e !== 'function') continue;
    if (/^\s*class\s+/.test(e.toString())) {
      const n = e.name;
      for (const p of Object.getOwnPropertyNames(e)) {
        if (typeof e[p] === 'function') {
          const f = {name: n+'.'+e[p].name, o: e[p], i: 0, t: 0, min: Infinity, max: 0};
          e[p] = function() {
            const start = process.hrtime();
            const r = f.o.apply(this, arguments);
            f.i++;
            const end = process.hrtime(start);
            const time = (end[0]+Math.floor(end[1]/1000000))+((end[1]%1000000)/1000000);
            if (time < f.min) f.min = time;
            if (time > f.max) f.max = time;
            f.t = (f.t*(f.i-1)+time)/f.i;
            update(functions);
            return r;
          }
          Object.defineProperty(e[p], 'name', {value: f.name.split('.')[1]});
          functions.push(f);
        }
      }
      for (const p of Object.getOwnPropertyNames(e.prototype)) {
        if (typeof e.prototype[p] === 'function') {
          const f = {name: n+'.'+p, o: e.prototype[p], i: 0, t: 0, min: Infinity, max: 0};
          e.prototype[p] = function() {
            const start = process.hrtime();
            const r = f.o.apply(this, arguments);
            f.i++;
            const end = process.hrtime(start);
            const time = (end[0]+Math.floor(end[1]/1000000))+((end[1]%1000000)/1000000);
            if (time < f.min) f.min = time;
            if (time > f.max) f.max = time;
            f.t = (f.t*(f.i-1)+time)/f.i;
            update(functions);
            return r;
          }
          Object.defineProperty(e.prototype[p], 'name', {value: p === 'constructor' ? n : p});
          functions.push(f);
        }
      }
    }
  }
}
process.on('uncaughtException', (err, origin) => {
  for (const socket of sockets) if (['bradley', 'Celestial', 'cs641311'].includes(socket.username)) socket.send({status: 'error', message: `Error: ${err} Origin: ${origin}`});
  console.error(err);
  process.exit(0);
});

const wss = new WebSocketServer({port: settings.port});
wss.on('connection', socket => {
  socket._send = socket.send;
  socket.send = data => socket._send(pack(data));
  sockets.add(socket);
  socket.on('message', data => {
    try {
      data = unpack(data);
    } catch(e) {
      return socket.close();
    }
    if (!socket.username) socket.username = data.username;
    if (data.type === 'update') {
      if (Storage.bans.includes(data.username)) {
        socket.send({status: 'error', message: 'You are banned!'});
        return setTimeout(() => socket.close());
      }
      if (servers[socket.room]) servers[socket.room].update(data);
    } else if (data.type === 'join') {
      if (clean(data.username) !== data.username) {
        socket.send({status: 'error', message: `Your username didn't pass the profanity check.`});
        return setTimeout(() => socket.close());
      } else if (Storage.bans.includes(data.username)) {
        socket.send({status: 'error', message: 'You are banned!'});
        return setTimeout(() => socket.close());
      } else if (!auth(socket.username, data.token)) {
        socket.send({status: 'error', message: 'Token is invalid. Login with the correct authserver.'});
        return setTimeout(() => socket.close());
      }
      let server;
      for (const id in servers) {
        if (servers[id] instanceof joinKey[data.gamemode]) {
          if (data.gamemode === 'ffa' && servers[id].pt.length >= settings.players_per_room) continue;
          if (data.gamemode === 'duels' && servers[id].pt.length !== 1) continue;
          if (data.gamemode === 'tdm' && servers[id].mode !== 0) continue;
          if (data.gamemode === 'defense' && servers[id].pt.length > 10) continue;
          server = id;
          break;
        }
      }
      if (!server) {
        server = Math.random();
        servers[server] = new joinKey[data.gamemode]();
      }
      if (servers[server].pt.some(t => t.username === socket.username)) {
        socket.send({status: 'error', message: 'You are already in the server!'});
        return setImmediate(() => socket.close());
      }
      socket.room = server;
      servers[server].add(socket, data.tank);
    } else if (data.type === 'ping') {
      socket.send({event: 'ping', id: data.id});
    } else if (data.type === 'chat') {
      if (Storage.mutes.includes(socket.username)) {
        log(`${socket.username} tried to say "${data.msg.slice(0, 100)}"`);
        return socket.send({status: 'error', message: 'You are muted!'});
      }
      if (!servers[socket.room]) return;
      servers[socket.room].logs.push({m: `[${socket.username}] ${clean(data.msg.slice(0, 100))}`, c: '#ffffff'});
      log(`[${socket.username}] ${clean(data.msg.slice(0, 100))}`);
    } else if (data.type === 'logs') {
      if (servers[data.room]) socket.send({event: 'logs', logs: servers[data.room].logs});
    } else if (data.type === 'command') {
      const f = Commands[data.data[0]];
      if (!f) return socket.send({status: 'error', message: 'Command not found.'});
      if (!(servers[socket.room] instanceof f[0])) return socket.send({status: 'error', message: 'This command is not available in this server type.'});
      if (data.data.length !== f[2] && f[2] !== -1) return socket.send({status: 'error', message: 'Wrong number of arguments.'});
      if (!hasAccess(socket.username, f[1])) return socket.send({status: 'error', message: `You don't have access to this.`});
      log(`${socket.username} ran command: ${data.data.join(' ')}`);
      f[3].bind(socket)(data.data);
    } else if (data.type === 'stats') {
      let gamemodes = {FFA: [], DUELS: [], TDM: [], Defense: [], tickspeed, event: 'stats'};
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
