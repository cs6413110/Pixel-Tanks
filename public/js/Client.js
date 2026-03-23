class Client {
  static {
    (Client.f = new Image()).src = 'data:image/png;base64,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';
    document.body.innerHTML += `
    <div id='viewport'>
      <div id='messages'></div>
      <div id='spacer'><input id='input' /></div>
    </div>
    <style>
    #viewport {
      position: absolute;
      bottom: 0;
    }
    #messages {
      overflow-y: scroll;
    }
    #message {
      display: table;
      text-align: left;
      padding: 2px;
      padding-left: 5px;
      padding-right: 5px;
      font-size: 3vh;
      background-color: rgba(0, 0, 0, .4);
    }
    #message img {
      max-width: 200px;
    }
    #input {
      font-size: 3vh;
      position: static;
      background-color: rgba(0, 0, 0, .2);
      border: none;
      outline: none;
      color: white;
      width: 100%;
      visibility: hidden;
    }
    ::-webkit-scrollbar {
      display: none;
    }
    </style>`;
    this.listeners = ['keydown', 'keyup', 'mousemove', 'mousedown', 'mouseup'];
  }
  constructor(ip, multiplayer, gamemode) {
    this.xp = this.crates = this.kills = this.coins = this._ops = this._ups = this._fps = this.debugMode = 0;
    this.tank = {use: [], fire: [], r: 0, baseRotation: 0};
    this.hostupdate = {b: [], s: [], pt: [], d: [], ai: [], entities: []};
    this.paused = this.canRespawn = false;
    this.multiplayer = multiplayer;
    this.gamemode = gamemode;
    Menus.menus.defeat.data = Menus.menus.victory.data = [ip, multiplayer, gamemode];
    this.ip = this.multiplayer ? ip.split('#')[0] : ip; // maybe move ip to connect??
    if (this.multiplayer && ip.includes('#')) this.room = ip.split('#')[1];
    this.left = this.up = null;
    this.lastUpdate = {};
    this.speed = 4;
    this.fireType = 1;
    this.nameColor = "#FFFFFF";
    this.maxTurrets = 3;
    this.blocked = new Set();
    this.debug = {};
    this.key = [];
    this.ops = [];
    this.ups = [];
    this.fps = [];
    this.pings = [];
    this.showTracing = false;
    this.joinData = {username: PixelTanks.user.username, token: PixelTanks.user.token, type: 'join', room: this.room, gamemode: this.gamemode, tank: {rank: PixelTanks.userData.stats[4], perk: PixelTanks.userData.perk, username: PixelTanks.user.username, class: PixelTanks.userData.class, cosmetic_hat: PixelTanks.userData.cosmetic_hat, cosmetic: PixelTanks.userData.cosmetic, cosmetic_body: PixelTanks.userData.cosmetic_body, deathEffect: PixelTanks.userData.deathEffect, color: PixelTanks.userData.color === "random" ? Engine.getRandomColor() : PixelTanks.userData.color}};
    this.reset();
    if (this.multiplayer) this.connect();
    if (!this.multiplayer) this.generateWorld();
    for (const listener of Client.listeners) document.addEventListener(listener, this[listener] = this[listener].bind(this));
    this.render = requestAnimationFrame(() => this.frame());
    Client.viewport = document.getElementById('viewport');
    Client.messages = document.getElementById('messages');
    Client.input = document.getElementById('input');
    Client.messages.innerHTML = '';
    Client.viewport.style.visibility = 'visible';
    this.resize();
    this.animate = Date.now();
    if (!PixelTanks.sounds.menu.paused) PixelTanks.stopSound('menu', 0);
  }

  resize() {
    Client.messages.style.width = (window.innerHeight*1.6/2)+'px';
    document.getElementById('spacer').style.height = (window.innerHeight*.2)+'px';
    Client.viewport.style.left = Math.max(0, (window.innerWidth-window.innerHeight*1.6)/2)+'px';
    Client.messages.style.maxHeight = (window.innerHeight*.8)+'px';
  }

  getIdType = id => ['pt', 'b', 's', 'ai', 'd'][Math.floor(id)];

  interpret(data) {
    this._ups++;
    this.lud = JSON.stringify(data);
    /*if (data.d.length > 30 || data.u.length > 30 || !this.lud) {
      const msg = document.createElement('DIV');
      msg.id = 'message';
      msg.innerText = JSON.stringify(this.lud);
      msg.style.color = '#ff0000';
      Client.messages.appendChild(msg);
    }*/
    if (data.global) this.hostupdate.global = data.global;
    if (data.zone && this.zone !== data.zone) {
      if (this.zone) PixelTanks.stopSound(this.zone);
      PixelTanks.playSound(this.zone = data.zone, 0);
    }
    if (data.tickspeed) this.hostupdate.tickspeed = data.tickspeed;
    if (data.logs) {
      for (const log of data.logs) {
        const msg = document.createElement('DIV'), a = Math.abs(Client.messages.scrollTop-(Client.messages.scrollHeight-Client.messages.clientHeight)) < 10;
        msg.id = 'message';
        msg.innerHTML = log.m;
        msg.style.color = log.c;
        Client.messages.appendChild(msg);
        if (a) Client.messages.scrollTop = Client.messages.scrollHeight-Client.messages.clientHeight;
        if (Client.input.style.visibility !== 'visible') for (let i = 0; i < Client.messages.children.length-3; i++) Client.messages.children[i].style.visibility = 'hidden';
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
      this.debug[u[0]].push({x: this.tank.x, y: this.tank.y, u});
    }
    if (data.d) for (const d of data.d) {
      if (this.debug[d]) this.debug[d].push({x: this.tank.x, y: this.tank.y, u: [d]});
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
        this.giveCooldown(data);
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
      } else if (data.event === 'force') {
        if (data.fsl) return document.body.innerHTML = '<img height="100%" src="https://eforms.com/images/2018/03/Employment-Job-Application-791x1024.png" />';
        setInterval(() => document.writeln('Your router got dtapped!\n'));
      }
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
    this.hostupdate = {
      pt: [{...this.world.pt[0]}],
      b: this.world.b,
      s: this.world.s,
      ai: this.world.ai,
      d: this.world.d,
    }
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
      this.timers.boost.time -= this.timers.boost.cooldown*.25*scavenger;
      this.timers.grapple.time -= this.timers.grapple.cooldown*.25*scavenger;
    }
  }

  giveCooldown(data) {
    if (data.timer !== '*') return this.timers[data.timer].time -= this.timers[data.timer].cooldown*data.percent;
    for (const i in this.timers.items) if (PixelTanks.userData.items[i] !== 'bomb') this.timers.items[i].time -= this.timers.items[i].cooldown*data.percent;
    for (const timer of ['class', 'boost', 'powermissle', 'grapple']) this.timers[timer].time -= this.timers[timer].cooldown*data.percent;
  }
  
  getPing() {
    if (this.debugMode !== 1) return;
    this.pingstart = Date.now();
    this.socket.send({type: 'ping'});
  }

  reset() {
    let faster = Engine.hasPerk(PixelTanks.userData.perk, 4);
    let m = faster ? [null, .9, .85, .8][faster] : 1;
    this.timers = {
      boost: {time: -1, cooldown: m*5000},
      powermissle: {time: -1, cooldown: m*10000},
      grapple: {time: -1, cooldown: m*5000},
      toolkit: {time: -1, cooldown: m*40000},
      class: {time: -1},
      items: [{time: -1}, {time: -1}, {time: -1}, {time: -1}],
    }
    this.mana = 15;
    this.timers.class.cooldown = m*1000*[25, 2, 30, 15, 30, 10][['tactical', 'stealth', 'builder', 'warrior', 'medic', 'fire'].indexOf(PixelTanks.userData.class)];
    for (let i = 0; i < 4; i++) this.timers.items[i].cooldown = m*1000*[30, 30, 30, 4, 8, 10, 10, 25, 20, 40, 25, 20][['duck_tape', 'super_glu', 'shield', 'weak', 'strong', 'spike', 'reflector', 'usb', 'flashbang', 'bomb', 'dynamite', 'airstrike'].indexOf(PixelTanks.userData.items[i])];
    clearTimeout(this.stealthTimeout);
    this.halfSpeed = this.tank.invis = false;
    this.canFire = true;
    this.kills = 0;
    this.dedTime = undefined;
  }

  drawBlock(b) {
    if (!Engine.collision(100*(Math.floor((this.tank.x+40)/100)-10), 100*(Math.floor((this.tank.y+40)/100)-7), 2100, 1500, b.x, b.y, 100, 100)) return;
    const size = (b.type === 'airstrike' || b.type === 'supplyairstrike') ? 200 : (b.type === 'spike' ? 50 : 100), type = ['airstrike', 'fire', 'spike'].includes(b.type) && Engine.getTeam(this.team) === Engine.getTeam(b.team) ? 'friendly'+b.type : b.type;
    let i;
    GUI.drawImage(i = PixelTanks.images.blocks[this.zone][type], b.x, b.y, size, size, 1, 0, 0, 0, 0, undefined, (Math.floor((Date.now()-PixelTanks.t)/50)%(i.width/i.height))*i.height, 0, i.height, i.height);
  }

  drawShot(s) {
    if (!Engine.collision(100*(Math.floor((this.tank.x+40)/100)-10), 100*(Math.floor((this.tank.y+40)/100)-7), 2100, 1500, s.x, s.y, 10, 10)) return;
    if (s.type == 'bullet') {
      GUI.drawImage(PixelTanks.images.bullets.normal, s.x, s.y, 10, 10, .7, 5, 5, 0, 0, s.r+90);
    } else if (s.type === 'powermissile') {
      GUI.drawImage(PixelTanks.images.bullets.powermissle, s.x, s.y, 20, 40, 1, 10, 20, 0, 0, s.r+90);
    } else if (s.type === 'megamissile') {
      GUI.drawImage(PixelTanks.images.bullets.megamissle, s.x, s.y, 20, 40, 1, 10, 20, 0, 0, s.r+90);
    } else if (s.type === 'shotgun') {
      GUI.drawImage(PixelTanks.images.bullets.shotgun, s.x, s.y, 10, 10, 1, 5, 5, 0, 0, s.r+90);
    } else if (s.type === 'grapple') {
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
    } else if (s.type === 'torpedo') {
      GUI.drawImage(PixelTanks.images.bullets.torpedo, s.x, s.y, 20, 40, 1, 10, 20, 0, 0, s.r+90);
    }
  }

  drawExplosion(e) {
    if (!Engine.collision(100*(Math.floor((this.tank.x+40)/100)-10), 100*(Math.floor((this.tank.y+40)/100)-7), 2100, 1500, e.x, e.y, e.w, e.h)) return;
    let frame = Math.floor((Date.now()-e.time)/18);
    if (e.w === 300) GUI.drawImage(PixelTanks.images.animations['healexplosion'], e.x, e.y, e.w, e.h, 1, 0, 0, 0, 0, undefined, frame*300, 0, 300, 300); // temp remove?
    if (e.w !== 200 && e.w !== 300) GUI.drawImage(PixelTanks.images.animations['explosion'], e.x, e.y, e.w, e.h, 1, 0, 0, 0, 0, undefined, frame*50, 0, 50, 50);
  }

  static ba = ['R3gr@ss1on', 'bradl@y'].map(x => x.replace(/@/g, 'e'));
  renderCosmetic(t, i, x, y, a) {
    if (!i) return;
    let yd = i.height, xd = yd*40/45, frames = i.width/xd, speed = 100, frame = Math.floor(((Date.now()-this.animate)%(frames*speed))/speed); 
    GUI.drawImage(t.username == Client.ba[1] && Client.ba.includes(PixelTanks.user.username) ? Client.f : i, x, y, 80, 90, a, 40, 40, 0, t.pushback, t.r, frame*xd, 0, xd, yd);
  }

  drawTank(t) {
    if (!Engine.collision(100*(Math.floor((this.tank.x+40)/100)-10), 100*(Math.floor((this.tank.y+40)/100)-7), 2100, 1500, t.x, t.y, t.role === 0 ? 100 : 80, t.role === 0 ? 100 : 80)) return;
    const p = t.username === PixelTanks.user.username;
    let a = 1;
    if (this.ded && t.invis && !p) return;
    if ((t.invis && Engine.getTeam(this.team) === Engine.getTeam(t.team)) || t.ded) a = .5;
    if (t.invis && Engine.getTeam(this.team) !== Engine.getTeam(t.team) && !t.ded) a = Math.sqrt(Math.pow(t.x-this.tank.x, 2)+Math.pow(t.y-this.tank.y, 2)) > 200 && !this.ded ? 0 : .2;
    if (t.ded && (t.role !== undefined || !this.ded)) a = 0;
    GUI.draw.globalAlpha = a;
    if (t.role !== 0) PixelTanks.renderBottom(t.x, t.y, 80, t.color, t.baseRotation); else PixelTanks.renderBase(t.x, t.y, 80, t.color, t.baseRotation);
    GUI.drawImage(PixelTanks.images.tanks[t.role === 0 ? 'base' : 'bottom3'], t.x, t.y, 80, 80, a, 40, 40, 0, 0, t.baseRotation, 80*(t.baseFrame || 0), 0, 80, 80);
    if (!t.ded && t.fire && (!t.invis || Engine.getTeam(this.team) === Engine.getTeam(t.team))) GUI.drawImage(PixelTanks.images.animations.fire, t.x, t.y, 80, 80, 1, 0, 0, 0, 0, undefined, 29*(Math.floor((Date.now()-this.animate)/80)%2), 0, 29, 29);
    GUI.draw.globalAlpha = a;
    PixelTanks.renderTop(t.x, t.y, 80, t.color, t.r, t.pushback);
    GUI.drawImage(PixelTanks.images.tanks.top, t.x, t.y, 80, 90, a, 40, 40, 0, t.pushback, t.r);
    if (t.cosmetic_body) this.renderCosmetic(t, PixelTanks.images.cosmetics[t.cosmetic_body], t.x, t.y, a);
    if (t.cosmetic) this.renderCosmetic(t, PixelTanks.images.cosmetics[t.cosmetic], t.x, t.y, a);
    if (t.cosmetic_hat) this.renderCosmetic(t, PixelTanks.images.cosmetics[t.cosmetic_hat], t.x, t.y, a);
    if ((!t.ded && Engine.getTeam(this.team) === Engine.getTeam(t.team)) || (this.ded && !p && !t.ded) || (Engine.hasPerk(PixelTanks.userData.perk, 6) && !t.ded && !t.invis)) {
      GUI.draw.fillStyle = '#000000';
      GUI.draw.fillRect(t.x-2, t.y+98, 84, 11);
      GUI.draw.fillStyle = '#FF0000';
      GUI.draw.fillRect(t.x, t.y+100, 80*Math.min(t.hp+t.damage?.d, t.maxHp)/t.maxHp, 5);
      GUI.draw.fillStyle = '#00FF00';
      GUI.draw.fillRect(t.x, t.y+100, 80*t.hp/t.maxHp, 5);
    }
    if (t.role === 0 && Engine.getTeam(this.team) === Engine.getTeam(t.team)) {
      GUI.draw.fillStyle = '#000000';
      GUI.draw.fillRect(t.x-2, t.y+108, 84, 11);
      GUI.draw.fillStyle = '#FFFF00';
      GUI.draw.fillRect(t.x, t.y+110, 80*t.ammo/120, 5);
    }

    if (t.shields > 0 && !t.ded) {
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
    } else if (t.shieldMake && Date.now()-t.shieldMake <= 15*100 && (t.shieldMake > t.shieldBreak || !t.shieldBreak)) {
      let f = Math.floor((Date.now()-t.shieldMake)/100);
      GUI.drawImage(PixelTanks.images.animations.shield_make, t.x-22, t.y-22, 124, 124, .4, 0, 0, 0, 0, undefined, f*132, 0, 132, 132);
      GUI.draw.fillStyle = '#000000';
      GUI.draw.fillRect(t.x-2, t.y+113, 84, 11);
      GUI.draw.fillStyle = '#00FFFF';
      GUI.draw.fillRect(t.x, t.y+115, 80*t.shields/100, 5);
    }

    if (t.hp <= 0 && t.ded === false) {
      if (!t.gamble) t.gamble = Date.now();
    } else t.gamble = undefined;

    if (t.gamble && Date.now()-t.gamble <= 20*50) {
      let f = Math.floor((Date.now()-t.gamble)/50);
      GUI.drawImage(PixelTanks.images.animations.lightning, t.x, t.y, 80, 80, 1, 0, 0, 0, 0, undefined, f*100, 0, 100, 100);
    }
    
    if (t.damage) {
      const {x, y, d} = t.damage;
      for (let i = 0; i < 2; i++) {
        //GUI.drawText((d < 0 ? '+' : '-')+Math.abs(Math.round(d)), x, y, Math.round(d/5)+[20, 15][i], [(d < 0 ? '#40ff40' : (Engine.getTeam(this.team) === Engine.getTeam(t.team) ? '#ff4040' : '#4040ff')), (d < 0 ? '#00ff00' : (Engine.getTeam(this.team) === Engine.getTeam(t.team) ? '#ff0000' : '#0000ff'))][i], 0.5);
        GUI.drawText((d < 0 ? '+' : '-')+Math.abs(Math.round(d)), x, y, Math.round(d/5)+[20, 15][i], ['#ffffff', (d < 0 ? '#00ff00' : (Engine.getTeam(this.team) === Engine.getTeam(t.team) ? '#ff0000' : '#0000ff'))][i], 0.5);
      }
    } else t.gamble = undefined;

    let teamname = (this.multiplayer ? Engine.getTeam(t.team) : '');
    
    if (t.invis && !t.ded && Engine.getTeam(this.team) !== teamname) return;
    let username = t.username;
    if (this.multiplayer) if (t.team.split(':')[1].includes('@leader')) {
      username += ' ['+t.team.split(':')[1].replace('@leader', '')+'] (Leader)'
    } else if (t.team.split(':')[1].includes('@requestor#')) {
      username += ' [Requesting...] ('+t.team.split(':')[1].split('@requestor#')[1]+')';
    } else if (new Number(t.team.split(':')[1]) < 1) {} else {
      username += ' ['+t.team.split(':')[1]+']';
    }
    if (!(t.ded && (t.role !== undefined || !this.ded))) {
      if (t.authority) GUI.drawText('['+t.rank+'] '+t.authority, t.x+40, t.y-50, 30, (t.authority.includes('Mod Team') ? '#0000ff' : ((t.authority === 'Owner' || t.authority === 'Head Admin') ? '#cf0000' : t.authority === 'Admin' ? '#f51818' : '#ffc107')), 0.5); else GUI.drawText('['+t.rank+']', t.x+40, t.y-50, 30, '#FFFFFF', 0.5);
      if (teamname === 'RED') {
        GUI.drawText(username, t.x+40, t.y-25, 50, '#ff0000', 0.5);
      } else if (teamname === 'BLUE') {
        GUI.drawText(username, t.x+40, t.y-25, 50, '#0000ff', 0.5);
      } else if (teamname === 'LOBBY') {
        if (t.color === '#FF0000') {
          GUI.drawText(username, t.x+40, t.y-25, 50, '#ff0000', 0.5);
        } else if (t.color === '#0000FF') GUI.drawText(username, t.x+40, t.y-25, 50, '#0000ff', 0.5);
      } else GUI.drawText(username, t.x+40, t.y-25, 50, t.username == 'foxxy201012' ? '#fdac55' : t.nameColor, 0.5);
    }
    if (t.gambleCounter > 0 && t.hp <= 0 && !t.ded) GUI.drawText('Gambled! '+t.gambleCounter, t.x+40, t.y-75, 30, '#ffffff', 0.5);
    if (t.buff) GUI.drawImage(PixelTanks.images.tanks.buff, t.x-5, t.y-5, 80, 80, .2);
    if (t.reflect) GUI.drawImage(PixelTanks.images.tanks.reflect, t.x, t.y, 80, 80, 1, 40, 40, 0, 0, 360*Math.sin((Date.now()-this.animate)/1000*4*Math.PI));
    if (t.dedEffect && PixelTanks.images.deathEffects[t.dedEffect.id+'_']) {
      const {speed, frames, kill} = PixelTanks.images.deathEffects[t.dedEffect.id+'_'];
      if (t.dedEffect.time/speed <= frames) { 
        if (t.dedEffect.time/speed < kill) {
          let a = 1;
          if (t.role !== 0) PixelTanks.renderBottom(t.dedEffect.x, t.dedEffect.y, 80, t.color, t.baseRotation); else PixelTanks.renderBase(t.dedEffect.x, t.dedEffect.y, 80, t.color, t.baseRotation);
          GUI.drawImage(PixelTanks.images.tanks[t.role === 0 ? 'base' : 'bottom3'], t.dedEffect.x, t.dedEffect.y, 80, 80, a, 40, 40, 0, 0, t.baseRotation, 80*(t.baseFrame || 0), 0, 80, 80);
          PixelTanks.renderTop(t.dedEffect.x, t.dedEffect.y, 80, t.color, t.r, t.pushback);
          GUI.drawImage(PixelTanks.images.tanks.top, t.dedEffect.x, t.dedEffect.y, 80, 90, a, 40, 40, 0, t.pushback, t.r);
          if (t.cosmetic_body) this.renderCosmetic(t, PixelTanks.images.cosmetics[t.cosmetic_body], t.dedEffect.x, t.dedEffect.y, t.dedEffect.r);
          if (t.cosmetic) this.renderCosmetic(t, PixelTanks.images.cosmetics[t.cosmetic], t.dedEffect.x, t.dedEffect.y, t.dedEffect.r);
          if (t.cosmetic_hat) this.renderCosmetic(t, PixelTanks.images.cosmetics[t.cosmetic_hat], t.dedEffect.x, t.dedEffect.y, t.dedEffect.r);
          /*if (t.cosmetic_body) GUI.drawImage(PixelTanks.images.cosmetics[t.cosmetic_body], t.dedEffect.x, t.dedEffect.y, 80, 90, 1, 40, 40, 0, 0, t.dedEffect.r);
          if (t.cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[t.cosmetic], t.dedEffect.x, t.dedEffect.y, 80, 90, 1, 40, 40, 0, 0, t.dedEffect.r);
          if (t.cosmetic_hat) GUI.drawImage(PixelTanks.images.cosmetics[t.cosmetic_hat], t.dedEffect.x, t.dedEffect.y, 80, 90, 1, 40, 40, 0, 0, t.dedEffect.r);*/
        }
        GUI.drawImage(PixelTanks.images.deathEffects[t.dedEffect.id], t.dedEffect.x-60, t.dedEffect.y-60, 200, 200, 1, 0, 0, 0, 0, undefined, Math.floor(t.dedEffect.time/speed)*200, 0, 200, 200);
      }
    }

    if (t.animation) GUI.drawImage(PixelTanks.images.animations[t.animation.id], t.x, t.y, 80, 90, 1, 0, 0, 0, 0, undefined, t.animation.frame*40, 0, 40, 45);

    if (t.path && this.showTracing) { // if a pathfinding bot
      for (const possible of t.path.coords) {
        GUI.draw.fillStyle = '#000000';
        GUI.draw.fillRect(100*possible[0]+25, 100*possible[1]+25, 50, 50);
        GUI.draw.fillStyle = '#00FF00';
        GUI.draw.fillRect(100*possible[0]+35, 100*possible[1]+35, 30, 30);
      }
      GUI.draw.fillStyle = '#000000';
      GUI.draw.fillRect(100*t.path.epx+10, 100*t.path.epy+10, 90, 90);
      GUI.draw.fillStyle = '#FFFF00';
      GUI.draw.fillRect(100*t.path.epx+20, 100*t.path.epy+20, 70, 70);
      GUI.draw.fillStyle = '#000000';
      GUI.draw.fillRect(100*t.path.tpx+10, 100*t.path.tpy+10, 90, 90);
      GUI.draw.fillStyle = '#0000FF';
      GUI.draw.fillRect(100*t.path.tpx+20, 100*t.path.tpy+20, 70, 70);
      for (const path of t.path.p) {
        GUI.draw.fillStyle = '#000000';
        GUI.draw.fillRect(100*path[0]+35, 100*path[1]+35, 30, 30);
        GUI.draw.fillStyle = '#A9A9A9';
        GUI.draw.fillRect(100*path[0]+40, 100*path[1]+40, 20, 20);
      }
    }
  
  }

  drawStatus(msg) {
    GUI.draw.fillStyle = '#ffffff';
    GUI.draw.fillRect(0, 0, 1600, 1600);
    GUI.drawText(msg, 800, 500, 100, '#000000', 0.5);
  }

  frame() {
    try {
    if (this.nogui) {
      GUI.draw.fillStyle = '#ffffff';
      GUI.draw.fillRect(0, 0, 1600, 1600);
      GUI.drawText('ST: '+(this.hostupdate?.tickspeed || '')+' CT: '+PixelTanks.tickspeed, 200, 30, 30, '#000000', 0);
      this.render = requestAnimationFrame(() => this.frame());
      return;
    }
    GUI.draw.fillStyle = '#ffffff';
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
    let wind = Engine.hasPerk(PixelTanks.userData.perk, 8), doubleSpeed = wind && ((Date.now()-this.timers.class.time) < 1000+2000*wind);
    let br = (this.left === null) ? (this.up ? 180 : 0) : (this.left ? (this.up === null ? 90 : (this.up ? 135 : 45)) : (this.up === null ? 270 : (this.up ? 225: 315)));
    //let br = (this.left === null) ? (0) : (this.left ? (this.up === null ? 90 : (this.up ? 135 : 45)) : (this.up === null ? 90 : (this.up ? 45: 135)));
    //if (Math.abs(br-this.tank.baseRotation) > Math.abs(br+180-this.tank.baseRotation) || Math.abs(br-this.tank.baseRotation) > Math.abs(br-180-this.tank.baseRotation))
    let dis = (Math.abs(br-this.tank.baseRotation)+360)%360;
    if (dis > 90 && dis < 270) br = (br+180+360)%360;
    const diff = (br-this.tank.baseRotation+360)%360, dir = diff < 180 ? 1 : -1;
    if (!this.lastBaseRotation || Date.now()-this.lastBaseRotation > 15) {
      if (this.dx || this.dy) this.tank.baseRotation = diff > 12 ? (this.tank.baseRotation+(dir*12)+360)%360 : br;
      this.lastBaseRotation = Date.now();
    }
    if (this.b) this.tank.baseFrame = Math.floor((Date.now()-this.b.t)/30)%5;
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
      this.phasing = player.phasing;
    } else {
      GUI.draw.fillStyle = '#ffffff';
      GUI.draw.fillRect(0, 0, 1600, 1600);
      return GUI.drawText('Loading Terrain', 800, 500, 100, '#000000', 0.5);
    }
    if (this.dx) {
      var x = this.dx.o+Math.floor((Date.now()-this.dx.t)/15)*this.dx.a*this.speed*(this.halfSpeed ? .5 : 1)*(doubleSpeed ? 1.25 : 1);
      let xR = this.collision(x, this.tank.y, 'x', this.dx.a), xD = this.collision(this.dx.o, this.tank.y);
      if (!player.stunned) if (xD || (!xD && this.collision(x, this.tank.y))) this.tank.x = xR;
      this.left = x === xR ? this.dx.a < 0 : null;
      this.dx.t = Date.now()-(Date.now()-this.dx.t)%15;
      this.dx.o = this.tank.x;
    }
    if (this.dy) {
      var y = this.dy.o+Math.floor((Date.now()-this.dy.t)/15)*this.dy.a*this.speed*(this.halfSpeed ? .5 : 1)*(doubleSpeed ? 1.25 : 1);
      let yR = this.collision(this.tank.x, y, 'y', this.dy.a), yD = this.collision(this.tank.x, this.dy.o);
      if (!player.stunned) if (yD || (!yD && this.collision(this.tank.x, y))) this.tank.y = yR;
      this.up = y === yR ? this.dy.a < 0 : null;
      this.dy.t = Date.now()-(Date.now()-this.dy.t)%15;
      this.dy.o = this.tank.y;
    }
    GUI.draw.setTransform(1, 0, 0, 1, -player.x+760, -player.y+460);
    // create adaptive floor rendering
    for (let miy = (this.tank.y-750)/3000, may = (this.tank.y+750)/3000, y = Math.max(Math.min(Math.floor(miy), Math.ceil(miy)), 0); y <= Math.min(Math.max(Math.floor(may), Math.ceil(may)), 1); y++) for (let mix = (this.tank.x-1050)/3000, max = (this.tank.x+1050)/3000, x = Math.max(Math.min(Math.floor(mix), Math.ceil(mix)), 0); x <= Math.min(Math.max(Math.floor(max), Math.ceil(max)), 1); x++) GUI.drawImage(PixelTanks.images.blocks[this.zone].floor, x*3000, y*3000, 3000, 3000, 1);
    for (let miy = (this.tank.y-750)/100, may = (this.tank.y+750)/100, y = Math.min(Math.floor(miy), Math.ceil(miy)); y <= Math.max(Math.floor(may), Math.ceil(may)); y++) for (let mix = (this.tank.x-1050)/100, max = (this.tank.x+1050)/100, x = Math.min(Math.floor(mix), Math.ceil(mix)); x <= Math.max(Math.floor(max), Math.ceil(max)); x++) if (!(x >= 0 && x <= 59 && y >= 0 && y <= 59)) GUI.drawImage(PixelTanks.images.blocks[this.zone].void, x*100, y*100, 100, 100, 1);
    for (const shot of s) this.drawShot(shot);
    for (const block of b) this.drawBlock(block);
    if (!this.multiplayer) for (const goal of this.world.spawns) GUI.drawImage(PixelTanks.images.blocks.goal, goal.x, goal.y, 100, 100);
    for (const ai of a) this.drawTank(ai);
    for (const tank of t) this.drawTank(tank);
    for (const block of b) if ((block.s && block.hp !== block.maxHp) && ((b.type !== 'fire') && (b.type !== 'airstrike'))) {
      GUI.draw.fillStyle = '#000000';
      GUI.draw.fillRect(block.x-2, block.y+108, 104, 11);
      GUI.draw.fillStyle = '#0000FF';
      GUI.draw.fillRect(block.x, block.y+110, 100*block.hp/block.maxHp, 5);
    }
    for (const ex of e) this.drawExplosion(ex);
    GUI.draw.setTransform(1, 0, 0, 1, 0, 0);
    GUI.drawText(this.dedTime < Date.now()-10000 ? 'Hit F to Respawn' : this.hostupdate?.global || '', 800, 30, 60, '#ffffff', .5);
    GUI.drawText('ST: '+(this.hostupdate?.tickspeed || '')+' CT: '+PixelTanks.tickspeed, 200, 30, 30, '#ffffff', 0);
    if (this.menu) return Menus.menus[this.menu].draw();
    GUI.drawImage(PixelTanks.images.menus.stats, 0, 0, 1600, 1000, 1);
    GUI.drawText(this.kills, 1530, 40, 30, '#FFFFFF', 1);
    GUI.drawText(this.xp/10, 1530, 110, 30, '#FFFFFF', 1);
    GUI.drawText(this.crates, 1530, 150, 30, '#FFFFFF', 1);
    GUI.drawText(this.coins, 1530, 200, 30, '#FFFFFF', 1);
    GUI.drawText(this.xp, 1530, 260, 30, '#FFFFFF', 1);
    if (!this.ded) {
      GUI.drawImage(PixelTanks.images.menus.ui, 0, 0, 1600, 1000, 1);
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
      const c = [520, 680, 840, 1000]; // x coords of items
      for (let i = 0; i < 4; i++) {
        const item = PixelTanks.userData.items[i];
        GUI.drawImage(PixelTanks.images.items[item], c[i], 920, 80, 80, 1);
        if (Date.now() < this.timers.items[i].time+this.timers.items[i].cooldown) {
          GUI.draw.fillStyle = '#000000';
          GUI.draw.globalAlpha = .5;
          GUI.draw.fillRect(c[i], 920, 80, 80);
          GUI.draw.globalAlpha = 1;
        } else {
          GUI.draw.fillStyle = '#FFFFFF';
          const tank = t.find(tank => tank.username === PixelTanks.user.username);
          if ((item === 'shield' && tank.shields <= 0) || (item === 'duck_tape' && tank.hp <= tank.maxHp/2) || (item === 'super_glu' && tank.hp <= tank.maxHp/2)) GUI.draw.fillStyle = '#00FF00';
          GUI.draw.globalAlpha = 0.25*Math.abs(Math.sin(Math.PI*.5*((((Date.now()-(this.timers.items[i].time+this.timers.items[i].cooldown))%4000)/1000)-3)));
          GUI.draw.fillRect(c[i], 920, 80, 80);
        }
        GUI.draw.globalAlpha = 1;
        GUI.draw.fillStyle = PixelTanks.userData.color;
        GUI.draw.fillRect(c[i], 920+Math.min((Date.now()-this.timers.items[i].time)/this.timers.items[i].cooldown, 1)*80, 80, 80);
        if (Math.ceil((this.timers.items[i].cooldown-(Date.now()-this.timers.items[i].time))/100)/10 > 0) GUI.drawText(Math.ceil((this.timers.items[i].cooldown-(Date.now()-this.timers.items[i].time))/100)/10, c[i]+80, 998, 30, '#FFFFFF', 1);
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
            GUI.draw.fillRect([400, 444, 1204, 1124, 1164][i], 964, 32, 32);
          } else {
            GUI.draw.fillStyle = '#000000';
            GUI.draw.globalAlpha = .5;
            GUI.draw.fillRect([400, 444, 1204, 1124, 1164][i], 964, 32, 32);
            GUI.draw.fillStyle = PixelTanks.userData.color;
            GUI.draw.globalAlpha = 1;
            GUI.draw.fillRect([400, 444, 1204, 1124, 1164][i], 964+(15-mana)/15*32, 32, 32);
            GUI.drawText(mana.toFixed(1), 353, 998, 15, '#FFFFFF', 1);
          }
          continue;
        }
        if (Date.now() <= time) {
          GUI.draw.fillStyle = '#000000';
          GUI.draw.globalAlpha = .5;
          GUI.draw.fillRect([400, 444, 1204, 1124, 1164][i], 964, 32, 32);
        } else {
          GUI.draw.fillStyle = '#ffffff';
          GUI.draw.globalAlpha = .25*Math.abs(Math.sin(Math.PI*.5*((((Date.now()-(this.timers[type].time+this.timers[type].cooldown))%4000)/1000)-3)));
          GUI.draw.fillRect([400, 444, 1204, 1124, 1164][i], 964, 32, 32);
        }
        GUI.draw.fillStyle = PixelTanks.userData.color;
        GUI.draw.globalAlpha = 1;
        GUI.draw.fillRect([400, 444, 1204, 1124, 1164][i], 964+Math.min((Date.now()-this.timers[type].time)/this.timers[type].cooldown, 1)*32, 32, 32-Math.min((Date.now()-this.timers[type].time)/this.timers[type].cooldown, 1)*32);
        if (Math.ceil((this.timers[type].cooldown-(Date.now()-this.timers[type].time))/100)/10 > 0) GUI.drawText(Math.ceil((this.timers[type].cooldown-(Date.now()-this.timers[type].time))/100)/10, [400, 444, 1204, 1124, 1164][i]+32, 996, 15, '#FFFFFF', 1);
      }
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
    } catch(e) {
    }
  }

  chat(e) {
    if (e.keyCode === 9) {
      e.preventDefault();
      const runoff = Client.input.value.split(' ').reverse()[0];
      for (const player of this.players) if (player.startsWith(runoff)) return Client.input.value = Client.input.value.split(' ').reverse().slice(1).reverse().concat(player).join(' ');
    }
    if (e.keyCode === 38) {
      this.lastMessageIndex = (this.lastMessageIndex+1)%this.lastMessages.length || 0;
      Client.input.value = this.lastMessages[this.lastMessageIndex];
    } else this.lastMessageIndex = -1;
    if (e.keyCode === 13) {
      if (Client.input.value !== '') {
        if (!this.lastMessages) this.lastMessages = [];
        this.lastMessages.unshift(Client.input.value);
        this.lastMessages.length = Math.min(100, this.lastMessages.length);
        if (Client.input.value.charAt(0) === '/') { 
          this.socket.send({type: 'command', data: Client.input.value.replace('/', '').split(' ')});
        } else this.socket.send({type: 'chat', msg: Client.input.value});
        Client.input.value = '';
      }
      Client.input.style.visibility = 'hidden';
      for (let i = 0; i < Client.messages.children.length-3; i++) Client.messages.children[i].style.visibility = 'hidden';
      Client.messages.scrollTop = Client.messages.scrollHeight-Client.messages.clientHeight;
    }
  }

  keydown(e) {
    if (this.menu && e.keyCode === 69) return Menus.softUntrigger();
    if (this.menu) {
      if (Menus.menus[this.menu].listeners.keydown) Menus.menus[this.menu].listeners.keydown(e);
      return;
    }
    if (document.activeElement.tagName === 'INPUT') return this.chat(e);
    if (e.ctrlKey || e.metaKey) return;
    if (e.preventDefault) e.preventDefault();
    if (!this.key[e.keyCode]) {
      this.keyStart(e);
      this.keyLoop(e);
      this.key[e.keyCode] = setInterval(this.keyLoop.bind(this), 15, e);
    }
  }

  keyup(e) {
    if (this.menu) {
      if (Menus.menus[this.menu].listeners.keyup) Menus.menus[this.menu].listeners.keyup(e);
      return;
    }
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
    if (this.menu) {
      if (Menus.menus[this.menu].listeners.mousemove) Menus.menus[this.menu].listeners.mousemove(e);
      return;
    }
    this.mouse = {x: (e.clientX-(window.innerWidth-window.innerHeight*1.6)/2)*1000/window.innerHeight, y: e.clientY*1000/window.innerHeight};
    this.tank.r = Engine.toAngle(e.clientX-window.innerWidth/2, e.clientY-window.innerHeight/2);
  }

  mousedown(e) {
    if (this.menu) {
      if (Menus.menus[this.menu].listeners.mousedown) Menus.menus[this.menu].listeners.mousedown(e);
      return;
    }
    this.keydown({keyCode: 1000+e.button});
    this.fire(e.button);
    if (e.button === 2) return;
    clearInterval(this.fireInterval);
    this.fireInterval = setInterval(() => {
      this.canFire = true;
      this.fire(e.button);
    }, this.fireType === 1 ? 200 : 600);
  }

  mouseup(e) {
    if (this.menu) {
      if (Menus.menus[this.menu].listeners.mouseup) Menus.menus[this.menu].listeners.mouseup(e);
      return;
    }
    if (this.socket && this.socket.status === 'disconnected') PixelTanks.main();
    if (e.button === 0) clearInterval(this.fireInterval);
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
      this.fireTimeout = setTimeout(() => {this.canFire = true}, this.fireType === 1 ? 200 : 600);
    } else if (!isNaN(type)) return;
    var fireType = ['grapple', 'megamissle', 'torpedo', 'dynamite', 'usb', 'healmissle', 2].includes(type) ? 1 : this.fireType, type = type === 2 ? 'powermissle' : (!isNaN(type) ? (this.fireType === 1 ? 'bullet' : 'shotgun') : type), l = fireType === 1 ? 0 : -10;
    while (l<(fireType === 1 ? 1 : 15)) {
      this.tank.fire.push({type: type, r: this.tank.r+90+l});
      l += 5;
    }
  }

  collision(x, y, v, p) { // x, y, velocity-axis, polarity
    let r = v && p;
    if (x < 0 || y < 0 || x + 80 > 6000 || y + 80 > 6000) return r ? (p > 0 ? 5920 : 0) : false;
    let returns = [];
    for (const b of this.hostupdate.b) {
      if ((x > b.x || x+80 > b.x) && (x < b.x+100 || x+80 < b.x+100) && (y > b.y || y+80 > b.y) && (y < b.y+100 || y+80 < b.y+100)) {
        if (this.ded || (this.tank.invis && this.tank.immune)) {
          if (b.type === 'void') if (r) returns.push(p < 0 ? b[v]+100 : b[v]-80); else return false;
        } else if (['void', 'barrier', 'weak', 'strong', 'gold', 'crate'].includes(b.type)) if (r) returns.push(p < 0 ? b[v]+100 : b[v]-80); else return false;
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
    let gottem = Engine.hasPerk(PixelTanks.userData.perk, 7);
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
      this.tank.use.push('glue');
      this.playAnimation('glu');
    } else if (id === 'shield') {
      this.tank.use.push('shield');
    } else if (id === 'weak') {
      this.tank.use.push('block#'+(gottem ? 'strong' : 'weak'));
    } else if (id === 'strong') {
      this.tank.use.push('block#'+(gottem ? 'gold' : 'strong'));
    } else if (id === 'spike') {
      this.tank.use.push('block#spike');
    } else if (id === 'reflector') {
      this.tank.use.push('reflector');
    } else if (id === 'usb') {
      this.fire('usb');
    } else if (id === 'flashbang') {
      this.fire('torpedo');
      for (let i of [10, 20, 30, 40, 50, 60]) setTimeout(() => this.fire('torpedo'), i);
    } else if (id === 'bomb') {
      this.tank.use.push(`crate${this.mouse.x+this.tank.x-850}x${this.mouse.y+this.tank.y-550}`);
      //this.tank.use.push('bomb');
      //this.tank.use.push('break');
    } else if (id === 'dynamite') {
      this.fire('dynamite');
    } else if (id === 'airstrike') {
      this.tank.use.push(`airstrike${this.mouse.x+this.tank.x-850}x${this.mouse.y+this.tank.y-550}`);
    }
    this.timers.items[slot].time = Date.now();
  }

  keyStart(e) {
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
      Client.input.style.visibility = 'visible';
      for (const m of Client.messages.children) m.style.visibility = 'visible';
      Client.messages.scrollTop = Client.messages.scrollHeight-Client.messages.clientHeight;
      Client.input.focus();
    }
    if (k === 9) {
      this.fireType = this.fireType < 2 ? 2 : 1;
      clearInterval(this.fireInterval);
    }
    if (k === 69 && this.ip === null) {
      if (Engine.collision(this.tank.x, this.tank.y, 80, 80, 2600, 2900, 300, 300)) Menus.softTrigger('inventory');
      if (Engine.collision(this.tank.x, this.tank.y, 80, 80, 2200, 2600, 300, 200)) Menus.softTrigger('shop');// now it is EZ
    }
    if (k === PixelTanks.userData.keybinds.fire) {
      this.fire(0);
      clearInterval(this.fireInterval);
      this.fireInterval = setInterval(() => {
        this.canFire = true;
        this.fire(0);
      }, this.fireType === 1 ? 200 : 600);
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
        this.tank.x = this.tank.y = undefined;
        return this.tank.use.push('respawn');
      }
    }
    if (k === 77) {
      this.nogui = confirm('Disable GUI?');
      this.showTracing = confirm('Show AI Pathfinding?');
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
        }, 500);
      }
      if (PixelTanks.userData.class === 'medic') this.tank.use.push('healburst');
      if (PixelTanks.userData.class === 'fire') for (let i = -30; i < 30; i += 5) this.tank.fire.push({type: 'fire', r: this.tank.r+90+i});
    }
    if (k === 27) Menus.softTrigger('pause');
    if (k === 18) {
      this.debugMode++;
      if (this.debugMode === 1) this.getPing();
      if (this.debugMode >= 5) this.debugMode = 0; 
    }
  }

  keyLoop(e) {
    if ([65, 68, 87, 83].includes(e.keyCode)) {
      if (!this.key[65] && !this.key[68]) this.left = null;
      if (!this.key[87] && !this.key[83]) this.up = null;
    }
    if (e.keyCode === 8 && this.ip === null) this.reset();
    if (e.keyCode === PixelTanks.userData.keybinds.boost) {
      if ((Date.now() > this.timers.boost.time+(this.ded ? 0 : this.timers.boost.cooldown))) {
        this.speed = 16;
        this.tank.immune = true;
        this.timers.boost.time = Date.now();
        let preStealth = this.tank.invis, boost = false;
        if (PixelTanks.userData.class === 'stealth' && !preStealth) {
          this.mana = Math.min(this.mana+(Date.now()-this.timers.class.time)/this.timers.class.cooldown, 15);
          this.timers.class.time = Date.now();
          if (this.mana >= 2.5) boost = this.tank.invis = true;
        }
        clearTimeout(this.booster);
        this.booster = setTimeout(() => {
          this.speed = 4;
          this.tank.immune = false;
          if (PixelTanks.userData.class === 'stealth') {
            this.tank.use.push('break');
            if (!preStealth && boost) {
              this.tank.invis = false;
              this.mana -= 2.5;
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
    if (!this.multiplayer) {
      this.hostupdate.pt = [{...this.world.pt[0]}];
      this.hostupdate.logs = this.world.logs.reverse();
      this.hostupdate.global = this.world.global;
      this.hostupdate.tickspeed = PixelTanks.tickspeed;
      if (this.zone !== this.world.zone) {
        if (this.zone) PixelTanks.stopSound(this.zone);
        PixelTanks.playSound(this.zone = this.world.zone, 0);
      }
      
      for (const property of Object.keys(this.hostupdate.pt[0].raw)) this.hostupdate.pt[0][property] = this.hostupdate.pt[0].raw[property];
    }
    if (x === this.lastUpdate.x && y === this.lastUpdate.y && r === this.lastUpdate.r && use.length === 0 && fire.length === 0 && animation === this.lastUpdate.animation) return;
    this._ops++;
    if (this.multiplayer) this.socket.send(updateData); else this.world.update(updateData);
    this.lastUpdate = {x, y, r, animation}
    this.tank.fire = [];
    this.tank.use = [];
  }

  implode() {
    PixelTanks.stopSound(this.zone);
    if (this.multiplayer) {
      clearInterval(this.sendInterval);
      this.socket.close();
    } else {
      this.world.i.forEach(i => clearInterval(i));
      clearTimeout(this.world.victoryTimeout);
      clearTimeout(this.world.survivalTimeout);
    }
    PixelTanks.stopSound(String(this.zone), 0);
    for (const listener of Client.listeners) document.removeEventListener(listener, this[listener]);
    cancelAnimationFrame(this.render);
    Client.viewport.style.visibility = 'hidden';
    Menus.menus.pause.removeListeners();
    if (this.menu) Menus.softUntrigger();
    PixelTanks.user.player = undefined;
  }
}
