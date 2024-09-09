class PixelTanks {
  static loadMessages = ['Recharging Instas...', 'Summoning Turrets...', 'Sorting Cosmetics...', 'Spotting Stealths...', 'Putting Out Fires...', 'Generating Levels...', 'Loading Up Crates...', 'Filling Up Stocks...', 'Drawing Menus...', 'Placing Blocks...', 'Launching Missles...', 'Booting Game Engine...'];
  
  static start() {
    PixelTanks.setup();
    PixelTanks.boot();
  }

  static setup() {
    document.body.innerHTML += `
    <style>
      html, body {
        margin: 0;
        padding: 0;
        text-align: center;
        background-color: black;
      }
      canvas {
        display: inline;
        height: 100%;
        width: calc(100vh*1.6);
      }
      @font-face {
        font-family: 'Font';
        src: url('https://cs6413110.github.io/Pixel-Tanks/public/fonts/PixelOperator.ttf') format('truetype');
      }
      * {
        font-family: Font;
      }
      input {
        font-size: 30px;
      }
    </style>`;
    GUI.canvas = document.createElement('CANVAS');
    Menus.scaler = document.createElement('CANVAS');
    GUI.draw = GUI.canvas.getContext('2d');
    document.body.appendChild(GUI.canvas);
    PixelTanks.resizer = 1//window.innerHeight/1000; // remove
    GUI.canvas.height = 1000;
    GUI.canvas.width = 1600;
    GUI.drawText('Loading Font', 800, 500, 50, '#fffff', 0.5);
    window.oncontextmenu = () => false;
    window.addEventListener('resize', () => { // TEMP move to GUI as static function
      for (const menu in Menus.menus) Menus.menus[menu].adapt();
      if (PixelTanks.user.player) PixelTanks.user.player.resize();
    });
    const ui = e => {
      if (Client.input.style.visibility === 'visible') return true;
      e.preventDefault();
      return false;
    };
    window.addEventListener('selectstart', ui);
    window.addEventListener('dragstart', ui);
    window.addEventListener('mousemove', Menus.mouseLog);
  }

  static updateBootProgress(progress) {
    GUI.clear();
    if (Math.random() < .05) PixelTanks.loadMessage = PixelTanks.loadMessages[Math.floor(Math.random()*PixelTanks.loadMessages.length)];
    GUI.drawText(PixelTanks.loadMessage, 800, 500, 50, '#ffffff', 0.5);
    GUI.draw.fillStyle = '#FFFFFF';
    GUI.draw.fillRect(400, 600, 800, 60);
    GUI.draw.fillStyle = '#000000';
    GUI.draw.fillRect(405, 605, 790, 50);
    GUI.draw.fillStyle = '#FFFFFF';
    GUI.draw.fillRect(410, 610, progress*780, 40);
  }

  static boot() {
    PixelTanks.user = {};
    PixelTanks.loadMessage = PixelTanks.loadMessages[Math.floor(Math.random()*PixelTanks.loadMessages.length)];
    const config = document.createElement('SCRIPT');
    const newClass = 'undefined';
    let cosmetAmount = 1;
    let deathAmount = 1;
    config.src = 'https://cs6413110.github.io/Pixel-Tanks/public/js/config.js';
    config.onload = () => {
      Network.load(sourceMap);
    Menus.menus = {
      start: {
        buttons: [
          [544, 648, 216, 116, function() {PixelTanks.auth(this.username.value, this.password.value, 'login')}, true],
          [840, 648, 216, 116, function() {PixelTanks.auth(this.username.value, this.password.value, 'signup')}, true],
        ],
        listeners: {
          keydown: function(e) {
            if (e.keyCode === 13) PixelTanks.auth(this.username.value, this.password.value, 'login');
          }
        },
        cdraw: function() {
          if (!this.username) {
            this.username = document.createElement('INPUT');
            this.password = document.createElement('INPUT');
            const left = (window.innerWidth-window.innerHeight*1.6)/2+.564*window.innerHeight;
            this.username.style = 'position: absolute; background: transparent; border: none; top: '+(.392*window.innerHeight)+'px; left: '+left+'px; width: '+(window.innerHeight*.456)+'px; height: '+(window.innerHeight*.08)+'px;';
            this.password.style = 'position: absolute; background: transparent; border: none; top: '+(.520*window.innerHeight)+'px; left: '+left+'px; width: '+(window.innerHeight*.456)+'px; height: '+(window.innerHeight*.08)+'px;';
            this.username.type = 'username';
            this.password.type = 'password';
            this.username.autocomplete = 'username';
            this.password.autocomplete = 'current-password';
            this.username.maxLength = 20;
            this.password.maxLength = 100;
            document.body.appendChild(this.username);
            document.body.appendChild(this.password);
            this.elements.push(this.username, this.password);
          }
        },
      },
      main: {
        buttons: [
          [972, 840, 88, 88, 'settings1', true],
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
          PixelTanks.convertCosmeticFormat(); // TEMP
          PixelTanks.userData.stats[4] = 20;
          if (!PixelTanks.userData.perks) PixelTanks.userData.perks = [false, false, false, false, false, false, false, false, false];
          if (!PixelTanks.userData.perk) PixelTanks.userData.perk = [0, 0];
          GUI.drawText(PixelTanks.user.username, 1280, 800, 100, '#ffffff', 0.5);
          PixelTanks.renderBottom(1200, 600, 160, PixelTanks.userData.color);
          GUI.drawImage(PixelTanks.images.tanks.bottom, 1200, 600, 160, 160, 1);
          PixelTanks.renderTop(1200, 600, 160, PixelTanks.userData.color);
          GUI.drawImage(PixelTanks.images.tanks.top, 1200, 600, 160, 180, 1);
          /*if (!PixelTanks.userData.cosmetics[0].includes('#')) {
            let cosmetics = {};
            for (const cosmetic of PixelTanks.userData.cosmetics) {
              if (cosmetics[cosmetic] === undefined) {
                cosmetics[cosmetic] = 1;
              } else cosmetics[cosmetic]++;
            }
            let cosmeticData = [];
            for (const cosmetic of Object.keys(cosmetics)) cosmeticData.push(cosmetic+'#'+cosmetics[cosmetic]);
            PixelTanks.userData.cosmetics = cosmeticData;
          }
          if (!PixelTanks.userData.deathEffects[0].includes('#')) {
            let deathEffects = {};
            for (const deathEffect of PixelTanks.userData.deathEffects) {
              if (deathEffects[deathEffect] === undefined) {
                deathEffects[deathEffect] = 1;
              } else deathEffects[deathEffect]++;
            }
            let deathEffectData = [];
            for (const deathEffect of Object.keys(deathEffects)) deathEffectData.push(deathEffect+'#'+deathEffects[deathEffect]);
            PixelTanks.userData.deathEffects = deathEffectData;
          }*/
          if (PixelTanks.userData.cosmetic_body !== 'undefined') GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic_body], 1200, 600, 160, 180, 1);
          if (PixelTanks.userData.cosmetic !== 'undefined') GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic], 1200, 600, 160, 180, 1);
          if (PixelTanks.userData.cosmetic_hat !== 'undefined') GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic_hat], 1200, 600, 160, 180, 1);
          if (newClass !== 'undefined') GUI.drawImage(PixelTanks.images.menus.alert, 530, 830, 20, 20, 1);
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
              [31, 511],
              [244, 511],
              [452, 511],
              [672, 511],
              [890, 511],
              [31, 594],
              [244, 594],
              [452, 594],
              [672, 594],
              [890, 594],
            ];
            for (const c of levelCoords) {
              if (x > c[0]*1600/1049 && x < (c[0]+80)*1600/1049 && y > c[1]*1000/653 && y < (c[1]+74)*1000/653) {
                Menus.removeListeners();
                PixelTanks.user.player = new Client(levelCoords.indexOf(c)+1, false, null);//rip the 0 lol
              }
            }
          }
        },
        cdraw: function() {},
      },
      victory: {
        buttons: [
          [656, 603, 313, 112, function() {
          Menus.trigger('main');
        }, true],
          [558, 726, 505, 114, function() {
            alert('no')
          }, true],
        ],
        listeners: {},
        cdraw: function() {
          //GUI.drawText('Coins: '+Menus.menus.victory.stats[coins], 800, 800, 50, '#ffffff', 0.5);
          //GUI.drawText('Crates: '+Menus.menus.victory.stats[crates], 800, 900, 50, '#ffffff', 0.5);
          //GUI.drawText('Xp: '+Menus.menus.victory.stats[xp], 800, 1000, 50, '#ffffff', 0.5);
        },
      },
      defeat: {
        buttons: [
          [656, 603, 313, 112, function() {
          Menus.trigger('main');
        }, true],
          [558, 726, 505, 114, function() {
            alert('no')
          }, true],
        ],
        listeners: {},
        cdraw: function() {
          GUI.drawText('Coins: '+Menus.menus.defeat.stats[coins], 800, 800, 50, '#ffffff', 0.5);
          GUI.drawText('Crates: '+Menus.menus.defeat.stats[crates], 800, 900, 50, '#ffffff', 0.5);
          GUI.drawText('Xp: '+Menus.menus.defeat.stats[xp], 800, 1000, 50, '#ffffff', 0.5);
        },
      },
      multiplayer: {
        buttons: [
          [424, 28, 108, 108, 'main'],
          [340, 376, 416, 116, function() {this.gamemode = 'ffa'}, true],
          [340, 532, 416, 116, function() {this.gamemode = 'duels'}, true],
          [340, 688, 416, 116, function() {this.gamemode = 'tdm'}, true],
          [340, 844, 416, 116, function() {this.gamemode = 'defense'}, true],
          [868, 848, 368, 88, function() {
            PixelTanks.user.player = new Client(this.ip, true, this.gamemode);
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
            /*this.socket = new MegaSocket((window.location.protocol === 'https:' ? 'wss://' : 'ws://')+this.ip, {keepAlive: false, reconnect: true, autoconnect: true});
            this.socket.on('connect', () => {
              this.socket.send({username: PixelTanks.user.username, type: 'stats'});
            });
            this.socket.on('message', (d) => {
              this.output = d;
            });*/
          }
        },
        cdraw: function() {
          if (!this.gamemode) {
            this.gamemode = 'ffa';
            this.output = {FFA: '', DUELS: '', TDM: ''};
            this.ip = '141.148.128.231:8080';
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
          [232, 308, 488, 488, function() {PixelTanks.openCrate(0, cosmetAmount)}, false],
          [880, 308, 488, 488, function() {PixelTanks.openCrate(1, deathAmount)}, false],
          [300, 816, 104, 52, function() {cosmetAmount = 1}, false],
          [424, 816, 104, 52, function() {cosmetAmount = 10}, false],
          [548, 816, 104, 52, function() {cosmetAmount = 100}, false],
          [948, 816, 104, 52, function() {deathAmount = 1}, false],
          [1072, 816, 104, 52, function() {deathAmount = 10}, false],
          [1196, 816, 104, 52, function() {deathAmount = 100}, false],
        ],
        listeners: {},
        cdraw: function() {
          GUI.drawText('Crates: ' + PixelTanks.userData.stats[1], 800, 260, 30, '#ffffff', 0.5);
          GUI.draw.globalAlpha = 1;
          GUI.draw.strokeStyle = '#FFFF00';
          GUI.draw.lineWidth = 10;
          if (cosmetAmount === 1) GUI.draw.strokeRect(300, 816, 104, 52);
          if (cosmetAmount === 10) GUI.draw.strokeRect(424, 816, 104, 52);
          if (cosmetAmount === 100) GUI.draw.strokeRect(548, 816, 104, 52);
          if (deathAmount === 1) GUI.draw.strokeRect(948, 816, 104, 52);
          if (deathAmount === 10) GUI.draw.strokeRect(1072, 816, 104, 52);
          if (deathAmount === 100) GUI.draw.strokeRect(1196, 816, 104, 52);
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
      void: {
        buttons: [
          [12, 12, 120, 120, 'main', true],
        ],
        listeners: {},
        cdraw: function() {},
      },
      settings1: {
        buttons: [
          [416, 20, 108, 108, 'main', true],
          [880, 208, 488, 96, 'settings2', true],
        ],
        listeners: {
          mousedown: function(e) {
            const key = {item1: [165, 404], item2: [381, 404], item3: [597, 404], item4: [827, 404], toolkit: [1043, 404], grapple: [1259, 404], boost: [165, 620], class: [381, 620], fire: [597, 620], powermissle: [827, 620], chat: [1043, 620], pause: [1259, 620]};
            for (const p in key) if (Menus.x > key[p][0] && Menus.x < key[p][0]+176 && Menus.y > key[p][1] && Menus.y < key[p][1]+176) {
              if (Menus.menus.settings1.selected === p) {
                PixelTanks.userData.keybinds[Menus.menus.settings1.selected] = 1000+e.button; // mouse handler
                return PixelTanks.save();
              } else return Menus.menus.settings1.selected = p;
            }
            
          },
          keydown: function(e) {
            PixelTanks.userData.keybinds[Menus.menus.settings1.selected] = e.keyCode;
            PixelTanks.save();
          }
        },
        cdraw: function() {
          const key = {item1: [165, 404], item2: [381, 404], item3: [597, 404], item4: [827, 404], toolkit: [1043, 404], grapple: [1259, 404], boost: [165, 620], class: [381, 620], fire: [597, 620], powermissle: [827, 620], chat: [1043, 620], pause: [1259, 620]};
          GUI.draw.fillStyle = '#A9A9A9'; // change selection  later?
          GUI.draw.lineWidth = 30; // border thickness
          for (const p in key) {
            if (Menus.menus.settings1.selected === p) GUI.draw.strokeRect(key[p][0], key[p][1], 176, 176);
            GUI.drawText(String.fromCharCode(PixelTanks.userData.keybinds[p]), key[p][0]+88, key[p][1]+88, 50, '#ffffff', .5);
          }
        },
      },
      settings2: {
        buttons: [
          [416, 20, 108, 108, 'main', true],
          [232, 208, 488, 96, 'settings1', true],
          //top 6
          [165, 404, 176, 176, function() {PixelTanks.purchase(0)}, true],
          [381, 404, 176, 176, function() {PixelTanks.purchase(1)}, true],
          [597, 404, 176, 176, function() {PixelTanks.purchase(4)}, true],
          [165, 620, 176, 176, function() {PixelTanks.purchase(2)}, true],
          [381, 620, 176, 176, function() {PixelTanks.purchase(5)}, true],
          [597, 620, 176, 176, function() {PixelTanks.purchase(3)}, true],
          //bottom 6
          [827, 404, 176, 176, function() {PixelTanks.purchase(0)}, true],
          [1043, 404, 176, 176, function() {PixelTanks.purchase(1)}, true],
          [1259, 404, 176, 176, function() {PixelTanks.purchase(4)}, true],
          [827, 620, 176, 176, function() {PixelTanks.purchase(2)}, true],
          [1043, 620, 176, 176, function() {PixelTanks.purchase(5)}, true],
          [1259, 620, 176, 176, function() {PixelTanks.purchase(3)}, true],
        ],
        listeners: {},
        cdraw: function() {
        },
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
                PixelTanks.user.player = new Client(helpCoords.indexOf(c)+1, false, null);
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
          [448, 360, 88, 88, function() {PixelTanks.switchTab('cosmeticTab', 'cosmetic_hat')}, false],
          [448, 460, 88, 88, function() {PixelTanks.switchTab('cosmeticTab', 'cosmetic')}, false],
          [448, 560, 88, 88, function() {PixelTanks.switchTab('cosmeticTab', 'cosmetic_body')}, false],
          [448, 220, 88, 88, function() {PixelTanks.switchTab('deathEffectsTab')}, false],
          [844, 816, 88, 88, function() {PixelTanks.switchTab('perkTab', 1)}, false],
          [932, 816, 88, 88, function() {PixelTanks.switchTab('perkTab', 2)}, false],
        ],
        listeners: {
          mousedown: function(e) {
            const {x, y} = Menus;
            if (this.classTab) {
              if (x < 688 || x > 912 || y < 334 || y > 666) return this.classTab = false;
              for (let xm = 0; xm < 2; xm++) {
                for (let ym = 0; ym < 3; ym++) {
                  if (Engine.collision(x, y, 0, 0, [702, 810][xm], [348, 456, 564][ym], 88, 88)) {
                    if (PixelTanks.userData.classes[[[0, 5, 3], [1, 4, 2]][xm][ym]]) {
                      const lastClass = PixelTanks.userData.class;
                      PixelTanks.userData.class = [['tactical', 'fire', 'medic'], ['stealth', 'builder', 'warrior']][xm][ym];
                      this.loaded = false;
                      if (PixelTanks.userData.class === lastClass) {
                        PixelTanks.userData.class = 'undefined';
                        this.loaded = false;
                      }
                    } else alert('You need to buy this first!');
                    return;
                  }
                }
              }
            } else if (this.itemTab) {
              if (x < 580 || x > 1020 || y < 334 || y > 666) return this.itemTab = false;
              const key = {airstrike: [600, 354], super_glu: [708, 354], duck_tape: [816, 354], shield: [924, 354], flashbang: [600, 462], bomb: [708, 462], dynamite: [816, 462], usb: [924, 462], weak: [600, 570], strong: [708, 570], spike: [816, 570], reflector: [924, 570]};
              for (const item in key) {
                if (Engine.collision(x, y, 0, 0, key[item][0], key[item][1], 80, 80)) {
                  if (!PixelTanks.userData.items.includes(item) || PixelTanks.userData.items[this.currentItem-1] === item) {
                    const lastItem = PixelTanks.userData.items[this.currentItem-1];
                    PixelTanks.userData.items[this.currentItem-1] = item;
                    this.loaded = false;
                    if (item === lastItem) {
                      PixelTanks.userData.items[this.currentItem-1] = 'undefined';
                      this.loaded = false;
                    }
                  } else alert('You are not allowed to have more than 1 of the same item');
                  return;
                }
              }
            } else if (this.perkTab) {
              if (x < 634 || x > 966 || y < 334 || y > 666) return this.perkTab = false;
              const xo = [652, 760, 868];
              const yo = [352, 460, 568];
              for (let i = 0; i < 9; i++) {
                if (Engine.collision(x, y, 0, 0, xo[i%3], yo[Math.floor(i/3)], 80, 80)) {
                  let simple = PixelTanks.userData.perk.reduce((a, c) => a.concat(Math.floor(c)), []);
                  if (!simple.includes(i+1) && PixelTanks.userData.perks[i]) {
                    const lastperk = PixelTanks.userData.perk[Menus.menus.inventory.currentPerk-1];
                    PixelTanks.userData.perk[Menus.menus.inventory.currentPerk-1] = i+1+PixelTanks.userData.perks[i]/10;
                    this.loaded = false;
                    if (PixelTanks.userData.perk[Menus.menus.inventory.currentPerk-1] === lastperk) {
                        PixelTanks.userData.perk[Menus.menus.inventory.currentPerk-1] = 'undefined';
                        this.loaded = false;
                      }
                  } 
                }
              }  
            } else if (this.cosmeticTab) {
              if (x < 518 || x > 1082 || y < 280 || y > 720) return Menus.menus.inventory.cosmeticTab = false;
              for (let i = 0; i < 16; i++) {
                if (Engine.collision(x, y, 0, 0, 598+(i%4)*108, 298+Math.floor(i/4)*108, 88, 88)) {
                  if (e.button === 0) {
                    let co = PixelTanks.userData.cosmetics[this.cosmeticMenu*16+i].split('#')[0]
                    PixelTanks.userData[Menus.menus.inventory.cosmeticType] = PixelTanks.userData[Menus.menus.inventory.cosmeticType] === co ? '' : co;
                    this.loaded = false;
                  } else {
                    const [cosmetic, amount] = PixelTanks.userData.cosmetics[this.cosmeticMenu*16+i].split('#');
                    if (amount === undefined || Number(amount) <= 1) return PixelTanks.userData.cosmetics.splice(this.cosmeticMenu*16+i, 1);
                    PixelTanks.userData.cosmetics[this.cosmeticMenu*16+i] = cosmetic+'#'+(Number(amount)-1);
                    this.loaded = false;
                  }
                  return;
                }
              }
            } else if (this.deathEffectsTab) {
              if (x < 518 || x > 1082 || y < 280 || y > 720) return Menus.menus.inventory.deathEffectsTab = false;
              for (let i = 0; i < 16; i++) {
                if (Engine.collision(x, y, 0, 0, 598+(i%4)*108, 298+Math.floor(i/4)*108, 88, 88)) {
                  if (e.button === 0) {
                    let de = PixelTanks.userData.deathEffects[this.deathEffectsMenu*16+i].split('#')[0];
                    PixelTanks.userData.deathEffect = PixelTanks.userData.deathEffect === de ? '' : de;
                  } else {
                    const [deathEffect, amount] = PixelTanks.userData.deathEffects[this.deathEffectsMenu*16+i].split('#');
                    if (amount === undefined || Number(amount) <= 1) return PixelTanks.userData.deathEffects.splice(this.deathEffectsMenu*16+i, 1);
                    const lastDeath = PixelTanks.userData.deathEffects[this.deathEffectsMenu*16+i];
                    PixelTanks.userData.deathEffects[this.deathEffectsMenu*16+i] = deathEffect+'#'+(Number(amount)-1);
                    this.loaded = false;
                    if (PixelTanks.userData.deathEffects[this.deathEffectsMenu*16+i] === lastDeath) {
                        PixelTanks.userData.deathEffect = 'undefined';
                        this.loaded = false;
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
            if (this.deathEffectsTab) {
              if (e.keyCode === 37 && this.deathEffectsMenu > 0) this.deathEffectsMenu--;
              if (e.keyCode === 39 && this.deathEffectsMenu+1 !== Math.ceil(PixelTanks.userData.deathEffects.length/16)) this.deathEffectsMenu++;
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
          GUI.drawText(PixelTanks.user.username, 280, 420, 80, '#000000', .5);
          GUI.drawText('Coins: '+coins, 280, 500, 50, '#FFE900', .5);
          GUI.drawText('Rank: '+rank, 280, 550, 50, '#FF2400', .5);
          GUI.drawText('Level Up Progress', 1400, 400, 50, '#000000', .5);
          GUI.drawText((rank < 20 ? coins+'/'+coinsUP : 'MAXED')+' Coins', 1400, 500, 50, rank < 20 ? (coins < coinsUP ? '#FF2400' : '#90EE90') : '#63666A', .5);
          GUI.drawText((rank < 20 ? xp+'/'+xpUP : 'MAXED')+' XP', 1400, 550, 50, rank < 20 ? (xp < xpUP ? '#FF2400' : '#90EE90') : '#63666A', .5);
          if (coins < coinsUP || xp < xpUP || rank > 19) {
            GUI.draw.fillStyle = '#000000';
            GUI.draw.globalAlpha = .7;
            GUI.draw.fillRect(1064, 458, 88, 88);
            GUI.draw.globalAlpha = 1;
          }
          for (let i = 0; i < 4; i++) {
            if (PixelTanks.userData.items[i] !== 'undefined') GUI.drawImage(PixelTanks.images.items[PixelTanks.userData.items[i]], [404, 492, 580, 668][i], 820, 80, 80, 1);
            if (PixelTanks.userData.items[i] === 'undefined') GUI.drawImage(PixelTanks.images.menus.broke, [404, 492, 580, 668][i], 820, 80, 80, 1);
          }
          let perkKey = [0, 'shield', 'thermal', 'scavenger', 'cooldown', 'refresh', 'radar', 'hook', 'adrenaline', 'core'];
          if (PixelTanks.userData.perk[0]) GUI.drawImage(PixelTanks.images.menus[perkKey[Math.floor(PixelTanks.userData.perk[0])]], 844, 816, 88, 88, 1, 0, 0, 0, 0, undefined, ((PixelTanks.userData.perk[0]%1)*10-1)*40, 0, 40, 40);
          if (!PixelTanks.userData.perk[0]) GUI.drawImage(PixelTanks.images.menus.broke, 844, 816, 88, 88, 1);
          if (PixelTanks.userData.perk[1]) GUI.drawImage(PixelTanks.images.menus[perkKey[Math.floor(PixelTanks.userData.perk[1])]], 932, 816, 88, 88, 1, 0, 0, 0, 0, undefined, ((PixelTanks.userData.perk[1]%1)*10-1)*40, 0, 40, 40);
          if (!PixelTanks.userData.perk[1]) GUI.drawImage(PixelTanks.images.menus.broke, 932, 816, 88, 88, 1);
          PixelTanks.renderBottom(680, 380, 240, PixelTanks.userData.color);
          GUI.drawImage(PixelTanks.images.tanks.bottom, 680, 380, 240, 240, 1);
          PixelTanks.renderTop(680, 380, 240, PixelTanks.userData.color, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
          GUI.drawImage(PixelTanks.images.tanks.top, 680, 380, 240, 270, 1, 120, 120, 0, 0, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
          if (PixelTanks.userData.cosmetic_body && PixelTanks.userData.cosmetic_body !== 'undefined') GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic_body], 680, 380, 240, 270, 1, 120, 120, 0, 0, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
          if (PixelTanks.userData.cosmetic && PixelTanks.userData.cosmetic !== 'undefined') GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic], 680, 380, 240, 270, 1, 120, 120, 0, 0, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
          if (PixelTanks.userData.cosmetic_hat && PixelTanks.userData.cosmetic_hat !== 'undefined') GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic_hat], 680, 380, 240, 270, 1, 120, 120, 0, 0, (-Math.atan2(this.target.x, this.target.y)*180/Math.PI+360)%360);
          const key = {tactical: [7, 7], fire: [7, 61], medic: [7, 115], stealth: [61, 7], builder: [61, 61], warrior: [61, 115]};
          if (!PixelTanks.userData.class) PixelTanks.userData.class = 'undefined';
          if (!PixelTanks.userData.classes || !PixelTanks.userData.class || PixelTanks.userData.class === 'undefined') GUI.drawImage(PixelTanks.images.menus.broke, 1112, 816, 88, 88, 1);
          if (PixelTanks.userData.classes && PixelTanks.userData.class && PixelTanks.userData.class !== 'undefined') GUI.drawImage(PixelTanks.images.menus.classTab, 1112, 816, 88, 88, 1, 0, 0, 0, 0, undefined, key[PixelTanks.userData.class][0], key[PixelTanks.userData.class][1], 44, 44);
          if (PixelTanks.userData.cosmetic_hat && PixelTanks.userData.cosmetic_hat !== 'undefined') GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic_hat], 448, 360, 88, 88, 1);
          if (PixelTanks.userData.cosmetic && PixelTanks.userData.cosmetic !== 'undefined') GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic], 448, 460, 88, 88, 1);
          if (PixelTanks.userData.cosmetic_body && PixelTanks.userData.cosmetic_body !== 'undefined') GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic_body], 448, 560, 88, 88, 1);
          if (!PixelTanks.userData.cosmetic_hat && PixelTanks.userData.cosmetic_hat !== 'undefined') GUI.drawImage(PixelTanks.images.menus.broke, 448, 360, 88, 88, 1);
          if (!PixelTanks.userData.cosmetic && PixelTanks.userData.cosmetic !== 'undefined') GUI.drawImage(PixelTanks.images.menus.broke, 448, 460, 88, 88, 1);
          if (!PixelTanks.userData.cosmetic_body && PixelTanks.userData.cosmetic_body !== 'undefined') GUI.drawImage(PixelTanks.images.menus.broke, 448, 560, 88, 88, 1);
          if (newClass !== 'undefined') GUI.drawImage(PixelTanks.images.menus.alert, 1102, 806, 20, 20, 1);
          const deathEffectData = PixelTanks.images.deathEffects[PixelTanks.userData.deathEffect+'_'];
          if (PixelTanks.userData.deathEffect && deathEffectData) GUI.drawImage(PixelTanks.images.deathEffects[PixelTanks.userData.deathEffect], 448, 220, 88, 88, 1, 0, 0, 0, 0, undefined, (Math.floor((Date.now()-this.time)/deathEffectData.speed)%deathEffectData.frames)*200, 0, 200, 200);
          if (!(PixelTanks.userData.deathEffect && deathEffectData)) GUI.drawImage(PixelTanks.images.menus.broke, 448, 220, 88, 88, 1);
          Menus.menus.inventory.buttonEffect = true;
          if (this.perkTab || this.healthTab || this.classTab || this.itemTab || this.cosmeticTab || this.deathEffectsTab) {
            Menus.menus.inventory.buttonEffect = false;
            GUI.drawImage(PixelTanks.images.blocks.void, 0, 0, 1600, 1600, .7);
          }
          if (this.classTab) {
            GUI.drawImage(PixelTanks.images.menus.classTab, 688, 334, 224, 332, 1);
            const classX = [701, 810, 810, 701, 810, 701];
            const classY = [348, 348, 564, 564, 456, 456];
            for (let i = 0; i < 6; i++) {
              if (!PixelTanks.userData.classes[i]) GUI.drawImage(PixelTanks.images.menus.locked, classX[i], classY[i], 88, 88, 1);
            }
            if (PixelTanks.userData.class !== 'undefined') {
              GUI.draw.strokeStyle = '#FFFF00';
              GUI.draw.lineWidth = 10;
              if (PixelTanks.userData.class === 'tactical') GUI.draw.strokeRect(701, 348, 88, 88); else if (PixelTanks.userData.class === 'fire') GUI.draw.strokeRect(701, 456, 88, 88); else if (PixelTanks.userData.class === 'medic') GUI.draw.strokeRect(701, 565, 88, 88); else if (PixelTanks.userData.class === 'stealth') GUI.draw.strokeRect(814, 348, 88, 88); else if (PixelTanks.userData.class === 'builder') GUI.draw.strokeRect(814, 456, 88, 88); else if (PixelTanks.userData.class === 'warrior') GUI.draw.strokeRect(814, 565, 88, 88);
            }
          } else if (this.itemTab) {
            GUI.drawImage(PixelTanks.images.menus.itemTab, 580, 334, 440, 332, 1);
            const key = {airstrike: [600, 354], super_glu: [708, 354], duck_tape: [816, 354], shield: [924, 354], flashbang: [600, 462], bomb: [708, 462], dynamite: [816, 462], usb: [924, 462], weak: [600, 570], strong: [708, 570], spike: [816, 570], reflector: [924, 570]};
            for (const item in key) GUI.drawImage(PixelTanks.images.items[item], key[item][0], key[item][1], 80, 80, 1);
          } else if (this.perkTab) {
            GUI.drawImage(PixelTanks.images.menus.perkTab, 634, 334, 332, 332, 1); //166x2
            const perks = ['shield', 'thermal', 'scavenger', 'cooldown', 'refresh', 'radar', 'hook', 'adrenaline', 'core'];
            const x = [652, 760, 868];
            const y = [352, 460, 568];
            for (let i = 0; i < 9; i++) {
              let level = PixelTanks.userData.perks[i], lock = !level;
              if (lock) level = 1;
              let simple = PixelTanks.userData.perk.reduce((a, c) => a.concat(Math.floor(c)), []);
              if (simple.includes(i+1)) {
                GUI.draw.strokeStyle = '#FFFF66';
                GUI.draw.lineWidth = 10;
                GUI.draw.strokeRect(x[i%3], y[Math.floor(i/3)], 80, 80);
              }
              if (Math.floor(PixelTanks.userData.perk[Menus.menus.inventory.currentPerk-1]) === i+1) {
                GUI.draw.strokeStyle = '#FFFF22';
                GUI.draw.lineWidth = 10;
                GUI.draw.strokeRect(x[i%3], y[Math.floor(i/3)], 80, 80);
              }
              GUI.drawImage(PixelTanks.images.menus[perks[i]], x[i%3], y[Math.floor(i/3)], 80, 80, 1, 0, 0, 0, 0, undefined, (level-1)*40, 0, 40, 40);
              if (lock) GUI.drawImage(PixelTanks.images.menus.locked, x[i%3], y[Math.floor(i/3)], 80, 80, 1);
            } 
          } else if (this.cosmeticTab) {
            const a = this.cosmeticMenu === 0, b = this.cosmeticMenu === Math.floor(PixelTanks.userData.cosmetics.length/16);
            GUI.drawImage(PixelTanks.images.menus.cosmeticTab, 518+(a ? 62 : 0), 280, 564-(a ? 62 : 0)-(b ? 62 : 0), 440, 1, 0, 0, 0, 0, undefined, (a ? 31 : 0), 0, 282-(a ? 31 : 0)-(b ? 31 : 0), 220);
            for (let i = this.cosmeticMenu*16; i < Math.min((this.cosmeticMenu+1)*16, PixelTanks.userData.cosmetics.length); i++) {
              try {
                GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetics[i].split('#')[0]], 598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 88, 88, 1);
              } catch(e) {
                GUI.draw.fillStyle = '#FF0000';
                GUI.draw.fillRect(598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 88, 88);
              }
              GUI.drawText(PixelTanks.userData.cosmetics[i].split('#')[1], 598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 30, '#FF0000', .5);
              if (PixelTanks.userData.cosmetics[i].split('#')[0] === PixelTanks.userData[Menus.menus.inventory.cosmeticType]) {
                GUI.draw.strokeStyle = '#FFFF22';
                GUI.draw.lineWidth = 10;
                GUI.draw.strokeRect(598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 88, 88);
              }
            }
          } else if (this.deathEffectsTab) {
            const a = this.deathEffectsMenu === 0, b = this.deathEffectsMenu === Math.floor(PixelTanks.userData.deathEffects.length/16);
            GUI.drawImage(PixelTanks.images.menus.deathEffectsTab, 518+(a ? 62 : 0), 280, 564-(a ? 62 : 0)-(b ? 62 : 0), 440, 1, 0, 0, 0, 0, undefined, (a ? 31 : 0), 0, 282-(a ? 31 : 0)-(b ? 31 : 0), 220);
            for (let i = this.deathEffectsMenu*16; i < Math.min((this.deathEffectsMenu+1)*16, PixelTanks.userData.deathEffects.length); i++) {
              const d = PixelTanks.images.deathEffects[PixelTanks.userData.deathEffects[i].split('#')[0]+'_'];
              if (d) GUI.drawImage(PixelTanks.images.deathEffects[PixelTanks.userData.deathEffects[i].split('#')[0]], 598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 88, 88, 1, 0, 0, 0, 0, undefined, (Math.floor((Date.now()-this.time)/d.speed)%d.frames)*200, 0, 200, 200);
              GUI.drawText(PixelTanks.userData.deathEffects[i].split('#')[1], 598+(i%4)*108, 298+Math.floor((i%16)/4)*108, 30, '#FF0000', .5);
              if (PixelTanks.userData.deathEffects[i].split('#')[0] === PixelTanks.userData.deathEffect) {
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
          [880, 208, 488, 96, 'shop2', true],
          [496, 404, 176, 176, function() {PixelTanks.purchase(0, 0)}, true],
          [712, 404, 176, 176, function() {PixelTanks.purchase(0, 1)}, true],
          [928, 404, 176, 176, function() {PixelTanks.purchase(0, 4)}, true],
          [496, 620, 176, 176, function() {PixelTanks.purchase(0, 2)}, true],
          [712, 620, 176, 176, function() {PixelTanks.purchase(0, 5)}, true],
          [928, 620, 176, 176, function() {PixelTanks.purchase(0, 3)}, true],
        ],
        listeners: {},
        keydown: function(e) {if (e.keyCode === 27) Menus.trigger('main')},
        cdraw: function() {
          GUI.drawText(PixelTanks.userData.stats[0]+' coinage', 800, 350, 50, 0x000000, 0.5);
          if (newClass !== 'undefined') GUI.drawImage(PixelTanks.images.menus.alert, 406, 10, 20, 20, 1);
          //GUI.drawImage(PixelTanks.images.menus.alert, 406, 10, 20, 20, 1);
        },
      },
      shop2: {
        buttons: [
          [416, 20, 108, 108, 'main', true],
          [232, 208, 488, 96, 'shop', true],
          //emergency cloak
          [60, 404, 136, 136, function() {PixelTanks.purchase(1, 0)}, true],
          [60, 572, 136, 136, function() {PixelTanks.purchase(1, 1)}, true],
          //thermal armor
          [228, 404, 136, 136, function() {PixelTanks.purchase(1, 2)}, true],
          [228, 572, 136, 136, function() {PixelTanks.purchase(1, 3)}, true],
          [228, 740, 136, 136, function() {PixelTanks.purchase(1, 4)}, true],
          //scav
          [396, 404, 136, 136, function() {PixelTanks.purchase(1, 5)}, true],
          [396, 572, 136, 136, function() {PixelTanks.purchase(1, 6)}, true],
          [396, 740, 136, 136, function() {PixelTanks.purchase(1, 7)}, true],
          //lower cd
          [564, 404, 136, 136, function() {PixelTanks.purchase(1, 8)}, true],
          [564, 572, 136, 136, function() {PixelTanks.purchase(1, 9)}, true],
          [564, 740, 136, 136, function() {PixelTanks.purchase(1, 10)}, true],
          //relfect boost
          [732, 404, 136, 136, function() {PixelTanks.purchase(1, 11)}, true],
          [732, 572, 136, 136, function() {PixelTanks.purchase(1, 12)}, true],
          //double boost
          [900, 404, 136, 136, function() {PixelTanks.purchase(1, 13)}, true],
          [900, 572, 136, 136, function() {PixelTanks.purchase(1, 14)}, true],
          //gripple
          [1068, 404, 136, 136, function() {PixelTanks.purchase(1, 15)}, true],
          [1068, 572, 136, 136, function() {PixelTanks.purchase(1, 16)}, true],
          [1068, 740, 136, 136, function() {PixelTanks.purchase(1, 17)}, true],
          //ai
          [1236, 404, 136, 136, function() {PixelTanks.purchase(1, 18)}, true],
          [1236, 572, 136, 136, function() {PixelTanks.purchase(1, 19)}, true],
          [1236, 740, 136, 136, function() {PixelTanks.purchase(1, 20)}, true],
          //living
          [1404, 404, 136, 136, function() {PixelTanks.purchase(1, 21)}, true],
          [1404, 572, 136, 136, function() {PixelTanks.purchase(1, 22)}, true],
          [1404, 740, 136, 136, function() {PixelTanks.purchase(1, 23)}, true],
        ],
        listeners: {},
        keydown: function(e) {if (e.keyCode === 27) Menus.trigger('main')},
        cdraw: function() {
          GUI.drawText(PixelTanks.userData.stats[0]+' coinage', 800, 350, 50, 0x000000, 0.5);
          if (newClass !== 'undefined') GUI.drawImage(PixelTanks.images.menus.alert, 406, 10, 20, 20, 1);
          //GUI.drawImage(PixelTanks.images.menus.alert, 406, 10, 20, 20, 1);
        },
      },
      pause: {
        buttons: [[1218, 910, 368, 76, function() {
          this.paused = false;
          PixelTanks.user.player.implode();
          Menus.trigger('main');
          this.multiplayer = undefined;
        }, true]],
        listeners: {},
        cdraw: () => {},
      },
    }
    
      for (const m in Menus.menus) {
        Menus.menus[m] = new Menu(Menus.menus[m], m);
        }
    }
    document.head.appendChild(config);
    PixelTanks.socket = new MegaSocket(window.location.protocol === 'https:' ? 'wss://'+window.location.hostname : 'ws://141.148.128.231', {keepAlive: true, reconnect: true, autoconnect: true});
  }

  static launch() {  
    setTimeout(() => Menus.trigger('start'), 200);
  }

  static save() {
    PixelTanks.playerData['pixel-tanks'] = PixelTanks.userData;
    Network.update('playerdata', JSON.stringify(PixelTanks.playerData));
  }

  static getData(callback) {
      Network.get(data => {
        try {
          PixelTanks.playerData = JSON.parse(data.playerdata);
        } catch(e) {
          PixelTanks.playerData = data.playerdata;
        }
        PixelTanks.userData = PixelTanks.playerData['pixel-tanks'];
        if (!PixelTanks.userData) {
          PixelTanks.userData = {
            class: '',
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
            classes: [false, false, false, false, false, false],
            perks: [false, false, false, false, false, false, false, false, false],
            perk: [0, 0],
            items: ['duck_tape', 'weak', 'bomb', 'flashbang'],
            keybinds: {
              items: [49, 50, 51, 52],
              toolkit: 81,
              grapple: 82,
              boost: 16,
              class: 70,
              fire: 32,
              powermissle: 86,
              chat: 13,
              pause: 27,
            },
          };
        }
        clearInterval(PixelTanks.autosave);
        PixelTanks.autosave = setInterval(() => PixelTanks.save(), 5000);
        callback();
      });
  }

  static auth(u, p, t) {
    Network.auth(u, p, t, () => PixelTanks.getData(() => Menus.trigger(t === 'login' ? 'main' : 'htp1')));
  }

  static switchTab(id, n) {
    if (!Menus.menus.inventory.healthTab && !Menus.menus.inventory.classTab && !Menus.menus.inventory.itemTab && !Menus.menus.inventory.cosmeticTab) Menus.menus.inventory[id] = true;
    if (n && id === 'itemTab') Menus.menus.inventory.currentItem = n;
    if (n && id === 'cosmeticTab') Menus.menus.inventory.cosmeticType = n;
    if (n && id === 'perkTab') Menus.menus.inventory.currentPerk = n;
    Menus.redraw();
  } // OPTIMIZE
  
  static openCrate(type, stuffAmount) {
    if (PixelTanks.userData.stats[1] < (type ? 5 : 1)*stuffAmount) return alert('Not Enough Crates');
    PixelTanks.userData.stats[1] -= (type ? 5 : 1)*stuffAmount; 
    let nimber = 100;
    if (stuffAmount === 1) nimber = 1000;
    if (stuffAmount === 10) nimber = 500;
    if (stuffAmount === 100) nimber = 100;
    let namber = -(nimber);
    for (let i = 0; i < stuffAmount; i++) {
      namber += nimber;
      setTimeout(() => {
        const price = type ? 5 : 1, name = type ? 'deathEffects' : 'cosmetics', rand = Math.floor(Math.random()*1001);
        let crate = PixelTanks.crates;
          /*crate = [{
          common: ['white horns', 'white wings', 'blue horns', 'gold horns', 'blue wings', 'gold wings', 'watermelon', 'Spooked', 'Cute Eyes', 'Army', 'Top Hat', 'X', 'Red Hoodie', 'Devil Wings', 'Devil Horns', 'Exclaimation Point', 'Orange Hoodie', 'GoldShield', 'Yellow Hoodie', 'Green Hoodie', 'Blue Hoodie', 'Purple Hoodie', 'Cancelled', 'Spirals', 'Speaker', 'Spikes', 'Candy Cane', 'Pumpkin Face', 'Mask', 'Purple-Pink Hoodie', 'Bunny Ears'],
          uncommon: ['glitch', 'spoider', 'CompanionCube', 'PortalCube', 'half glitch', 'eye', 'Anime Eyes', 'Angry Eyes', 'Hard Hat', 'Present', 'Dead', 'Peace', 'Question Mark', 'Small Scratch', 'Kill = Ban', 'Reindeer Hat', 'Pumpkin Hat', 'Cat Ears', 'Cake', 'Cat Hat', 'bread', 'First Aid', 'silver', 'Fisher Hat', 'chip', 'eyes', 'zombie', 'googly', 'static', 'lava', 'void knight'],
          rare: ['gold helment', 'toxic', 'Antlers', 'White helment', 'Blue Helment', 'Aqua Helment', 'Purple helment', 'Stripes', 'scoped', 'brain', 'Hands', 'Straw Hat', 'Hax', 'Tools', 'Money Eyes', 'Dizzy', 'Checkmark', 'Sweat', 'Scared', 'Blue Tint', 'Purple Top Hat', 'Purple Grad Hat', 'Eyebrows', 'Helment', 'Rudolph', 'Candy Corn', 'Flag', 'Katana',  'Swords', 'angry hoodie'],
          epic: ['Aaron', 'hacker_hoodie', 'Plasma Ball', 'Hazard', 'Locked', 'Elf', 'Triple Gun', 'Evil Eyes', 'Gold', 'Rage', 'Onfire', 'Halo', 'Police', 'Deep Scratch', 'bluekatana', 'Assassin', 'Astronaut', 'Christmas Lights', 'No Mercy', 'Error', 'disguise', 'Lego', 'Paleontologist', 'hollow_eye'],
          legendary: ['Sun Roof', 'Blind', 'Redsus', 'Uno Reverse', 'Christmas Hat', 'Mini Tank',],
          mythic: ['Terminator', 'MLG Glasses', 'Power Armor', 'venom'],
        }, {
          common: ['explode', 'nuke', 'insta', 'evan'], //bruh why am i common :(
          uncommon: ['anvil', 'gameover', 'minecraft'],
          rare: ['darksouls', 'magic', 'Cactus'],
          epic: ['battery', 'skull', 'banhammer'],
          legendary: ['error', 'tombstone', 'pokeball'],
          mythic: ['clicked', 'cat'],
        }];*/
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
        let number = Math.floor(Math.random()*(crate[type][rarity].length)), item;
        for (const e in this.images[name]) if (e === crate[type][rarity][number]) item = this.images[name][e];
        if (item === undefined) return alert('Error while trying to give you cosmetic id "'+crate[type][rarity][number]+'"');
        Menus.removeListeners();
        const start = Date.now(), render = setInterval(function() {
          GUI.clear();
          if (type) GUI.drawImage(item, 600, 400, 400, 400, 1, 0, 0, 0, 0, undefined, (Math.floor((Date.now()-start)/PixelTanks.images[name][crate[type][rarity][number]+'_'].speed)%PixelTanks.images[name][crate[type][rarity][number]+'_'].frames)*200, 0, 200, 200);
          if (!type) GUI.drawImage(item, 600, 400, 400, 400, 1);
          GUI.drawText('You Got', 800, 200, 100, '#ffffff', 0.5);
          GUI.drawText(crate[type][rarity][number].split('_').reduce((a, c) => (a.concat(c.charAt(0).toUpperCase()+c.slice(1))), []).join(' '), 800, 800, 50, '#ffffff', 0.5);
          GUI.drawText(rarity, 800, 900, 30, {mythic: '#FF0000', legendary: '#FFFF00', epic: '#A020F0', rare: '#0000FF', uncommon: '#32CD32', common: '#FFFFFF'}[rarity], 0.5);
        }, 15); // use built in menus renderer instead?
        let done = false;
        for (const i in PixelTanks.userData[name]) {
          const [item, amount] = PixelTanks.userData[name][i].split('#');
          if (item === crate[type][rarity][number]) {
            done = true;
            PixelTanks.userData[name][i] = item+'#'+(Number(amount)+1);
          }
        }
        if (!done) PixelTanks.userData[name].unshift(crate[type][rarity][number]+'#1');
        setTimeout(() => {
          clearInterval(render);
          if (i+1 < stuffAmount) Menus.trigger('void'); else Menus.trigger('crate');
          PixelTanks.save();
        }, (nimber)-20);
      }, namber);
    }
  }

  static convertCosmeticFormat() {
    const c = a => a.replaceAll(' ', '_').toLowerCase();
    for (let cosmetic of PixelTanks.userData.cosmetics) cosmetic = c(cosmetic);
    PixelTanks.userData.cosmetic_body = c(PixelTanks.userData.cosmetic_body);
    PixelTanks.userData.cosmetic = c(PixelTanks.userData.cosmetic);
    PixelTanks.userData.cosmetic_hat = c(PixelTanks.userData.cosmetic_hat);
  }

  static upgrade() {
    const coins = PixelTanks.userData.stats[0], xp = PixelTanks.userData.stats[3], rank = PixelTanks.userData.stats[4];
    if (coins < (rank+1)*1000 || xp < (rank+1)*100) return alert('Your  boi!');
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

  static purchase(type, stat) {
    if (type === 0) { // classes
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
    } else if (type === 1) {
      const levelRequirements = [2, 4, 6, 8, 10, 12, 14, 16, 18];
      const prices = [5000, 10000, 15000];
      const key = [2, 3, 3, 3, 2, 2, 3, 3, 3];
      let i = stat, l = 0, o = 0;
      while (i >= 0) {
        i -= key[l];
        if (i >= 0) l++; else o = key[l]+i+1;
      }
      let perk = PixelTanks.userData.perks[l];
      if (o <= perk) return alert('You already bought this.');
      if (PixelTanks.userData.stats[4] < levelRequirements[l]) return alert('You need to be rank '+levelRequirements[l]+' to buy this!');
      if (PixelTanks.userData.stats[0] < prices[o-1]) return alert('Your brok boi.');
      PixelTanks.userData.stats[0] -= prices[o-1];
      PixelTanks.userData.perks[l] = o;
    }
  }
}
