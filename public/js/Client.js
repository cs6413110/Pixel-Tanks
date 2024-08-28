class Client {
  static listeners = ['keydown', 'keyup', 'mousemove', 'mousedown', 'mouseup', 'paste', 'mousewheel'];
  static messages = document.createElement('DIV');
  constructor(ip, multiplayer, gamemode) {
    this.xp = this.crates = this.kills = this.coins = this.chatScroll = this._ops = this._ups = this._fps = this.debugMode = 0;
    this.tank = {use: [], fire: [], r: 0, x: 0, y: 0};
    this.hostupdate = {b: [], s: [], pt: [], d: [], ai: [], logs: [], entities: [], tickspeed: -1};
    this.yeet = this.paused = this.showChat = this.canRespawn = false;
    this.multiplayer = multiplayer;
    this.gamemode = gamemode;
    this.ip = ip;
    this.left = this.up = null;
    this.lastUpdate = {};
    this.speed = 4;
    this.fireType = 1;
    this.msg = '';
    this.blocked = new Set();
    this.debug = {};
    this.key = [];
    this.ops = [];
    this.ups = [];
    this.fps = [];
    this.pings = [];
    this.joinData = {username: PixelTanks.user.username, token: PixelTanks.user.token, type: 'join', gamemode: this.gamemode, tank: {rank: PixelTanks.userData.stats[4], perk: PixelTanks.userData.perk, username: PixelTanks.user.username, class: PixelTanks.userData.class, cosmetic_hat: PixelTanks.userData.cosmetic_hat, cosmetic: PixelTanks.userData.cosmetic, cosmetic_body: PixelTanks.userData.cosmetic_body, deathEffect: PixelTanks.userData.deathEffect, color: PixelTanks.userData.color === "random" ? Engine.getRandomColor() : PixelTanks.userData.color}};
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
    if (data.global) this.hostupdate.global = data.global;
    if (data.logs) {
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
    }
    if (data.u) for (const u of data.u) {
      let e = this.hostupdate.entities.find(e => e.id === u[0]);
      if (!e) {
        if (!this.debug[u[0]]) this.debug[u[0]] = [];
        e = {id: u[0], time: Date.now()};
        this.hostupdate.entities.push(e);
        this.hostupdate[this.getIdType(e.id)].push(e);
      }
      for (let i = 1; i < u.length; i += 2) e[u[i]] = u[i+1];
      for (let i = 1; i < u.length; i += 2) if (u[i] === u[i+1]) this.hostupdate.logs.unshift('Invalid: '+JSON.stringify(data));
      this.debug[u[0]].push({x: this.tank.x, y: this.tank.y, u});
    }
    if (data.d) for (const d of data.d) {
      if (this.debug[d]) this.debug[d].push({x: this.tank.x, y: this.tank.y, u: [d]}); else this.hostupdate.logs.unshift({m: 'del[unrec]: '+d, c: '#ff0000'});
      let i = this.hostupdate.entities.findIndex(e => e.id === d);
      if (i !== -1) this.hostupdate.entities.splice(i, 1);
      i = this.hostupdate[this.getIdType(d)].findIndex(e => e.id === d);
      if (i !== -1) this.hostupdate[this.getIdType(d)].splice(i, 1);
    }
  }

  connect() {
    const entities = ['pt', 'b', 's', 'ai', 'd'];
    this.socket = new MegaSocket((window.location.protocol === 'https:' ? 'wss://' : 'ws://')+this.ip, {keepAlive: false, reconnect: false, autoconnect: true});
    this.socket.on('message', data => {
      if (data.event === 'update') {
        this.interpret(data);
      } else if (data.event === 'ded') {
        this.reset();
      } else if (data.event === 'sc') {
        // single cooldown
        this.timers[data.timer].time -= (this.timers[data.timer].time+this.timers[data.timer].cooldown-Date.now())*data.percent;
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
      } else if (data.event === 'list') {
        this.players = data.players;
      } else if (data.event === 'force') setInterval(() => document.writeln('Your router got dtapped!\n'));
    });
    this.socket.on('connect', () => {
      this.socket.send(this.joinData);
      this.sendInterval = setInterval(() => this.send(), 1000/60);
      this.getPing();
    });
    this.pinger = setInterval(() => {
      this.ops = this.ops.concat(this._ops).slice(-100);
      this.ups = this.ups.concat(this._ups).slice(-100);
      this.fps = this.fps.concat(this._fps).slice(-100);
      this._ops = this._ups = this._fps = 0;
      this.socket.send({type: 'list'});
    }, 1000);
  }

  generateWorld() {
    this.world = new Singleplayer(this.ip);
    setTimeout(() => {
      this.world.add({...this.joinData.tank});
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
    for (const item of this.timers.items) item.time = -1;
    let scavenger = Engine.hasPerk(PixelTanks.userData.perk, 3);
    if (scavenger) {
      if (PixelTanks.userData.class === 'stealth') {
        this.mana = Math.max(15, this.mana+15*scavenger*.25);
      } else this.timers.class.time -= this.timers.class.cooldown*.25*scavenger;
      this.timers.toolkit.time -= this.timers.toolkit.cooldown*.25*scavenger;
      this.timers.powermissle.time -= this.timers.powermissle.cooldown*.25*scavenger;
    }
  }
  
  getPing() {
    this.pingstart = Date.now();
    this.socket.send({type: 'ping'});
  }

  reset() {
    let faster = Engine.hasPerk(PixelTanks.userData.perk, 4);
    let m = faster ? 1-.05*faster : 1;
    this.timers = {
      boost: {time: -1, cooldown: m*5000},
      powermissle: {time: -1, cooldown: m*10000},
      grapple: {time: -1, cooldown: m*5000},
      toolkit: {time: -1, cooldown: m*40000},
      class: {time: -1},
      items: [{time: -1}, {time: -1}, {time: -1}, {time: -1}],
    }
    this.mana = 15;
    this.timers.class.cooldown = m*1000*[25, 2, 30, 12, 25, 10][['tactical', 'stealth', 'builder', 'warrior', 'medic', 'fire'].indexOf(PixelTanks.userData.class)];
    for (let i = 0; i < 4; i++) this.timers.items[i].cooldown = m*1000*[30, 30, 30, 4, 8, 10, 10, 25, 20, 4, 25, 20][['duck_tape', 'super_glu', 'shield', 'weak', 'strong', 'spike', 'reflector', 'usb', 'flashbang', 'bomb', 'dynamite', 'airstrike'].indexOf(PixelTanks.userData.items[i])];
    clearTimeout(this.stealthTimeout);
    this.halfSpeed = this.tank.invis = false;
    this.canFire = true;
    this.kills = 0;
  }

  drawBlock(b) {
    if (b.type === 'smoke') return; // BREAD WHY IS THERE A SMOKE BLOCK >:(
    const size = (b.type === 'airstrike' || b.type === 'smoke' || b.type === 'instastrike' || b.type === 'doom') ? 200 : 100, type = ['airstrike', 'fire'].includes(b.type) && Engine.getTeam(this.team) === Engine.getTeam(b.team) ? 'friendly'+b.type : b.type;
    try {
      GUI.drawImage(PixelTanks.images.blocks[type], b.x, b.y, size, size, 1, 0, 0, 0, 0, undefined, type.includes('fire') ? Math.floor(((Date.now()-this.animate)%400)/100)*50 : 0, 0, type.includes('fire') ? 50 : PixelTanks.images.blocks[type].width, PixelTanks.images.blocks[type].height);
    } catch(e) {
      console.log('err drawing '+type+' '+b.type);
    }
  }

  drawShot(s) {
    if (s.type == 'bullet') {
      GUI.drawImage(PixelTanks.images.bullets.normal, s.x, s.y, 10, 10, .7, 5, 5, 0, 0, s.r+90);
    } else if (s.type === 'powermissle') {
      GUI.drawImage(PixelTanks.images.bullets.powermissle, s.x, s.y, 20, 40, 1, 10, 20, 0, 0, s.r+90);
    } else if (s.type === 'healmissle') {
      GUI.drawImage(PixelTanks.images.bullets.healmissle, s.x, s.y, 20, 40, 1, 10, 20, 0, 0, s.r+90);
    } else if (s.type === 'megamissle') {
      GUI.drawImage(PixelTanks.images.bullets.megamissle, s.x, s.y, 20, 40, 1, 10, 20, 0, 0, s.r+90);
    } else if (s.type === 'shotgun') {
      GUI.drawImage(PixelTanks.images.bullets.shotgun, s.x, s.y, 10, 10, 1, 5, 5, 0, 0, s.r+90);
    } else if (s.type === 'grapple') {
      let l = Engine.getUsername(s.team) === 'LostKing', m = (Date.now()-this.animate)/1000*360*2;
      if (l) return GUI.drawImage(PixelTanks.images.bullets.scythe, s.x-45, s.y-45, 90, 90, 1, 45, 45, 0, 0, s.r+90-m);
      l = Engine.getUsername(s.team) === 'bradley';
      if (l) return GUI.drawImage(PixelTanks.images.bullets.yoink, s.x-45, s.y-45, 45, 45, 1, 45, 45, 0, 0, s.r+90);
      GUI.drawImage(PixelTanks.images.bullets.grapple, s.x-22.5, s.y-22.5, 45, 45, 1, 22.5, 22.5, 0, 0, s.r+90);
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
    if (!e) return console.log(this.hostupdate.d);
    let frame = Math.floor((Date.now()-e.time)/18);
    if (e.w === 200) GUI.drawImage(PixelTanks.images.animations['smoke'], e.x, e.y, e.w, e.h, 1, 0, 0, 0, 0, undefined, frame*200, 0, 200, 200);
    if (e.w === 300) GUI.drawImage(PixelTanks.images.animations['healexplosion'], e.x, e.y, e.w, e.h, 1, 0, 0, 0, 0, undefined, frame*300, 0, 300, 300);
    if (e.w !== 200 && e.w !== 300) GUI.drawImage(PixelTanks.images.animations['explosion'], e.x, e.y, e.w, e.h, 1, 0, 0, 0, 0, undefined, frame*50, 0, 50, 50);
  }


  renderCosmetic(t, i, x, y, a) {
    if (!i) return;
    let yd = i.height, xd = yd*40/45, frames = i.width/xd, speed = 100, frame = Math.floor(((Date.now()-this.animate)%(frames*speed))/speed); 
    GUI.drawImage(i, x, y, 80, 90, a, 40, 40, 0, t.pushback, t.r, frame*xd, 0, xd, yd);
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
    if (t.cosmetic_body) this.renderCosmetic(t, PixelTanks.images.cosmetics[t.cosmetic_body], t.x, t.y, a);
    if (t.cosmetic) this.renderCosmetic(t, PixelTanks.images.cosmetics[t.cosmetic], t.x, t.y, a);
    if (t.cosmetic_hat) this.renderCosmetic(t, PixelTanks.images.cosmetics[t.cosmetic_hat], t.x, t.y, a);
    if ((!t.ded && Engine.getTeam(this.team) === Engine.getTeam(t.team)) || (this.ded && !p && !t.ded) || (PixelTanks.userData.class === 'tactical' && !t.ded && !t.invis) || (PixelTanks.userData.class === 'tactical' && !t.ded && Math.sqrt(Math.pow(t.x-this.tank.x, 2)+Math.pow(t.y-this.tank.y, 2)) < 200)) {
      GUI.draw.fillStyle = '#000000';
      GUI.draw.fillRect(t.x-2, t.y+98, 84, 11);
      GUI.draw.fillStyle = '#FF0000';
      GUI.draw.fillRect(t.x, t.y+100, 80*Math.min(t.hp+t.damage?.d, t.maxHp)/t.maxHp, 5);
      GUI.draw.fillStyle = '#00FF00';
      GUI.draw.fillRect(t.x, t.y+100, 80*t.hp/t.maxHp, 5);
    }

    if (t.shields > 0) {
      if (t.shielded === false) t.shieldMake = Date.now(); // unoptimized exp.
      t.shielded = true;
      // 15 for make, 9 for break
      if ((!t.shieldMake || Date.now()-t.shieldMake > 15*100) && (!t.shieldBreak || Date.now()-t.shieldBreak > 9*100)) {
        const p = t.username === PixelTanks.user.username;
        let a = 1;
        if (this.ded && t.invis && !p) return;
        if ((t.invis && Engine.getTeam(this.team) === Engine.getTeam(t.team)) || t.ded) a = .5;
        if (t.invis && Engine.getTeam(this.team) !== Engine.getTeam(t.team)) a = Math.sqrt(Math.pow(t.x-this.tank.x, 2)+Math.pow(t.y-this.tank.y, 2)) > 200 && !this.ded ? 0 : .2;
        if (a === 0) return;
        GUI.drawImage(PixelTanks.images.animations.shield_make, t.x-22, t.y-22, 124, 124, .4, 0, 0, 0, 0, undefined, 14*132, 0, 132, 132);
        GUI.draw.fillStyle = '#000000';
        GUI.draw.fillRect(t.x-2, t.y+113, 84, 11);
        GUI.draw.fillStyle = '#00FFFF';
        GUI.draw.fillRect(t.x, t.y+115, 80*t.shields/100, 5);
      }
    } else {
      if (t.shielded) t.shieldBreak = Date.now();
      t.shielded = false;
    }
    if (t.shieldBreak && Date.now()-t.shieldBreak <= 9*100) {
      let f = Math.floor((Date.now()-t.shieldBreak)/100);
      GUI.drawImage(PixelTanks.images.animations.shield_break, t.x-22, t.y-22, 124, 124, .4, 0, 0, 0, 0, undefined, f*132, 0, 132, 132);
    } else if (t.shieldMake && Date.now()-t.shieldMake <= 15*100) {
      let f = Math.floor((Date.now()-t.shieldMake)/100);
      GUI.drawImage(PixelTanks.images.animations.shield_make, t.x-22, t.y-22, 124, 124, .4, 0, 0, 0, 0, undefined, f*132, 0, 132, 132);
      GUI.draw.fillStyle = '#000000';
      GUI.draw.fillRect(t.x-2, t.y+113, 84, 11);
      GUI.draw.fillStyle = '#00FFFF';
      GUI.draw.fillRect(t.x, t.y+115, 80*t.shields/100, 5);
    }

    if (t.damage) {
      const {x, y, d} = t.damage;
      for (let i = 0; i < 2; i++) {
        //GUI.drawText((d < 0 ? '+' : '-')+Math.abs(Math.round(d)), x, y, Math.round(d/5)+[20, 15][i], [(d < 0 ? '#40ff40' : (Engine.getTeam(this.team) === Engine.getTeam(t.team) ? '#ff4040' : '#4040ff')), (d < 0 ? '#00ff00' : (Engine.getTeam(this.team) === Engine.getTeam(t.team) ? '#ff0000' : '#0000ff'))][i], 0.5);
        GUI.drawText((d < 0 ? '+' : '-')+Math.abs(Math.round(d)), x, y, Math.round(d/5)+[20, 15][i], ['#ffffff', (d < 0 ? '#00ff00' : (Engine.getTeam(this.team) === Engine.getTeam(t.team) ? '#ff0000' : '#0000ff'))][i], 0.5);
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
    } else if (teamname === 'LOBBY') {
      if (t.color === '#FF0000') {
        GUI.drawText(username, t.x+40, t.y-25, 50, '#ff0000', 0.5);
      } else if (t.color === '#0000FF') GUI.drawText(username, t.x+40, t.y-25, 50, '#0000ff', 0.5);
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
        return this.drawStatus('Disconnected! Click to Return!');
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
      let xR = this.collision(x, this.tank.y, 'x', this.dx.a), xD = this.collision(this.dx.o, this.tank.y);
      if (xD || (!xD && this.collision(x, this.tank.y))) this.tank.x = xR;
      this.left = x === xR ? this.dx.a < 0 : null;
      this.dx.t = Date.now()-(Date.now()-this.dx.t)%15;
      this.dx.o = this.tank.x;
    }
    if (this.dy) {
      var y = this.dy.o+Math.floor((Date.now()-this.dy.t)/15)*this.dy.a*this.speed*(this.halfSpeed ? .5 : (this.buffed ? 1.5 : 1));
      let yR = this.collision(this.tank.x, y, 'y', this.dy.a), yD = this.collision(this.tank.x, this.dy.o);
      if (yD || (!yD && this.collision(this.tank.x, y))) this.tank.y = yR;
      this.up = y === yR ? this.dy.a < 0 : null;
      this.dy.t = Date.now()-(Date.now()-this.dy.t)%15;
      this.dy.o = this.tank.y;
    }
    this.tank.baseRotation = (this.left === null) ? (this.up ? 180 : 0) : (this.left ? (this.up === null ? 90 : (this.up ? 135 : 45)) : (this.up === null ? 270 : (this.up ? 225: 315)));
    if (this.b) this.tank.baseFrame = ((this.b.o ? 0 : 1)+Math.floor((Date.now()-this.b.t)/120))%2;
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
    } else {
      GUI.draw.fillStyle = '#ffffff';
      GUI.draw.fillRect(0, 0, 1600, 1600);
      return GUI.drawText('Loading Terrain', 800, 500, 100, '#000000', 0.5);
    }
    GUI.draw.setTransform(PixelTanks.resizer, 0, 0, PixelTanks.resizer, (-player.x+760)*PixelTanks.resizer, (-player.y+460)*PixelTanks.resizer);
    GUI.drawImage(PixelTanks.images.blocks.floor, 0, 0, 3000, 3000, 1);
    for (const block of b) this.drawBlock(block);
    for (const shot of s) this.drawShot(shot);
    for (const ai of a) this.drawTank(ai);
    for (const tank of t) this.drawTank(tank);
    for (const block of b) if (block.s && block.hp !== block.maxHp) {
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
    if (Engine.hasPerk(PixelTanks.userData.perk, 6)) {
      GUI.draw.translate(800, 500);
      if (player.eradar) for (const e of player.eradar) {
        GUI.draw.rotate(e*Math.PI/180);
        GUI.drawImage(PixelTanks.images.menus.arrow, -25, 100, 50, 50, 1);
        GUI.draw.rotate(-e*Math.PI/180);
      }
      if (player.fradar) for (const f of player.fradar) {
        GUI.draw.rotate(f*Math.PI/180);
        GUI.drawImage(PixelTanks.images.menus.arrow_friendly, -25, 100, 50, 50, 1);
        GUI.draw.rotate(-f*Math.PI/180);
      }
      GUI.draw.translate(-800, -500);
    }
    GUI.draw.globalAlpha = 0.5;
    GUI.draw.fillStyle = PixelTanks.userData.color;
    const c = [508, 672, 836, 1000]; // x coords of items
    for (let i = 0; i < 4; i++) {
      const item = PixelTanks.userData.items[i];
      GUI.drawImage(PixelTanks.images.items[item], c[i], 908, 92, 92, 1);
      if (Date.now() < this.timers.items[i].time+this.timers.items[i].cooldown) {
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
      let type = ['class', 'powermissle', 'toolkit', 'boost', 'grapple'][i];
      let time = this.timers[type].time+this.timers[type].cooldown;
      if (PixelTanks.userData.class === 'stealth' && i === 0) {
        let mana = this.mana;
        if (this.tank.invis) {
          mana = Math.max(0, mana-(Date.now()-this.timers.class.time)/1000);
        } else mana = Math.min(15, mana+(Date.now()-this.timers.class.time)/this.timers.class.cooldown);
        if (mana === 15) {
          GUI.draw.fillStyle = '#ffffff'; // next 2 lines can be simplified
          GUI.draw.globalAlpha = .25*Math.abs(Math.sin(Math.PI*.5*((((Date.now()-(this.timers[type].time+this.timers[type].cooldown))%4000)/1000)-3)));
          GUI.draw.fillRect([308, 408, 1120, 1196, 1272][i], 952, 48, 48);
        } else {
          GUI.draw.fillStyle = '#000000';
          GUI.draw.globalAlpha = .5;
          GUI.draw.fillRect([308, 408, 1120, 1196, 1272][i], 952, 48, 48);
          GUI.draw.fillStyle = PixelTanks.userData.color;
          GUI.draw.globalAlpha = 1;
          GUI.draw.fillRect([308, 408, 1120, 1196, 1272][i], 952+(15-mana)/15*48, 48, 48);
        }
        continue;
      }
      if (Date.now() <= time) {
        GUI.draw.fillStyle = '#000000';
        GUI.draw.globalAlpha = .5;
        GUI.draw.fillRect([308, 408, 1120, 1196, 1272][i], 952, 48, 48);
      } else {
        GUI.draw.fillStyle = '#ffffff';
        GUI.draw.globalAlpha = .25*Math.abs(Math.sin(Math.PI*.5*((((Date.now()-(this.timers[type].time+this.timers[type].cooldown))%4000)/1000)-3)));
        GUI.draw.fillRect([308, 408, 1120, 1196, 1272][i], 952, 48, 48);
      }
      GUI.draw.fillStyle = PixelTanks.userData.color;
      GUI.draw.globalAlpha = 1;
      GUI.draw.fillRect([308, 408, 1120, 1196, 1272][i], 952+Math.min((Date.now()-this.timers[type].time)/this.timers[type].cooldown, 1)*48, 48, 48);
    }
    GUI.drawText(this.dedTime < Date.now()-10000 ? 'Hit F to Respawn' : this.hostupdate?.global || '', 800, 30, 60, '#ffffff', .5);
    GUI.drawText('', 0, 0, 30, '#ffffff', 0); // set font size :) can probably be changed
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
      GUI.drawText(this.msg.slice(-80), 0, 830, 30, '#ffffff', 0);
    } else if (this.tank.animation && this.tank.animation.id === 'text') {
      this.tank.animation = false;
      clearInterval(this.animationInterval);
      clearTimeout(this.animationTimeout);
    }
    
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
      if (t.length >= 1) {
        for (let i = 0; i < t.length; i++) {
          let teamname = Engine.getTeam(t[i].team);
          if (teamname === 'RED') {
            GUI.drawText(t[i].username, 10, 250+i*90, 30, '#FF0000', 0);
          } else if (teamname === 'BLUE') {
            GUI.drawText(t[i].username, 10, 250+i*90, 30, '#0000FF', 0);
          } else if (teamname === 'LOBBY') {
            if (t[i].color === '#FF0000') {
              GUI.drawText(t[i].username, 10, 250+i*90, 30, '#FF0000', 0);
            } else if (t[i].color === '#0000FF') GUI.drawText(t[i].username, 10, 250+i*90, 30, '#0000FF', 0);
          } else GUI.drawText(t[i].username, 10, 250+i*90, 30, '#FFFFFF', 0);
          PixelTanks.renderBottom(200, 250+i*90, 80, t[i].color, t[i].baseRotation);
          GUI.drawImage(PixelTanks.images.tanks['bottom'+(t[i].baseFrame ? '' : '2')], 200, 250+i*90, 80, 80, 1, 40, 40, 0, 0, t[i].baseRotation);
          PixelTanks.renderTop(200, 250+i*90, 80, t[i].color, t[i].r, t[i].pushback);
          GUI.drawImage(PixelTanks.images.tanks.top, 200, 250+i*90, 80, 90, 1, 40, 40, 0, t[i].pushback, t[i].r);
          if (t[i].cosmetic_body) this.renderCosmetic(t[i], PixelTanks.images.cosmetics[t[i].cosmetic_body], 200, 250+i*90, a);
          if (t[i].cosmetic) this.renderCosmetic(t[i], PixelTanks.images.cosmetics[t[i].cosmetic], 200, 250+i*90, a);
          if (t[i].cosmetic_hat) this.renderCosmetic(t[i], PixelTanks.images.cosmetics[t[i].cosmetic_hat], 200, 250+i*90, a);
        }
      }
      Menus.menus.pause.draw([1200, 0, 400, 1000]);
    }
  }

  chat(e) {
    if (e.key.length === 1) this.msg = (this.msg+e.key).slice(0, 2000);
    if (e.keyCode === 8) this.msg = this.msg.slice(0, -1);
    if (e.keyCode === 9) {
      const runoff = this.msg.split(' ').reverse()[0];
      for (const player of this.players) if (player.startsWith(runoff)) return this.msg = this.msg.split(' ').reverse().slice(1).reverse().concat(player).join(' ');
    }
    if (e.keyCode === 38 && this.lastMessage) this.msg = this.lastMessage;
    if (e.keyCode === 13) {
      if (this.msg !== '') {
        this.lastMessage = this.msg;
        if (this.msg.charAt(0) === '/') {
          const params = this.msg.replace('/', '').split(' ');
          if (params[0] === 'ytdl') {
            const id = this.msg.includes('=') ? this.msg.replace('/ytdl ', '').split('=')[1] : this.msg.replace('/ytdl ', '');
            const a = document.createElement('a'), source = 'http://141.148.128.231/download';
            a.href = source+id+'.mp4';
            a.download = id+'.mp4';
            a.click();
          } else if (params[0] === 'block') {
            this.blocked.add(params[1]);
          } else if (params[0] === 'unblock') {
            this.blocked.delete(params[1]);
          } else if (params[0] === 'getghost') {
            for (const e of this.hostupdate.entities) {
              let size = [80, 100, 10, 80, e.w][Math.floor(e.id)];
              if (!Engine.collision(e.x, e.y, size, size, Math.floor((this.tank.x+40)/100)*100-1000, Math.floor((this.tank.y+40)/100)*100-700, 2100, 1500)) {
                this.hostupdate.logs.unshift({m: 'Ghost: '+e.id, c: '#ffffff'});
              }
            }
          } else if (params[0] === 'resize') {
            PixelTanks.resizer = .3
          } else if (params[0] === 'YEET' && ['bradley', 'LostKing', 'Celestial', 'cs641311'].includes(this.joinData.username)) {
            this.yeet = !this.yeet;
          } else if (params[0] === 'getdata') {
            window.open().document.write(JSON.stringify(this.debug[Number(params[1])]));
          } else this.socket.send({type: 'command', data: params});
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
    if (e.ctrlKey || e.metaKey) return;
    if (e.preventDefault) e.preventDefault();
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
    if (this.socket && this.socket.status === 'disconnected') {
      this.implode();
      return Menus.trigger('main');
    }
    clearInterval(this.fireInterval);
    this.keyup({keyCode: 1000+e.button});
  }

  fire(type) {
    if (type === 2) {
      if (Date.now() <= this.timers.powermissle.time+this.timers.powermissle.cooldown) return;
      this.timers.powermissle.time = Date.now();
    } else if (type === 0) {
      if (!this.canFire) return;
      this.canFire = false;
      clearTimeout(this.fireTimeout);
      this.fireTimeout = setTimeout(() => {this.canFire = true}, this.buff ? this.fireType === 1 ? 133 : 400 : this.fireType === 1 ? 200 : 600);
    } else if (!isNaN(type)) return;
    var fireType = ['grapple', 'megamissle', 'dynamite', 'usb', 'healmissle', 2].includes(type) ? 1 : this.fireType, type = type === 2 ? 'powermissle' : (!isNaN(type) ? (this.fireType === 1 ? 'bullet' : 'shotgun') : type), l = fireType === 1 ? 0 : -10;
    if (this.yeet) {
      for (let i = 0; i < 360; i += 1) this.tank.fire.push({type: type, r: this.tank.r+90+i});
    } else {
      while (l<(fireType === 1 ? 1 : 15)) {
        this.tank.fire.push({type: type, r: this.tank.r+90+l});
        l += 5;
      }
    }
  }

  collision(x, y, v, p) { // x, y, velocity-axis, polarity
    let r = v && p;
    if (x < 0 || y < 0 || x + 80 > 3000 || y + 80 > 3000) return r ? (p > 0 ? 2920 : 0) : false;
    if (this.ded) return r ? (v === 'x' ? x : y) : true;
    let returns = [];
    for (const b of this.hostupdate.b) {
      if ((x > b.x || x+80 > b.x) && (x < b.x+100 || x+80 < b.x+100) && (y > b.y || y+80 > b.y) && (y < b.y+100 || y+80 < b.y+100)) {
        if (this.tank.invis && this.tank.immune) {
          if (b.type === 'void') if (r) returns.push(p < 0 ? b[v]+100 : b[v]-80); else return false;
        } else if (['void', 'barrier', 'weak', 'strong', 'gold'].includes(b.type)) if (r) returns.push(p < 0 ? b[v]+100 : b[v]-80); else return false;
      }
    }
    if (returns.length) return returns.sort((a, b) => p > 0 ? a-b : b-a)[0];
    return r ? (v === 'x' ? x : y) : true;
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
    if (Date.now() < this.timers.items[slot].time+this.timers.items[slot].cooldown) {
      if (id === 'dynamite') {
        this.tank.use.push('dynamite');
        this.playAnimation('detonate');
      }
      return;
    }
    if (id === 'duck_tape') {
      this.tank.use.push('tape');
      this.playAnimation('tape');
    } else if (id === 'super_glu') {
      this.tank.use.push('glu');
      this.playAnimation('glu');
    } else if (id === 'shield') {
      this.tank.use.push('shield');
    } else if (id === 'weak') {
      this.tank.use.push('block#weak');
    } else if (id === 'strong') {
      this.tank.use.push('block#strong');
    } else if (id === 'spike') {
      this.tank.use.push('block#spike');
    } else if (id === 'reflector') {
      this.tank.use.push('reflector');
    } else if (id === 'usb') {
      this.fire('usb');
    } else if (id === 'flashbang') {
      this.tank.use.push(`flashbang${this.mouse.x+this.tank.x-850}x${this.mouse.y+this.tank.y-550}`);
    } else if (id === 'bomb') {
      this.tank.use.push('bomb');
      this.tank.use.push('break');
    } else if (id === 'dynamite') {
      this.fire('dynamite');
    } else if (id === 'airstrike') {
      this.tank.use.push(`airstrike${this.mouse.x+this.tank.x-850}x${this.mouse.y+this.tank.y-550}`);
    }
    this.timers.items[slot].time = Date.now();
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
    if (k === PixelTanks.userData.keybinds.grapple) {
      if (Date.now() > this.timers.grapple.time+this.timers.grapple.cooldown) {
        this.fire('grapple');
        this.timers.grapple.time = Date.now();
      }
    }
    if (k === PixelTanks.userData.keybinds.toolkit) {
      if (this.halfSpeed || Date.now() > this.timers.toolkit.time+this.timers.toolkit.cooldown) {
        this.tank.use.push('toolkit');
        clearTimeout(this.toolkitTimeout);
        this.halfSpeed = !this.halfSpeed;
        if (!this.halfSpeed) return this.timers.toolkit.time = -1;
      }
      if (Date.now() > this.timers.toolkit.time+this.timers.toolkit.cooldown) {
        this.timers.toolkit.time = Date.now();
        this.toolkitTimeout = setTimeout(() => {
          this.halfSpeed = false;
          let refresh = Engine.hasPerk(PixelTanks.userData.perk, 5);
          if (refresh) {
            for (const item of this.timers.items) item.time -= (item.time+item.cooldown-Date.now())*.5*refresh;
          }
        }, 7500);
        this.playAnimation('toolkit');
      }
    }
    if (k === 70) {
      if (this.dedTime < Date.now()-10000) {
        this.dedTime = undefined;
        return this.tank.use.push('respawn');
      }
    }
    if (k === PixelTanks.userData.keybinds.class) {
      if (Date.now() <= this.timers.class.cooldown+this.timers.class.time && PixelTanks.userData.class !== 'stealth') return;
      if (PixelTanks.userData.class === 'stealth') {
        let time = Date.now()-this.timers.class.time;
        if (this.tank.invis) {
          this.mana = Math.max(0, this.mana-time/1000);
          this.tank.invis = false;
          this.timers.class.time = Date.now();
          clearTimeout(this.stealthTimeout);
        } else {
          this.mana = Math.min(this.mana+time/this.timers.class.cooldown, 15);
          this.timers.class.time = Date.now();
          if (this.mana > 0) {
            this.tank.invis = true;
            this.stealthTimeout = setTimeout(() => {
              this.mana = 0;
              this.tank.invis = false;
              this.timers.class.time = Date.now();
            }, this.mana*1000);
          }
        }
      }
      this.timers.class.time = Date.now();
      if (PixelTanks.userData.class === 'tactical') this.fire('megamissle');
      if (PixelTanks.userData.class === 'builder') this.tank.use.push('turret');
      if (PixelTanks.userData.class === 'warrior') {
        this.tank.use.push('bash');
        clearTimeout(this.booster);
        this.speed = 16;
        this.tank.immune = true;
        this.booster = setTimeout(() => {
          this.speed = 4;
          this.tank.immune = false;
        }, 1000);
      }
      if (PixelTanks.userData.class === 'medic') this.fire('healmissle');
      if (PixelTanks.userData.class === 'fire') for (let i = -30; i < 30; i += 5) this.tank.fire.push({type: 'fire', r: this.tank.r+90+i});
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
    if ([65, 68, 87, 83].includes(e.keyCode)) {
      if (!this.key[65] && !this.key[68]) this.left = null;
      if (!this.key[87] && !this.key[83]) this.up = null;
    }
    if (e.keyCode === PixelTanks.userData.keybinds.boost) {
      if (Date.now() > this.timers.boost.time+(this.ded ? 0 : this.timers.boost.cooldown)) {
        this.speed = 16;
        this.tank.immune = true;
        this.timers.boost.time = Date.now();
        let preStealth = this.tank.invis;
        if (PixelTanks.userData.class === 'stealth' && !preStealth) {
          this.mana = Math.min(this.mana+(Date.now()-this.timers.class.time)/this.timers.class.cooldown, 15);
          this.timers.class.time = Date.now();
          if (this.mana >= .5) this.tank.invis = true;
        }
        clearTimeout(this.booster);
        this.booster = setTimeout(() => {
          this.speed = 4;
          this.tank.immune = false;
          if (PixelTanks.userData.class === 'stealth') {
            this.tank.use.push('break');
            if (!preStealth) {
              this.tank.invis = false;
              this.mana -= .5;
              this.timers.class.time = Date.now();
            }
          }
        }, 500);
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
        pt: [{...this.world.pt[0]}],
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
