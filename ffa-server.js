const settings = {
  path: '/ffa',
  authserver: 'localhost',
  bans: [],
  banips: [],
  mutes: [],
  admins: ['cs641311', 'Celestial', 'bradley', 'DIO', 'DarkMemeGod', '3foe'],
  players_per_room: 400,
  ups: 60,
  port: 15132,
}

const {Engine, AI, Block, Shot, Damage, Tank, getTeam, parseTeamExtras, getUsername} = require('./public/js/engine.js');
console.log('Loaded module');
const auth = async(username, token) => {
  const response = await fetch('http://'+settings.authserver+`/verify?username=${username}&token=${token}`);
  return await response.text() === 'true';
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
], rageMessages = [
  `{idot} left the game`,
  `{idot} quit`,
  `{idot} disconnected`,
];


let tickspeed = -1;
const getTickspeed = i => {
  const start = Date.now();
  setTimeout(() => {
    tickspeed = Date.now()-start; 
    getTickspeed();
  });
}
setTimeout(() => getTickspeed());
console.log('starting server');
Bun.serve({
  port: settings.port,
  fetch(req, server) {
    return new Reponse('hi');
    if (server.upgrade(req)) return;
    return new Response('Connect via websocket');
  },
  websocket: {
    open(socket) {
      sockets.add(socket);
      socket._send = socket.send;
      socket.send = data => socket._send(JSON.stringify(data));
      // banip here
    },
    async message(socket, data) {
      try {
        data = JSON.parse(data);
      } catch(e) {
        return socket.close();
      }
      if (!socket.username) {
        // check for ban or invalid username here
        socket.username = data.username;
      }
      if (data.type === 'update') {
        servers[socket.room].update(data);
      } else if (data.type === 'join') {
        let server;
        for (const id in servers) {
          if (servers[id] instanceof joinKey[data.gamemode]) {
            if (data.gamemode === 'ffa' && servers[id].pt.length >= settings.players_per_room) continue;
            if (data.gamemode === 'duels' && servers[id].pt.length !== 1) continue;
            if (data.gamemode === 'tdm' && servers[id].mode !== 0) continue;
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
        // handle mutes and filtering here
        if (servers[socket.room]) servers[socket.room].logs.push({m: `[${socket.username}] ${msg}`, c: '#ffffff'});
        if (servers[data.room]) servers[data.room].logs.push({m: `[${data.username}] ${msg}`, c: '#ffffff'});
      } else if (data.type === 'logs') {
        if (servers[data.room]) socket.send({event: 'logs', logs: servers[data.room].logs});
      } else if (data.type === 'command') {
        const f = Commands[data.data[0]], args = data.data;
        if (typeof func === 'function') {
          f.bind(socket)(args);
        } else socket.send({status: 'error', message: 'Command not found.'});
      } else if (data.type === 'stats') {
        let gamemodes = {FFA: [], DUELS: [], TDM: [], tickspeed, event: 'stats'};
        for (const id in servers) {
          gamemodes[servers[id].constructor.name][id] = [];
          for (const pt of servers[id].pt) {
            gamemodes[servers[id].constructor.name][id].push(pt.username);
          }
        }
        socket.send(gamemodes);
      }
    },
    close(socket, code, reason) {
      if (servers[socket.room]) servers[socket.room].disconnect(socket, code, reason);
    },
  },
});
console.log('should be started?');
const Commands = {
  createteam: function(data) {
    if (!(servers[this.room] instanceof FFA)) return socket.send({status: 'error', message: 'This command is only allowed in FFA'});
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    if (servers[this.room].pt.find(t => getTeam(t.team) === data[1])) return this.send({status: 'error', message: 'This team already exists.'});
    if (data[1].includes('@leader') || data[1].includes('@requestor#') || data[1].includes(':') || data[1].length > 20) return this.send({status: 'error', message: 'Team name not allowed.'});
    servers[this.room].pt.find(t => t.username === this.username).team = this.username+':'+data[1]+'@leader';
    servers[this.room].logs.push({m: this.username+' created team '+data[1]+'. Use /join '+data[1]+' to join.', c: '#0000FF'});
  },
  join: function(data) {
    if (!(servers[this.room] instanceof FFA)) return socket.send({status: 'error', message: 'This command is only allowed in FFA'});
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    if (servers[this.room].pt.find(t => t.username === this.username).team.includes('@leader')) return this.send({status: 'error', message: 'You must disband your team to join. (/leave)'});
    if (!servers[this.room].pt.find(t => getTeam(t.team) === data[1] && t.team.includes('@leader'))) return this.send({status: 'error', message: 'This team does not exist.'});
    servers[this.room].pt.find(t => t.username === this.username).team += '@requestor#'+data[1];
    servers[this.room].logs.push({m: this.username+' requested to join team '+data[1]+'. Team owner can use /accept '+this.username+' to accept them.', c: '#0000FF'});
  },
  accept: function(data) {
    if (!(servers[this.room] instanceof FFA)) return socket.send({status: 'error', message: 'This command is only allowed in FFA'});
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    var leader = servers[this.room].pt.find(t => t.username === this.username), requestor = servers[this.room].pt.find(t => t.username === data[1]);
    if (!requestor) return this.send({status: 'error', message: 'Player not found.'});
    if (leader.team.includes('@leader') && requestor.team.includes('@requestor#') && getTeam(leader.team) === requestor.team.split('@requestor#')[1]) {
      requestor.team = data[1]+':'+getTeam(leader.team);
      servers[this.room].logs.push({ m: data[1]+' has joined team '+getTeam(leader.team), c: '#40C4FF' });
    }
  },
  leave: function() {
    if (!(servers[this.room] instanceof FFA)) return socket.send({status: 'error', message: 'This command is only allowed in FFA'});
    var target = servers[this.room].pt.find(t => t.username === this.username);
    if (target.team.includes('@leader')) servers[this.room].pt.forEach(t => {
      if (getTeam(t.team) === getTeam(target.team)) t.team = t.username+':'+Math.random();
    });
    target.team = this.username+':'+Math.random();
  },
  newmap: function(data) {
    if (!(servers[this.room] instanceof FFA)) return socket.send({status: 'error', message: 'This command is only allowed in FFA'});
    if (!settings.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    servers[this.room].levelReader(ffaLevels[Math.floor(Math.random()*ffaLevels.length)]);
    servers[this.room].pt.forEach(t => {
      t.x = servers[this.room].spawn.x;
      t.y = servers[this.room].spawn.y;
      t.socket.send({event: 'override', data: [{key: 'x', value: t.x}, {key: 'y', value: t.y}]});
    });
  },
  banip: function(data) {
    return this.send({status: 'error', messsage: "We wouldn't want another evanism catastrophe, now, would we?"});
    if (!settings.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    var ip;
    try {
      var ip = servers[this.room].pt.find(t => t.username === data[1]).socket.ip;
    } catch(e) {
      return this.send({status: 'error', message: 'Player not found.'});
    }
    settings.banips.push(ip);
    sockets.forEach(s => {
      if (!s.ip === ip) return;
      s.send({status: 'error', message: 'You were just ip banned!'});
      setTimeout(() => s.close());
    });
    servers[this.room].logs.push({m: data[1]+`'s ip, `+ip+`, has been banned.`, c: '#FF0000'});
  },
  unbanip: function(data) {
    if (!settings.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    if (settings.banips.indexOf(data[1]) !== -1) settings.banips.splice(settings.banips.indexOf(data[1]), 1);
    servers[this.room].logs.push({m: data[1]+' ip has been unbanned.', c: '#0000FF'});
  },
  ban: function(data) {
    if (!settings.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length < 4 || isNaN(data[2])) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    if (settings.admins.includes(data[1])) return this.send({status: 'error', message: `You can't ban another admin!`});
    var l = 3, reason = '', server = servers[this.room];
    while (l<data.length) {
      reason += data[l]+' ';
      l++;
    }
    settings.bans.push({ username: data[1], by: this.username, time: data[2], reason: reason });
    server.logs.push({ m: this.username+' banned '+data[1]+' for '+data[2]+' minutes because "'+reason+'"', c: '#FF0000' });
    sockets.forEach(s => {
      if (s.username !== data[1]) return;
      s.send({status: 'error', message: 'You were just banned!'});
      setTimeout(() => s.close());
    });
  },
  bans: function(data) {
    if (!settings.admins.includes(this.username)) return this.send({ status: 'error', message: 'You are not a server admin!' });
    if (data[1]) {
      if (!A.each(settings.bans, function(i, server) {
        server.logs = server.logs.concat([{m: this.username+`'s Ban Info:`, c: '#FFFF22'}, {m: 'For: '+this.reason, c: '#FFFF22'}, {m: 'Time left: '+this.time, c: '#FFFF22'}, {m: 'Issued by: '+this.by, c: '#FFFF22'}]);
        return true;
      }, 'username', data[1], servers[this.room])) servers[this.room].logs.push({m: '/bans: '+data[1]+' is not banned.', c: '#FF0000'});
    } else {
      var players = [];
      A.each(settings.bans, function(i, p) {p.push(this.username)}, null, players);
      servers[this.room].logs = servers[this.room].logs.concat([{m: 'Bans Info:', c: '#FFFF22'}, {m: 'All Banned Players: '+players, c: '#FFFF22'}]);
    }
  },
  unban: function(data) {
    if (!settings.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 2) return this.send({ status: 'error', message: 'Command has invalid arguments.' });
    A.each(settings.bans, function(i) {settings.bans.splice(i, 1)}, 'username', data[1]);
    servers[this.room].logs.push({m: data[1]+' is unbanned.', c: '#0000FF'});
  },
  mute: function(data) {
    if (!settings.admins.includes(this.username)) {
      this.send({ status: 'error', message: 'You are not a server admin!' });
      return;
    }
    if (data.length !== 3 || isNaN(data[2])) {
      this.send({ status: 'error', message: 'Command has invalid arguments.' });
      return;
    }
    settings.mutes.push({
      username: data[1],
      by: this.username,
      time: data[2],
    });
    servers[this.room].logs.push({m: data[1]+' was muted for '+data[2]+' minutes by '+this.username, c: '#FFFF22'});
  },
  mutes: function(data) {
    if (!settings.admins.includes(this.username)) {
      this.send({ status: 'error', message: 'You are not a server admin!' });
      return;
    }
    if (data[1]) {
      if (!A.each(settings.mutes, function(i, server) {
        server.logs = server.logs.concat([{m: this.username+`'s Mute Info:`, c: '#FFFF22'}, {m: 'Time left: '+this.time, c: '#FFFF22'}, {m: 'Issued by: '+this.by, c: '#FFFF22'}]);
        return true;
      }, 'username', data[1], servers[this.room])) servers[this.room].logs.push({m: '/mutes: '+data[1]+' is not muted.', c: '#FF0000'});
    } else {
      var players = [];
      A.each(settings.mutes, function(i, p) {p.push(this.username)}, null, null, players);
      servers[this.room].logs = servers[this.room].logs.concat([{m: 'Mutes Info:', c: '#FFFF22'}, {m: 'All Muted Players: '+players, c: '#FFFF22'}]);
    }
  },
  unmute: function(data) {
    if (!settings.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    A.each(settings.mutes, function(i) {settings.mutes.splice(i, 1)}, 'username', data[1]);
    servers[this.room].logs.push({m: data[1]+' is unmuted.', c: '#0000FF'});
  },
  kick: function(data) {
    if (!settings.admins.includes(this.username)) return this.send({ status: 'error', message: 'You are not a server admin!' });
    if (data.length !== 2) return this.send({ status: 'error', message: 'Command has invalid arguments.' });
    for (const socket of sockets) {
      if (socket.username === data[1]) {
        socket.send({status: 'error', message: 'You have been kicked by '+this.username});
        setTimeout(() => socket.close());
      }
    }
  },
  kill: function(data) {
    if (!(servers[this.room] instanceof FFA)) return socket.send({status: 'error', message: 'This command is only allowed in FFA'});
    if (!settings.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 2) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    for (const server of Object.values(servers)) for (const t of server.pt) if (data[1] === t.username) t.damageCalc(t.x, t.y, 6000, this.username);
  },
  ai: function(data) {
    if (!(servers[this.room] instanceof FFA)) return socket.send({status: 'error', message: 'This command is only allowed in FFA'});
    if (!settings.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    if (data.length !== 7) return this.send({status: 'error', message: 'Command has invalid arguments.'});
    for (let i = 0; i < Number(data[5]); i++) servers[this.room].ai.push(new AI(Math.floor(Number(data[1]) / 100) * 100 + 10, Math.floor(Number(data[2]) / 100) * 100 + 10, Number(data[3]), Math.min(20, Math.max(0, Number(data[4]))), ':'+data[6], servers[this.room]));
  },
  spectate: function(data) {
    if (!settings.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    for (const server of Object.values(servers)) for (const t of server.pt) if (t.username === data[1]) t.ded = true;
  },
  live: function(data) {
    if (!settings.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not a server admin!'});
    for (const server of Object.values(servers)) for (const t of server.pt) if (t.username === data[1]) t.ded = false;
  },
  switch: function(data) {
    if (!(servers[this.room] instanceof TDM)) return this.send({status: 'error', message: 'This command is only allowed in TDM'});
    if (data.length === 2 && !settings.admins.includes(this.username)) return this.send({status: 'error', message: 'You are not an admin!'});
    for (const t of servers[this.room].pt) if (t.username === (data.length === 1 ? this.username : data[1])) t.color = t.color === '#FF0000' ? '#0000FF' : '#FF0000';
  },
  start: function() {
    if (!(servers[this.room] instanceof TDM)) return this.send({status: 'error', message: 'This command is only allowed in TDM'});
    if (!settings.admins.includes(this.username)) return this.send({status: 'error', message: 'Only admins can use this for now'});
    if (servers[this.room].mode === 0) {
      servers[this.room].readytime = Date.now();
      servers[this.room].time = 0;
    }
  },
  reboot: () => {
    process.exit(1);
  }
};

class Multiplayer extends Engine {
  constructor(levels) {
    super(levels);
    this.sendkey = {'Block': 'b', 'Shot': 's', 'AI': 'ai', 'Tank': 'pt', 'Damage': 'd'};
    this.sendkeyValues = ['b', 's', 'ai', 'pt', 'd'];
    if (!settings.fps_boost) this.i.push(setInterval(() => this.send(), 1000/settings.UPS));
  }

  override(t) {
    t.socket.send({event: 'override', data: [{key: 'x', value: t.x}, {key: 'y', value: t.y}]});
  }

  add(socket, data) {
    data.socket = socket;
    this.logs.push({m: this.joinMsg(data.username), c: '#66FF00'});
    super.add(data);
  }

  update(data) {
    super.update(data);
  }

  send() {
    for (const t of this.pt) {
      const fx = Math.floor(t.x/100), fy = Math.floor(t.y/100), sy = Math.max(fy-7, 0), ey = Math.min(fy+7, 30), sx = Math.max(fx-10, 0), ex = Math.min(fx+10, 30);
      const newrender = {b: new Set(), pt: new Set(), ai: new Set(), s: new Set(), d: new Set(), logs: this.logs.length, sx, sy, ex, ey};
      const message = {b: [], pt: [], ai: [], s: [], d: [], logs: this.logs, global: this.global, tickspeed, event: 'hostupdate', delete: {b: [], pt: [], ai: [], s: [], d: []}};      
      let send = t.render.logs !== newrender.logs;
      for (let cy = sy; cy < ey; cy++) {
        for (let cx = sx; cx < ex; cx++) {
          for (const entity of this.cells[cx][cy]) {
            const type = this.sendkey[entity.constructor.name];
            newrender[type].add(entity.id);
            if (!t.render[type].has(entity.id) || entity.updatedLast > t.lastUpdate) {
              message[type].push(entity.raw);
              send = true;
            }
          }
        }
      }
      for (const entity of this.sendkeyValues) {
        for (const id of t.render[entity]) {
          if (!newrender[entity].has(id)) {
            message.delete[entity].push(id);
            send = true;
          }
        }
      }
      t.render = newrender;
      t.lastUpdate = Date.now();
      if (send) t.socket.send(message);
    }
  }

  disconnect(socket, code, reason) {
    this.pt = this.pt.filter(t => {
      if (t.username === socket.username) {
        for (const cell of t.cells) {
          const [x, y] = cell.split('x');
          this.cells[x][y].delete(t);
        }
        return false;
      }
      return true;
    });
    this.ai = this.ai.filter(ai => getUsername(ai.team) !== socket.username);
    this.logs.push({m: this.rageMsg(socket.username), c: '#E10600'});
    if (this.pt.length === 0) {
      this.i.forEach(i => clearInterval(i));
      delete servers[socket.room];
    }
  }

  deathMsg(victim, killer) {
    return deathMessages[Math.floor(Math.random()*deathMessages.length)].replace('{victim}', victim).replace('{killer}', killer);
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
    if (m.socket) m.socket.send({event: 'kill'});
    A.each(this.ai, function(i, host, t) {
      if (getUsername(this.team) === t.username) {
        host.ai.splice(i, 1);
        i--;
      }
    }, null, null, this, t);
    setTimeout(function() {
      t.socket.send({event: 'ded'});
      t.socket.send({event: 'override', data: [{key: 'x', value: this.spawn.x}, {key: 'y', value: this.spawn.y}]});
      A.assign(t, 'x', this.spawn.x, 'y', this.spawn.y, 'ded', false, 'hp', t.maxHp);
    }.bind(this), 10000);
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
        this.global = '======FIGHT======';
        this.mode = 2;
      }
    }
  }

  ondeath(t, m) {
    t.ded = true;
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
          tank.hp = tank.maxHp;
          tank.shields = 0;
          tank.ded = false;
          tank.socket.send({event: 'ded'});
        });
        this.b = [];
        this.s = [];
        this.ai = [];
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
    super([[]]); // no lobby level for now :(
    this.global = 'Waiting for Players...';
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
    if (this.pt.length === 4) { // once four players, begin the countdown
      this.readytime = Date.now();
      this.time = 60; // 1 minute starting time
    }
  }

  ontick() {
    if (this.mode === 0) {
      if ((this.time-(Date.now()-this.readytime)/1000) <= 0) {
        this.mode = 1; // game start
        this.readytime = Date.now();
        this.time = 5;
        this.pt.forEach(t => {
          t.team = t.username+':'+(t.color === '#FF0000' ? 'RED' : 'BLUE');
        });
        this.levelReader(duelsLevels[0]);
      }
    } else if (this.mode === 1) {
      this.pt.forEach(t => {
        const spawn = getTeam(t.team) === 'BLUE' ? 0 : 1;
        t.x = this.spawns[spawn].x;
        t.y = this.spawns[spawn].y;
        this.override(t);
      });
      this.global = 'Round '+this.round+' in '+(this.time-Math.floor((Date.now()-this.readytime)/1000));
      if ((this.time-(Date.now()-this.readytime)/1000) <= 0) {
        this.global = '======FIGHT======';
        this.mode = 2;
      }
    }
  }

  ondeath(t, m) {
    t.ded = true;
    let allies = 0;
    this.pt.forEach(tank => {
      if (!tank.ded) {
        if (getTeam(tank.team) === getTeam(t.team)) {
          allies++;
        }
      }
    });
    if (allies === 0) {
      const winner = getTeam(m.team);
      this.wins[winner]++;
      if (this.wins[winner] === 3) {
        this.global = winner+' Wins!';
        setTimeout(() => {
          this.pt.forEach(t => {
            t.socket.send({event: 'gameover', type: winner === t.team ? 'victory' : 'defeat'});
            t.socket.close();
          });
        }, 5000);
      } else {
        this.global = winner+' Wins Round '+this.round;
        setTimeout(() => {
          this.pt.forEach(tank => {
            tank.hp = tank.maxHp;
            tank.shields = 0;
            tank.ded = false;
            t.socket.send({event: 'ded'});
          });
          this.b = [];
          this.s = [];
          this.ai = [];
          this.d = [];
          this.levelReader(duelsLevels[0]);
          this.round++;
          this.mode = 1; 
          this.readytime = Date.now();
        }, 5000);
      }   
    }
  }
}
/*
const Profile = (arr, update) => {
  const functions = [];
  for (let e of arr) {
    if (typeof e !== 'function') continue;
    if (/^\s*class\s+/.test(e.toString())) {
      const n = e.name;
      for (const p of Object.getOwnPropertyNames(e)) {
        if (typeof e[p] === 'function') {
          const f = {name: n+'.'+e[p].name, o: e[p], i: 0, t: 0, l: 0};
          e[p] = function() {
            const start = process.hrtime();
            const r = f.o.apply(this, arguments);
            f.i++;
            const end = process.hrtime(start);
            f.l = (end[0]+Math.floor(end[1]/1000000))+((end[1]%1000000)/1000000);
            f.t = (f.t*(f.i-1)+f.l)/f.i;
            update(functions);
            return r;
          }
          Object.defineProperty(e[p], 'name', {value: f.name.split('.')[1]});
          functions.push(f);
        }
      }
      for (const p of Object.getOwnPropertyNames(e.prototype)) {
        if (typeof e.prototype[p] === 'function') {
          const f = {name: n+'.'+p, o: e.prototype[p], i: 0, t: 0, l: 0};
          e.prototype[p] = function() {
            const start = process.hrtime();
            const r = f.o.apply(this, arguments);
            f.i++;
            const end = process.hrtime(start);
            f.l = (end[0]+Math.floor(end[1]/1000000))+((end[1]%1000000)/1000000);
            f.t = (f.t*(f.i-1)+f.l)/f.i;
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
const joinKey = {'ffa': FFA, 'duels': DUELS, 'tdm': TDM};

let lagometer = [];
Profile([Engine, Block, Shot, AI, Damage, FFA, Multiplayer, A], f => {
  lagometer = f;
});
setInterval(() => {
  lagometer.sort((a, b) => b.t - a.t);
  const top = lagometer.slice(0, Math.min(15, lagometer.length));
  console.log('-----PROFILING REPORT-----');
  for (const t of top) console.log(t.name+': ('+t.t+', '+t.l+') over '+t.i);
}, 10000);*/
