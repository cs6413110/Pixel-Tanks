const msgpack = document.createElement('SCRIPT');
msgpack.src = 'https://cs6413110.github.io/Pixel-Tanks/public/js/msgpackr.js';
msgpack.onload = () => {
  const pathfinding = document.createElement('SCRIPT');
  pathfinding.src = 'https://cs6413110.github.io/Pixel-Tanks/public/js/pathfinding.js';
  pathfinding.onload = () => {
    const engine = document.createElement('SCRIPT');
    engine.src = 'https://cs6413110.github.io/Pixel-Tanks/public/js/engine.js';
    engine.onload = Game;
    document.head.appendChild(engine);
  }
  document.head.appendChild(pathfinding);
}
document.head.appendChild(msgpack);
function Game() {
  class MegaSocket {
    constructor(url, options={keepAlive: true, autoconnect: true, reconnect: false}) {
      this.url = url;
      this.options = options;
      this.callstack = {open: [], close: [], message: []};
      this.status = 'idle';
      window.addEventListener('offline', () => {
        this.socket.close();
        this.socket.onclose();
      });
      if (this.options.reconnect) window.addEventListener('online', this.connect.bind(this));
      if (this.options.autoconnect) {
        this.status = 'connecting';
        this.connect();
      }
    }

    connect() {
      this.socket = new WebSocket(this.url);
      this.socket.binaryType = 'arraybuffer';
      this.socket.onopen = () => {
        this.status = 'connected';
        if (this.options.keepAlive) this.socket.keepAlive = setInterval(() => {
          this.socket.send(msgpackr.pack({type: 'ping', op: 'ping'}));
        }, 30000);
        this.callstack.open.forEach(f => f());
      }
      this.socket.onmessage = data => {
        try {
          data = msgpackr.unpack(new Uint8Array(data.data));
        } catch(e) {
          alert('Socket Encryption Error: ' + data.data+' | '+e);
        }
        if (data.status === 'error') {
          if (data.message === 'Invalid token.') {
            clearInterval(PixelTanks.autosave);
            if (PixelTanks.user.player) PixelTanks.user.player.implode();
            PixelTanks.user.token = undefined;
            PixelTanks.user.username = undefined;
            return Menus.trigger('start');
          }
          return alert(data.message);
        }
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
      data = msgpackr.pack(data);
      this.socket.send(data);
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
      this.buttonEffect = true;
      this.cdraw = cdraw.bind(this);
      this.listeners.click = this.onclick;
      for (const l in this.listeners) this.listeners[l] = this.listeners[l].bind(this);
      for (const b of this.buttons) {
        if (typeof b[4] === 'function') b[4] = b[4].bind(this);
        b[6] = 0;
      }
      this.render = [0, 0, 1600, 1000];
      if (PixelTanks.images.menus[this.id] !== undefined) {
        const oldload = PixelTanks.images.menus[this.id].onload;
        PixelTanks.images.menus[this.id].onload = () => {
          oldload();
          this.compile();
        }
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
        if (A.collider({x: Menus.x, y: Menus.y, w: 0, h: 0}, {x: this.render[0]+b[0], y: this.render[1]+b[1], w: b[2]*this.render[2]/1600, h: b[3]*this.render[3]/1000})) {
          if (typeof b[4] === 'function') {
            return b[4]();
          } else return Menus.trigger(b[4]);
        }
      }
    }

    compile() {
      this.cache = [];
      for (const b of this.buttons) {
        const x = this.render[0]+b[0]*this.render[2]/1600, y = this.render[1]+b[1]*this.render[3]/1000, w = b[2]*this.render[2]/1600, h = b[3]*this.render[3]/1000;
        const canvas = document.createElement('canvas'), draw = canvas.getContext('2d');
        canvas.width = w*PixelTanks.resizer;
        canvas.height = h*PixelTanks.resizer;
        canvas.style = 'border: 1px solid black';
        draw.setTransform(PixelTanks.resizer, 0, 0, PixelTanks.resizer, -x*PixelTanks.resizer, -y*PixelTanks.resizer);
        if (PixelTanks.images.menus[this.id]) draw.drawImage(PixelTanks.images.menus[this.id], this.render[0], this.render[1], this.render[2], this.render[3]);
        this.cache.push([x, y, w, h, canvas]);
      }
    }
    
    draw(render) {
      if (render && JSON.stringify(render) !== JSON.stringify(this.render)) {
        this.render = render;
        this.compile();
      }
      if (PixelTanks.images.menus[this.id]) GUI.drawImage(PixelTanks.images.menus[this.id], this.render[0], this.render[1], this.render[2], this.render[3], 1);
      this.cdraw();
      if (!this.buttonEffect) return;
      for (const b of this.buttons) {
        if (b[5]) {
          const [x, y, w, h, canvas] = this.cache[this.buttons.indexOf(b)];
          if (A.collider({x, y, w, h}, {x: Menus.x, y: Menus.y, w: 0, h: 0})) {
            b[6] = Math.min(b[6]+1, 10);
          } else {
            b[6] = Math.max(b[6]-1, 0);
          }
          GUI.drawImage(canvas, x-b[6], y-b[6]*h/w, w+b[6]*2, h+b[6]*2*h/w, 1);
        }
      }
    }
  }
    
  class Menus {
    static start() {
      Menus.renderer = requestAnimationFrame(Menus.render);
    }
  
    static render() {
      Menus.renderer = requestAnimationFrame(Menus.render);
      GUI.clear();
      Menus.redraw();
    }
  
    static mouseLog(e) {
      Menus.x = (e.clientX-(window.innerWidth-window.innerHeight*1.6)/2)/PixelTanks.resizer;
      Menus.y = e.clientY/PixelTanks.resizer;
    }
  
    static stop() {
      cancelAnimationFrame(Menus.renderer);
      Menus.renderer = undefined;
    }
  
    static trigger(name) {
      if (Menus.current) Menus.menus[Menus.current].removeListeners();
      if (Menus.renderer === undefined) Menus.start();
      Menus.current = name;
      Menus.menus[Menus.current].addListeners();
    }
  
    static redraw() {
      if (!Menus.current) return;
      Menus.menus[Menus.current].draw([0, 0, 1600, 1000]);
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
        image.onerror = () => alert(`Failed to load image: ${source}`);
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
      if (a !== undefined) {
        GUI.draw.translate(x+px, y+py);
        GUI.draw.rotate(a*Math.PI/180);
      }
      GUI.draw.globalAlpha = t;
      if (cx || cy || cy || ch) {
        GUI.draw.drawImage(image, cx, cy, cw, ch, x, y, w, h);
      } else {
        GUI.draw.drawImage(image, a !== undefined ? -px+bx : x, a !== undefined ? -py+by : y, w, h);
      }
      GUI.draw.globalAlpha = 1;
      if (a !== undefined) {
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
      GUI.draw.imageSmoothingEnabled = false;
      Menus.scaler.getContext('2d').imageSmoothingEnabled = false;
      document.body.appendChild(GUI.canvas);
      PixelTanks.resizer = window.innerHeight/1000;
      GUI.canvas.height = window.innerHeight;
      GUI.canvas.width = window.innerHeight*1.6;
      GUI.canvas.style = 'background-color: black;';
      GUI.draw.setTransform(PixelTanks.resizer, 0, 0, PixelTanks.resizer, 0, 0);
      GUI.drawText('Loading Font', 800, 500, 50, '#fffff', 0.5);
      window.oncontextmenu = () => {return false};
      window.addEventListener('resize', GUI.resize);
      window.addEventListener('mousemove', Menus.mouseLog);
    }
  
    static updateBootProgress(progress) {
      GUI.clear();
      GUI.drawText(Math.round(progress*100)+'%', 800, 500, 50, '#ffffff', 0.5);
    }

    static boot() {
      PixelTanks.user = {};
      const config = document.createElement('SCRIPT');
      config.src = 'https://cs6413110.github.io/Pixel-Tanks/public/js/config.js';
      config.onload = () => {
        PixelTanks.images = images;
        Loader.loadImages(PixelTanks.images);
      Menus.menus = {
        start: {
          buttons: [
            [544, 648, 216, 116, function() {PixelTanks.auth(this.username, this.password, 'login')}, true],
            [840, 648, 216, 116, function() {PixelTanks.auth(this.username, this.password, 'signup')}, true],
            [564, 392, 456, 80, function() {this.type = 'username'}, false],
            [564, 520, 456, 80, function() {this.type = 'password'}, false],
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
            GUI.drawText(this.username, 574, 407, 50, '#000000', 0);
            GUI.drawText(this.password.replace(/./g, '*'), 574, 535, 50, '#000000', 0);
          },
        },
        main: {
          buttons: [
            [972, 840, 88, 88, 'keybinds', true],
            [532, 616, 536, 136, 'multiplayer', true],
            [648, 840, 88, 88, 'shop', true],
            [540, 840, 88, 88, 'inventory', true],
            [756, 840, 88, 88, 'crate', true],
            [864, 840, 88, 88, 'help', true],
            [532, 392, 536, 136, 'singleplayer', true],
            /*[320, 920, 80, 80, function() {
              clearInterval(PixelTanks.autosave);
              PixelTanks.user.token = undefined;
              PixelTanks.user.username = undefined;
              Menus.trigger('start');
            }],*/ // logout
          ],
          listeners: {},
          cdraw: function() {
            PixelTanks.renderBottom(1200, 600, 160, PixelTanks.userData.color);
            GUI.drawImage(PixelTanks.images.tanks.bottom, 1200, 600, 160, 160, 1);
            PixelTanks.renderTop(1200, 600, 160, PixelTanks.userData.color);
            GUI.drawImage(PixelTanks.images.tanks.top, 1200, 600, 160, 180, 1);
            if (PixelTanks.userData.cosmetic !== '' && PixelTanks.userData.cosmetic !== undefined) GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic], 1200, 600, 160, 180, 1);
            GUI.drawText(PixelTanks.user.username, 1280, 800, 100, '#ffffff', 0.5);
          },
        },
        singleplayer: {
          buttons: [
            [25, 28, 80, 74, 'main', true],
          ],
          listeners: {
            mousedown: function(e) {
              const {x, y} = Menus;
              const levelCoords = [
                [31, 179],
                [244, 179],
                [452, 179],
                [672, 179],
                [890, 179],
                [31, 262],
                [244, 262],
                [452, 262],
                [672, 262],
                [890, 262],
                [31, 345],
                [244, 345],
                [452, 345],
                [672, 345],
                [890, 345],
                [31, 428],
                [244, 428],
                [452, 428],
                [672, 428],
                [890, 428],
              ];
              for (const c of levelCoords) {
                if (x > c[0]*1600/1049 && x < (c[0]+80)*1600/1049 && y > c[1]*1000/653 && y < (c[1]+74)*1000/653) {
                  Menus.removeListeners();
                  PixelTanks.user.player = new Tank(levelCoords.indexOf(c)+10, false, null);
                }
              }
            }
          },
          cdraw: function() {},
        },
        victory: {
          buttons: [
            [656, 603, 313, 112, 'main', true],
            [558, 726, 505, 114, function() {
              alert('lol idk')
            }, true],
          ],
          listeners: {},
          cdraw: function() {
            
          },
        },
        defeat: {
          buttons: [
            [656, 603, 313, 112, 'main', true],
            [558, 726, 505, 114, function() {
              alert('lol idk')
            }, true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        multiplayer: {
          buttons: [
            [424, 28, 108, 108, 'main'],
            [340, 376, 416, 116, function() {this.gamemode = 'ffa'}, true],
            [340, 532, 416, 116, function() {this.gamemode = 'duels'}, true],
            [340, 688, 416, 116, function() {this.gamemode = 'tdm'}, true],
            [340, 844, 416, 116, function() {this.gamemode = 'juggernaut'}, true],
            [868, 848, 368, 88, function() {
              PixelTanks.user.player = new Tank(this.ip, true, this.gamemode);
              Menus.removeListeners();
            }, true],
          ],
          listeners: {
            keydown: function(e) {
              if (e.key.length === 1) {
                this.ip += e.key;
              } else if (e.keyCode === 8) {
                this.ip = this.ip.slice(0, -1);
              } else if (e.keyCode !== -1) return;
              this.socket = new MegaSocket((window.location.protocol === 'https:' ? 'wss://' : 'ws://')+this.ip, {keepAlive: false, reconnect: true, autoconnect: true});
              this.socket.on('connect', () => {
                this.socket.send({username: PixelTanks.user.username, type: 'stats'});
              });
              this.socket.on('message', (d) => {
                this.output = d;
              });
            }
          },
          cdraw: function() {
            if (!this.gamemode) {
              this.gamemode = 'ffa';
              this.output = {FFA: '', DUELS: '', TDM: ''};
              this.ip = '141.148.128.231/ffa';
              this.listeners.keydown({keyCode: -1, key: ''});
            }
            GUI.drawText(this.gamemode, 1200, 800, 50, '#FFFFFF', 0.5);
            GUI.drawText(this.ip, 800, 276, 50, '#FFFFFF', 0.5);
            GUI.drawText(this.output.FFA.length, 820, 434, 50, '#FFFFFF', 0.5);
            GUI.drawText(this.output.DUELS.length, 820, 590, 50, '#FFFFFF', 0.5);
            GUI.drawText(this.output.TDM.length, 820, 764, 50, '#FFFFFF', 0.5);
            let offset = 0;
            for (const server of this.output[this.gamemode.toUpperCase()]) {
              if (server !== null) for (const player of server) {
                GUI.drawText(player, 880, 400+40*offset, 50, '#FFFFFF', 0);
                offset++;
              }
            }
          }
        },
        crate: {
          buttons: [
            [416, 20, 81, 81, 'main', true],
            [232, 308, 488, 488, function() {PixelTanks.openCrate(0)}, false],
            [880, 308, 488, 488, function() {PixelTanks.openCrate(1)}, false],
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
        help: {
          buttons: [
            [44, 44, 80, 80, 'main', true],
            [684, 764, 236, 80, 'helpinventory', true],
            [1024, 764, 236, 80, 'helpcosmetic', true],
            [1344, 764, 236, 80, 'helpclass', true],
            [44, 884, 236, 80, 'helpmode', true],
            [364, 884, 236, 80, 'helpvocab', true],
            [1344, 884, 236, 80, 'helpteam', true],
          ],
          listeners: {
            mousedown: function(e) {
              const {x, y} = Menus;
              const helpCoords = [
                [44, 644],
                [364, 644],
                [684, 644],
                [1024, 644],
                [1344, 644],
                [44, 764],
                [364, 764],
                [684, 884],
                [1344, 884],
              ];
              for (const c of helpCoords) {
                if (x > c[0] && x < c[0]+80 && y > c[1] && y < c[1]+74) {
                  Menus.removeListeners();
                  PixelTanks.user.player = new Tank(helpCoords.indexOf(c)+1, false, null);
                }
              }
            }
          },
          cdraw: function() {
            const helpCoords = [
                [44, 644],
                [364, 644],
                [684, 644],
                [1024, 644],
                [1344, 644],
                [44, 764],
                [364, 764],
                [684, 884],
                [1344, 884],
              ];
            GUI.draw.fillStyle = '#000000';
            for (const c of helpCoords) GUI.draw.fillRect(c[0], c[1], 80, 74);
          },
        },
        helpinventory: {
          buttons: [
            [120, 132, 120, 120, 'help', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        helpcosmetic: {
          buttons: [
            [120, 132, 120, 120, 'help', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        helpclass: {
          buttons: [
            [120, 132, 120, 120, 'help', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        helpmode: {
          buttons: [
            [120, 132, 120, 120, 'help', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        helpvocab: {
          buttons: [
            [120, 132, 120, 120, 'help', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        helpteam: {
          buttons: [
            [120, 132, 120, 120, 'help', true],
          ],
          listeners: {},
          cdraw: function() {},
        },
        inventory: {
          buttons: [
            [416, 20, 108, 108, 'main', true],
            [1064, 460, 88, 88, PixelTanks.upgrade, true],
            [1112, 816, 88, 88, function() {PixelTanks.switchTab('classTab')}, false],
            [400, 816, 88, 88, function() {PixelTanks.switchTab('itemTab', 1)}, false],
            [488, 816, 88, 88, function() {PixelTanks.switchTab('itemTab', 2)}, false],
            [576, 816, 88, 88, function() {PixelTanks.switchTab('itemTab', 3)}, false],
            [664, 816, 88, 88, function() {PixelTanks.switchTab('itemTab', 4)}, false],
            [756, 220, 88, 88, function() {PixelTanks.switchTab('cosmeticTab')}, false],
            [532, 220, 88, 88, function() {PixelTanks.switchTab('deathEffectsTab')}, false],
          ],
          listeners: {
            mousedown: function(e) {
              const {x, y} = Menus;
              if (this.classTab) {
                if (x < 688 || x > 912 || y < 334 || y > 666) return this.classTab = false;
                for (let xm = 0; xm < 2; xm++) {
                  for (let ym = 0; ym < 3; ym++) {
                    if (collision(x, y, 0, 0, [702, 810][xm], [348, 456, 564][ym], 88, 88)) {
                      if (PixelTanks.userData.classes[[[0, 5, 3], [1, 4, 2]][xm][ym]]) {
                        PixelTanks.userData.class = [['tactical', 'fire', 'medic'], ['stealth', 'builder', 'warrior']][xm][ym];
                      } else alert('You need to buy this first!');
                      return;
                    }
                  }
                }
              } else if (this.itemTab) {
                if (x < 580 || x > 1020 || y < 334 || y > 666) return this.itemTab = false;
                const key = {airstrike: [600, 354], super_glu: [708, 354], duck_tape: [816, 354], shield: [924, 354], flashbang: [600, 462], bomb: [708, 462], dynamite: [816, 462], usb: [924, 462], weak: [600, 570], strong: [708, 570], spike: [816, 570], reflector: [904, 570]};
                for (const item in key) {
                  if (collision(x, y, 0, 0, key[item][0], key[item][1], 80, 80)) {
                    if (!PixelTanks.userData.items.includes(item)) {
                      PixelTanks.userData.items[this.currentItem-1] = item;
                    } else alert('You are not allowed to have more than 1 of the same item');
                    return;
                  }
                }
              } else if (this.cosmeticTab) {
                if (x < 518 || x > 1082 || y < 280 || y > 720) return Menus.menus.inventory.cosmeticTab = false;
                for (let i = 0; i < 16; i++) {
                  if (collision(x, y, 0, 0, 598+(i%4)*108, 298+Math.floor(i/4)*108, 88, 88)) {
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
                  if (collision(x, y, 0, 0, 598+(i%4)*108, 298+Math.floor(i/4)*108, 88, 88)) {
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
              if (e.key.length === 1 && this.color.length < 7) {
                this.color += e.key;
                PixelTanks.userData.color = this.color;
              }
              if (e.keyCode === 8) this.color = this.color.slice(0, -1);
              if (this.cosmeticTab) {
                if (e.keyCode === 37 && this.cosmeticMenu > 0) this.cosmeticMenu--;
                if (e.keyCode === 39 && this.cosmeticMenu+1 !== Math.ceil(PixelTanks.userData.cosmetics.length/16)) this.cosmeticMenu++;
              }
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
            const coins = PixelTanks.userData.stats[0], xp = PixelTanks.userData.stats[3], rank = PixelTanks.userData.stats[4];
            const coinsUP = (rank+1)*1000, xpUP = (rank+1)*100;
            GUI.draw.fillStyle = this.color;
            GUI.draw.fillRect(1008, 260, 32, 32);
            GUI.drawText(this.color, 1052, 260, 30, '#000000', 0);
            GUI.drawText(PixelTanks.user.username, 300, 420, 80, '#000000', .5);
            GUI.drawText('Coins: '+coins, 300, 500, 50, '#FFE900', .5);
            GUI.drawText('Rank: '+rank, 300, 550, 50, '#FF2400', .5);
            GUI.drawText('Level Up Progress', 1400, 400, 50, '#000000', .5);
            GUI.drawText((rank < 20 ? coins+'/'+coinsUP : 'MAXED')+' Coins', 1400, 500, 50, rank < 20 ? (coins < coinsUP ? '#FF2400' : '#90EE90') : '#63666A', .5);
            GUI.drawText((rank < 20 ? xp+'/'+xpUP : 'MAXED')+' XP', 1400, 550, 50, rank < 20 ? (xp < xpUP ? '#FF2400' : '#90EE90') : '#63666A', .5);
            if (coins < coinsUP || xp < xpUP || rank > 19) {
              GUI.draw.fillStyle = '#000000';
              GUI.draw.globalAlpha = .7;
              GUI.draw.fillRect(1064, 458, 88, 88);
              GUI.draw.globalAlpha = 1;
            }
            for (let i = 0; i < 4; i++) GUI.drawImage(PixelTanks.images.items[PixelTanks.userData.items[i]], [404, 492, 580, 668][i], 820, 80, 80, 1);
            PixelTanks.renderBottom(680, 380, 240, PixelTanks.userData.color);
            GUI.drawImage(PixelTanks.images.tanks.bottom, 680, 380, 240, 240, 1);
            PixelTanks.renderTop(680, 380, 240, PixelTanks.userData.color, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
            GUI.drawImage(PixelTanks.images.tanks.top, 680, 380, 240, 270, 1, 120, 120, 0, 0, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
            if (PixelTanks.userData.cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic], 680, 380, 240, 270, 1, 120, 120, 0, 0, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
            const key = {tactical: [7, 7], fire: [7, 61], medic: [7, 115], stealth: [61, 7], builder: [61, 61], warrior: [61, 115]};
            if (PixelTanks.userData.class) GUI.drawImage(PixelTanks.images.menus.classTab, 1112, 816, 88, 88, 1, 0, 0, 0, 0, undefined, key[PixelTanks.userData.class][0], key[PixelTanks.userData.class][1], 44, 44);
            if (PixelTanks.userData.cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic], 760, 224, 80, 80, 1);
            const deathEffectData = PixelTanks.images.deathEffects[PixelTanks.userData.deathEffect+'_'];
            if (PixelTanks.userData.deathEffect) GUI.drawImage(PixelTanks.images.deathEffects[PixelTanks.userData.deathEffect], 536, 224, 80, 80, 1, 0, 0, 0, 0, undefined, (Math.floor((Date.now()-this.time)/deathEffectData.speed)%deathEffectData.frames)*200, 0, 200, 200);
            Menus.menus.inventory.buttonEffect = true;
            if (this.healthTab || this.classTab || this.itemTab || this.cosmeticTab || this.deathEffectsTab) {
              Menus.menus.inventory.buttonEffect = false;
              GUI.drawImage(PixelTanks.images.blocks.void, 0, 0, 1600, 1600, .7);
            }
            if (this.classTab) {
              GUI.drawImage(PixelTanks.images.menus.classTab, 688, 334, 224, 332, 1);
              GUI.draw.strokeStyle = '#FFFF00';
              GUI.draw.lineWidth = 10;
              if (PixelTanks.userData.class === 'tactical') GUI.draw.strokeRect(701, 348, 88, 88); else if (PixelTanks.userData.class === 'fire') GUI.draw.strokeRect(701, 456, 88, 88); else if (PixelTanks.userData.class === 'medic') GUI.draw.strokeRect(701, 565, 88, 88); else if (PixelTanks.userData.class === 'stealth') GUI.draw.strokeRect(814, 348, 88, 88); else if (PixelTanks.userData.class === 'builder') GUI.draw.strokeRect(814, 456, 88, 88); else if (PixelTanks.userData.class === 'warrior') GUI.draw.strokeRect(814, 565, 88, 88);
            } else if (this.itemTab) {
              GUI.drawImage(PixelTanks.images.menus.itemTab, 580, 334, 440, 332, 1);
              const key = {airstrike: [600, 354], super_glu: [708, 354], duck_tape: [816, 354], shield: [924, 354], flashbang: [600, 462], bomb: [708, 462], dynamite: [816, 462], usb: [924, 462], weak: [600, 570], strong: [708, 570], spike: [816, 570], reflector: [904, 570]};
              for (const item in key) GUI.drawImage(PixelTanks.images.items[item], key[item][0], key[item][1], 80, 80, 1);
            } else if (this.cosmeticTab) {
              const a = this.cosmeticMenu === 0, b = this.cosmeticMenu === Math.floor(PixelTanks.userData.cosmetics.length/16);
              GUI.drawImage(PixelTanks.images.menus.cosmeticTab, 518+(a ? 62 : 0), 280, 564-(a ? 62 : 0)-(b ? 62 : 0), 440, 1, 0, 0, 0, 0, undefined, (a ? 31 : 0), 0, 282-(a ? 31 : 0)-(b ? 31 : 0), 220);
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
              GUI.drawImage(PixelTanks.images.menus.deathEffectsTab, 518+(a ? 62 : 0), 280, 564-(a ? 62 : 0)-(b ? 62 : 0), 440, 1, 0, 0, 0, 0, undefined, (a ? 31 : 0), 0, 282-(a ? 31 : 0)-(b ? 31 : 0), 220);
              for (let i = this.deathEffectsMenu*16; i < Math.min((this.deathEffectsMenu+1)*16, PixelTanks.userData.deathEffects.length); i++) {
                const d = PixelTanks.images.deathEffects[PixelTanks.userData.deathEffects[i]+'_'];
                GUI.drawImage(PixelTanks.images.deathEffects[PixelTanks.userData.deathEffects[i]], 598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 88, 88, 1, 0, 0, 0, 0, undefined, (Math.floor((Date.now()-this.time)/d.speed)%d.frames)*200, 0, 200, 200);
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
            [416, 20, 108, 108, 'main', true],
            [232, 208, 488, 96, function() {/* class tab */}, true],
            [880, 208, 488, 96, function() {/* ded tab */}, true],
            [496, 404, 176, 176, function() {PixelTanks.purchase(0)}, true],
            [712, 404, 176, 176, function() {PixelTanks.purchase(1)}, true],
            [928, 404, 176, 176, function() {PixelTanks.purchase(4)}, true],
            [496, 620, 176, 176, function() {PixelTanks.purchase(2)}, true],
            [712, 620, 176, 176, function() {PixelTanks.purchase(5)}, true],
            [928, 620, 176, 176, function() {PixelTanks.purchase(3)}, true],
          ],
          listeners: {},
          cdraw: function() {
            GUI.drawText(PixelTanks.userData.stats[0]+' coinage', 800, 350, 50, 0x000000, 0.5);
          },
        },
        pause: {
          buttons: [[128, 910, 1460, 76, function() {
            PixelTanks.user.player.implode();
            Menus.trigger('main');
          }, true]],
          listeners: {},
          cdraw: () => {},
        },
      }
      
        for (const m in Menus.menus) Menus.menus[m] = new Menu(Menus.menus[m], m);
      }
      document.head.appendChild(config);
      PixelTanks.socket = new MegaSocket(window.location.protocol === 'https:' ? 'wss://'+window.location.hostname : 'ws://141.148.128.231', {keepAlive: true, reconnect: true, autoconnect: true});
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
        console.error('Save Error:' + e)
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
              class: '',
              cosmetic: '',
              cosmetics: [],
              deathEffect: '',
              deathEffects: [],
              color: '#ffffff',
              stats: [
                1000000, // coins
                0, // crates
                1, // level
                0, // xp
                20, // rank
              ],
              classes: [
                false, // tactical
                false, // stealth
                false, // warrior
                false, // medic
                false, // builder
                false, // fire
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
    
    static openCrate(type) {
      try {
      const price = type ? 5 : 1, name = type ? 'deathEffects' : 'cosmetics', rand = Math.floor(Math.random()*1001), crate = [{
        common: ['X', 'Red Hoodie', 'Devil Wings', 'Devil Horns', 'Exclaimation Point', 'Orange Hoodie', 'Yellow Hoodie', 'Green Hoodie', 'Leaf', 'Blue Hoodie', 'Purple Hoodie', 'Purple Flower', 'Boost', 'Cancelled', 'Spirals', 'Laff', 'Speaker', 'Spikes', 'Bat Wings', 'Christmas Tree', 'Candy Cane', 'Pumpkin Face', 'Top Hat', 'Mask', 'Purple-Pink Hoodie', 'Bunny Ears', 'Red Ghost', 'Blue Ghost', 'Pink Ghost', 'Orange Ghost'],
        uncommon: ['Present', 'Dead', 'Apple', 'Pumpkin', 'Basketball', 'Banana', 'Pickle', 'Blueberry', 'Eggplant', 'Peace', 'Question Mark', 'Small Scratch', 'Kill = Ban', 'Headphones', 'Reindeer Hat', 'Pumpkin Hat', 'Cat Ears', 'Cake', 'Cat Hat', 'First Aid', 'Fisher Hat'],
        rare: ['Box', 'Straw Hat', 'Hax', 'Tools', 'Money Eyes', 'Dizzy', 'Checkmark', 'Sweat', 'Scared', 'Blue Tint', 'Purple Top Hat', 'Purple Grad Hat', 'Eyebrows', 'Helment', 'Rudolph', 'Candy Corn', 'Flag', 'Swords'],
        epic: ['Black', 'Evil Eyes', 'Gold', 'Rage', 'Onfire', 'Halo', 'Police', 'Deep Scratch', 'Back Button', 'Controller', 'Assassin', 'Astronaut', 'Christmas Lights', 'No Mercy', 'Error'],
        legendary: ['Blind', 'Lego', 'Redsus', 'Uno Reverse', 'Christmas Hat', 'Mini Tank', 'Paleontologist', 'Yellow Pizza'],
        mythic: ['Terminator', 'MLG Glasses'],
      }, {
        common: ['erase', 'explode', 'nuke', 'evan'],
        uncommon: ['anvil', 'insta', 'knight', 'gameover'],
        rare: ['amogus', 'minecraft', 'magic', 'plant'],
        epic: ['wakawaka', 'battery', 'fix'],
        legendary: ['error', 'enderman', 'mechagodzilla'],
        mythic: ['clicked', 'cat'],
      }];
      let rarity;
      if (rand < 1) { // .1%
        rarity = 'mythic';
      } else if (rand < 10) { // .9%
        rarity = 'legendary';
      } else if (rand < 50) { // 4%
        rarity = 'epic';
      } else if (rand < 150) { // 10%
        rarity = 'rare';
      } else if (rand < 300) { // 15%
        rarity = 'uncommon';
      } else { // 70%
        rarity = 'common'; 
      }
      if (PixelTanks.userData.stats[1] < price) return alert('Your broke boi!');
      PixelTanks.userData.stats[1] -= price; 
      let number = Math.floor(Math.random()*(crate[type][rarity].length)), item;
      for (const e in this.images[name]) if (e === crate[type][rarity][number]) item = this.images[name][e];
      if (item === undefined) document.write('Game Crash!<br>Crashed while trying to give you cosmetic id "'+crate[type][rarity][number]+'". Report this to cs641311, bradley, or Celestial.');
      Menus.removeListeners();
      const start = Date.now(), render = setInterval(function() {
        GUI.clear();
        if (type) GUI.drawImage(item, 600, 400, 400, 400, 1, 0, 0, 0, 0, undefined, (Math.floor((Date.now()-start)/PixelTanks.images[name][crate[type][rarity][number]+'_'].speed)%PixelTanks.images[name][crate[type][rarity][number]+'_'].frames)*200, 0, 200, 200);
        if (!type) GUI.drawImage(item, 600, 400, 400, 400, 1);
        GUI.drawText('You Got', 800, 200, 100, '#ffffff', 0.5);
        GUI.drawText(crate[type][rarity][number], 800, 800, 50, '#ffffff', 0.5);
        GUI.drawText(rarity, 800, 900, 30, {mythic: '#FF0000', legendary: '#FFFF00', epic: '#A020F0', rare: '#0000FF', uncommon: '#32CD32', common: '#FFFFFF'}[rarity], 0.5);
      }, 15);
      setTimeout(() => {
        clearInterval(render);
        Menus.trigger('crate');
      }, 5000);
      PixelTanks.userData[name].push(crate[type][rarity][number]);
      PixelTanks.save();
      } catch(e) {alert(e)}
    }

    static upgrade() {
      const coins = PixelTanks.userData.stats[0], xp = PixelTanks.userData.stats[3], rank = PixelTanks.userData.stats[4];
      if (coins < (rank+1)*1000 || xp < (rank+1)*100) return alert('Your broke boi!');
      if (rank >= 20) return alert('You are max level!');
      PixelTanks.userData.stats[0] -= (rank+1)*1000;
      PixelTanks.userData.stats[3] -= (rank+1)*100;
      PixelTanks.userData.stats[4]++;
      PixelTanks.save();
      alert('You Leveled Up to '+(rank+1));
    }

    static renderBottom(x, y, s, color, a=0) {
      GUI.draw.translate(x+40/80*s, y+40/80*s);
      GUI.draw.rotate(a*Math.PI/180);
      GUI.draw.fillStyle = color;
      GUI.draw.beginPath();
      GUI.draw.moveTo(-20/80*s, -32/80*s);
      GUI.draw.lineTo(20/80*s, -32/80*s);
      GUI.draw.lineTo(20/80*s, 32/80*s);
      GUI.draw.lineTo(-20/80*s, 32/80*s); 
      GUI.draw.lineTo(-20/80*s, -32/80*s);
      GUI.draw.fill();
      GUI.draw.rotate(-a*Math.PI/180);
      GUI.draw.translate(-x-40/80*s, -y-40/80*s);
    }

    static renderTop(x, y, s, color, a=0, p=0) {
      GUI.draw.translate(x+40/80*s, y+40/80*s);
      GUI.draw.rotate(a*Math.PI/180);
      GUI.draw.fillStyle = color;
      GUI.draw.beginPath();
      GUI.draw.moveTo(-11/80*s, p+48/80*s);
      GUI.draw.lineTo(-11/80*s, p+28/80*s);
      GUI.draw.lineTo(-16/80*s, p+28/80*s);
      GUI.draw.lineTo(-27/80*s, p+17/80*s);
      GUI.draw.lineTo(-27/80*s, p-16/80*s);
      GUI.draw.lineTo(-16/80*s, p-27/80*s);
      GUI.draw.lineTo(17/80*s, p-27/80*s);
      GUI.draw.lineTo(28/80*s, p-16/80*s);
      GUI.draw.lineTo(28/80*s, p+17/80*s);
      GUI.draw.lineTo(17/80*s, p+28/80*s);
      GUI.draw.lineTo(12/80*s, p+28/80*s);
      GUI.draw.lineTo(12/80*s, p+48/80*s);
      GUI.draw.lineTo(-11/80*s, p+48/80*s);
      GUI.draw.fill();
      GUI.draw.rotate(-a*Math.PI/180);
      GUI.draw.translate(-x-40/80*s, -y-40/80*s);
    }

    static purchase(stat) {
      // since u can like only buy classes the number relates to the index of the true/false value in the PixelTanks.userData.classes to determine whether you have it or not
      const prices = [
        70000, // tactical
        30000, // stealth
        80000, // warrior
        40000, // medic
        60000, // builder
        90000, // fire
      ];
      if (PixelTanks.userData.classes[stat]) return alert('You already bought this.');
      if (PixelTanks.userData.stats[0] < prices[stat]) return alert('Your brok boi.');
      PixelTanks.userData.stats[0] -= prices[stat];
      PixelTanks.userData.classes[stat] = true;
    }
  }

  class Tank {
    constructor(ip, multiplayer, gamemode) {
      this.xp = 0;
      this.crates = 0;
      this.kills = 0;
      this.coins = 0;
      this.lastUpdate = {};
      this.hostupdate = {
        b: [],
        s: [],
        pt: [],
        d: [],
        ai: [],
        logs: [],
        tickspeed: -1,
      };
      this.paused = false;
      this.speed = 4;
      this.key = [];
      this.left = null;
      this.up = null;
      this.canGrapple = true;
      this.showChat = false;
      this.msg = '';
      this.multiplayer = multiplayer;
      this.tank = {use: [], fire: [], r: 0, x: 0, y: 0};
      this.tank.invis = PixelTanks.userData.class === 'stealth';
      this.ops = 0;
      this.ups = 0;
      this.fps = 0;
      this.ping = 0;
      this.debug = '';
      this.reset();

      const joinData = {
        username: PixelTanks.user.username,
        token: PixelTanks.user.token,
        type: 'join',
        gamemode: gamemode,
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
        this.socket = new MegaSocket((window.location.protocol === 'https:' ? 'wss://' : 'ws://')+ip, {keepAlive: false, reconnect: false, autoconnect: true});
        this.socket.on('message', data => {
          switch (data.event) {
            case 'hostupdate':
              this.ups++;
              this.hostupdate.tickspeed = data.tickspeed;
              this.hostupdate.global = data.global;
              this.hostupdate.logs = data.logs.reverse();
              ['pt', 'b', 's', 'ai', 'd'].forEach(p => {
                if (data[p].length) data[p].forEach(e => {
                 const index = this.hostupdate[p].findIndex(obj => obj.id === e.id);
                 if (index !== -1) {
                   this.hostupdate[p][index] = e;
                 } else {
                   this.hostupdate[p].push(e);
                 }
                });
                if (data.delete[p].length) this.hostupdate[p] = this.hostupdate[p].filter(e => !data.delete[p].includes(e.id));
              });
              break;
            case 'ded':
              this.reset();
              break;
            case 'gameover':
              this.implode();
              if (data.type === 'victory') {
                Menus.menus.victory.stats = {kills: 'n/a', coins: 'n/a'};
                Menus.trigger('victory');
              } else {
                Menus.menus.defeat.stats = {kills: 'n/a', coins: 'n/a'};
                Menus.trigger('defeat');
              }
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
              this.canItem0 = true;
              this.canItem1 = true;
              this.canItem2 = true;
              this.canItem3 = true;
              this.canToolkit = true;
              this.timers.toolkit = -1;
              this.timers.items = [{time: 0, cooldown: -1}, {time: 0, cooldown: -1,}, {time: 0, cooldown: -1}, {time: 0, cooldown: -1}]
              break;
            case 'ping':
              if (data.id === this.pingId) this.ping = Date.now()-this.pingStart;
              break;
          }
        });

        this.socket.on('connect', () => {
          this.socket.send(joinData);
          this.sendInterval = setInterval(this.send.bind(this), 1000/30);
        });
      } else {
        this.world = new Singleplayer(ip);
        setTimeout(() => {
          this.world.add(joinData.tank);
          setInterval(this.send.bind(this), 1000/60);
        });
      }
      this.pinger = setInterval(() =>  {
        if (multiplayer) {
          this.pingId = Math.random();
          this.pingStart = Date.now();
          this.socket.send({type: 'ping', id: this.pingId});
        }
        this.debug = 'T='+this.hostupdate.tickspeed+' P='+this.ping+' F='+this.fps+' U='+this.ups+' O='+this.ops;
        this.ops = 0;
        this.ups = 0;
        this.fps = 0;
      }, 1000);

      document.addEventListener('keydown', this.keydown.bind(this));
      document.addEventListener('keyup', this.keyup.bind(this));
      document.addEventListener('mousemove', this.mousemove.bind(this));
      document.addEventListener('mousedown', this.mousedown.bind(this));
      document.addEventListener('mouseup', this.mouseup.bind(this));
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
      this.canClass = true;
      this.canFire = true;
      this.canBoost = true;
      this.canToolkit = true;
      this.canPowermissle = true;
      this.canItem0 = true;
      this.canItem1 = true;
      this.canItem2 = true;
      this.canItem3 = true;
      this.canGrapple = true;
      this.kills = 0;
    }

    drawBlock(b) {
      const size = b.type === 'airstrike' ? 200 : 100;
      const type = ['airstrike', 'fire'].includes(b.type) && getTeam(this.team) === getTeam(b.team) ? 'friendly'+b.type : b.type;
      GUI.drawImage(PixelTanks.images.blocks[type], b.x, b.y, size, size, 1);
    }

    drawShot(s) {
      if (s.type == 'bullet') {
        GUI.drawImage(PixelTanks.images.blocks.void, s.x, s.y, 10, 10, .7, 5, 5, 0, 0, s.r+180);
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
        GUI.draw.strokeStyle = '#A9A9A9';
        GUI.draw.moveTo(s.x, s.y);
        const t = this.hostupdate.pt.find(t => t.username === s.team.split(':')[0]);
        if (t) GUI.draw.lineTo(t.x+40, t.y+40);
        GUI.draw.stroke();
      } else if (s.type === 'dynamite') {
        GUI.drawImage(PixelTanks.images.bullets.dynamite, s.x, s.y, 10, 40, 1, 5, 5, 0, 0, s.r+180);
      } else if (s.type === 'usb') {
        GUI.drawImage(PixelTanks.images.bullets.usb, s.x, s.y, 10, 40, 1, 5, 5, 0, 0, s.r+180);
      } else if (s.type === 'fire') {
        GUI.drawImage(PixelTanks.images.bullets.fire, s.x, s.y, 10, 10, 1, 5, 5, 0, 0, s.r+180);
      }
    }

    drawExplosion(e) {
      GUI.drawImage(PixelTanks.images.animations.explosion, e.x, e.y, e.w, e.h, 1, 0, 0, 0, 0, undefined, e.f*50, 0, 50, 50);
    }

    drawAI(ai) {
      const {x, y, role, r, baseRotation, baseFrame, pushback, cosmetic, hp, maxHp, color} = ai;
      if (role !== 0) PixelTanks.renderBottom(x, y, 80, color);
      GUI.drawImage(PixelTanks.images.tanks[role === 0 ? 'base' : 'bottom'+(baseFrame ? '' : '2')], x, y, 80, 80, 1, 40, 40, 0, 0, baseRotation);
      if (ai.fire) GUI.drawImage(PixelTanks.images.animations.fire, x, y, 80, 80, 1, 0, 0, 0, 0, undefined, ai.fire.frame*29, 0, 29, 29);
      PixelTanks.renderTop(x, y, 80, color, r, pushback);
      GUI.drawImage(PixelTanks.images.tanks.top, x, y, 80, 90, 1, 40, 40, 0, pushback, r);
      if (cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[cosmetic], x, y, 80, 90, 1, 40, 40, 0, pushback, r);
      GUI.draw.fillStyle = '#000000';
      GUI.draw.fillRect(x-2, y+98, 84, 11);
      GUI.draw.fillStyle = '#00FF00';
      GUI.draw.fillRect(x, y+100, 80*hp/maxHp, 5);
      GUI.drawText('['+role+'] AI Bot', x+40, y-25, 50, '#ffffff', 0.5);
      GUI.draw.fillStyle = '#ffffff';
      if (ai.damage) {
        for (let i = 0; i < 2; i++) {
          GUI.drawText((ai.damage.d < 0 ? '+' : '-')+Math.round(ai.damage.d), ai.damage.x, ai.damage.y, Math.round(ai.damage.d/5)+[20, 15][i], ['#ffffff', getTeam(this.team) === getTeam(ai.team) ? '#ff0000' : '#0000ff'][i], 0.5);
        }
      }
    }

    drawTank(t) {
      const p = t.username === PixelTanks.user.username;
      let a = 1;
      if (t.invis && !p) a = Math.sqrt(Math.pow(t.x-this.tank.x, 2)+Math.pow(t.y-this.tank.y, 2)) > 200 ? 0 : .2;
      if ((t.invis && p) || t.ded) a = .5;
      GUI.draw.globalAlpha = a;
      PixelTanks.renderBottom(t.x, t.y, 80, t.color, t.baseRotation);
      GUI.drawImage(PixelTanks.images.tanks['bottom'+(t.baseFrame ? '' : '2')], t.x, t.y, 80, 80, a, 40, 40, 0, 0, t.baseRotation);
      if (t.fire) GUI.drawImage(PixelTanks.images.animations.fire, t.x, t.y, 80, 80, 1, 0, 0, 0, 0, undefined, t.fire.frame*29, 0, 29, 29);
      GUI.draw.globalAlpha = a;
      PixelTanks.renderTop(t.x, t.y, 80, t.color, t.r, t.pushback);
      GUI.drawImage(PixelTanks.images.tanks.top, t.x, t.y, 80, 90, a, 40, 40, 0, t.pushback, t.r);
      if (t.cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[t.cosmetic], t.x, t.y, 80, 90, a, 40, 40, 0, t.pushback, t.r);
      if ((!t.ded && getTeam(this.team) === getTeam(t.team)) || (this.ded && !t.ded) || (PixelTanks.userData.class === 'tactical' && !t.ded && !t.invis) || (PixelTanks.userData.class === 'tactical' && !t.ded && Math.sqrt(Math.pow(t.x-this.tank.x, 2)+Math.pow(t.y-this.tank.y, 2)) < 200)) {
        GUI.draw.fillStyle = '#000000';
        GUI.draw.fillRect(t.x-2, t.y+98, 84, 11);
        GUI.draw.fillStyle = '#FF0000';
        GUI.draw.fillRect(t.x, t.y+100, 80*Math.min(t.hp+t.damage?.d, t.maxHp)/t.maxHp, 5);
        GUI.draw.fillStyle = '#00FF00';
        GUI.draw.fillRect(t.x, t.y+100, 80*t.hp/t.maxHp, 5);
      }
      if (t.invis && t.username !== PixelTanks.user.username) return;

      var username = '['+t.rank+'] '+t.username;
      if (t.team.split(':')[1].includes('@leader')) {
        username += ' ['+t.team.split(':')[1].replace('@leader', '')+'] (Leader)'
      } else if (t.team.split(':')[1].includes('@requestor#')) {
        username += ' [Requesting...] ('+t.team.split(':')[1].split('@requestor#')[1]+')';
      } else if (new Number(t.team.split(':')[1]) < 1) {} else {
        username += ' ['+t.team.split(':')[1]+']';
      }

      GUI.drawText(username, t.x+40, t.y-25, 50, '#ffffff', 0.5);

      if (t.shields > 0 && (!t.invis || (t.invis && p))) {
        GUI.draw.beginPath();
        GUI.draw.fillStyle = '#7DF9FF';
        GUI.draw.globalAlpha = (t.shields/100)*.4; // .2 max, .1 min
        GUI.draw.arc(t.x+40, t.y+40, 66, 0, 2*Math.PI);
        GUI.draw.fill();
        GUI.draw.globalAlpha = 1;
        GUI.draw.fillStyle = '#000000';
        GUI.draw.fillRect(t.x-2, t.y+113, 84, 11);
        GUI.draw.fillStyle = '#00FFFF';
        GUI.draw.fillRect(t.x, t.y+115, 80*t.shields/100, 5);
      }

      if (t.buff) GUI.drawImage(PixelTanks.images.tanks.buff, t.x-5, t.y-5, 80, 80, .2);
      if (t.reflect) GUI.drawImage(PixelTanks.images.tanks.reflect, t.x, t.y, 80, 80, 1);
      if (t.damage) {
        const {x, y, d} = t.damage;
        for (let i = 0; i < 2; i++) {
          GUI.drawText((d < 0 ? '+' : '-')+Math.round(d), x, y, Math.round(d/5)+[20, 15][i], ['#ffffff', getTeam(this.team) === getTeam(t.team) ? '#ff0000' : '#0000ff'][i], 0.5);
        }
      }
      
      if (t.emote) {
        GUI.drawImage(PixelTanks.images.emotes.speech, t.x+90, t.y-15, 100, 100, 1);
        GUI.drawImage(PixelTanks.images.emotes[t.emote.a], t.x+90, t.y-15, 100, 100, 1, 0, 0, 0, 0, undefined, t.emote.f*50, 0, 50, 50);
      }

      if (t.dedEffect) {
        const {speed, frames, kill} = PixelTanks.images.deathEffects[t.dedEffect.id+'_'];
        if (t.dedEffect.time/speed > frames) return;
        if (t.dedEffect.time/speed < kill) {
          GUI.drawImage(PixelTanks.images.tanks.bottom, t.dedEffect.x, t.dedEffect.y, 80, 80, 1, 40, 40, 0, 0, 0);
          GUI.drawImage(PixelTanks.images.tanks.destroyed, t.dedEffect.x, t.dedEffect.y, 80, 90, 1, 40, 40, 0, 0, t.dedEffect.r);
          if (t.cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[t.cosmetic], t.dedEffect.x, t.dedEffect.y, 80, 90, 1, 40, 40, 0, 0, t.dedEffect.r);
        }
        GUI.drawImage(PixelTanks.images.deathEffects[t.dedEffect.id], t.dedEffect.x-60, t.dedEffect.y-60, 200, 200, 1, 0, 0, 0, 0, undefined, Math.floor(t.dedEffect.time/speed)*200, 0, 200, 200);
      }

      if (t.animation) GUI.drawImage(PixelTanks.images.animations[t.animation.id], t.x, t.y, 80, 90, 1, 0, 0, 0, 0, undefined, t.animation.frame*40, 0, 40, 45);
    }

    frame() {
      this.render = requestAnimationFrame(this.frame.bind(this));
      GUI.clear();
      if (this.hostupdate.pt.length === 0) {
        GUI.draw.fillStyle = '#ffffff';
        GUI.draw.fillRect(0, 0, 1600, 1600);
        return  GUI.drawText('Loading Terrain', 800, 500, 100, '#000000', 0.5);
      }
      if (this.multiplayer) if (this.socket.status !== 'connected' ) {
        GUI.draw.fillStyle = '#ffffff';
        GUI.draw.fillRect(0, 0, 1600, 1600);
        return GUI.drawText('Server Closed', 800, 500, 100, '#000000', 0.5);
      }
      this.fps++;
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
        this.ded = player.ded;
      }
      GUI.draw.setTransform(PixelTanks.resizer, 0, 0, PixelTanks.resizer, (-player.x+760)*PixelTanks.resizer, (-player.y+460)*PixelTanks.resizer);

      GUI.drawImage(PixelTanks.images.blocks.floor, 0, 0, 3000, 3000, 1);

      b.forEach(block => this.drawBlock(block));
      s.forEach(shot => this.drawShot(shot));
      a.forEach(ai => this.drawAI(ai));
      t.forEach(tank => this.drawTank(tank));
      for (const block of b) {
        if (block.s) {
          GUI.draw.fillStyle = '#000000';
          GUI.draw.fillRect(block.x-2, block.y+108, 104, 11);
          GUI.draw.fillStyle = '#0000FF';
          GUI.draw.fillRect(block.x, block.y+110, 100*block.hp/block.maxHp, 5);
        }
      }
      e.forEach(e => this.drawExplosion(e));

      GUI.draw.setTransform(PixelTanks.resizer, 0, 0, PixelTanks.resizer, 0, 0);
      
      if (player.flashbanged) {
        GUI.draw.fillStyle = '#FFFFFF';
        GUI.draw.fillRect(0, 0, 1600, 1000);
      }
      
      GUI.drawImage(PixelTanks.images.menus.ui, 0, 0, 1600, 1000, 1);
      GUI.draw.fillStyle = PixelTanks.userData.color;
      GUI.draw.globalAlpha = 0.5;
      const c = [500, 666, 832, 998];
      for (let i = 0; i < 4; i++) {
        const item = PixelTanks.userData.items[i];
        GUI.drawImage(PixelTanks.images.items[item], c[i], 900, 100, 100, 1);
        if (!this['canItem'+i]) {
          GUI.draw.fillStyle = '#000000';
          GUI.draw.globalAlpha = .5;
          GUI.draw.fillRect(c[i], 900, 100, 100);
        } else {
          GUI.draw.fillStyle = '#FFFFFF';
          const tank = t.find(tank => tank.username === PixelTanks.user.username), blockedOn = item === 'bomb' && !this.collision(tank.x, tank.y);
          if (blockedOn || (item === 'shield' && tank.shields <= 0) || (item === 'duck_tape' && tank.hp <= tank.maxHp/2) || (item === 'super_glu' && tank.hp <= tank.maxHp/2)) GUI.draw.fillStyle = '#00FF00';
          GUI.draw.globalAlpha = (blockedOn ? .5 : 0)+.25*Math.abs(Math.sin(Math.PI*.5*((((Date.now()-(this.timers.items[i].time+this.timers.items[i].cooldown))%4000)/1000)-3)));
          GUI.draw.fillRect(c[i], 900, 100, 100);
        }
        GUI.draw.globalAlpha = 1;
        GUI.draw.fillStyle = PixelTanks.userData.color;
        GUI.draw.fillRect(c[i], 900+Math.min((Date.now()-this.timers.items[i].time)/this.timers.items[i].cooldown, 1)*100, 100, 100);
      }
      GUI.drawImage(PixelTanks.images.items["powermissleui"], 422, 950, 50, 50, 1);
      GUI.drawImage(PixelTanks.images.items["toolkitui"], 1127, 950, 50, 50, 1);
      GUI.drawImage(PixelTanks.images.items["boostui"], 1205, 950, 50, 50, 1);
      for (let i = 0; i < 3; i++) {
        GUI.draw.fillRect([422, 1127, 1205][i], 950+Math.min((Date.now()-this.timers[['powermissle', 'toolkit', 'boost'][i]])/[10000, 40000, 5000][i], 1)*50, 50, 50);
      }
      GUI.drawImage(PixelTanks.images.items[PixelTanks.userData.class+"ui"], 345, 950, 50, 50, 1);
      GUI.draw.fillRect(345, 950+Math.min((Date.now()-this.timers.class.time)/this.timers.class.cooldown, 1)*50, 50, 50);
      GUI.draw.globalAlpha = 1;

      GUI.draw.fillStyle = '#000000';
      GUI.draw.globalAlpha = .2;
      GUI.draw.fillRect(0, 0, 180, 250);
      GUI.draw.globalAlpha = 1;
      GUI.drawText(this.debug, 10, 20, 30, '#ffffff', 0);
      GUI.drawText('Killstreak: '+this.kills, 10, 50, 30, '#ffffff', 0);
      GUI.drawText('Crates: '+this.crates, 10, 100, 30, '#ffffff', 0);
      GUI.drawText('XP: '+this.xp, 10, 150, 30, '#ffffff', 0);
      GUI.drawText('coin$: '+this.coins, 10, 200, 30, '#ffffff', 0);
      if (this.hostupdate.global) GUI.drawText(this.hostupdate.global, 800, 30, 60, '#ffffff', .5);

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
        if (this.tank.animation === false || this.tank.animation.id !== 'text') this.playAnimation('text');
      } else if (this.tank.animation) if (this.tank.animation.id === 'text') {
        this.tank.animation = false;
        clearInterval(this.animationInterval);
        clearTimeout(this.animationTimeout);
      }
      
      if (this.paused) {
        let a = 1;
        GUI.draw.globalAlpha = .7;
        GUI.draw.fillStyle = '#000000';
        GUI.draw.fillRect(0, 0, 1600, 1000);
        GUI.draw.globalAlpha = 1;
        for (let i = 0; i < t.length; i++) {
          GUI.drawText(t[i].username, 10, 250+i*90, 30, '#FFFFFF', 0);
          PixelTanks.renderBottom(200, 250+i*90, 80, t[i].color, t[i].baseRotation);
          GUI.drawImage(PixelTanks.images.tanks['bottom'+(t[i].baseFrame ? '' : '2')], 200, 250+i*90, 80, 80, 1, 40, 40, 0, 0, t[i].baseRotation);
          PixelTanks.renderTop(200, 250+i*90, 80, t[i].color, t[i].r, t[i].pushback);
          GUI.drawImage(PixelTanks.images.tanks.top, 200, 250+i*90, 80, 90, 1, 40, 40, 0, t[i].pushback, t[i].r);
          if (t[i].cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[t[i].cosmetic], 200, 250+i*90, 80, 90, 1, 40, 40, 0, t[i].pushback, t[i].r);
        }
        Menus.menus.pause.draw([1200, 0, 400, 1000]);
      }
    }

    chat(e) {
      if (e.key.length === 1) this.msg += e.key;
      if (e.keyCode === 8) this.msg = this.msg.slice(0, -1);
      if (e.keyCode === 13) {
        if (this.msg !== '') {
          this.socket.send(this.msg.charAt(0) === '/' ? {type: 'command', data: this.msg.replace('/', '').split(' ')} : {type: 'chat', msg: this.msg});
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
      this.mouse = {x: (e.clientX-(window.innerWidth-window.innerHeight*1.6)/2)/PixelTanks.resizer, y: e.clientY/PixelTanks.resizer};
      this.tank.r = toAngle(e.clientX-window.innerWidth/2, e.clientY-window.innerHeight/2);
    }

    mousedown(e) {
      this.fire(e.button);
      clearInterval(this.fireInterval);
      this.fireInterval = setInterval(() => {
        this.canFire = true;
        this.fire(e.button);
      }, this.fireType === 1 ? 200 : 600);
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
        if (!this.canFire) return;
        this.canFire = false;
        clearTimeout(this.fireTimeout);
        this.fireTimeout = setTimeout(() => {this.canFire = true}, this.fireType === 1 ? 200 : 600);
      }
      var fireType = ['grapple', 'megamissle', 'dynamite', 'usb', 2].includes(type) ? 1 : this.fireType, type = type === 2 ? (PixelTanks.userData.class === 'medic' ? 'healmissle' : 'powermissle') : (type === 0 ? (this.fireType === 1 ? 'bullet' : 'shotgun') : type), l = fireType === 1 ? 0 : -10;
      while (l<(fireType === 1 ? 1 : 15)) {
        this.tank.fire.push({...toPoint(this.tank.r+l), type: type, r: this.tank.r+l});
        l += 5;
      }
    }

    collision(x, y) {
      if (this.ded) return true;
      if (x < 0 || y < 0 || x + 80 > 3000 || y + 80 > 3000) return false;
      if (this.tank.invis && this.tank.immune && !this.halfSpeed) return true;
      var l = 0, blocks = this.hostupdate.b, len = blocks.length;
      while (l<len) {
        if ((x > blocks[l].x || x + 80 > blocks[l].x) && (x < blocks[l].x + 100 || x + 80 < blocks[l].x + 100) && (y > blocks[l].y || y + 80 > blocks[l].y) && (y < blocks[l].y + 100 || y + 80 < blocks[l].y + 100)) {
          if (['barrier', 'weak', 'strong', 'gold', 'void'].includes(blocks[l].type)) return false;
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
      if (!this['canItem'+slot]) {
        if (id === 'dynamite') this.tank.use.push('dynamite');
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
        cooldown = 5000;
      } else if (id === 'usb') {
        this.fire('usb');
        cooldown = 25000;
      } else if (id === 'flashbang') {
        this.tank.use.push('flashbang');
        cooldown = 20000;
      } else if (id === 'bomb') {
        this.tank.use.push('bomb');
        this.tank.use.push('break');
        cooldown = 5000;
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
      for (let i = 0; i < 4; i++) {
        if (k === PixelTanks.userData.keybinds.items[i]) this.useItem(PixelTanks.userData.items[i], i);
      }
      for (let i = 0; i < 6; i++) {
        if (k === PixelTanks.userData.keybinds.emotes[i]) this.emote(Pixel.userData.emotes[i]);
      }
      if (k === 13) this.showChat = true;
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
        if (!this.halfSpeed && Date.now()-this.timers.toolkit < (PixelTanks.userData.class === 'medic' ? 5000 : 7500)) {
          this.timers.toolkit = new Date('Nov 28 2006').getTime();
          this.canToolkit = true;
        }
      } else if (k === 70 && this.canClass) {
        this.canClass = false;
        const c = PixelTanks.userData.class;
        if (c === 'stealth' && !this.halfSpeed) {
          this.tank.invis = !this.tank.invis;
          this.timers.class = {time: Date.now(), cooldown: 50};
        } else if (c === 'tactical') {
          this.fire('megamissle');
          this.timers.class = {time: Date.now(), cooldown: 25000};
        } else if (c === 'builder') {
          this.tank.use.push('turret');
          this.timers.class = {time: Date.now(), cooldown: 30000};
        } else if (c === 'warrior') {
          this.tank.use.push('buff');
          this.timers.class = {time: Date.now(), cooldown: 40000};
        } else if (c === 'medic') {
          this.tank.use.push(`healwave${this.mouse.x+this.tank.x-850}x${this.mouse.y+this.tank.y-550}`);
          this.timers.class = {time: Date.now(), cooldown: 30000};
        } else if (c === 'fire') {
          for (let i = -30; i < 30; i += 5) this.tank.fire.push({...toPoint(this.tank.r+i), type: 'fire', r: this.tank.r+i});
          this.timers.class = {time: Date.now(), cooldown: 10000};
        }
        setTimeout(() => {this.canClass = true}, this.timers.class.cooldown);
      } else if (k === 27) {
        this.paused = !this.paused;
        if (this.paused) {
          Menus.menus.pause.addListeners();
        } else {
          Menus.removeListeners();
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
          setTimeout(() => {
            this.speed = 4;
            this.tank.immune = false;
            if (PixelTanks.userData.class === 'stealth') this.tank.use.push('break');
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
      const {x, y, r, use, fire} = this.tank;
      const updateData = {username: PixelTanks.user.username, type: 'update', data: this.tank};
      if (x === this.lastUpdate.x && y === this.lastUpdate.y && r === this.lastUpdate.r && use.length === 0 && fire.length === 0) return;
      this.ops++;
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
      this.lastUpdate = {x, y, r}
      this.tank.fire = [];
      this.tank.use = [];
    }

    implode() {
      if (this.multiplayer) {
        clearInterval(this.sendInterval);
        this.socket.close();
      } else {
        this.world.i.forEach(i => clearInterval(i));
      }
      document.removeEventListener('keydown', this.keydown.bind(this));
      document.removeEventListener('keyup', this.keyup.bind(this));
      document.removeEventListener('mousemove', this.mousemove.bind(this));
      document.removeEventListener('mousedown', this.mousedown.bind(this));
      document.removeEventListener('mouseup', this.mouseup.bind(this));
      cancelAnimationFrame(this.render);
      Menus.menus.pause.removeListeners();
      PixelTanks.user.player = undefined;
    }
  }

  class Singleplayer extends Engine {
    constructor(level) {
      if (typeof level === 'object') { // custom level handler for breads
        super([level.code]);
        this.level = level.name;
      } else {
        const levels = [
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","S","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B1","B4","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","A3","B1","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B1","B4","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B4","B0","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B5"],["B5","B5","B5","B4","B4","B0","B5","B1","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B0","B4","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B1","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B4","B4","B5","B1","B1","B5","B5","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B4","B0","B4","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B0","A0","B0","A0","B0","B4","B0","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B0","B1","B0","B0","B0","B0","B0","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B0","B0","B0","B0","B0","B1","B0","B5","B5","B5","B5","B5","B4","B0","B0","B0","B0","B0","B4","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B0","B0","B0","B1","B0","B0","B0","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5"],["B5","B5","B0","B0","S","B0","B0","B1","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B0","B0","B1","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B0","B0","B0","B0","B1","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B0","B1","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B2","B0","B2","B0","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5"],["B5","B5","B0","B0","B0","B5","B5","B5","B5","B0","B2","B0","B0","B0","B2","B0","B5","B5","B5","B5","B5","B5","B5","B1","B1","B1","B5","B5","B5","B5"],["B5","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B3","B3","B0","B3","B3","B5","B5","B5","B5","B0","B2","B0","B2","B0","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5"],["B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B5"],["B5","B0","B3","B3","B3","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B1","B0","B0","B0","B5","B5"],["B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5"],["B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B3","B0","B1","B0","B5","B5"],["B5","B5","B0","B0","B0","B5","B5","B0","B0","B0","B0","B0","B0","B2","B0","B0","B0","B0","B0","B5","B5","B5","B5","A0","B0","B3","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B5","B5","B4","B0","B0","B0","B4","B0","B2","B0","B0","B0","B1","B0","B5","B5","B5","B5","B1","B3","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B5","B5","B0","B0","B3","B0","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B4","B0","B4","B0","B0","B4","B0","B1","B1","B0","B0","B0","B0","B0","B0","B2","B0","B0","B0","B1","B0","B0","B5","B5"],["B5","B5","B0","B4","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B1","B0","B0","B0","B0","B0","B0","B0","B0","B2","B0","B0","B0","B5","B5","B5"],["B5","B5","B0","B0","B0","B4","B0","B4","B0","B0","B0","B0","B0","B0","B4","B0","A0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
  [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","S","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B1","B4","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","A3","B1","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B1","B4","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B4","B0","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B5"],["B5","B5","B5","B4","B4","B0","B5","B1","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B0","B4","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B1","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B4","B4","B5","B1","B1","B5","B5","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B4","B0","B4","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","S","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B1","B4","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","A3","B1","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B1","B4","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B4","B0","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B5"],["B5","B5","B5","B4","B4","B0","B5","B1","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B0","B4","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B1","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B4","B4","B5","B1","B1","B5","B5","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B4","B0","B4","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","S","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B1","B4","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","A3","B1","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B1","B4","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B4","B0","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B5"],["B5","B5","B5","B4","B4","B0","B5","B1","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B0","B4","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B1","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B4","B4","B5","B1","B1","B5","B5","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B4","B0","B4","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","S","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B1","B4","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","A3","B1","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B1","B4","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B4","B0","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B5"],["B5","B5","B5","B4","B4","B0","B5","B1","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B0","B4","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B1","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B4","B4","B5","B1","B1","B5","B5","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B4","B0","B4","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B4","B0","B0","B0","B0","B4","B4","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","A0","A0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","A0","A0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B0","B0","B0","B0","B0","B0","B4","B0","B5","B5","B5","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B4","B0","B0","B0","B0","B4","B4","B0","B5","B5","B5","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","A1","B0","B0","B4","B0","B5","B5","B5","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B3","B0","B0","B0","B0","B0","B0","B0","B0","B3","B0","B0","B0","B0","B0","B5","B5"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","A1","B4","B3","B0","B0","B0","B0","B0","B5","B5"],["B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B3","B0","B0","B0","B0","B0","B0","B0","B0","B3","B0","B0","B0","B0","B0","B5","B5"],["B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","A1","B0","B0","B4","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B0","S","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
                [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","S","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B1","B4","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","A3","B1","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B1","B4","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B4","B0","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B5"],["B5","B5","B5","B4","B4","B0","B5","B1","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B0","B4","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B1","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B4","B4","B5","B1","B1","B5","B5","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B4","B0","B4","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B0","B0","S","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B1","B4","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","A3","B1","B0","B0","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B1","B4","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B1","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B4","B0","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B5"],["B5","B5","B5","B4","B4","B0","B5","B1","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B0","B4","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B1","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B4","B4","B5","B1","B1","B5","B5","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B4","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B4","B0","B4","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B4","B4","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B4","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","A3","B0","B0","B0","B0","B0","B0","B4","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B0","B0","B4","B0","B0","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B5","B5","B5","B4","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B4","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B4","B4","B4","B4","B5","B4","B4","B0","B0","B4","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B5","B4","B0","B0","B4","B4","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B4","B0","B0","S","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B4","B5","B4","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B5","B4","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B4","B0","B0","B0","B0","B0","B4","B4","B4","B4","B4","B0","B0","B0","B4","B4","B4","B4","B0","B0","B4","B4","B5","B5","B5","B5","B5"],["B5","B5","B5","B4","B4","B4","B4","B4","B4","B4","B5","B5","B5","B4","B0","B0","B0","B4","B4","B4","B0","B0","B0","B4","B4","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B0","B0","B0","B0","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B4","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B4","B0","B0","B0","B0","B4","B0","B0","B4","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B4","B4","B4","B4","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B4","B4","B4","B4","B4","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B4","B5","B5","B5","B5","B4","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","B0","B0","B0","B5","B5","B0","B0","B0","B1","B0","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B1","B0","B0","B1","S","B1","B0","B0","B1","B1","B0","B0","B1","A3","B1","B0","B0","B1","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","B0","B0","B0","B5","B5","B0","B0","B0","B1","B0","B0","B0","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B4","B5","B5","B5","B5","B4","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5","B1","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B4","B5","B5","B5","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","A3","B4","B5","B5","B5","B4","A3","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B1","B4","B0","B0","B0","B4","B1","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B4","B0","B0","B0","B4","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","S","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B4","B4","B0","B4","B4","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B4","B4","B4","B4","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B0","A1","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B0","B0","B0","B0","B0","B0","S","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B4","B0","B0","B4","B0","B0","B4","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B0","B4","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B4","B0","B0","B4","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B0","B0","B0","B0","B0","B0","B0","B4","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B0","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B4","B0","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B0","B0","B0","B0","B0","B4","B0","B0","B0","B5","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","B0","B0","B0","B0","B0","B1","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B1","B0","B1","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B1","B0","B1","B0","B0","B0","B0","B0","B1","B0","B1","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B1","B0","B4","B4","B4","B4","B4","B4","B4","B0","B1","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B1","B0","B1","B0","B0","B0","B0","B0","B1","B0","B1","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B1","B0","B1","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","B0","B0","B0","B0","B0","B1","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B4","B4","B4","B4","B4","B4","B0","B4","B4","B4","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B4","B4","B4","B4","B4","B4","B0","B4","B4","B4","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B4","B4","B4","B4","B4","B4","B0","B4","B4","B4","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B4","B4","B0","B4","B4","B4","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","A3","B0","B4","B4","B4","B0","B4","B4","B4","B0","A3","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B4","B4","B4","B0","B4","B4","B4","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B1","B0","B0","S","B0","B0","B1","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B4","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B0","B0","B2","B2","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B0","B0","B2","B2","B0","B0","B4","B0","B0","B0","B4","B0","A3","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B0","B0","B2","B2","B0","B0","B2","B0","S","B0","B2","B0","B1","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B0","B0","B2","B2","B0","B0","B4","B0","B0","B0","B4","B0","A3","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B0","B0","B2","B2","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B4","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B4","B0","B4","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","S","B0","B0","B0","B4","B0","B4","B0","B0","B0","A1","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B4","B0","B4","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B4","B4","B0","B4","B4","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B4","B0","A3","B0","B4","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B0","B0","B2","B0","B0","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","A3","B2","S","B2","A3","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B0","B0","B2","B0","B0","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B4","B0","B0","B0","B4","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B4","B4","B0","B4","B4","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B4","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B0","B0","B0","B0","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B0","B0","B0","B0","B0","B0","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B4","B4","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","S","B0","B4","B4","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B0","B0","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B0","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B4","B4","B4","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B4","B5","B5","B4","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B0","B4","B4","B4","B4","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","A1","B0","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B0","B0","B0","B0","B0","B0","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B4","B4","B4","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B2","B0","B2","B0","B2","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B4","B2","B4","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B4","B4","B0","B4","B4","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","A3","B4","B4","B4","B4","B0","B4","B4","B4","B4","A3","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B0","B0","B4","B4","B4","B4","B4","B0","B4","B4","B4","B4","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B4","B4","B4","B4","B4","B0","B0","B0","B4","B4","B4","B4","B4","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B2","B0","B4","B4","B4","B4","B4","B0","B0","B1","B0","B0","B4","B4","B4","B4","B4","B0","B2","B0","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4","B0","B0","B0","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B2","B0","B2","B0","B0","B0","B0","B1","B0","S","B0","B1","B0","B0","B0","B0","B2","B0","B2","B0","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B4","B4","B4","B4","B0","B0","B0","B0","B0","B0","B0","B4","B4","B4","B4","B0","B0","B0","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B2","B0","B4","B4","B4","B4","B4","B0","B0","B1","B0","B0","B4","B4","B4","B4","B4","B0","B2","B0","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B0","B0","B0","B0","B4","B4","B4","B4","B4","B0","B0","B0","B4","B4","B4","B4","B4","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B0","B0","B4","B4","B4","B4","B4","B0","B4","B4","B4","B4","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","A3","B4","B4","B4","B4","B0","B4","B4","B4","B4","A3","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B4","B4","B0","B4","B4","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B4","B2","B4","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B2","B0","B2","B0","B2","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B2","B0","B2","B0","A0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","A0","B0","B2","B0","B1","B0","B0","B2","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B2","B0","B0","B0","B0","B0","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B4","B0","B4","B0","B0","B2","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B1","B0","B0","S","B0","B0","B1","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B2","B0","B0","B4","B0","B4","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B0","B0","B0","B0","B0","B0","B0","B2","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","B2","B0","B0","B1","B0","B2","B0","A0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B0","A0","B0","B2","B0","B2","B0","B0","B0","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","A0","A0","A0","A0","A0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B1","B0","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","S","B0","B0","B5","B5","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
           [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B5","B5","B0","B5","B5","B5","B0","B5","B0","B5","B5","B5","B0","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B3","B5","B5","B0","B5","B5","B5","B0","B5","B0","B5","B5","B5","B0","B5","B5","B3","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B5","B5","B0","B5","B0","B5","B5","B5","B5","B5","B0","B5","B0","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B0","B0","B0","B5","B0","B0","B0","B5","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B5","B5","B0","B5","B0","B5","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B0","B0","B0","B0","B0","B0","B0","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B0","B5","B5","B0","B5","B5","B0","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5","A1","A2","A1","B5","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B5","A1","A2","A1","B5","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B0","B5","B5","B5","B5","B5","B0","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B0","B0","B0","B0","B0","B0","B0","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B0","B5","B5","B5","B5","B5","B0","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B5","B5","B0","B5","B5","B5","B0","B5","B0","B5","B5","B5","B0","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B3","B0","B5","B0","B0","B0","B0","B0","S","B0","B0","B0","B0","B0","B5","B0","B3","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B0","B5","B0","B5","B0","B5","B5","B5","B5","B5","B0","B5","B0","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B0","B0","B0","B5","B0","B0","B0","B5","B0","B0","B0","B5","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B5","B5","B5","B5","B5","B5","B0","B5","B0","B5","B5","B5","B5","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","A1","B0","A1","B0","B0","B1","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B3","B3","B3","B3","B3","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B3","B3","B0","B0","B0","S","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B5","B1","B1","B1","B1","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B0","B1","B0","B0","A1","B0","A1","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B0","A0","A0","A0","A0","A0","A0","A0","A0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","S","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B3","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B3","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B0","B0","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B0","B2","B0","B4","B0","B0","B0","B4","B0","B2","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B2","B0","B2","B0","B2","B0","B2","B0","B2","B0","B2","B0","B2","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B4","B0","B0","B0","B4","B0","B2","B0","B4","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B4","B0","B0","B0","B4","B0","B0","B0","B4","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B3","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B4","B3","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B3","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B3","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B3","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","A1","A1","A1","B3","S","B3","A1","A1","A1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
        [["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","A3","B5","B5","B5","B5","B5","A2","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B1","B0","B1","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","A0","B1","B0","B4","B2","B4","B0","B1","A0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B1","B4","S","B4","B1","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","A0","B1","B0","B4","B2","B4","B0","B1","A0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B0","B0","B1","B0","B1","B0","B0","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","A2","B5","B5","B5","B5","B5","A3","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"],["B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5","B5"]],
      ];
        if (level > levels.length || level < 1) level = 1;
        super([levels[level-1]]);
        this.level = level;
      }
    }

    ontick() {

      /*
        DELETE ALL THESE COMMENTS AFTER U READ
        How to use custom levels with custom names(for tutorials):
        
        When creating the tank, do:
        ...new Tank({name: 'bread-level#128372183213', code: *insert code NO COMMA*}, false, null)

        To run a normal level do:
        ...new Tank(1, false, null);
        *runs the first level in existance*

        HOW DO I DRAW MEH TEXT:

        Use the tutorial below. The level name for custom levels is the one you set :)
      */
      if (this.level === 1) {
        // GUI.drawText(...
      } else if (this.level === 'custom bread level') {
        const drawBlockX = 5, drawBlockY = 3;
        GUI.drawText('HALP', drawBlockX*100+50, drawBlockY*100+50, 50, '#FFFFFF', .5);
        // 50 => Text size
        // F spam => color hex code
        // .5 => center text(0 = start left, 1 = start right)
        // delete all my comments when u add ur cringe
      }
      if (this.ai.length === 0) {
        setTimeout(() => {
          PixelTanks.user.player.implode();
          Menus.menus.victory.stats = {kills: 'n/a', coins: 'n/a'};
          Menus.trigger('victory');
        }, 3000);
        this.ontick = () => {}
      }
    }

    ondeath() {
      this.ai.forEach(ai => {
        ai.mode = 3;
      });
      setTimeout(() => {
        PixelTanks.user.player.implode();
        Menus.menus.defeat.stats = {kills: 'n/a', coins: 'n/a'};
        Menus.trigger('defeat');
      }, 10000);
    }

    override(data) {
      PixelTanks.user.player.tank.x = data.x;
      PixelTanks.user.player.tank.y = data.y;
    }
  }

  window.onload = PixelTanks.start;
};
