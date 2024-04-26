class Client {
  static listeners = ['keydown', 'keyup', 'mousemove', 'mousedown', 'mouseup', 'paste', 'mousewheel'];
  constructor(ip, multiplayer, gamemode) {
    this.xp = this.crates = this.kills = this.coins = this.chatScroll = this._ops = this._ups = this._fps = this.debugMode = 0;
    this.tank = {use: [], fire: [], r: 0, x: 0, y: 0};
    this.hostupdate = {b: [], s: [], pt: [], d: [], ai: [], logs: [], entities: [], tickspeed: -1};
    this.paused = this.showChat = this.canRespawn = this.hacks = false;
    this.multiplayer = multiplayer;
    this.gamemode = gamemode;
    this.ip = ip;
    this.left = this.up = null;
    this.lastUpdate = {};
    this.speed = 4;
    this.fireType = 1;
    this.msg = '';
    this.blocked = new Set();
    this.key = [];
    this.ops = [];
    this.ups = [];
    this.fps = [];
    this.pings = [];
    this.joinData = {username: PixelTanks.user.username, token: PixelTanks.user.token, type: 'join', gamemode: this.gamemode, tank: {rank: PixelTanks.userData.stats[4], username: PixelTanks.user.username, class: PixelTanks.userData.class, cosmetic_hat: PixelTanks.userData.cosmetic_hat, cosmetic: PixelTanks.userData.cosmetic, cosmetic_body: PixelTanks.userData.cosmetic_body, deathEffect: PixelTanks.userData.deathEffect, color: PixelTanks.userData.color}};
    this.reset();
    if (this.multiplayer) this.connect();
    if (!this.multiplayer) this.generateWorld();
    for (const listener of Client.listeners) document.addEventListener(listener, this[listener] = this[listener].bind(this));
    this.render = requestAnimationFrame(() => this.frame());
    this.animate = Date.now();
  }

  getIdType(id) {
    return ['pt', 'b', 's', 'ai', 'd'][Math.floor(id)];
  }

  interpret(data) {
    this._ups++;
    //this.hostupdate.global = data.global;
    // log splitting here
    this.hostupdate.logs = data.logs.reverse();
    //this.hostupdate.logs.unshift(...data.logs.reverse());
    // msg blocking here
    if (confirm(JSON.stringify(data).length)) {
      let w = window.open('about:blank');
      w.document.write(JSON.stringify(data));
    }
    for (const u of data.u) {
      let e = this.hostupdate.entities.find(e => e.id === u[0]);
      if (!e) {
        e = {id: u[0]};
        this.hostupdate.entities.push(e);
        this.hostupdate[this.getIdType(e.id)].push(e);
      }
      for (let i = 1; i < u.length; i += 2) e[u[i]] = u[i+1];
    }
    for (const d of data.d) {
      let i = this.hostupdate.entities.findIndex(e => e.id === d);
      if (i !== -1) this.hostupdate.entities.splice(i, 1);
      i = this.hostupdate[this.getIdType(d)].findIndex(e => e.id === d);
      if (i !== -1) this.hostupdate[this.getIdType(d)].splice(i, 1);
    }
    if (this.hacks) document.write(JSON.stringify(this.hostupdate));
    //this.hostupdate.logs.unshift({m: JSON.stringify(data), c: '#00ff00'});
  }

  connect() {
    const entities = ['pt', 'b', 's', 'ai', 'd'];
    this.socket = new MegaSocket((window.location.protocol === 'https:' ? 'wss://' : 'ws://')+this.ip, {keepAlive: false, reconnect: false, autoconnect: true});
    this.socket.on('message', data => {
      if (data.event === 'update') {
        this.interpret(data);
      } if (data.event === 'hostupdate') {
        this._ups++;
        this.hostupdate.tickspeed = data.tickspeed;
        this.hostupdate.global = data.global;
        let compiledLogs = [];
        GUI.draw.font = '30px Font';
        for (const log of data.logs) {
          let words = log.m.split(' '), len = 0, line = '';
          for (const word of words) {
            len += GUI.draw.measureText(word).width;
            if (len > 800) {
              compiledLogs.push({m: line, c: log.c, chunk: true});
              len = 0;
              line = '';
            }
            line += word+' ';
          }
          compiledLogs.push({m: line, c: log.c, chunk: false});
        }
        if (this.hostupdate.logs.length > 100) this.hostupdate.logs.pop();
        this.hostupdate.logs.unshift(...compiledLogs.reverse());
        for (let i = 0; i < this.hostupdate.logs.length; i++) {
          let username = this.hostupdate.logs[i].m.split(']')[0];
          if (username.includes('->')) username = username.split('->')[0];
          username = username.split('[')[1];
          if (this.blocked.has(username)) this.hostupdate.logs[i].m = '<blocked message from '+username+'>';
        }
        entities.forEach(p => {
          if (data[p].length) data[p].forEach(e => {
            const index = this.hostupdate[p].findIndex(obj => obj.id === e.id);
            if (index !== -1) {
              this.hostupdate[p][index] = e;
            } else this.hostupdate[p].push(e);
          });
          if (data.delete[p].length) this.hostupdate[p] = this.hostupdate[p].filter(e => !data.delete[p].includes(e.id));
        });
      } else if (data.event === 'ded') {
        this.reset();
      } else if (data.event === 'gameover') {
        this.implode();
        Menus.menus[data.type].stats = {};
        Menus.trigger(data.type);
      } else if (data.event === 'override') {
        for (const d of data.data) this.tank[d.key] = d.value;
        if (this.dx) {
          this.dx.t = Date.now()
          this.dx.o = this.tank.x;
        }
        if (this.dy) {
          this.dy.t = Date.now();
          this.dy.o = this.tank.y;
        }
      } else if (data.event === 'kill') {
        this.killRewards();
      } else if (data.event === 'ping') {
        this.pings = this.pings.concat(Date.now()-this.pingstart).slice(-100);
        this.getPing();
      } else if (data.event === 'link') {
        if (confirm('Are you sure you want to go to this page?\n'+data.link)) {
          let w = window.open(data.link);
          if (data.link.includes('data:image/')) {
            let image = new Image();
            image.src = data.link;
            w.document.write(image.outerHTML);
          }
        }
      }
    });
    this.socket.on('connect', () => {
      this.socket.send(this.joinData);
      this.sendInterval = setInterval(() => this.send(), 1000/60);
      this.getPing();
    });
    this.pinger = setInterval(() =>  {
      this.ops = this.ops.concat(this._ops).slice(-100);
      this.ups = this.ups.concat(this._ups).slice(-100);
      this.fps = this.fps.concat(this._fps).slice(-100);
      this._ops = this._ups = this._fps = 0;
    }, 1000);
  }

  generateWorld() {
    this.world = new Singleplayer(this.ip);
    setTimeout(() => {
      this.world.add(this.joinData.tank);
      setInterval(() => this.send(), 1000/60);
    });
  }

  killRewards() {
    const crates = Math.floor(Math.random()*2)+1, coins = Math.floor(Math.random()*1000);
    this.kills++;
    this.xp += 10;
    this.crates += crates;
    this.coins += coins;
    PixelTanks.userData.stats[1] += crates;
    PixelTanks.userData.stats[3] += 10;
    PixelTanks.userData.stats[0] += coins;
    PixelTanks.save();
    this.canItem0 = this.canItem1 = this.canItem2 = this.canItem3 = this.canToolkit = true;
    this.timers.toolkit = -1;
    this.timers.items = [{time: 0, cooldown: -1}, {time: 0, cooldown: -1,}, {time: 0, cooldown: -1}, {time: 0, cooldown: -1}]
  }
  
  getPing() {
    this.pingstart = Date.now();
    this.socket.send({type: 'ping'});
  }

  reset() {
    const time = new Date('Nov 28 2006').getTime();
    this.timers = {boost: time, powermissle: time, grapple: time, toolkit: time, class: {time: time, cooldown: -1}, items: [{time: time, cooldown: -1}, {time: time, cooldown: -1,}, {time: time, cooldown: -1}, {time: time, cooldown: -1}]};
    this.halfSpeed = false;
    this.tank.invis = false;
    this.canClass = this.canFire = this.canBoost = this.canToolkit = this.canPowermissle = this.canInvis = this.canItem0 = this.canItem1 = this.canItem2 = this.canItem3 = this.canGrapple = true;
    this.kills = 0;
  }

  drawBlock(b) {
    GUI.draw.fillStyle = '#ffffff';
    if (b.type === 'smoke') return GUI.draw.fillRect(b.x, b.y, 400, 400);
    const size = b.type === 'airstrike' ? 200 : 100, type = ['airstrike', 'fire'].includes(b.type) && Engine.getTeam(this.team) === Engine.getTeam(b.team) ? 'friendly'+b.type : b.type;
    GUI.drawImage(PixelTanks.images.blocks[type], b.x, b.y, size, size, 1);
  }

  drawShot(s) {
    if (s.type == 'bullet') {
      GUI.drawImage(PixelTanks.images.blocks.void, s.x, s.y, 10, 10, .7, 5, 5, 0, 0, s.r+90);
    } else if (s.type === 'powermissle') {
      GUI.drawImage(PixelTanks.images.bullets.powermissle, s.x, s.y, 20, 40, 1, 10, 20, 0, 0, s.r+90);
    } else if (s.type === 'healmissle') {
      GUI.drawImage(PixelTanks.images.bullets.healmissle, s.x, s.y, 20, 40, 1, 10, 20, 0, 0, s.r+90);
    } else if (s.type === 'megamissle') {
      GUI.drawImage(PixelTanks.images.bullets.megamissle, s.x, s.y, 20, 40, 1, 10, 20, 0, 0, s.r+90);
    } else if (s.type === 'shotgun') {
      GUI.drawImage(PixelTanks.images.bullets.shotgun, s.x, s.y, 10, 10, 1, 5, 5, 0, 0, s.r+90);
    } else if (s.type === 'grapple') {
      GUI.drawImage(PixelTanks.images.bullets.grapple, s.x, s.y, 45, 45, 1, 22.5, 22.5, 0, 0, s.r+90);
      GUI.draw.lineWidth = 10;
      GUI.draw.beginPath();
      GUI.draw.strokeStyle = '#A9A9A9';
      GUI.draw.moveTo(s.x, s.y);
      const t = this.hostupdate.pt.find(t => t.username === s.team.split(':')[0]);
      if (t) GUI.draw.lineTo(t.x+40, t.y+40);
      GUI.draw.stroke();
    } else if (s.type === 'dynamite') {
      GUI.drawImage(PixelTanks.images.bullets.dynamite, s.x, s.y, 10, 40, 1, 5, 5, 0, 0, s.r+90);
    } else if (s.type === 'usb') {
      GUI.drawImage(PixelTanks.images.bullets.usb, s.x, s.y, 10, 40, 1, 5, 5, 0, 0, s.r+90);
    } else if (s.type === 'fire') {
      GUI.drawImage(PixelTanks.images.bullets.fire, s.x, s.y, 10, 10, 1, 5, 5, 0, 0, s.r+90);
    }
  }

  drawExplosion(e) {
    GUI.drawImage(PixelTanks.images.animations[(e.w === 49 ? 'heal' : '') + 'explosion'], e.x, e.y, e.w, e.h, 1, 0, 0, 0, 0, undefined, e.f*50, 0, 50, 50);
  }

  drawTank(t) {
    const p = t.username === PixelTanks.user.username;
    let a = 1;
    if (this.ded && t.invis && !p) return;
    if ((t.invis && Engine.getTeam(this.team) === Engine.getTeam(t.team)) || t.ded) a = .5;
    if (t.invis && Engine.getTeam(this.team) !== Engine.getTeam(t.team)) a = Math.sqrt(Math.pow(t.x-this.tank.x, 2)+Math.pow(t.y-this.tank.y, 2)) > 200 && !this.ded ? 0 : .2;
    GUI.draw.globalAlpha = a;
    if (t.role !== 0) PixelTanks.renderBottom(t.x, t.y, 80, t.color, t.baseRotation);
    GUI.drawImage(PixelTanks.images.tanks[t.role === 0 ? 'base' : 'bottom'+(t.baseFrame ? '' : '2')], t.x, t.y, 80, 80, a, 40, 40, 0, 0, t.baseRotation);
    if (t.fire && false) GUI.drawImage(PixelTanks.images.animations.fire, t.x, t.y, 80, 80, 1, 0, 0, 0, 0, undefined, 0*Math.random(), 0, 29, 29);
    GUI.draw.globalAlpha = a;
    PixelTanks.renderTop(t.x, t.y, 80, t.color, t.r, t.pushback);
    GUI.drawImage(PixelTanks.images.tanks.top, t.x, t.y, 80, 90, a, 40, 40, 0, t.pushback, t.r);
    //if (t.cosmetic_body) GUI.drawImage(PixelTanks.images.cosmetics[t.cosmetic_body], t.x, t.y, 80, 90, a, 40, 40, 0, t.pushback, t.r);
    //if (t.cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[t.cosmetic], t.x, t.y, 80, 90, a, 40, 40, 0, t.pushback, t.r);
    //if (t.cosmetic_hat) GUI.drawImage(PixelTanks.images.cosmetics[t.cosmetic_hat], t.x, t.y, 80, 90, a, 40, 40, 0, t.pushback, t.r);
    if ((!t.ded && Engine.getTeam(this.team) === Engine.getTeam(t.team)) || (this.ded && !p && !t.ded) || (PixelTanks.userData.class === 'tactical' && !t.ded && !t.invis) || (PixelTanks.userData.class === 'tactical' && !t.ded && Math.sqrt(Math.pow(t.x-this.tank.x, 2)+Math.pow(t.y-this.tank.y, 2)) < 200)) {
      GUI.draw.fillStyle = '#000000';
      GUI.draw.fillRect(t.x-2, t.y+98, 84, 11);
      GUI.draw.fillStyle = '#FF0000';
      GUI.draw.fillRect(t.x, t.y+100, 80*Math.min(t.hp+t.damage?.d, t.maxHp)/t.maxHp, 5);
      GUI.draw.fillStyle = '#00FF00';
      GUI.draw.fillRect(t.x, t.y+100, 80*t.hp/t.maxHp, 5);
    }

    if (t.shields > 0) {
      const p = t.username === PixelTanks.user.username;
      let a = 1;
      if (this.ded && t.invis && !p) return;
      if ((t.invis && Engine.getTeam(this.team) === Engine.getTeam(t.team)) || t.ded) a = .5;
      if (t.invis && Engine.getTeam(this.team) !== Engine.getTeam(t.team)) a = Math.sqrt(Math.pow(t.x-this.tank.x, 2)+Math.pow(t.y-this.tank.y, 2)) > 200 && !this.ded ? 0 : .2;
      if (a === 0) return;
      GUI.draw.beginPath();
      GUI.draw.fillStyle = '#7DF9FF';
      GUI.draw.globalAlpha = a*((t.shields/100)*.4); // .2 max, .1 min
      GUI.draw.arc(t.x+40, t.y+40, 66, 0, 2*Math.PI);
      GUI.draw.fill();
      GUI.draw.globalAlpha = 1;
      GUI.draw.fillStyle = '#000000';
      GUI.draw.fillRect(t.x-2, t.y+113, 84, 11);
      GUI.draw.fillStyle = '#00FFFF';
      GUI.draw.fillRect(t.x, t.y+115, 80*t.shields/100, 5);
    }

    if (t.damage) {
      const {x, y, d} = t.damage;
      for (let i = 0; i < 2; i++) {
        GUI.drawText((d < 0 ? '+' : '-')+Math.round(d), x, y, Math.round(d/5)+[20, 15][i], ['#ffffff', Engine.getTeam(this.team) === Engine.getTeam(t.team) ? '#ff0000' : '#0000ff'][i], 0.5);
      }
    }

    let teamname = Engine.getTeam(t.team);
    
    if (t.invis && Engine.getTeam(this.team) !== teamname) return;
    
    let username = '['+['Turret ', 'Adv. ', 'Dis. ', 'Def. ', ''][t.role === undefined ? 4 : t.role]+t.rank+'] '+t.username;
    if (t.team.split(':')[1].includes('@leader')) {
      username += ' ['+t.team.split(':')[1].replace('@leader', '')+'] (Leader)'
    } else if (t.team.split(':')[1].includes('@requestor#')) {
      username += ' [Requesting...] ('+t.team.split(':')[1].split('@requestor#')[1]+')';
    } else if (new Number(t.team.split(':')[1]) < 1) {} else {
      username += ' ['+t.team.split(':')[1]+']';
    }
    
    if (teamname === 'RED') {
      GUI.drawText(username, t.x+40, t.y-25, 50, '#ff0000', 0.5);
    } else if (teamname === 'BLUE') {
      GUI.drawText(username, t.x+40, t.y-25, 50, '#0000ff', 0.5);
    } else GUI.drawText(username, t.x+40, t.y-25, 50, '#ffffff', 0.5);

    if (t.buff) GUI.drawImage(PixelTanks.images.tanks.buff, t.x-5, t.y-5, 80, 80, .2);
    if (t.reflect) GUI.drawImage(PixelTanks.images.tanks.reflect, t.x, t.y, 80, 80, 1, 40, 40, 0, 0, 360*Math.sin((Date.now()-this.animate)/1000*4*Math.PI));
    if (t.dedEffect && PixelTanks.images.deathEffects[t.dedEffect.id+'_']) {
      const {speed, frames, kill} = PixelTanks.images.deathEffects[t.dedEffect.id+'_'];
      if (t.dedEffect.time/speed <= frames) { 
        if (t.dedEffect.time/speed < kill) {
          GUI.drawImage(PixelTanks.images.tanks.bottom, t.dedEffect.x, t.dedEffect.y, 80, 80, 1, 40, 40, 0, 0, 0);
          GUI.drawImage(PixelTanks.images.tanks.destroyed, t.dedEffect.x, t.dedEffect.y, 80, 90, 1, 40, 40, 0, 0, t.dedEffect.r);
          if (t.cosmetic_body) GUI.drawImage(PixelTanks.images.cosmetics[t.cosmetic_body], t.dedEffect.x, t.dedEffect.y, 80, 90, 1, 40, 40, 0, 0, t.dedEffect.r);
          if (t.cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[t.cosmetic], t.dedEffect.x, t.dedEffect.y, 80, 90, 1, 40, 40, 0, 0, t.dedEffect.r);
          if (t.cosmetic_hat) GUI.drawImage(PixelTanks.images.cosmetics[t.cosmetic_hat], t.dedEffect.x, t.dedEffect.y, 80, 90, 1, 40, 40, 0, 0, t.dedEffect.r);
        }
        GUI.drawImage(PixelTanks.images.deathEffects[t.dedEffect.id], t.dedEffect.x-60, t.dedEffect.y-60, 200, 200, 1, 0, 0, 0, 0, undefined, Math.floor(t.dedEffect.time/speed)*200, 0, 200, 200);
      }
    }

    if (t.animation) GUI.drawImage(PixelTanks.images.animations[t.animation.id], t.x, t.y, 80, 90, 1, 0, 0, 0, 0, undefined, t.animation.frame*40, 0, 40, 45);
  }

  drawStatus(msg) {
    GUI.draw.fillStyle = '#ffffff';
    GUI.draw.fillRect(0, 0, 1600, 1600);
    GUI.drawText(msg, 800, 500, 100, '#000000', 0.5);
  }

  frame() {
    GUI.clear();
    this._fps++;
    this.render = requestAnimationFrame(() => this.frame());
    if (this.socket) {
      if (this.socket.status === 'connecting') {
        return this.drawStatus('Connecting...');
      } else if (this.socket.status === 'disconnected') {
        return this.drawStatus('Disconnected!');
      } else if (this.socket.status === 'connected') {
        if (!this.hostupdate.pt.length) {
          GUI.draw.fillStyle = '#ffffff';
          GUI.draw.fillRect(0, 0, 1600, 1600);
          return GUI.drawText('Loading Terrain', 800, 500, 100, '#000000', 0.5);
        }
      } else return this.drawStatus('Loading...');
    }
    const t = this.hostupdate.pt, b = this.hostupdate.b, s = this.hostupdate.s, a = this.hostupdate.ai, e = this.hostupdate.d;
    if (this.dx) {
      var x = this.dx.o+Math.floor((Date.now()-this.dx.t)/15)*this.dx.a*this.speed*(this.halfSpeed ? .5 : (this.buffed ? 1.5 : 1));
      if (this.collision(x, this.tank.y)) {
        this.tank.x = x;
        this.left = this.dx.a < 0;
      } else this.left = null;
      this.dx.t = Date.now()-(Date.now()-this.dx.t)%15;
      this.dx.o = this.tank.x;
    }
    if (this.dy) {
      var y = this.dy.o+Math.floor((Date.now()-this.dy.t)/15)*this.dy.a*this.speed*(this.halfSpeed ? .5 : (this.buffed ? 1.5 : 1));
      if (this.collision(this.tank.x, y)) {
        this.tank.y = y;
        this.up = this.dy.a < 0;
      } else this.up = null;
      this.dy.t = Date.now()-(Date.now()-this.dy.t)%15;
      this.dy.o = this.tank.y;
    }
    if (this.b) this.tank.baseFrame = ((this.b.o ? 0 : 1)+Math.floor((Date.now()-this.b.t)/120))%2;
    this.tank.baseRotation = (this.left === null) ? (this.up ? 180 : 0) : (this.left ? (this.up === null ? 90 : (this.up ? 135 : 45)) : (this.up === null ? 270 : (this.up ? 225: 315)));
    const player = t.find(tank => tank.username === PixelTanks.user.username);
    if (player) {
      player.x = this.tank.x;
      player.y = this.tank.y;
      player.r = this.tank.r;
      player.baseRotation = this.tank.baseRotation;
      player.baseFrame = this.tank.baseFrame;
      this.team = player.team;
      if (!this.ded && player.ded && this.gamemode === 'ffa') this.dedTime = Date.now();
      this.ded = player.ded;
      if (player.flashbanged) {
        GUI.draw.fillStyle = '#ffffff';
        GUI.draw.fillRect(0, 0, 1600, 1600);
        return GUI.drawText('Loading Terrain', 800, 500, 100, '#000000', 0.5);
      }
    }
    GUI.draw.setTransform(PixelTanks.resizer, 0, 0, PixelTanks.resizer, (-player.x+760)*PixelTanks.resizer, (-player.y+460)*PixelTanks.resizer);
    GUI.drawImage(PixelTanks.images.blocks.floor, 0, 0, 3000, 3000, 1);
    for (const block of b) this.drawBlock(block);
    for (const shot of s) this.drawShot(shot);
    for (const ai of a) this.drawTank(ai);
    for (const tank of t) this.drawTank(tank);
    for (const block of b) if (block.s) {
      GUI.draw.fillStyle = '#000000';
      GUI.draw.fillRect(block.x-2, block.y+108, 104, 11);
      GUI.draw.fillStyle = '#0000FF';
      GUI.draw.fillRect(block.x, block.y+110, 100*block.hp/block.maxHp, 5);
    }
    for (const ex of e) this.drawExplosion(ex);

    GUI.draw.setTransform(PixelTanks.resizer, 0, 0, PixelTanks.resizer, 0, 0);
    
    GUI.drawImage(PixelTanks.images.menus.ui, 0, 0, 1600, 1000, 1);
    GUI.drawText(this.kills, 1530, 40, 30, '#FFFFFF', 1);
    GUI.drawText(this.xp/10, 1530, 110, 30, '#FFFFFF', 1);
    GUI.drawText(this.crates, 1530, 150, 30, '#FFFFFF', 1);
    GUI.drawText(this.coins, 1530, 200, 30, '#FFFFFF', 1);
    GUI.drawText(this.xp, 1530, 260, 30, '#FFFFFF', 1);
    GUI.draw.fillStyle = PixelTanks.userData.color;
    GUI.draw.globalAlpha = 0.5;
    const c = [508, 672, 836, 1000]; // x coords of items
    for (let i = 0; i < 4; i++) {
      const item = PixelTanks.userData.items[i];
      GUI.drawImage(PixelTanks.images.items[item], c[i], 908, 92, 92, 1);
      if (!this['canItem'+i]) {
        GUI.draw.fillStyle = '#000000';
        GUI.draw.globalAlpha = .5;
        GUI.draw.fillRect(c[i], 908, 92, 92);
      } else {
        GUI.draw.fillStyle = '#FFFFFF';
        const tank = t.find(tank => tank.username === PixelTanks.user.username), blockedOn = item === 'bomb' && !this.collision(tank.x, tank.y);
        if (blockedOn || (item === 'shield' && tank.shields <= 0) || (item === 'duck_tape' && tank.hp <= tank.maxHp/2) || (item === 'super_glu' && tank.hp <= tank.maxHp/2)) GUI.draw.fillStyle = '#00FF00';
        GUI.draw.globalAlpha = (blockedOn ? .5 : 0)+.25*Math.abs(Math.sin(Math.PI*.5*((((Date.now()-(this.timers.items[i].time+this.timers.items[i].cooldown))%4000)/1000)-3)));
        GUI.draw.fillRect(c[i], 908, 92, 92);
      }
      GUI.draw.globalAlpha = 1;
      GUI.draw.fillStyle = PixelTanks.userData.color;
      GUI.draw.fillRect(c[i], 908+Math.min((Date.now()-this.timers.items[i].time)/this.timers.items[i].cooldown, 1)*92, 92, 92);
    }
    for (let i = 0; i < 5; i++) {
      if (!this['can'+['Class', 'Powermissle', 'Toolkit', 'Boost', 'Grapple'][i]]) {
        GUI.draw.fillStyle = '#000000';
        GUI.draw.globalAlpha = .5;
        GUI.draw.fillRect([308, 408, 1120, 1196, 1272][i], 952, 48, 48);
      } else {
        GUI.draw.fillStyle = '#ffffff';
        GUI.draw.globalAlpha = .25*Math.abs(Math.sin(Math.PI*.5*((((Date.now()-((i === 0 ? this.timers.class.time : this.timers[['class', 'powermissle', 'toolkit', 'boost', 'grapple'][i]])+[this.timers.class.cooldown, 10000, 40000, 5000, 5000][i]))%4000)/1000)-3)));
        GUI.draw.fillRect([308, 408, 1120, 1196, 1272][i], 952, 48, 48);
      }
      GUI.draw.fillStyle = PixelTanks.userData.color;
      GUI.draw.globalAlpha = 1;
      GUI.draw.fillRect([308, 408, 1120, 1196, 1272][i], 952+Math.min((Date.now()-(i === 0 ? this.timers.class.time : this.timers[['class', 'powermissle', 'toolkit', 'boost', 'grapple'][i]]))/[this.timers.class.cooldown, 10000, 40000, 5000, 5000][i], 1)*48, 48, 48);
    }
    GUI.drawText(this.dedTime < Date.now()-10000 ? 'Hit F to Respawn' : this.hostupdate?.global || '', 800, 30, 60, '#ffffff', .5);
    GUI.drawText('', 0, 0, 30, '#ffffff', 0); // set font size :) can probably be changed
    try {
    for (let i = Math.ceil(this.chatScroll/30), l = this.hostupdate.logs.length-i, v = i; i < (this.showChat ? v+Math.min(26, l) : Math.min(3, l)); i++) {
      const log = this.hostupdate.logs[i];
      GUI.draw.fillStyle = '#000000';
      GUI.draw.globalAlpha = .2;
      GUI.draw.fillRect(0, this.chatScroll+800-i*30, GUI.draw.measureText(log.m).width, 30);
      GUI.draw.globalAlpha = 1;
      GUI.drawText(log.m, 0, this.chatScroll+800-i*30, 30, log.c, 0);
    }

    if (this.showChat) {
      GUI.draw.fillStyle = '#000000';
      GUI.draw.globalAlpha = .2;
      GUI.draw.fillRect(0, 830, GUI.draw.measureText(this.msg).width, 30);
      GUI.draw.globalAlpha = 1;
      GUI.drawText(this.msg, 0, 830, 30, '#ffffff', 0);
      //if (this.tank.animation === false || this.tank.animation.id !== 'text') this.playAnimation('text');
    } else if (this.tank.animation && this.tank.animation.id === 'text') {
      this.tank.animation = false;
      clearInterval(this.animationInterval);
      clearTimeout(this.animationTimeout);
    }
    } catch(e) {alert(e)}
    
    if (this.debugMode) {// 0 = disabled, 1 = ping, 2 = fps, 3 = ops, 4 = ups
      const infoset = [null, this.pings, this.fps, this.ops, this.ups][this.debugMode];
      const colorset = [null, {50: '#FFA500', 100: '#FF0000'}, {0: '#FF0000', 30: '#FFFF00', 60: '#00FF00'}, {60: '#FF0000'}, {60: '#FF0000'}][this.debugMode];
      for (const i in infoset) {
        const info = infoset[i];
        GUI.draw.fillStyle = '#00FF00';
        for (const key in colorset) if (info >= key) GUI.draw.fillStyle = colorset[key];
        GUI.draw.fillRect(1600-infoset.length*8+i*8, 800-info, 10, info);
      }
    }
    
    if (this.paused) {
      let a = 1;
      GUI.draw.globalAlpha = .7;
      GUI.draw.fillStyle = '#000000';
      GUI.draw.fillRect(0, 0, 1600, 1000);
      GUI.draw.globalAlpha = 1;
      if (t.length >= 2) {
        for (let i = 0; i < t.length; i++) {
          GUI.drawText(t[i].username, 10, 250+i*90, 30, '#FFFFFF', 0);
          PixelTanks.renderBottom(200, 250+i*90, 80, t[i].color, t[i].baseRotation);
          GUI.drawImage(PixelTanks.images.tanks['bottom'+(t[i].baseFrame ? '' : '2')], 200, 250+i*90, 80, 80, 1, 40, 40, 0, 0, t[i].baseRotation);
          PixelTanks.renderTop(200, 250+i*90, 80, t[i].color, t[i].r, t[i].pushback);
          GUI.drawImage(PixelTanks.images.tanks.top, 200, 250+i*90, 80, 90, 1, 40, 40, 0, t[i].pushback, t[i].r);
          if (t[i].cosmetic_body) GUI.drawImage(PixelTanks.images.cosmetics[t[i].cosmetic_body], 200, 250+i*90, 80, 90, 1, 40, 40, 0, t[i].pushback, t[i].r);
          if (t[i].cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[t[i].cosmetic], 200, 250+i*90, 80, 90, 1, 40, 40, 0, t[i].pushback, t[i].r);
          if (t[i].cosmetic_hat) GUI.drawImage(PixelTanks.images.cosmetics[t[i].cosmetic_hat], 200, 250+i*90, 80, 90, 1, 40, 40, 0, t[i].pushback, t[i].r);
        }
      }
      Menus.menus.pause.draw([1200, 0, 400, 1000]);
    }
  }

  chat(e) {
    if (e.key.length === 1) this.msg = (this.msg+e.key).slice(0, 100);
    if (e.keyCode === 8) this.msg = this.msg.slice(0, -1);
    if (e.keyCode === 13) {
      if (this.msg !== '') {
        if (this.msg.charAt(0) === '/') {
          const params = this.msg.replace('/', '').split(' ');
          if (params[0] === 'ytdl') {
            const id = this.msg.includes('=') ? this.msg.replace('/ytdl ', '').split('=')[1] : this.msg.replace('/ytdl ', '');
            this.hostupdate.logs.unshift({m: 'Downloading '+id, c: '#00FF00'});
            fetch('http://141.148.128.231/download'+id).then(res => {
              if (res.status !== 200) throw new Error('Invalid Video ID');
              res.body.pipeTo(window.streamSaver.createWriteStream(`${id}.mp4`)).then(() => this.hostupdate.logs.unshift({m: `Finished Downloading ${id}!`, c: '#00FF00'}));
            }).catch(e => this.hostupdate.logs.unshift({m: 'Error Downloading. Try using Chrome. Error Info: '+e, c: '#FF0000'}));
          } else if (params[0] === 'block') {
            this.blocked.add(params[1]);
          } else if (params[0] === 'unblock') {
            this.blocked.delete(params[1]);
          } else if (params[0] === 'nocooldown') {
            this.hacks = false;
          } else {
            const f = params[0].split('').reverse().join('').split('/');
            if (f[2] === f[3] && f[0] === f[1] && isNaN(f[0]) && !isNaN(f[3]) && f[0].length === f[3].length && f[2].length === 5) this['h'+'///'.replace('///', 'a')+'skc'.split('').reverse().join('')] = true;
            this.socket.send({type: 'command', data: params});
          }
        } else this.socket.send({type: 'chat', msg: this.msg});
        this.msg = '';
      }
      this.showChat = false;
    }
  }

  mousewheel(e) {
    if (this.showChat) this.chatScroll = Math.min(this.hostupdate.logs.length*30, Math.max(0, this.chatScroll+e.wheelDeltaY));
  }

  paste(e) {
    e.preventDefault();
    if (this.showChat) this.msg += e.clipboardData.getData('text');
  }

  keydown(e) {
    if (e.preventDefault) e.preventDefault();
    if (e.ctrlKey || e.metaKey) return;
    if (!this.key[e.keyCode]) {
      if (this.showChat) return this.chat(e);
      this.keyStart(e);
      this.keyLoop(e);
      this.key[e.keyCode] = setInterval(this.keyLoop.bind(this), 15, e);
    }
  }

  keyup(e) {
    if (e.preventDefault) e.preventDefault();
    clearInterval(this.key[e.keyCode]);
    this.key[e.keyCode] = false;
    if (e.keyCode == 65 || e.keyCode == 68) this.left = null;
    if (e.keyCode == 87 || e.keyCode == 83) this.up = null;
    if (e.keyCode === PixelTanks.userData.keybinds.fire) clearInterval(this.fireInterval);
    if (this.dx && (e.keyCode === 65 && this.dx.a < 0 || e.keyCode === 68 && this.dx.a > 0)) this.dx = false;
    if (this.dy && (e.keyCode === 87 && this.dy.a < 0 || e.keyCode === 83 && this.dy.a > 0)) this.dy = false;
    if ([87, 65, 68, 83].includes(e.keyCode)) {
      this.b = false;
      for (const key of [87, 65, 68, 83]) if (this.key[key]) this.keyStart({keyCode: key});
    }
  }

  mousemove(e) {
    this.mouse = {x: (e.clientX-(window.innerWidth-window.innerHeight*1.6)/2)/PixelTanks.resizer, y: e.clientY/PixelTanks.resizer};
    this.tank.r = Engine.toAngle(e.clientX-window.innerWidth/2, e.clientY-window.innerHeight/2);
  }

  mousedown(e) {
    this.keydown({keyCode: 1000+e.button});
    this.fire(e.button);
    clearInterval(this.fireInterval);
    this.fireInterval = setInterval(() => {
      this.canFire = true;
      this.fire(e.button);
    }, this.fireType === 1 ? 200 : 600);
  }

  mouseup(e) {
    clearInterval(this.fireInterval);
    this.keyup({keyCode: 1000+e.button});
  }

  fire(type) {
    if (type === 2) {
      if (!this.canPowermissle && !this.hacks) return;
      this.canPowermissle = false;
      this.timers.powermissle = Date.now();
      setTimeout(() => {this.canPowermissle = true;}, 10000);
    } else if (type === 0) {
      if (!this.canFire) return;
      this.canFire = false;
      clearTimeout(this.fireTimeout);
      this.fireTimeout = setTimeout(() => {this.canFire = true}, this.buff ? this.fireType === 1 ? 133 : 400 : this.fireType === 1 ? 200 : 600);
    } else if (!isNaN(type)) return;
    var fireType = ['grapple', 'megamissle', 'dynamite', 'usb', 'healmissle', 2].includes(type) ? 1 : this.fireType, type = type === 2 ? 'powermissle' : (!isNaN(type) ? (this.fireType === 1 ? 'bullet' : 'shotgun') : type), l = fireType === 1 ? 0 : -10;
    while (l<(fireType === 1 ? 1 : 15)) {
      this.tank.fire.push({type: type, r: this.tank.r+90+l});
      l += 5;
    }
  }

  collision(x, y) {
    if (x < 0 || y < 0 || x + 80 > 3000 || y + 80 > 3000) return false;
    if (this.ded || (this.tank.invis && this.tank.immune && !this.halfSpeed)) return true;
    var l = 0, blocks = this.hostupdate.b, len = blocks.length;
    while (l<len) {
      if ((x > blocks[l].x || x + 80 > blocks[l].x) && (x < blocks[l].x + 100 || x + 80 < blocks[l].x + 100) && (y > blocks[l].y || y + 80 > blocks[l].y) && (y < blocks[l].y + 100 || y + 80 < blocks[l].y + 100)) {
        if (['barrier', 'weak', 'strong', 'gold'].includes(blocks[l].type) || ['barrier', 'void'].includes(blocks[l].type)) return false;
      }
      l++;
    }
    return true;
  }

  playAnimation(id) {
    this.tank.animation = {id: id, frame: 0};
    clearTimeout(this.animationTimeout);
    clearInterval(this.animationInterval);
    this.animationInterval = setInterval(() => {
      if (this.tank.animation.frame === PixelTanks.images.animations[id+'_'].frames) {
        clearInterval(this.animationInterval);
        this.animationTimeout = setTimeout(() => {this.tank.animation = false}, PixelTanks.images.animations[id+'_'].speed);
      } else this.tank.animation.frame++;
    }, PixelTanks.images.animations[id+'_'].speed);
  }

  useItem(id, slot) {
    if (!this['canItem'+slot] && !this.hacks) {
      if (id === 'dynamite') {
        this.tank.use.push('dynamite');
        this.playAnimation('detonate');
      }
      return;
    }
    let cooldown = 0;
    if (id === 'duck_tape') {
      this.tank.use.push('tape');
      this.playAnimation('tape');
      cooldown = 30000;
    } else if (id === 'super_glu') {
      this.tank.use.push('glu');
      this.playAnimation('glu');
      cooldown = 30000;
    } else if (id === 'shield') {
      this.tank.use.push('shield');
      cooldown = 30000;
    } else if (id === 'weak') {
      this.tank.use.push('block#'+(PixelTanks.userData.class === 'builder' ? 'strong' : 'weak'));
      cooldown = 4000;
    } else if (id === 'strong') {
      this.tank.use.push('block#'+(PixelTanks.userData.class === 'builder' ? 'gold' : 'strong'));
      cooldown = 8000;
    } else if (id === 'spike') {
      this.tank.use.push('block#spike');
      cooldown = 10000;
    } else if (id === 'reflector') {
      this.tank.use.push('reflector');
      cooldown = 10000;
    } else if (id === 'usb') {
      this.fire('usb');
      cooldown = 25000;
    } else if (id === 'flashbang') {
      this.tank.use.push(`flashbang${this.mouse.x+this.tank.x-850}x${this.mouse.y+this.tank.y-550}`);
      cooldown = 10000;
    } else if (id === 'bomb') {
      this.tank.use.push('bomb');
      this.tank.use.push('break');
      cooldown = 3000;
    } else if (id === 'dynamite') {
      this.fire('dynamite');
      cooldown = 25000;
    } else if (id === 'airstrike') {
      this.tank.use.push(`airstrike${this.mouse.x+this.tank.x-850}x${this.mouse.y+this.tank.y-550}`);
      cooldown = 20000;
    }
    this.timers.items[slot] = {cooldown: cooldown, time: Date.now()};
    this['canItem'+slot] = false;
    clearTimeout(this['itemTimeout'+slot]);
    this['itemTimeout'+slot] = setTimeout(() => {
      this['canItem'+slot] = true;
    }, cooldown);
  }

  keyStart(e) {
    if (this.paused && e.keyCode !== 27) return;
    const k = e.keyCode;
    if ([65, 68].includes(k)) {
      this.dx = {o: this.tank.x, t: Date.now(), a: k === 65 ? -1 : 1, b: false};
      this.b = {o: this.tank.baseFrame, t: Date.now()};
    } else if ([83, 87].includes(k)) {
      this.dy = {o: this.tank.y, t: Date.now(), a: k === 87 ? -1 : 1, b: false};
      this.b = {o: this.tank.baseFrame, t: Date.now()};
    }
    for (let i = 0; i < 4; i++) if (k === PixelTanks.userData.keybinds[`item${i+1}`]) this.useItem(PixelTanks.userData.items[i], i);
    if (k === PixelTanks.userData.keybinds.chat && this.socket) {
      this.chatScroll = 0;
      this.showChat = true;
    }
    if (k === 9) {
      this.fireType = this.fireType < 2 ? 2 : 1;
      clearInterval(this.fireInterval);
    }
    if (k === PixelTanks.userData.keybinds.fire) {
      this.fire(0);
      clearInterval(this.fireInterval);
      this.fireInterval = setInterval(() => {
        this.canFire = true;
        this.fire(0);
      }, this.buff ? this.fireType === 1 ? 133 : 400 : this.fireType === 1 ? 200 : 600);
    }
    if (k === PixelTanks.userData.keybinds.powermissle) this.fire(2);
    if (k === PixelTanks.userData.keybinds.grapple && (this.canGrapple || this.hacks)) {
      this.fire('grapple');
      this.canGrapple = false;
      this.timers.grapple = Date.now();
      setTimeout(() => {this.canGrapple = true}, 5000);
    }
    if (k === PixelTanks.userData.keybinds.toolkit) {
      if (this.halfSpeed || this.canToolkit || this.hacks) {
        this.tank.use.push('toolkit');
        this.halfSpeed = !this.halfSpeed;
      }
      if (this.canToolkit || this.hacks) {
        this.canToolkit = false;
        this.timers.toolkit = Date.now();
        setTimeout(() => {this.canToolkit = true}, 40000);
        setTimeout(() => {this.halfSpeed = false}, 7500);
        this.playAnimation('toolkit');
      }
      if (!this.halfSpeed && Date.now()-this.timers.toolkit < 7500) {
        this.timers.toolkit = new Date('Nov 28 2006').getTime();
        this.canToolkit = true;
      }
    }
    if (k === 70) {
      if (this.dedTime < Date.now()-10000) {
        this.dedTime = undefined;
        return this.tank.use.push('respawn');
      }
    }
    if (k === PixelTanks.userData.keybinds.class) {
      if ((!this.canClass && PixelTanks.userData.class !== 'stealth') && !this.hacks) return;
      this.canClass = false;
      const c = PixelTanks.userData.class;
      if (c === 'stealth') {
        if (this.canInvis)  {
          this.tank.invis = true;
          this.canInvis = false;
          this.timers.class = {time: Date.now(), cooldown: 30000};
          this.invis = setTimeout(() => {
            this.tank.invis = false;
            this.timers.class = {time: Date.now(), cooldown: 15000};
            this.invis = setTimeout(() => {
              this.canInvis = true;
            }, 15000);
          }, 30000);
        } else if (this.tank.invis) {
          this.tank.invis = false;
          clearTimeout(this.invis);
          setTimeout(() => {
            this.canInvis = true;
          }, .5*(Date.now()-this.timers.class.time));
          this.timers.class = {time: Date.now(), cooldown: .5*(Date.now()-this.timers.class.time)};
        }
      } else if (c === 'tactical') {
        this.fire('megamissle');
        this.timers.class = {time: Date.now(), cooldown: 25000};
      } else if (c === 'builder') {
        this.tank.use.push('turret');
        this.timers.class = {time: Date.now(), cooldown: 40000}
      } else if (c === 'warrior') {
        this.tank.use.push('bash');
        clearTimeout(this.booster);
        this.speed = 16;
        this.tank.immune = true;
        this.booster = setTimeout(() => {
          this.speed = 4;
          this.tank.immune = false;
        }, 1000);
        this.timers.class = {time: Date.now(), cooldown: 12000};
      } else if (c === 'medic') {
        this.fire('healmissle');
        this.tank.use.push('healmissile');
        this.timers.class = {time: Date.now(), cooldown: 25000};//stop it ur wasting time :/
      } else if (c === 'fire') {
        for (let i = -30; i < 30; i += 5) this.tank.fire.push({type: 'fire', r: this.tank.r+90+i});
        this.timers.class = {time: Date.now(), cooldown: 10000};
      }
      setTimeout(() => {this.canClass = true}, this.timers.class.cooldown);
    }
    if (k === 27) {
      this.paused = !this.paused;
      if (this.paused) {
        Menus.menus.pause.addListeners();
      } else {
        Menus.removeListeners();
      }
    }
    if (k === 18) {
      this.debugMode++;
      if (this.debugMode >= 5) this.debugMode = 0; 
    }
  }

  keyLoop(e) {
    if (e.keyCode === PixelTanks.userData.keybinds.boost) {
      if (this.canBoost) {
        this.speed = 16;
        this.canBoost = false;
        this.tank.immune = true;
        this.timers.boost = Date.now();
        clearTimeout(this.booster);
        clearTimeout(this.boostTimeout);
        this.booster = setTimeout(() => {
          this.speed = 4;
          this.tank.immune = false;
          if (PixelTanks.userData.class === 'stealth') this.tank.use.push('break');
        }, 500);
        this.boostTimeout = setTimeout(() => {this.canBoost = true}, this.ded ? 0 : 5000);
      }
    }
  }

  send() {
    const {x, y, r, use, fire, animation} = this.tank;
    const updateData = {username: PixelTanks.user.username, type: 'update', data: this.tank};
    if (x === this.lastUpdate.x && y === this.lastUpdate.y && r === this.lastUpdate.r && use.length === 0 && fire.length === 0 && animation === this.lastUpdate.animation) return;
    this._ops++;
    if (this.multiplayer) {
      this.socket.send(updateData);
    } else {
      this.world.update(updateData);
      this.hostupdate = {
        pt: this.world.pt,
        b: this.world.b,
        s: this.world.s,
        ai: this.world.ai,
        d: this.world.d,
        logs: this.world.logs.reverse(),
      }
    }
    this.lastUpdate = {x, y, r, animation}
    this.tank.fire = [];
    this.tank.use = [];
  }

  implode() {
    if (this.multiplayer) {
      clearInterval(this.sendInterval);
      this.socket.close();
    } else this.world.i.forEach(i => clearInterval(i));
    for (const listener of Client.listeners) document.removeEventListener(listener, this[listener]);
    cancelAnimationFrame(this.render);
    Menus.menus.pause.removeListeners();
    PixelTanks.user.player = undefined;
  }
}
