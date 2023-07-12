const json = document.createElement('SCRIPT');
json.src = 'https://cs6413110.github.io/Pixel-Tanks/public/js/json.js';
json.onload = () => {
  const engine = document.createElement('SCRIPT');
  engine.src = 'https://cs6413110.github.io/Pixel-Tanks/public/js/engine.js';
  engine.onload = game();
}
document.head.appendChild(json);
const game = () => {
  class MegaSocket {
    constructor(url, options) {
      this.url = url;
      this.options = {};
      this.callstack = {open: [], close: [], message: []};
      const {keepAlive = true, autoconnect = true, reconnect = false} = options;

      this.options.keepAlive = keepAlive;
      this.options.autoconnect = autoconnect;
      this.options.reconnect = reconnect;
      if (this.options.autoconnect) {
        this.status = 'connecting';
        this.connect();
      } else {
        this.status = 'idle';
        window.addEventListener('offline', () => {
          this.socket.close();
          this.socket.onclose();
        });
        if (this.options.reconnect) window.addEventListener('online', this.connect.bind(this));
      }
    }

    connect() {
      this.socket = new WebSocket(this.url);
      this.socket.onopen = () => {
        this.status = 'connected';
        if (this.options.keepAlive) this.socket.keepAlive = setInterval(() => {
          this.socket.send('|');
        }, 50000);
        this.callstack.open.forEach(f => f());
      }
      this.socket.onmessage = data => {
        try {
          data = window.jsonpack.unpack(A.de(data.data));
        } catch(e) {
          alert('Socket Encryption Error: ' + A.de(data.data));
        }
        if (data.status === 'error') return alert(data.message);
        this.callstack.message.forEach(f => f(data));
      }
      this.socket.onclose = e => {
        clearInterval(this.socket.keepAlive);
        this.status = 'disconnected';
        this.callstack.close.forEach(f => f());
        if (this.options.reconnect) this.connect();
      }
    }

    on(event, operation) {
      if (event === 'connect') this.callstack.open.push(operation);
      if (event === 'message') this.callstack.message.push(operation);
      if (event === 'close') this.callstack.close.push(operation);
    }
    no(event) {
      if (event === 'connect') this.callstack.open = [];
      if (event === 'message') this.callstack.message = [];
      if (event === 'close') this.callstack.close = [];
    }
    send(data) {
      this.socket.send(A.en(window.jsonpack.pack(data)));
    }
    close() {
      this.socket.close();
    }
  }

  class A {
    static each(arr, func, filter, param) {
      var l = 0;
      while (l<arr.length) {
        if ((filter === undefined || filter === null) ? true : (arr[l][filter.key] === filter.value)) {
          var r = undefined;
          if (typeof func === 'string') {
            r = arr[l][func](param);
          } else {
            r = func.bind(arr[l])({ ...param, i: l });
          }
          if (r !== undefined) return r;
        }
        l++;
      }
    }

    static search(arr, filter) {
      var l = 0;
      while (l<arr.length) {
        if (arr[l][filter.key] === filter.value) {
          return arr[l];
        }
        l++;
      }
    }

    static collider(rect1, rect2) {
      if ((rect1.x > rect2.x || rect1.x+rect1.w > rect2.x) && (rect1.x < rect2.x+rect2.w || rect1.x+rect1.w < rect2.x+rect2.w) && (rect1.y > rect2.y || rect1.y+rect1.h > rect2.y) && (rect1.y < rect2.y+rect2.h || rect1.y+rect1.h < rect2.y+rect2.h)) return true;
      return false;
    }

    static assign(obj, keys, values) {
      A.each(keys, function(d) {obj[this] = d.values[d.i]}, null, {values: values});
    }

    static en(c) {var x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")}

    static de(b) {var a,e={},d=b.split(""),c=d[0],f=d[0],g=[c],h=256,o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")}
  }

  class Menu {
    constructor(data, id) {
      const {buttons, listeners, cdraw} = data;
      this.id = id;
      this.buttons = buttons;
      this.listeners = listeners;
      this.cdraw = cdraw.bind(this);
      this.listeners.click = this.onclick;
      for (const l in this.listeners) this.listeners[l] = this.listeners[l].bind(this);
      for (const b of this.buttons) {
        if (typeof b[4] === 'function') b[4] = b[4].bind(this);
        b[6] = 0;
      }
    }
    
    addListeners() {
      for (const l in this.listeners) window.addEventListener(l, this.listeners[l]);
    }
    
    removeListeners() {
      for (const l in this.listeners) window.removeEventListener(l, this.listeners[l]);
    }
    
    onclick() {
      for (const b of this.buttons) {
        if (A.collider({x: Menus.x, y: Menus.y, w: 0, h: 0}, {x: b[0], y: b[1], w: b[2], h: b[3]})) {
          if (typeof b[4] === 'function') {
            return b[4]();
          } else return Menus.trigger(b[4]);
        }
      }
    }
    
    draw() {
      if (PixelTanks.images.menus[this.id]) GUI.drawImage(PixelTanks.images.menus[this.id], 0, 0, 1600, 1000, 1);
      this.cdraw();
      for (const b of this.buttons) {
        if (b[5]) {
          if (A.collider({x: b[0], y: b[1], w: b[2], h: b[3]}, {x: Menus.x, y: Menus.y, w: 0, h: 0})) {
            b[6] = Math.min(b[6]+1, 10);
          } else {
            b[6] = Math.max(b[6]-1, 0);
          }
        }
        
        Menus.scaler.width = b[2]*PixelTanks.resizer;
        Menus.scaler.height = b[3]*PixelTanks.resizer;
        Menus.scaler.getContext('2d').setTransform(1, 0, 0, 1, -b[0]*PixelTanks.resizer, -b[1]*PixelTanks.resizer);
        Menus.scaler.getContext('2d').drawImage(GUI.canvas, 0, 0);
        GUI.drawImage(Menus.scaler, (b[0]-b[6]), (b[1]-b[6]), (b[2]+b[6]*2), (b[3]+b[6]*2), 1);
      }
    }
  }
    
  class Menus {
    static start() {
      Menus.renderer = requestAnimationFrame(Menus.render);
      window.addEventListener('mousemove', Menus.mouseLog);
    }
  
    static render() {
      requestAnimationFrame(Menus.render);
      Menus.redraw();
    }
  
    static mouseLog(e) {
      Menus.x = (e.clientX-(window.innerWidth-window.innerHeight*1.6)/2)/PixelTanks.resizer;
      Menus.y = e.clientY/PixelTanks.resizer;
    }
  
    static stop() {
      cancelAnimationFrame(Menus.renderer);
      window.removeEventListener('mousemove', Menus.mouseLog);
    }
  
    static trigger(name) {
      if (Menus.current) Menus.menus[Menus.current].removeListeners();
      if (!Menus.renderer) Menus.start();
      Menus.current = name;
      Menus.menus[Menus.current].addListeners();
    }
  
    static redraw() {
      if (!Menus.current) return;
      GUI.clear();
      Menus.menus[Menus.current].draw();
    }
  
    static removeListeners() {
      Menus.stop();
      Menus.menus[Menus.current].removeListeners();
    }
  }

  class Network {
    static get(callback) {
      const {username, token} = PixelTanks.user;
      PixelTanks.socket.send({op: 'database', type: 'get', username, token});
      PixelTanks.socket.on('message', data => {
        if (data.status === 'success' && data.type === 'get') {
          PixelTanks.socket.no('message');
          callback(data.data);
        }
      });
    }

    static update(key, value) {
      const {username, token} = PixelTanks.user;
      PixelTanks.socket.send({op: 'database', type: 'set', username, token, key, value});
      PixelTanks.socket.on('message', data => {
        if (data.success) PixelTanks.socket.no('message');
      });
    }

    static auth(username, password, type, callback) {
      PixelTanks.socket.send({op: 'auth', type, username, password});
      PixelTanks.socket.on('message', data => {
        if (data.status === 'success') {
          PixelTanks.socket.no('message');
          PixelTanks.user.username = username;
          PixelTanks.user.token = data.token;
          callback();
        }
      });
    }
  }

  class Loader {

    static loadImage(source, t, i) {
      this.total++;
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        image.onload = () => {
          this.loaded++;
          PixelTanks.updateBootProgress(Math.round(this.loaded/this.total*100)/100);
          resolve(image);
        }
        image.onerror = () => reject(new Error(`Failed to load image: ${source}`));
        image.src = `https://cs6413110.github.io/Pixel-Tanks/public/images${source}.png`;
        this.key[t][i] = image;
      });
    }
  
    static async loadImages(key) {
      Loader.key = key;
      Loader.loaded = 0;
      Loader.total = 0;
      const promises = [];
      for (const t in key) {
        for (const i in key[t]) {
          if (!i.endsWith('_')) promises.push(this.loadImage(key[t][i], t, i));
        }
      }
      await Promise.all(promises);
      PixelTanks.launch();
    }
  
  }

  class GUI {
    
    static resize() {
      PixelTanks.resizer = window.innerHeight/1000;
      GUI.canvas.height = window.innerHeight;
      GUI.canvas.width = window.innerHeight*1.6;
      GUI.draw.setTransform(PixelTanks.resizer, 0, 0, PixelTanks.resizer, 0, 0);
      Menus.redraw();
    }

    static drawImage(image, x, y, w, h, t, px, py, bx, by, a, cx, cy, cw, ch) {
      if (a) {
        GUI.draw.translate(x+px, y+py);
        GUI.draw.rotate(a*Math.PI/180);
      }
      GUI.draw.globalAlpha = t;
      if (cx || cy || cy || ch) {
        GUI.draw.drawImage(image, cx, cy, cw, ch, x, y, w, h);
      } else {
        GUI.draw.drawImage(image, a ? -px+bx : x, a ? -py+by : y, w, h);
      }
      GUI.draw.globalAlpha = 1;
      if (a) {
        GUI.draw.rotate(-a*Math.PI/180);
        GUI.draw.translate(-x-px, -y-py);
      }
    }

    static drawText(message, x, y, size, color, anchor) {
      GUI.draw.font = `${size}px Font`;
      GUI.draw.fillStyle = color;
      GUI.draw.fillText(message, x-GUI.draw.measureText(message).width*anchor, y+size*.8*(1-anchor));
    }

    static clear() {
      GUI.draw.clearRect(-10000, -10000, 20000, 20000);
    }
  }

  class PixelTanks {

    static start() {
      PixelTanks.setup();
      PixelTanks.boot();
    }

    static setup() {
      document.body.innerHTML += `
      <style>
        html, body {
          margin: 0;
          max-height: 100vh;
          max-width: 100vw;
          padding: 0;
          overflow: hidden;
          text-align: center;
        }
        canvas {
          display: inline;
        }
        @font-face {
          font-family: 'Font';
          src: url('https://cs6413110.github.io/Pixel-Tanks/public/fonts/PixelOperator.ttf') format('truetype');
        }
      </style>`;
      Menus.scaler = document.createElement('CANVAS');
      GUI.canvas = document.createElement('CANVAS');
      GUI.draw = GUI.canvas.getContext('2d');
      document.body.appendChild(GUI.canvas);
      PixelTanks.resizer = window.innerHeight/1000;
      GUI.canvas.height = window.innerHeight;
      GUI.canvas.width = window.innerHeight*1.6;
      GUI.canvas.style = 'background-color: black;';
      GUI.draw.setTransform(PixelTanks.resizer, 0, 0, PixelTanks.resizer, 0, 0);
      GUI.drawText('Loading Font', 800, 500, 50, '#fffff', 0.5);
      window.oncontextmenu = () => {return false};
      window.addEventListener('resize', GUI.resize);
    }
  
    static updateBootProgress(progress) {
      GUI.clear();
      GUI.drawText(Math.round(progress*100)+'%', 800, 500, 50, '#ffffff', 0.5);
    }

    static boot() {
      PixelTanks.user = {};

      PixelTanks.images = {
        blocks: {
          barrier: '/blocks/barrier',
          strong: '/blocks/strong',
          weak: '/blocks/weak',
          spike: '/blocks/spike',
          floor: '/blocks/floor',
          void: '/blocks/void',
          gold: '/blocks/gold',
          heal: '/blocks/heal',
          mine: '/blocks/mine',
          fire: '/blocks/fire',
          airstrike: '/blocks/airstrike',
          fortress: '/blocks/fortress',
        },
        bullets: {
          //normal: '/bullets/normal', no image yet :(
          shotgun: '/bullets/shotgun',
          powermissle: '/bullets/powermissle',
          megamissle: '/bullets/megamissle',
          grapple: '/bullets/grapple',
          dynamite: '/bullets/dynamite',
          fire: '/bullets/fire',
        },
        tanks: {
          buff: '/tanks/buff',
          base: '/tanks/base',
          destroyed: '/tanks/destroyed',
          top: '/tanks/top',
          bottom: '/tanks/bottom',
          bottom2: '/tanks/bottom2',
        },
        cosmetics: {
              'DarkMemeGod': '/cosmetics/meme',
              'Aaron': '/cosmetics/aaron',
              'Astronaut': '/cosmetics/astronaut',
              'Onfire': '/cosmetics/onfire',
              'Assassin': '/cosmetics/assassin',
              'Redsus': '/cosmetics/redsus',
              'Venom': '/cosmetics/venom',
              'Blue Tint': '/cosmetics/blue_tint',
              'Purple Flower': '/cosmetics/purple_flower',
              'Leaf': '/cosmetics/leaf',
              'Basketball': '/cosmetics/basketball',
              'Purple Top Hat': '/cosmetics/purple_top_hat',
              'Terminator': '/cosmetics/terminator',
              'Dizzy': '/cosmetics/dizzy',
              'Knife': '/cosmetics/knife',
              'Scared': '/cosmetics/scared',
              'Laff': '/cosmetics/laff',
              'Hacker Hoodie': '/cosmetics/hacker_hoodie',
              'Error': '/cosmetics/error',
              'Purple Grad Hat': '/cosmetics/purple_grad_hat',
              'Bat Wings': '/cosmetics/bat_wings',
              'Back Button': '/cosmetics/back',
              'Fisher Hat': '/cosmetics/fisher_hat',
              'Kill = Ban': '/cosmetics/ban',
              'Blue Ghost': '/cosmetics/blue_ghost',
              'Pumpkin Face': '/cosmetics/pumpkin_face',
              'Pumpkin Hat': '/cosmetics/pumpkin_hat',
              'Red Ghost': '/cosmetics/red_ghost',
              'Candy Corn': '/cosmetics/candy_corn',
              'Yellow Pizza': '/cosmetics/yellow_pizza',
              'Orange Ghost': '/cosmetics/orange_ghost',
              'Pink Ghost': '/cosmetics/pink_ghost',
              'Paleontologist': '/cosmetics/paleontologist',
              'Yellow Hoodie': '/cosmetics/yellow_hoodie',
              'X': '/cosmetics/x',
              'Sweat': '/cosmetics/sweat',
              'Spirals': '/cosmetics/spirals',
              'Spikes': '/cosmetics/spikes',
              'Rudolph': '/cosmetics/rudolph',
              'Reindeer Hat': '/cosmetics/reindeer_hat',
              'Red Hoodie': '/cosmetics/red_hoodie',
              'Question Mark': '/cosmetics/question_mark',
              'Purple-Pink Hoodie': '/cosmetics/purplepink_hoodie',
              'Purple Hoodie': '/cosmetics/purple_hoodie',
              'Pumpkin': '/cosmetics/pumpkin',
              'Pickle': '/cosmetics/pickle',
              'Orange Hoodie': '/cosmetics/orange_hoodie',
              'Helment': '/cosmetics/helment',
              'Green Hoodie': '/cosmetics/green_hoodie',
              'Exclaimation Point': '/cosmetics/exclaimation_point',
              'Eggplant': '/cosmetics/eggplant',
              'Devil Wings': '/cosmetics/devils_wings',
              'Christmas Tree': '/cosmetics/christmas_tree',
              'Christmas Lights': '/cosmetics/christmas_lights',
              'Checkmark': '/cosmetics/checkmark',
              'Cat Hat': '/cosmetics/cat_hat',
              'Blueberry': '/cosmetics/blueberry',
              'Blue Hoodie': '/cosmetics/blue_hoodie',
              'Blue Helment': '/cosmetics/blue_helment',
              'Banana': '/cosmetics/bannana',
              'Aqua Helment': '/cosmetics/aqua_helment',
              'Apple': '/cosmetics/apple',
              'Hoodie': '/cosmetics/hoodie',
              'Purple Helment': '/cosmetics/purple_helment',
              'Angel Wings': '/cosmetics/angel_wings',
              'Boost': '/cosmetics/boost',
              'Bunny Ears': '/cosmetics/bunny_ears',
              'Cake': '/cosmetics/cake',
              'Cancelled': '/cosmetics/cancelled',
              'Candy Cane': '/cosmetics/candy_cane',
              'Cat Ears': '/cosmetics/cat_ears',
              'Christmas Hat': '/cosmetics/christmas_hat',
              'Controller': '/cosmetics/controller',
              'Deep Scratch': '/cosmetics/deep_scratch',
              'Devil Horns': '/cosmetics/devil_horn',
              'Headphones': '/cosmetics/earmuffs',
              'Eyebrows': '/cosmetics/eyebrows',
              'First Aid': '/cosmetics/first_aid',
              'Flag': '/cosmetics/flag',
              'Halo': '/cosmetics/halo',
              'Hax': '/cosmetics/hax',
              'Low Battery': '/cosmetics/low_battery',
              'Mini Tank': '/cosmetics/mini_tank',
              'MLG Glasses': '/cosmetics/mlg_glasses',
              'Money Eyes': '/cosmetics/money_eyes',
              'No Mercy': '/cosmetics/no_mercy',
              'Peace': '/cosmetics/peace',
              'Police': '/cosmetics/police',
              'Question Mark': '/cosmetics/question_mark',
              'Rage': '/cosmetics/rage',
              'Small Scratch': '/cosmetics/small_scratch',
              'Speaker': '/cosmetics/speaker',
              'Swords': '/cosmetics/swords',
              'Tools': '/cosmetics/tools',
              'Top Hat': '/cosmetics/top_hat',
              'Uno Reverse': '/cosmetics/uno_reverse',
              'Mask': '/cosmetics/victim',
        },
        menus: {
          ui: '/menus/ui',
          start: '/menus/start',
          main: '/menus/main',
          multiplayer: '/menus/multiplayer',
          crate: '/menus/crate',
          settings: '/menus/settings',
          keybinds: '/menus/keybinds',
          inventory: '/menus/inventory',
          classTab: '/menus/classTab',
          healthTab: '/menus/healthTab',
          itemTab: '/menus/itemTab',
          cosmeticTab: '/menus/cosmeticTab',
          deathEffectsTab: '/menus/cosmeticTab',
          shop_armor: '/menus/shop_armor',
          shop_class: '/menus/shop_class',
          shop_items: '/menus/shop_items',
          shop_kits: '/menus/shop_kits',
          broke: '/menus/broke',
          htp1: '/menus/htp1',
          htp2: '/menus/htp2',
          htp3: '/menus/htp3',
          htp4: '/menus/htp4',
        },
        emotes: { // type: 0=loop 1=play once 2=static
          speech: '/emotes/speech',
          speech_: {speed: 50},
          mlg: '/emotes/mlg',
          mlg_: {type: 1, frames: 13, speed: 50},
          wink: '/emotes/wink',
          wink_: {type: 2, speed: 50},
          confuzzled: '/emotes/confuzzled',
          confuzzled_: {type: 2, speed: 50},
          surrender: '/emotes/surrender',
          surrender_: {type: 2, speed: 50},
          anger: '/emotes/anger',
          anger_: {type: 0, frames: 4, speed: 50},
          ded: '/emotes/ded',
          ded_: {type: 2, speed: 50},
          mercy: '/emotes/mercy',
          mercy_: {type: 0, frames: 1, speed: 50},
          suffocation: '/emotes/suffocation',
          suffocation_: {type: 0, frames: 3, speed: 50},
          nomercy: '/emotes/nomercy',
          nomercy_: {type: 0, frames: 1, speed: 50},
          idea: '/emotes/idea',
          idea_: {type: 1, frames: 6, speed: 50},
          scared: '/emotes/scared',
          scared_: {type: 2, speed: 50},
          crying: '/emotes/crying',
          crying_: {type: 0, frames: 5, speed: 50},
          flat: '/emotes/flat',
          flat_: {type: 0, frames: 1, speed: 50},
          noflat: '/emotes/noflat',
          noflat_: {type: 0, frames: 1, speed: 50},
          rage: '/emotes/rage',
          rage_: {type: 0, frames: 5, speed: 50},
          sad: '/emotes/sad',
          sad_: {type: 0, frames: 2, speed: 50},
          sweat: '/emotes/sweat',
          sweat_: {type: 0, frames: 10, speed: 50},
          teamedon: '/emotes/miss',
          teamedon_: {type: 1, frames: 28, speed: 75},
          evanism: '/emotes/evanism',
          evanism_: {type: 1, frames: 45, speed: 100},
          miss: '/emotes/teamedon',
          miss_: {type: 0, frames: 12, speed: 50},
        },
        animations: {
          tape: '/animations/tape',
          tape_: {frames: 17, speed: 50},
          toolkit: '/animations/toolkit',
          toolkit_: {frames: 16, speed: 50},
          glu: '/animations/glu',
          glu_: {frames: 45, speed: 50},
          fire: '/animations/fire',
          fire_: {frames: 1, speed: 50},
          explosion: '/animations/explosion',
        },
        deathEffects: {
          explode: '/animations/explode',
          explode_: {frames: 17, speed: 75, kill: 8, type: 1},
          clicked: '/animations/clicked',
          clicked_: {frames: 29, speed: 75, kill: 28, type: 2},
          amogus: '/animations/amogus',
          amogus_: {frames: 47, speed: 75, kill: 21, type: 1},
          nuke: '/animations/nuke',
          nuke_: {frames: 26, speed: 75, kill: 12, type: 1},
          error: '/animations/error',
          error_: {frames: 10, speed: 250, kill: 10, type: 2},
          magic: '/animations/magic',
          magic_: {frames: 69, speed: 75, kill: 51, type: 2},
          /*securly: '/animations/securly',
          securly_: {frames: 1, speed: 9900, kill: 1, type: 3},*/
          anvil: '/animations/anvil',
          anvil_: {frames: 22, speed: 75, kill: 6, type: 1},
          insta: '/animations/insta',
          insta_: {frames: 22, speed: 75, kill: 21, type: 1},
          crate: '/animations/crate',
          crate_: {frames: 31, speed: 75, kill: 21, type: 2},
          battery: '/animations/battery',
          battery_: {frames: 55, speed: 75, kill: 54, type: 2},
          evan: '/animations/evan',
          evan_: {frames: 8, speed: 500, kill: 7, type: 1},
          minecraft: '/animations/minecraft',
          minecraft_: {frames: 22, speed: 100, kill: 15, type: 2},
          enderman: '/animations/enderman',
          enderman_: {frames: 4, speed: 500, kill: 3, type: 2},
        },
        items: {
          airstrike: '/items/airstrike',
          duck_tape: '/items/duck-tape',
          super_glu: '/items/super-glu',
          shield: '/items/shield',
          flashbang: '/items/flashbang',
          bomb: '/items/bomb',
          dynamite: '/items/dynamite',
          weak: '/items/weak',
          strong: '/items/strong',
          spike: '/items/spike',
          mine: '/items/mine',
          fortress: '/items/fortress',
        }
      };

      Loader.loadImages(PixelTanks.images);

      Menus.menus = {
        start: {
          buttons: [
            [580, 740, 200, 100, function() {PixelTanks.auth(this.username, this.password, 'login')}, true],
            [820, 740, 200, 100, function() {PixelTanks.auth(this.username, this.password, 'signup')}, true],
            [580, 480, 440, 60, function() {this.type = 'username'}, false],
            [580, 580, 440, 60, function() {this.type = 'password'}, false],
          ],
          listeners: {
            keydown: function(e) {
              if (e.key.length === 1) this[this.type] += e.key;
              if (e.keyCode === 8) this[this.type] = this[this.type].slice(0, -1);
              if (e.keyCode === 13) PixelTanks.auth(this.username, this.password, 'login');
            }
          },
          cdraw: function() {
            if (!this.type) {
              this.type = 'username';
              this.username = '';
              this.password = '';
            }
            GUI.drawText(this.username, 580, 495, 30, '#ffffff', 0);
            GUI.drawText(this.password.replace(/./g, '•'), 580, 595, 30, '#ffffff', 0);
          },
        },
        main: {
          buttons: [
            [1180, 920, 80, 80, 'keybinds', true],
            [580, 500, 440, 100, 'multiplayer', true],
            [580, 640, 440, 100, 'shop', true],
            [420, 920, 80, 80, 'inventory', true],
            [528, 896, 80, 80, 'crate', true],
            [620, 920, 80, 80, 'htp1', true],
            [580, 360, 440, 100, function() {alert('Singleplayer is coming soon!')}, true],
            [320, 920, 80, 80, function() {
              PixelTanks.user.token = undefined;
              PixelTanks.user.username = undefined;
              Menus.trigger('start');
            }],
          ],
          listeners: {},
          cdraw: function() {
            GUI.drawImage(PixelTanks.images.tanks.bottom, 800, 800, 80, 80, 1);
            GUI.drawImage(PixelTanks.images.tanks.top, 800, 800, 80, 90, 1);
            if (PixelTanks.userData.cosmetic !== '' && PixelTanks.userData.cosmetic !== undefined) GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic], 800, 800, 80, 90, 1);
            GUI.drawText(PixelTanks.user.username, 900, 840, 50, '#ffffff', 0.5)
            GUI.drawText('Rank: '+PixelTanks.userData.stats[4], 900, 880, 50, '#ffffff', 0);
            GUI.drawText('XP - '+PixelTanks.userData.stats[3]+'/'+(PixelTanks.userData.stats[4]+1)*100+' Level Cost: N/a', 900, 920, 50, '#ffffff', 0);
            GUI.drawText('Coins: '+PixelTanks.userData.stats[0], 900, 960, 50, '#ffffff', 0);
          },
        },
        multiplayer: {
          buttons: [
            [424, 28, 108, 108, 'main'],
            [340, 376, 416, 116, function() {this.gamemode = 'ffa'}, false],
            [340, 532, 416, 116, function() {this.gamemode = 'duels'}, false],
            [340, 688, 416, 116, function() {this.gamemode = 'tdm'}, false],
            [340, 844, 416, 116, function() {this.gamemode = 'juggernaut'}, false],
            [868, 848, 368, 88, function() {
              PixelTanks.user.joiner = new Tank(this.ip, true); 
              Menus.removeListeners();
            }],
          ],
          listeners: {
            keydown: function(e) {
              if (e.key.length === 1) this.ip += e.key;
              if (e.keyCode === 8) this.ip = this.ip.slice(0, -1);
            }
          },
          cdraw: function() {
            if (!this.gamemode) {
              this.gamemode = 'ffa';
              this.ip = '141.148.128.231/ffa';
            }
            GUI.drawText(this.ip, 800, 276, 50, '#FFFFFF', 0.5);
          }
        },
        crate: {
          buttons: [
            [418, 112, 106, 106, 'main', true],
            [1076, 114, 106, 106, 'cosmetic', true],
            [625, 324, 564, 564, function() {PixelTanks.openCrate()}, false],
            [0, 324, 564, 564, function() {PixelTanks.openDeath()}, false],
          ],
          listeners: {},
          cdraw: function() {
            GUI.drawText('Crates: ' + PixelTanks.userData.stats[1], 800, 260, 30, '#ffffff', 0.5);
          }
        },
        settings: {
          buttons: [
            [59, 56, 53, 53, 'main', true],
            [397, 65, 38, 35, 'keybinds', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        htp1: {
          buttons: [
            [12, 12, 120, 120, 'main', true],
            [476, 224, 320, 80, 'htp2', true],
            [804, 224, 320, 80, 'htp3', true],
            [1132, 224, 320, 80, 'htp4', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        htp2: {
          buttons: [
            [12, 12, 120, 120, 'main', true],
            [148, 224, 320, 80, 'htp1', true],
            [804, 224, 320, 80, 'htp3', true],
            [1132, 224, 320, 80, 'htp4', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        htp3: {
          buttons: [
            [12, 12, 120, 120, 'main', true],
            [148, 224, 320, 80, 'htp1', true],
            [476, 224, 320, 80, 'htp2', true],
            [1132, 224, 320, 80, 'htp4', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        htp4: {
          buttons: [
            [12, 12, 120, 120, 'main', true],
            [148, 224, 320, 80, 'htp1', true],
            [476, 224, 320, 80, 'htp2', true],
            [804, 224, 320, 80, 'htp3', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        keybinds: {
          buttons: [
            [40, 40, 120, 120, 'main', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        inventory: {
          buttons: [
            [424, 28, 108, 108, 'main', true],
            [1064, 458, 88, 88, function() {PixelTanks.switchTab('healthTab')}, true],
            [1112, 814, 88, 88, function() {PixelTanks.switchTab('classTab')}, true],
            [400, 814, 88, 88, function() {PixelTanks.switchTab('itemTab', 1)}, true],
            [488, 814, 88, 88, function() {PixelTanks.switchTab('itemTab', 2)}, true],
            [576, 814, 88, 88, function() {PixelTanks.switchTab('itemTab', 3)}, true],
            [664, 814, 88, 88, function() {PixelTanks.switchTab('itemTab', 4)}, true],
            [756, 220, 88, 88, function() {PixelTanks.switchTab('cosmeticTab')}, true],
            [556, 220, 88, 88, function() {PixelTanks.switchTab('deathEffectsTab')}, true],
          ],
          listeners: {
            mousedown: function(e) {
              const {x, y} = Menus;
              if (this.classTab) {
                if (x < 688 || x > 912 || y < 334 || y > 666) return this.classTab = false;
                for (let xm = 0; xm < 2; xm++) {
                  for (let ym = 0; ym < 3; ym++) {
                    if (A.collider({x, y, w: 0, h: 0}, {x: [702, 816][xm], y: [348, 456, 564][ym], w: 88, h: 88})) {
                      if (PixelTanks.userData.classes[[[0, 6, 3], [1, 4, 2]][xm][ym]]) {
                        PixelTanks.userData.class = [['tactical', 'fire', 'medic'], ['stealth', 'builder', 'warrior']][xm][ym];
                      } else {
                        alert('You need to buy this first!');
                      }
                      return;
                    }
                  }
                }
              } else if (this.itemTab) {
                if (x < 580 || x > 1020 || y < 334 || y > 666) return this.itemTab = false;
                const key = {airstrike: [600, 354], super_glu: [708, 354], duck_tape: [816, 354], shield: [924, 354], flashbang: [600, 462], bomb: [708, 462], dynamite: [816, 462], fortress: [924, 462], weak: [600, 570], strong: [708, 570], spike: [816, 570], mine: [904, 570]};
                for (const item in key) {
                  if (x > key[item][0] && x < key[item][0]+80 && y > key[item][1] && y < key[item][1]+80) {
                    if (!PixelTanks.userData.items.includes(item)) {
                  PixelTanks.userData.items[this.currentItem-1] = item;
                    } else {
                      alert('You are not allowed to have more than 1 of the same item');
                    }
                    return;
                  }
                }
              } else if (this.cosmeticTab) {
                if (x < 518 || x > 1082 || y < 280 || y > 720) return Menus.menus.inventory.cosmeticTab = false;
                for (let i = 0; i < 16; i++) {
                  if (A.collider({x, y, w: 0, h: 0}, {x: 598+(l%4)*108, y: 298+Math.floor(l/4)*108, w: 88, h: 88})) {
                    if (e.button === 0) {
                      PixelTanks.userData.cosmetic = PixelTanks.userData.cosmetics[this.cosmeticMenu*16+i];
                    } else {
                      PixelTanks.userData.cosmetics.splice(this.cosmeticMenu*16+i, 1);
                    }
                    return;
                  }
                }
              } else if (this.deathEffectsTab) {
                if (x < 518 || x > 1082 || y < 280 || y > 720) return Menus.menus.inventory.deathEffectsTab = false;
                for (let i = 0; i < 16; i++) {
                  if (A.collider({x, y, w: 0, h: 0}, {x: 598+(l%4)*108, y: 298+Math.floor(l/4)*108, w: 88, h: 88})) {
                    if (e.button === 0) {
                      PixelTanks.userData.deathEffect = PixelTanks.userData.deathEffects[this.deathEffectsMenu*16+i];
                    } else {
                      PixelTanks.userData.deathEffects.splice(this.deathEffectsMenu*16+i, 1);
                    }
                    return;
                  }
                }
              }
            },
            mousemove: function(e) {
              this.target = {x: e.clientX-window.innerWidth/2, y: e.clientY-window.innerHeight/2};
            },
            keydown: function(e) {
              if (e.key.length === 1) this.color += e.key;
              if (e.keyCode === 8) this.color = this.color.slice(0, -1);
              if (this.cosmeticTab) {
                if (e.keyCode === 37 && this.cosmeticMenu > 0) this.cosmeticMenu--;
                if (e.keyCode === 39 && this.cosmeticMenu+1 !== Math.ceil(PixelTanks.userData.cosmetics.length/16)) this.cosmeticMenu++;
              }
              PixelTanks.userData.color = this.color;
            }
          },
          cdraw: function() {
            if (!this.target) {
              this.time = Date.now();
              this.color = PixelTanks.userData.color;
              this.target = {x: 0, y: 0};
              this.cosmeticMenu = 0;
              this.deathEffectsMenu = 0;
            }
            GUI.draw.fillStyle = this.color;
            GUI.draw.fillRect(1116, 264, 40, 40);
            GUI.drawText(this.color, 1052, 256, 20, this.color, 0);
            GUI.drawImage(PixelTanks.images.tanks.top, 1064, 458, 88, 88, 1);
            for (let i = 0; i < 4; i++) {
              GUI.drawImage(PixelTanks.images.items[PixelTanks.userData.items[0]], [402, 490, 578, 666][i], 816, 80, 80, 1);
            }
            GUI.drawImage(PixelTanks.images.tanks.bottom, 680, 380, 240, 240, 1);
            GUI.drawImage(PixelTanks.images.tanks.top, 680, 380, 240, 270, 1, 120, 120, 0, 0, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
            if (PixelTanks.userData.cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic], 680, 380, 240, 270, 1, 120, 120, 0, 0, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);

            if (this.healthTab || this.classTab || this.itemTab || this.cosmeticTab || this.deathEffectsTab) {
              GUI.draw.fillStyle = '#000000';
              GUI.draw.globalAlpha = .7;
              GUI.draw.fillRect(0, 0, 1600, 1600);
            }
            if (this.classTab) {
              GUI.drawImage(PixelTanks.images.menus.classTab, 688, 334, 224, 332, 1);
              GUI.draw.strokeStyle = '#FFFF00';
              GUI.draw.lineWidth = 10;
              if (PixelTanks.userData.class === 'tactical') GUI.draw.strokeRect(701, 348, 88, 88); else if (PixelTanks.userData.class === 'fire') GUI.draw.strokeRect(701, 456, 88, 88); else if (PixelTanks.userData.class === 'medic') GUI.draw.strokeRect(701, 565, 88, 88); else if (PixelTanks.userData.class === 'stealth') GUI.draw.strokeRect(814, 348, 88, 88); else if (PixelTanks.userData.class === 'builder') GUI.draw.strokeRect(814, 456, 88, 88); else if (PixelTanks.userData.class === 'warrior') GUI.draw.strokeRect(814, 565, 88, 88);
            } else if (this.itemTab) {
              GUI.drawImage(PixelTanks.images.menus.itemTab, 580, 334, 440, 332, 1);
              const key = {airstrike: [600, 354], super_glu: [708, 354], duck_tape: [816, 354], shield: [924, 354], flashbang: [600, 462], bomb: [708, 462], dynamite: [816, 462], fortress: [924, 462], weak: [600, 570], strong: [708, 570], spike: [816, 570], mine: [904, 570]};
              for (const item in key) GUI.drawImage(PixelTanks.images.items[item], key[item][0], key[item][1], 80, 80, 1);
            } else if (this.cosmeticTab) {
              const a = this.cosmeticMenu === 0, b = this.cosmeticMenu === Math.floor(PixelTanks.userData.cosmetics.length/16);
              GUI.drawImage(PixelTanks.images.menus.cosmeticTab, 518+(a ? 62 : 0), 280, 564-(a ? 62 : 0)-(b ? 62 : 0), 440, 1, 0, 0, 0, 0, 0, (a ? 31 : 0), 0, 282-(a ? 31 : 0)-(b ? 31 : 0), 220);
              for (let i = this.cosmeticMenu*16; i < Math.min((this.cosmeticMenu+1)*16, PixelTanks.userData.cosmetics.length); i++) {
                GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetics[i]], 598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 88, 88, 1);
                if (PixelTanks.userData.cosmetics[i] === PixelTanks.userData.cosmetic) {
                  GUI.draw.strokeStyle = '#FFFF22';
                  GUI.draw.lineWidth = 10;
                  GUI.draw.strokeRect(598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 88, 88);
                }
              }
            } else if (this.deathEffectsTab) {
              const a = this.deathEffectsMenu === 0, b = this.deathEffectsMenu === Math.floor(PixelTanks.userData.deathEffects.length/16);
              GUI.drawImage(PixelTanks.images.menus.deathEffectsTab, 518+(a ? 62 : 0), 280, 564-(a ? 62 : 0)-(b ? 62 : 0), 440, 1, 0, 0, 0, 0, 0, (a ? 31 : 0), 0, 282-(a ? 31 : 0)-(b ? 31 : 0), 220);
              for (let i = this.deathEffectsMenu*16; i < Math.min((this.deathEffectsMenu+1)*16, PixelTanks.userData.deathEffects.length); i++) {
                const d = PixelTanks.images.deathEffects[PixelTanks.userData.deathEffects[i]+'_'];
                GUI.drawImage(PixelTanks.images.deathEffects[PixelTanks.userData.deathEffects[i]], 598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 88, 88, 1, 0, 0, 0, 0, 0, (Math.floor((Date.now()-this.time)/d.speed)%d.frames)*200, 0, 200, 200);
                if (PixelTanks.userData.deathEffects[i] === PixelTanks.userData.deathEffect) {
                  GUI.draw.strokeStyle = 0xffff22;
                  GUI.draw.lineWidth = 10;
                  GUI.draw.strokeRect(598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 88, 88);
                }
              }
            }
          },
        },
        shop: {
          buttons: [
            [424, 28, 108, 108, 'main', true],
            [88, 212, 328, 64, function() {this.tab='items'}, true],
            [456, 212, 328, 64, function() {alert('removed')}, false],
            [824, 212, 328, 64, function() {this.tab='class'}, true],
            [1192, 212, 328, 64, function() {this.tab='kits'}, true],
          ],
          listeners: {
            mousedown: function() {
              if (this.tab === 'class') {
                for (let i = 0; i < 6; i++) {
                  if (A.collider({x: Menus.x, y: Menus.t, w: 0, h: 0}, {x: [504, 720, 936][i%3], y: [416, 632][Math.floor(i/3)], w: 176, h: 176})) PixelTanks.purchase(['tactical', 'stealth', 'builder', 'warrior', 'fire', 'medic'][i]);
                }
              }
            }
          },
          cdraw: function() {
            if (!this.tab) this.tab = 'armor';
            GUI.drawImage(PixelTanks.images.menus['shop_'+this.tab], 0, 0, 1600, 1000, 1);
            GUI.drawText(PixelTanks.userData.stats[0]+' coinage', 800, 350, 50, 0x000000, 0.5);
            if (this.tab === 'class') {
              for (let i = 0; i < 6; i++) {
                if (!PixelTanks.userData.classes[i] && PixelTanks.userData.stats[0] < [70000, 30000, 70000, 50000, 50000, 70000][i]) {
                  GUI.drawImage(PixelTanks.images.menus.broke, [504, 720, 504, 936, 936, 720][i], [416, 416, 632, 632, 416, 632][i], 176, 176, 1);
                }
              }
            }
          },
        },
      }

      for (const m in Menus.menus) Menus.menus[m] = new Menu(Menus.menus[m], m);
      PixelTanks.socket = new MegaSocket('ws://141.148.128.231', {keepAlive: true, reconnect: true, autoconnect: true});
    }

    static launch() {
      setTimeout(() => Menus.trigger('start'), 200);
    }

    static save() {
      try {
        const temp = PixelTanks.playerData;
        temp['pixel-tanks'] = PixelTanks.userData;
        Network.update('playerdata', JSON.stringify(temp));
      } catch (e) {
        alert('Save Error:' + e)
      }
    }

    static getData(callback) {
        Network.get(data => {
          const {'pixel-tanks': userData, ...playerData} = JSON.parse(data.playerdata);
          PixelTanks.userData = userData;
          PixelTanks.playerData = playerData;
          if (!PixelTanks.userData) {
            PixelTanks.userData = {
              username: PixelTanks.user.username,
              class: 'normal',
              cosmetic: '',
              cosmetics: [],
              deathEffect: '',
              deathEffects: [],
              color: '#ffffff',
              stats: [
                0, // coins
                0, // crates
                1, // level
                0, // xp
                0, // rank
              ],
              classes: [
                false, // tactical
                false, // stealth
                false, // warrior
                false, // medic
                false, // builder
                false, // summoner
                false, // fire
                false, // ice
              ],
              items: ['duck_tape', 'weak', 'bomb', 'flashbang'],
              keybinds: {
                items: [49, 50, 51, 52],
                emotes: [53, 54, 55, 56, 57, 48],    
              },
            };
          }
          clearInterval(PixelTanks.autosave);
          PixelTanks.autosave = setInterval(() => PixelTanks.save(), 5000);
          callback();
        });
    }

    static auth(u, p, t) {
      Network.auth(u, p, t, () => {
        PixelTanks.getData(() => Menus.trigger(t === 'login' ? 'main' : 'htp1'));
      });
    }

    static switchTab(id, n) {
      if (!Menus.menus.inventory.healthTab && !Menus.menus.inventory.classTab && !Menus.menus.inventory.itemTab && !Menus.menus.inventory.cosmeticTab) Menus.menus.inventory[id] = true;
      if (n) Menus.menus.inventory.currentItem = n;
      Menus.redraw();
    } // OPTIMIZE

    static openDeath() {
      const {userData, images} = PixelTanks;
      const rand = Math.floor(Math.random()*1001), crate = {
        common: ['explode', 'nuke', 'evan'],
        uncommon: ['anvil', 'insta'],
        rare: ['amogus', 'minecraft', 'magic'],
        epic: ['blocked', 'battery'],
        legendary: ['error', 'enderman'],
        mythic: ['clicked'],
      }
      let rarity;

      if (userData.stats[1] < 5) return alert('Your broke boi!');
      userData.stats[1] -= 5;

      if (Math.floor(Math.random() * (1001)) < 1) { // .1%
        rarity = 'mythic';
      } else if (Math.floor(Math.random() * (1001)) < 10) { // .9%
        rarity = 'legendary';
      } else if (Math.floor(Math.random() * (1001)) < 50) { // 4%
        rarity = 'epic';
      } else if (Math.floor(Math.random() * (1001)) < 150) { // 10%
        rarity = 'rare';
      } else if (Math.floor(Math.random() * (1000 - 0 + 1)) < 300) { // 15%
        rarity = 'uncommon';
      } else { // 70%
        rarity = 'common'; 
      }

      var number = Math.floor(Math.random()*(crate[rarity].length)), d;
      for (var deathEffect in this.images.deathEffects) {if (deathEffect === crate[rarity][number]) d = this.images.deathEffects[deathEffect]}
      if (d === undefined) document.write('Game Crash!<br>Crashed while trying to give you cosmetic id "'+crate[rarity][number]+'". Report this to cs641311, bradley, or Celestial.');
      Menus.removeListeners();
      var start = Date.now();
      var render = setInterval(function() {
        GUI.clear();
        GUI.drawImage(d, 600, 400, 400, 400, 1, 0, 0, 0, 0, 0, (Math.floor((Date.now()-start)/PixelTanks.images.deathEffects[crate[rarity][number]+'_'].speed)%PixelTanks.images.deathEffects[crate[rarity][number]+'_'].frames)*200, 0, 200, 200);
        GUI.drawText('You Got', 800, 200, 100, '#ffffff', 0.5);
        GUI.drawText(crate[rarity][number], 800, 800, 50, '#ffffff', 0.5);
        GUI.drawText(rarity, 800, 900, 30, {
          mythic: '#FF0000',
          legendary: '#FFFF00',
          epic: '#A020F0',
          rare: '#0000FF',
          uncommon: '#32CD32',
          common: '#FFFFFF',
        }[rarity], 0.5);
      }, 15);
      setTimeout(() => {
        clearInterval(render);
        Menus.trigger('crate');
      }, 5000);
      PixelTanks.userData.deathEffects.push(crate[rarity][number]);
      PixelTanks.save();
    }

    static openCrate(crate) {
      if (PixelTanks.userData.stats[1] <= 0) {
        alert('Your broke boi!');
        return;
      }
      PixelTanks.userData.stats[1]--;

      var crate = {
        common: ['X', 'Red Hoodie', 'Devil Wings', 'Devil Horns', 'Exclaimation Point', 'Orange Hoodie', 'Yellow Hoodie', 'Green Hoodie', 'Leaf', 'Blue Hoodie', 'Purple Hoodie', 'Purple Flower', 'Boost', 'Cancelled', 'Spirals', 'Laff', 'Speaker', 'Spikes', 'Bat Wings', 'Christmas Tree', 'Candy Cane', 'Pumpkin Face', 'Top Hat', 'Mask', 'Purple-Pink Hoodie', 'Bunny Ears', 'Red Ghost', 'Blue Ghost', 'Pink Ghost', 'Orange Ghost'],
        uncommon: ['Apple', 'Pumpkin', 'Basketball', 'Banana', 'Pickle', 'Blueberry', 'Eggplant', 'Peace', 'Question Mark', 'Small Scratch', 'Kill = Ban', 'Headphones', 'Reindeer Hat', 'Pumpkin Hat', 'Cat Ears', 'Cake', 'Cat Hat', 'First Aid', 'Fisher Hat'],
        rare: ['Hax', 'Tools', 'Money Eyes', 'Dizzy', 'Checkmark', 'Sweat', 'Scared', 'Blue Tint', 'Purple Top Hat', 'Purple Grad Hat', 'Eyebrows', 'Helment', 'Rudolph', 'Candy Corn', 'Flag', 'Swords'],
        epic: ['Rage', 'Onfire', 'Halo', 'Police', 'Deep Scratch', 'Back Button', 'Controller', 'Assassin', 'Astronaut', 'Christmas Lights', 'No Mercy', 'Error'],
        legendary: ['Redsus', 'Uno Reverse', 'Christmas Hat', 'Mini Tank', 'Paleontologist', 'Yellow Pizza'],
        mythic: ['Terminator', 'MLG Glasses'],
      }

      var rarity;
      if (Math.floor(Math.random() * (1001)) < 1) { // .1%
        rarity = 'mythic';
      } else if (Math.floor(Math.random() * (1001)) < 10) { // .9%
        rarity = 'legendary';
      } else if (Math.floor(Math.random() * (1001)) < 50) { // 4%
        rarity = 'epic';
      } else if (Math.floor(Math.random() * (1001)) < 150) { // 10%
        rarity = 'rare';
      } else if (Math.floor(Math.random() * (1000 - 0 + 1)) < 300) { // 15%
        rarity = 'uncommon';
      } else { // 70%
        rarity = 'common'; 
      }

      var number = Math.floor(Math.random()*(crate[rarity].length)), c;
      for (var cosmetic in this.images.cosmetics) {if (cosmetic === crate[rarity][number]) c = this.images.cosmetics[cosmetic]}
      if (c === undefined) document.write('Game Crash!<br>Crashed while trying to give you cosmetic id "'+crate[rarity][number]+'". Report this to cs641311, bradley, or Celestial.');
      GUI.clear();
      GUI.drawImage(c, 600, 400, 400, 400, 1);
      GUI.drawText('You Got', 800, 200, 100, '#ffffff', 0.5);
      GUI.drawText(crate[rarity][number], 800, 800, 50, '#ffffff', 0.5);
      GUI.drawText(rarity, 800, 900, 30, {
        mythic: '#FF0000',
        legendary: '#FFFF00',
        epic: '#A020F0',
        rare: '#0000FF',
        uncommon: '#32CD32',
        common: '#FFFFFF',
      }[rarity], 0.5);
      setTimeout(() => {Menus.redraw()}, 2000);
      PixelTanks.userData.cosmetics.push(crate[rarity][number]);
      PixelTanks.save();
    }

    static purchase(stat) {
      var key = {
        tactical: [['classes', 0], 70000],
        stealth: [['classes', 1], 30000],
        warrior: [['classes', 2], 70000],
        medic: [['classes', 3], 50000],
        builder: [['classes', 4], 50000],
        summoner: [['classes', 5], 100000],
        fire: [['classes', 6], 70000],
        ice: [['classes', 7], 70000],
      }
      if (key[stat] === undefined) alert('The ['+stat+'] item is not registered. Scream at me to add it.');
      if (PixelTanks.userData[key[stat][0][0]][key[stat][0][1]]) {
        alert('You already bought this :/');
      } else if (PixelTanks.userData.stats[0] >= key[stat][1]) {
        PixelTanks.userData.stats[0] -= key[stat][1];
        PixelTanks.userData[key[stat][0][0]][key[stat][0][1]] = true;
        alert('purchase succes. thank u 4 ur monee');
      } else {
        alert('Your brok boi');
      }
    }
  }

  class Tank {
    constructor(ip, multiplayer) {
      this.xp = 0;
      this.crates = 0;
      this.kills = 0;
      this.coins = 0;
      this.hostupdate = {};
      this.paused = false;
      this.speed = 4;
      this.key = [];
      this.left = null;
      this.up = null;
      this.canGrapple = true;
      this.showChat = false;
      this.msg = '';
      this.multiplayer = multiplayer;
      this.tank = {use: [], fire: [], r: 0};
      this.reset();

      const joinData = {
        username: PixelTanks.user.username,
        token: PixelTanks.user.token,
        type: 'join',
        tank: {
          rank: PixelTanks.userData.stats[4],
          username: PixelTanks.user.username,
          class: PixelTanks.userData.class,
          cosmetic: PixelTanks.userData.cosmetic,
          deathEffect: PixelTanks.userData.deathEffect,
          color: PixelTanks.userData.color,
        },
      }

      if (multiplayer) {
        this.socket = new MegaSocket(`ws://${ip}`, {keepAlive: false, reconnect: false, autoconnect: true});
        this.socket.on('message', data => {
          this.ups++;
          if (this.paused) return;
          switch (data.event) {
            case 'hostupdate':
              if (data.logs) data.logs.reverse();
              for (const property in data) this.hostupdate[property] = data[property];
              break;
            case 'ded':
              this.reset();
              break;
            case 'gameover':
              break;
            case 'pay':
              const amount = Number(data.amount);
              this.coins += amount;
              PixelTanks.userData.stats[0] += amount;
              PixelTanks.save();
              break;
            case 'override':
              data.data.forEach(d => {
                this.tank[d.key] = d.value;
              });
              if (this.dx) {
                this.dx.t = Date.now();
                this.dx.o = this.tank.x;
              }
              if (this.dy) {
                this.dy.t = Date.now();
                this.dy.o = this.tank.y;
              }
              break;
            case 'kill':
              const crates = Math.floor(Math.random()*2)+1, coins = Math.floor(Math.random()*1000);
              this.kills++;
              this.xp += 10;
              this.crates += crates;
              this.coins += coins;
              PixelTanks.userData.stats[1] += crates;
              PixelTanks.userData.stats[3] += 10;
              PixelTanks.userData.stats[0] += coins;
              PixelTanks.save();
              break;
            case 'ping':
              this.ping = new Date().getTime()-this.pingStart;
              break;
          }
        });

        this.socket.on('connect', () => {
          this.socket.send(joinData);
          this.pinger = setInterval(() =>  {
            this.pingId = Math.random();
            this.pingStart = Date.now();
            this.socket.send({type: 'ping', id: this.pingId});
            this.ops = 0;
            this.ups = 0;
            this.fps = 0;
          }, 1000);
        });
      } else {
        this.world = new Singleplayer();
        this.world.add(joinData.tank);
      }

      document.addEventListener('keydown', this.keydown.bind(this));
      document.addEventListener('keyup', this.keyup.bind(this));
      document.addEventListener('mousemove', this.mousemove.bind(this));
      document.addEventListener('mousedown', this.mousedown.bind(this));
      document.addEventListener('mouseup', this.mouseup.bind(this));
      setInterval(this.send.bind(this), 1000/60);
      this.render = requestAnimationFrame(this.frame.bind(this));
    }

    reset() {
      const time = new Date('Nov 28 2006').getTime();
      this.timers = {
        boost: time,
        powermissle: time,
        toolkit: time,
        class: {time: time, cooldown: -1},
        items: [{time: time, cooldown: -1}, {time: time, cooldown: -1,}, {time: time, cooldown: -1}, {time: time, cooldown: -1}],
      };
      this.fireType = 1;
      this.halfSpeed = false;
      this.canFire = true;
      this.canBoost = true;
      this.canToolkit = true;
      this.canPowermissle = true;
      this.canMegamissle = true;
      this.canInvis = true;
      this.canTurret = true;
      this.canBuild = true;
      this.canBuff = true;
      this.canHeal = true;
      this.canFlame = true;
      this.canDynamite = true;
      this.hasDynamite = false;
      this.canItem0 = true;
      this.canItem1 = true;
      this.canItem2 = true;
      this.canItem3 = true;
      this.canChangePaused = true;
      this.canGrapple = true;
      this.kills = 0;
    }

    drawBlock(b) {
      const size = b.type === 'airstrike' ? 200 : 100;
      GUI.drawImage(PixelTanks.images.blocks[b.type], b.x, b.y, size, size, (b.type === 'mine' && this.hostupdate.tanks.find(t => t.username === PixelTanks.user.username).team.split(':')[1].replace('@leader', '') !== b.team.split(':')[1].replace('@leader', '')) ? .03 : 1);
    }

    drawShot(s) {
      if (s.type == 'bullet') {
        GUI.draw.fillStyle = '#000000';
        GUI.draw.fillRect(s.x, s.y, 10, 10);
      } else if (['powermissle', 'healmissle'].includes(s.type)) {
        GUI.drawImage(PixelTanks.images.bullets.powermissle, s.x, s.y, 20, 40, 1, 10, 20, 0, 0, s.r+180);
      } else if (s.type === 'megamissle') {
        GUI.drawImage(PixelTanks.images.bullets.megamissle, s.x, s.y, 20, 40, 1, 10, 20, 0, 0, s.r+180);
      } else if (s.type === 'shotgun') {
        GUI.drawImage(PixelTanks.images.bullets.shotgun, s.x, s.y, 10, 10, 1, 5, 5, 0, 0, s.r+180);
      } else if (s.type === 'grapple') {
        GUI.drawImage(PixelTanks.images.bullets.grapple, s.x, s.y, 45, 45, 1, 22.5, 22.5, 0, 0, s.r+180);
        GUI.draw.lineWidth = 10;
        GUI.draw.beginPath();
        GUI.draw.fillStyle = '#A9A9A9';
        GUI.draw.moveTo(s.x, s.y);
        const t = this.hostupdate.tanks.find(t => t.username === s.team.split(':')[0]);
        if (t) GUI.draw.lineTo(t.x+40, t.y+40);
        GUI.draw.stroke();
      } else if (s.type === 'dynamite') {
        GUI.drawImage(PixelTanks.images.bullets.dynamite, s.x, s.y, 10, 40, 1, 5, 5, 0, 0, s.r+180);
      } else if (s.type === 'fire') {
        GUI.drawImage(PixelTanks.images.bullets.fire, s.x, s.y, 10, 10, 1, 5, 5, 0, 0, s.r+180);
      }
    }

    drawExplosion(e) {
      GUI.drawImage(PixelTanks.images.animations.explosion, e.x, e.y, e.w, e.h, 1, 0, 0, 0, 0, 0, e.f*50, 0, 50, 50);
    }

    drawAi(a) {
      GUI.drawImage(PixelTanks.images.tanks.base, a.x, a.y, 80, 80, 1);
      GUI.drawImage(PixelTanks.images.tanks.top, a.x, a.y, 80, 90, 1, 40, 40, 0, a.p, a.r);
      if (a.cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[a.cosmetic], a.x, a.y, 80, 90, 1, 40, 40, 0, a.p, a.r);
      GUI.draw.fillStyle = '#000000';
      GUI.draw.fillRect(a.x, a.y+100, 80, 10);
      GUI.draw.fillStyle = '#00FF00';
      GUI.draw.fillRect(a.x+4, a.y+102, 72*a.hp/600, 6);
    }

    drawTank(t) {
      const p = t.username === PixelTanks.user.username;
      let a = 1;
      if (t.invis && !p) a = Math.sqrt(Math.pow(t.x-this.tank.x, 2)+Math.pow(t.y-this.tank.y, 2)) > 200 ? 0 : .2;
      if ((t.invis && p) || t.ded) a = .5;
      GUI.drawImage(PixelTanks.images.tanks['bottom'+(t.baseFrame ? '' : '2')], t.x, t.y, 80, 80, a, 40, 40, 0, 0, t.baseRotation);
      if (t.fire) GUI.drawImage(PixelTanks.images.animations.fire, t.x, t.y, 80, 80, 1, 0, 0, 0, 0, 0, t.fire.frame*29, 0, 29, 29);
      GUI.drawImage(PixelTanks.images.tanks.top, t.x, t.y, 80, 90, a, 40, 40, 0, t.pushback, t.r);
      if (t.cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[t.cosmetic], t.x, t.y, 80, 90, a, 40, 40, 0, t.pushback, t.r);
      if (t.invis && t.username !== PixelTanks.user.username) return;

      if (!t.ded) {
        GUI.draw.fillStyle = '#000000';
        GUI.draw.fillRect(t.x-2, t.y+98, 84, 11);
        GUI.draw.fillStyle = '#90EE90';
        GUI.draw.fillRect(t.x, t.y+100, 80*t.hp/t.maxHp, 5);
      }

      var username = '['+t.rank+'] '+t.username;
      if (t.team.split(':')[1].includes('@leader')) {
        username += ' ['+t.team.split(':')[1].replace('@leader', '')+'] (Leader)'
      } else if (t.team.split(':')[1].includes('@requestor#')) {
        username += ' [Requesting...] ('+t.team.split(':')[1].split('@requestor#')[1]+')';
      } else if (new Number(t.team.split(':')[1]) < 1) {} else {
        username += ' ['+t.team.split(':')[1]+']';
      }

      GUI.drawText(username, t.x+40, t.y-25, 50, t.color, 0.5);

      if (t.shields > 0 && (!t.invis || (t.invis && p))) {
        GUI.draw.beginPath();
        GUI.draw.fillStyle = '#7DF9FF';
        GUI.draw.globalAlpha = .2;
        GUI.draw.arc(t.x+40, t.y+40, 66, 0, 2*Math.PI);
        GUI.draw.fill();
        GUI.draw.globalAlpha = 1;
      }

      if (t.buff) GUI.drawImage(PixelTanks.images.tanks.buff, t.x-5, t.y-5, 80, 80, .2);
      if (t.d) {
        const {x, y, d} = t.damage;
        for (let i = 0; i < 2; i++) {
          GUI.drawText((d < 0 ? '+' : '-')+Math.round(d), x, y, Math.round(d/5)+[20, 15][i], [0xffffff, PixelTanks.user.username === t.u ? 0xff0000 : 0x0000ff][i], 0.5);
        }
      }
      
      if (t.emote) {
        GUI.drawImage(PixelTanks.images.emotes.speech, t.x+90, t.y-15, 100, 100, 1);
        GUI.drawImage(PixelTanks.images.emotes[t.emote.a], t.x+90, t.y-15, 100, 100, 1, 0, 0, 0, 0, 0, t.emote.f*50, 0, 50, 50);
      }

      if (t.dedEffect) {
        const {speed, frames, kill} = PixelTanks.images.deathEffects[t.dedEffect.id+'_'];
        if (t.dedEffect.time/speed > frames) return;
        if (t.dedEffect.time/speed < kill) {
        GUI.drawImage(PixelTanks.images.tanks.bottom, t.dedEffect.x, t.dedEffect.y, 80, 80, 1, 40, 40, 0, 0, 0);
        GUI.drawImage(PixelTanks.images.tanks.destroyed, t.dedEffect.x, t.dedEffect.y, 80, 90, 1, 40, 40, 0, 0, t.dedEffect.r);
      if (t.cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[t.cosmetic], t.dedEffect.x, t.dedEffect.y, 80, 90, 1, 40, 40, 0, 0, t.dedEffect.r);
        }
        GUI.drawImage(PixelTanks.images.deathEffects[t.dedEffect.id], t.dedEffect.x-60, t.dedEffect.y-60, 200, 200, 1, 0, 0, 0, 0, 0, Math.floor(t.dedEffect.time/speed)*200, 0, 200, 200);
      }

      if (t.animation) GUI.drawImage(PixelTanks.images.animations[t.animation.id], t.x, t.y, 80, 90, 1, 0, 0, 0, 0, 0, t.animation.frame*40, 0, 40, 45);

      if (t.healing && t.class === 'medic' && !t.ded) {
        const target = this.hostupdate.tanks.find(tank => tank.username === t.healing);
         if (Math.sqrt(Math.pow(this.x-d.t.x, 2)+Math.pow(this.y-d.t.y, 2)) > 500) return;
        GUI.draw.beginPath();
        GUI.draw.lineStyle(10, 0x00FF00, .7);
        GUI.draw.moveTo(t.x+40, t.y+40);
        GUI.draw.lineTo(this.x+40, this.y+40);
        GUI.draw.endFill();
        GUI.draw.lineStyle(0, 0x000000, 1);
      }
    }

    frame() {
      this.render = requestAnimationFrame(this.frame.bind(this));
      GUI.clear();
      if (this.hostupdate.logs === undefined) {
        GUI.draw.fillStyle = '#000000';
        return GUI.draw.fillText('Loading Terrain...', 100, 100);
      }
      this.fps++;
      const t = this.hostupdate.tanks, b = this.hostupdate.blocks, s = this.hostupdate.bullets, a = this.hostupdate.ai, e = this.hostupdate.explosions;
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
      if (this.b) this.tank.baseFrame = ((this.b.o ? 0 : 1)+Math.floor((Date.now()-this.b.t)/60))%2;
      this.tank.baseRotation = (this.left === null) ? (this.up ? 180 : 0) : (this.left ? (this.up === null ? 90 : (this.up ? 135 : 45)) : (this.up === null ? 270 : (this.up ? 225: 315)));

      const player = t.find(tank => tank.username === PixelTanks.user.username);
      player.x = this.tank.x;
      player.y = this.tank.y;
      player.r = this.tank.r;
      player.baseRotation = this.tank.baseRotation;
      player.baseFrame = this.tank.baseFrame;
      GUI.draw.setTransform(PixelTanks.resizer, 0, 0, PixelTanks.resizer, (-tank.x+760)*PixelTanks.resizer, (-this.y+460)*PixelTanks.resizer);

      GUI.drawImage(PixelTanks.images.blocks.floor, 0, 0, 3000, 3000, 1);

      b.forEach(block => this.drawBlock(block));
      s.forEach(shot => this.drawShot(shot));
      a.forEach(ai => this.drawAi(ai));
      t.forEach(tank => this.drawTank(tank));
      for (const block of b) {
        if (b.s) {
          GUI.draw.fillStyle = '#000000';
          GUI.draw.fillRect(b[l].x-2, b[l].y+108, 104, 11);
          GUI.draw.fillStyle = '#0000FF';
          GUI.draw.fillRect(b[l].x, b[l].y+110, 100*b[l].hp/b[l].maxHp, 5);
        }
      }
      e.forEach(e => this.drawExplosion(e));
      
      GUI.draw.setTransform(PixelTanks.resizer, 0, 0, PixelTanks.resizer, 0, 0);
      GUI.drawImage(PixelTanks.images.menus.ui, 0, 0, 1600, 1000, 1);
      GUI.draw.fillStyle = PixelTanks.userData.color;
      GUI.draw.globalAlpha = 0.5;
      for (let i = 0; i < 4; i++) {
        const c = [500, 666, 832, 998];
        GUI.drawImage(PixelTanks.images.items[PixelTanks.userData.items[i]], c[i], 900, 100, 100, 1);
        GUI.draw.fillRect(c[i], 900+Math.min((Date.now()-this.timers.items[i].time)/this.timers.items[i].cooldown, 1)*100, 100, 100);
      }
      for (let i = 0; i < 3; i++) {
        GUI.draw.fillRect([418, 1132, 1212][i], 950+Math.min((Date.now()-this.timers[['powermissle', 'toolkit', 'boost'][i]])/[10000, 30000, 5000][i], 1)*50, 50, 50);
      }
      GUI.draw.fillRect(348, 950+Math.min((Date.now()-this.timers.class.time)/this.timers.class.cooldown, 1)*50, 50, 50);
      GUI.draw.globalAlpha = 1;

      GUI.draw.fillStyle = '#000000';
      GUI.draw.globalAlpha = .2;
      GUI.draw.fillRect(0, 0, 180, 250);
      GUI.draw.globalAlpha = 1;
      GUI.drawText('Kills Streak: '+this.kills, 10, 50, 30, '#ffffff', 0);
      GUI.drawText('Crates: '+this.crates, 10, 100, 30, '#ffffff', 0);
      GUI.drawText('Experience: '+this.xp, 10, 150, 30, '#ffffff', 0);
      GUI.drawText('Coins: '+this.coins, 10, 200, 30, '#ffffff', 0);

      var l = 0, len = Math.min((this.showChat || this.hostupdate.logs.length<3) ? this.hostupdate.logs.length : 3, 30);
      while (l<len) {
        GUI.draw.fillStyle = '#000000';
        GUI.draw.globalAlpha = .2;
        GUI.draw.fillRect(0, 800-l*30, GUI.draw.measureText(this.hostupdate.logs[l].m).width, 30);
        GUI.draw.globalAlpha = 1;
        GUI.drawText(this.hostupdate.logs[l].m, 0, 800-l*30, 30, this.hostupdate.logs[l].c, 0);
        l++;
      }

      if (this.showChat) {
        GUI.draw.fillStyle = '#000000';
        GUI.draw.globalAlpha = .2;
        GUI.draw.fillRect(0, 830, GUI.draw.measureText(this.msg).width, 30);
        GUI.draw.globalAlpha = 1;
        GUI.drawText(this.msg, 0, 830, 30, '#ffffff', 0);
      }

      
      if (player.flashbanged) {
        GUI.draw.fillStyle = '#FFFFFF';
        GUI.draw.fillRect(0, 0, 1600, 1000);
      }
    }

    chat(e) {
      if (e.key.length === 1) this.msg += e.key;
      if (e.keyCode === 8) this.msg = this.msg.slice(0, -1);
      if (e.keyCode === 13) {
        if (this.msg !== '') {
          this.socket.send(this.msg.charAt(0) === '/' ? {type: 'command', data: this.msg.split(' ')} : {type: 'chat', msg: this.msg});
          this.msg = '';
        }
        this.showChat = false;
      }
    }

    keydown(e) {
      e.preventDefault();
      if (!this.key[e.keyCode]) {
        if (this.showChat) return this.chat(e);
        this.keyStart(e);
        this.keyLoop(e);
        this.key[e.keyCode] = setInterval(this.keyLoop.bind(this), 15, e);
      }
    }

    keyup(e) {
      e.preventDefault();
      clearInterval(this.key[e.keyCode]);
      this.key[e.keyCode] = false;
      if (e.keyCode == 65 || e.keyCode == 68) this.left = null;
      if (e.keyCode == 87 || e.keyCode == 83) this.up = null;
      if (this.dx && (e.keyCode === 65 && this.dx.a < 0 || e.keyCode === 68 && this.dx.a > 0)) this.dx = false;
      if (this.dy && (e.keyCode === 87 && this.dy.a < 0 || e.keyCode === 83 && this.dy.a > 0)) this.dy = false;
      if ([87, 65, 68, 83].includes(e.keyCode)) {
        this.b = false;
        if (this.key[65]) this.keyStart({keyCode: 65});
        if (this.key[68]) this.keyStart({keyCode: 68});
        if (this.key[87]) this.keyStart({keyCode: 87});
        if (this.key[83]) this.keyStart({keyCode: 83});
      }
    }

    mousemove(e) {
      const x = e.clientX-window.innerWidth/2, y = e.clientY-window.innerHeight/2;
      this.tank.r = this.toAngle(x, y);
      this.mouse = {x, y};
    }

    toAngle(x, y) {
      return (-Math.atan2(x, y)*180/Math.PI+360)%360;
    }

    toPoint(angle) {
      const theta = (-angle)*Math.PI/180, y = Math.cos(theta), x = Math.sin(theta);
      return {x: x/Math.abs(x), y: y/Math.abs(x)};
    }

    mousedown(e) {
      if (this.canFire) this.fire(e.button);
      clearInterval(this.fireInterval);
      this.fireInterval = setInterval(this.fire.bind(this), this.fireType === 1 ? 200 : 600, e.button);
    }

    mouseup() {
      clearInterval(this.fireInterval);
    }

    fire(type) {
      if (type === 2) {
        if (!this.canPowermissle) return;
        this.canPowermissle = false;
        this.timers.powermissle = Date.now();
        setTimeout(() => {
          this.canPowermissle = true;
        }, 10000);
      } else if (type === 0) {
        this.canFire = false;
        setTimeout(function(){this.canFire = true}.bind(this), this.fireType === 1 ? 200 : 600);
      }
      var fireType = ['grapple', 'megamissle', 'dynamite', 2].includes(type) ? 1 : this.fireType, type = type === 2 ? (PixelTanks.userData.class === 'medic' ? 'healmissle' : 'powermissle') : (type === 0 ? (this.fireType === 1 ? 'bullet' : 'shotgun') : type), l = fireType === 1 ? 0 : -10;
      while (l<(fireType === 1 ? 1 : 15)) {
        this.tank.fire.push({...this.toPoint(this.tank.r+l), type: type, r: this.tank.r+l});
        l += 5;
      }
    }

    collision(x, y) {

      var l = 0, team;
      while (l < this.hostupdate.tanks.length) {
        if (this.hostupdate.tanks[l].username === PixelTanks.user.username) {
          team = this.hostupdate.tanks[l].team.split(':')[1].replace('@leader', '').replace('@requestor#', '');
          if (this.hostupdate.tanks[l].ded) return true;
        }
        l++;
      }

      if (x < 0 || y < 0 || x + 80 > 3000 || y + 80 > 3000) return false;

      if (this.tank.invis && this.tank.immune) return true;
      var l = 0, blocks = this.hostupdate.blocks, len = blocks.length;
      while (l<len) {
        if ((x > blocks[l].x || x + 80 > blocks[l].x) && (x < blocks[l].x + 100 || x + 80 < blocks[l].x + 100) && (y > blocks[l].y || y + 80 > blocks[l].y) && (y < blocks[l].y + 100 || y + 80 < blocks[l].y + 100)) {
          if ((blocks[l].type === 'fire' || blocks[l].type === 'fortress' && blocks[l].team.split(':')[1] === team)) {} else if (blocks[l].c) return false;
        }
        l++;
      }
      return true;
    }

    playAnimation(id) {
      this.tank.animation = {id: id, frame: 0};
      clearInterval(this.animationInterval);
      this.animationInterval = setInterval(function() {
        if (this.tank.animation.frame === PixelTanks.images.animations[id+'_'].frames) {
          clearInterval(this.animationInterval);
          setTimeout(function() {this.tank.animation = false}.bind(this), PixelTanks.images.animations[id+'_'].speed);
        } else this.tank.animation.frame++;
      }.bind(this), PixelTanks.images.animations[id+'_'].speed);
    }

    item(id, slot) {
      const key = {
        duck_tape: [() => {
          this.tank.use.push('tape');
          this.playAnimation('tape');
        }, 30000, false],
        super_glu: [() => {
          this.tank.use.push('glu');
          this.playAnimation('glu');
        }, 40000, false],
        shield: [() => {
          this.tank.use.push('shield');
        }, 30000, false],
        weak: [() => {
          this.tank.use.push('block');
          this.tank.blockType = PixelTanks.userData.class === 'builder' ? 'strong' : 'weak';
        }, 3000, false],
        strong: [() => {
          this.tank.use.push('block');
          this.tank.blockType = PixelTanks.userData.class === 'builder' ? 'gold' : 'strong';
        }, 7000, false],
        spike: [() => {
          this.tank.use.push('block');
          this.tank.blockType = 'spike';
        }, 10000, false],
        flashbang: [() => {
          this.tank.use.push('flashbang');
        }, 40000, false],
        bomb: [() => {
          this.tank.use.push('bomb');
        }, 5000, false],
        mine: [() => {
          this.tank.use.push('block');
          this.tank.blockType = 'mine';
        }, 1000, false],
        dynamite: [() => {
          if (!this['canItem'+slot]) {
            this.tank.use.push('dynamite');
          } else {
            this.fire('dynamite');
            this['canItem'+slot] = false;
            this.timers.items[slot].cooldown = 25000;
            this.timers.items[slot].time = new Date();
            setTimeout(function() {
              this['canItem'+slot] = true;
            }.bind(this), 25000);
          }
        }, 25000, true],
        airstrike: [() => {
          this.tank.airstrike = {x: this.mouse.x/PixelTanks.resizer-this.tank.x+1460, y: this.mouse.y/PixelTanks.resizer-this.tank.y+860};
        }, 40000, false],
        fortress: [() => {
          this.tank.use.push('block');
          this.tank.blockType = 'fortress';
        }, 30000, false],
      }
      this.useItem(key[id][0], key[id][1], slot, key[id][2]);
    }

    useItem(enable, cooldown, slot, c) {
      if (c) return enable();
      if (this['canItem'+slot]) {
        enable = enable.bind(this);
        enable();
        this.timers.items[slot].cooldown = cooldown;
        this.timers.items[slot].time = Date.now();
        this['canItem'+slot] = false;
        setTimeout(function() {
          this['canItem'+slot] = true;
        }.bind(this), cooldown);
      }
    }

    keyStart(e) {
      if (this.paused && e.keyCode !== 22) return;
      const k = e.keyCode;
      if ([65, 68].includes(k)) {
        this.dx = {o: this.tank.x, t: Date.now(), a: k === 65 ? -1 : 1, b: false};
        this.b = {o: this.tank.baseFrame, t: Date.now()};
      } else if ([83, 87].includes(k)) {
        this.dy = {o: this.tank.y, t: Date.now(), a: k === 87 ? -1 : 1, b: false};
        this.b = {o: this.tank.baseFrame, t: Date.now()};
      }
      for (let i = 0; i < 4; i++) {
        if (k === PixelTanks.userData.keybinds.items[i]) this.item(PixelTanks.userData.items[i], i);
      }
      for (let i = 0; i < 6; i++) {
        if (k === PixelTanks.userData.keybinds.emotes[i]) this.emote(Pixel.userData.emotes[i]);
      }
      if (k === 14) this.showChat = true;
      if (k === 9) {
        this.fireType = this.fireType < 2 ? 2 : 1;
        clearInterval(this.fireInterval);
      } else if (k === 82 && this.canGrapple) {
        this.fire('grapple');
        this.canGrapple = false;
        setTimeout(() => {this.canGrapple = true}, 5000);
      } else if (k === 81) {
        if (this.halfSpeed || this.canToolkit) {
          this.tank.use.push('toolkit');
          this.halfSpeed = !this.halfSpeed;
        }
        if (this.canToolkit) {
          this.canToolkit = false;
          this.timers.toolkit = new Date();
          setTimeout(() => {this.canToolkit = true}, 40000);
          setTimeout(() => {this.halfSpeed = false}, PixelTanks.userData.class === 'medic' ? 5000 : 7500);
          this.playAnimation('toolkit');
        }
      } else if (k === 70) {
        const c = PixelTanks.userData.class;
        if (c === 'stealth') {
          if (this.tank.invis || this.canInvis) this.tank.invis = !this.tank.invis;
          if (this.canInvis)  {
            this.canInvis = false;
            this.timers.class = {time: Date.now(), cooldown: 30000};
            this.invis = setTimeout(() => {
              this.tank.invis = false;
              this.invis = setTimeout(() => {
                this.canInvis = true;
              }, 30000);  
            }, 30000);
          } else if (this.tank.invis) {
            setTimeout(() => {
              this.canInvis = true;
            }, 30000-(Date.now()-this.timers.class.time));
          }
        } else if (c === 'tactical' && this.canMegamissle) {
          this.fire('megamissle');
          this.canMegamissle = false;
          this.timers.class = {time: Date.now(), cooldown: 30000};
          setTimeout(() => {this.canMegamissle = true}, 30000);
        } else if (c === 'builder' && this.canTurret) {
          this.canTurret = false;
          this.tank.use.push('turret');
          this.timers.class = {time: Date.now(), cooldown: 40000};
          setTimeout(() => {this.canTurret = true}, 40000);
        } else if (c === 'warrior' && this.canBuff) {
          this.tank.use.push('buff');
          this.canBuff = false;
          this.timers.class = {time: Date.now(), cooldown: 40000};
          setTimeout(() => {this.canBuff = true}, 40000);
        } else if (c === 'medic') {
          this.tank.use.push('healSwitch');
          this.timers.class = {time: Date.now(), cooldown: 0};
        } else if (c === 'fire' && this.canFlame) {
          this.canFlame = false;
          this.timers.class = {time: Date.now(), cooldown: 10000};
          for (let i = -30; i < 30; i += 5) this.tank.fire.push({...this.toPoint(this.tank.r+i), type: 'fire', r: this.tank.r+i});
          setTimeout(() => {this.canFlame = true}, 10000);
        }
      } else if (k === 27) {
        this.paused = !this.paused;
        if (this.paused) {
         GUI.draw.fillStyle = '#000000';
          GUI.draw.fillRect(0, 0, 1600, 1000);
        } else {
          Menus.removeListeners()
        }
      }
    }

    keyLoop(e) {
      if (e.keyCode === 16) {
        if (this.canBoost) {
          this.speed = 16;
          this.canBoost = false;
          this.tank.immune = true;
          this.timers.boost = Date.now();
          if (PixelTanks.userData.class === 'tactical') this.tank.use.push('mine');
          setTimeout(() => {
            this.speed = 4;
            this.tank.immune = false;
            if (PixelTanks.userData.class === 'tactical') this.tank.use.push('mine');
            if (PixelTanks.userData.class === 'stealth') this.tank.use.push('bomb');
          }, 500);
          setTimeout(() => {this.canBoost = true}, 5000);
        }
      }
    }

    emote(id) {
      clearInterval(this.emoteAnimation);
      clearTimeout(this.emoteTimeout);
      const {type, frames} = PixelTanks.images.emotes[id+'_'];
      this.tank.emote = {a: id, f: 0};
      if (type !== 2) this.emoteAnimation = setInterval(() => {
        if (this.tank.emote.f !== frames) {
          this.tank.emote.f++;
        } else if (type === 0) {
          this.tank.emote.f = 0;
        }
      }, 50);
      this.emoteTimeout = setTimeout(() => {
        clearInterval(this.emoteAnimation);
        this.tank.emote = null;
      }, type < 2 ? 5000 : 1500+50*frames);
    }

    send() {
      const updateData = {username: PixelTanks.user.username, type: 'update', data: this.tank}
      if (this.multiplayer && this.socket.status === 'connected') {
        this.ops++;
        this.socket.send(updateData);
      } else {
        this.world.update(updateData);
      }
      this.tank.blockType = null;
      this.tank.airstrike = null;
      this.tank.fire = [];
      this.tank.use = [];
    }
  }

  window.onload = PixelTanks.start;
};