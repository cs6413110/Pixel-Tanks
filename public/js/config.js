const images = {
  blocks: {
    barrier: '/blocks/barrier',
    strong: '/blocks/strong',
    weak: '/blocks/weak',
    spike: '/blocks/spike',
    floor: '/blocks/floor',
    void: '/blocks/void',
    gold: '/blocks/gold',
    fire: '/blocks/fire',
    friendlyfire: '/blocks/friendlyfire',
    airstrike: '/blocks/airstrike',
    friendlyairstrike: '/blocks/friendlyairstrike',
  },
  bullets: {
    //normal: '/bullets/normal', no image yet :(
    shotgun: '/bullets/shotgun',
    powermissle: '/bullets/powermissle',
    megamissle: '/bullets/megamissle',
    grapple: '/bullets/grapple',
    dynamite: '/bullets/dynamite',
    fire: '/bullets/fire',
    usb: '/bullets/usb',
  },
  tanks: {
    buff: '/tanks/buff',
    reflect: '/tanks/reflect',
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
    'ShieldGold': '/cosmetics/ShieldGold',
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
    'Present': '/cosmetics/present',
    'Blind': '/cosmetics/blind',
    'Gold': '/cosmetics/gold',
    'Box': '/cosmetics/box',
    'Straw Hat': '/cosmetics/strawhat',
    'Evil Eyes': '/cosmetics/evileye',
    'Black': '/cosmetics/black',
    'Lego': '/cosmetics/lego',
    'Dead': '/cosmetics/dead',
    "PWR-DMG'S HELM": '/cosmetics/pwr-dmg-helm',
  },
  menus: {
    ui: '/menus/ui',
    start: '/menus/start',
    main: '/menus/main',
    multiplayer: '/menus/multiplayer',
    singleplayer: '/menus/singleplayer',
    victory: '/menus/victory',
    defeat: '/menus/defeat',
    crate: '/menus/crate',
    //settings: '/menus/settings',
    keybinds: '/menus/keybinds',
    inventory: '/menus/inventory',
    classTab: '/menus/classTab',
    itemTab: '/menus/itemTab',
    cosmeticTab: '/menus/cosmeticTab', // FIX DUPLICATE USELESS(deathEffecs and cosmetic tab referenceing same imagoge);
    deathEffectsTab: '/menus/cosmeticTab',
    shop: '/menus/shop',
    broke: '/menus/broke',
    htp1: '/menus/htp1',
    htp2: '/menus/htp2',
    htp3: '/menus/htp3',
    htp4: '/menus/htp4',
    pause: '/menus/pause',
    help: '/menus/help',
    helpinventory: '/menus/helpinventory',
    helpcosmetic: '/menus/helpcosmetic',
    helpclass: '/menus/helpclass',
    helpmode: '/menus/helpmode',
    helpvocab: '/menus/helpvocab',
    helpteam: '/menus/helpteam',
  },
  emotes: { // type: 0=loop 1=play once 2=static
    speech: '/emotes/speech',
    speech_: { speed: 50 },
    mlg: '/emotes/mlg',
    mlg_: { type: 1, frames: 13, speed: 50 },
    wink: '/emotes/wink',
    wink_: { type: 2, speed: 50 },
    confuzzled: '/emotes/confuzzled',
    confuzzled_: { type: 2, speed: 50 },
    surrender: '/emotes/surrender',
    surrender_: { type: 2, speed: 50 },
    anger: '/emotes/anger',
    anger_: { type: 0, frames: 4, speed: 50 },
    ded: '/emotes/ded',
    ded_: { type: 2, speed: 50 },
    mercy: '/emotes/mercy',
    mercy_: { type: 0, frames: 1, speed: 50 },
    suffocation: '/emotes/suffocation',
    suffocation_: { type: 0, frames: 3, speed: 50 },
    nomercy: '/emotes/nomercy',
    nomercy_: { type: 0, frames: 1, speed: 50 },
    idea: '/emotes/idea',
    idea_: { type: 1, frames: 6, speed: 50 },
    scared: '/emotes/scared',
    scared_: { type: 2, speed: 50 },
    crying: '/emotes/crying',
    crying_: { type: 0, frames: 5, speed: 50 },
    flat: '/emotes/flat',
    flat_: { type: 0, frames: 1, speed: 50 },
    noflat: '/emotes/noflat',
    noflat_: { type: 0, frames: 1, speed: 50 },
    rage: '/emotes/rage',
    rage_: { type: 0, frames: 5, speed: 50 },
    sad: '/emotes/sad',
    sad_: { type: 0, frames: 2, speed: 50 },
    sweat: '/emotes/sweat',
    sweat_: { type: 0, frames: 10, speed: 50 },
    teamedon: '/emotes/miss',
    teamedon_: { type: 1, frames: 28, speed: 75 },
    evanism: '/emotes/evanism',
    evanism_: { type: 1, frames: 45, speed: 100 },
    miss: '/emotes/teamedon',
    miss_: { type: 0, frames: 12, speed: 50 },
  },
  animations: {
    tape: '/animations/tape',
    tape_: { frames: 17, speed: 50 },
    toolkit: '/animations/toolkit',
    toolkit_: { frames: 16, speed: 50 },
    glu: '/animations/glu',
    glu_: { frames: 45, speed: 50 },
    heal: '/animations/heal',
    heal_: { frames: 16, speed: 25 },
    fire: '/animations/fire',
    fire_: { frames: 1, speed: 50 },
    text: '/animations/text',
    text_: { frames: 37, speed: 50 },
    explosion: '/animations/explosion',
  },
  deathEffects: {
    explode: '/animations/explode',
    explode_: { frames: 17, speed: 75, kill: 8, type: 1 },
    clicked: '/animations/clicked',
    clicked_: { frames: 29, speed: 75, kill: 28, type: 2 },
    amogus: '/animations/amogus',
    amogus_: { frames: 47, speed: 75, kill: 21, type: 1 },
    nuke: '/animations/nuke',
    nuke_: { frames: 26, speed: 75, kill: 12, type: 1 },
    error: '/animations/error',
    error_: { frames: 10, speed: 250, kill: 10, type: 2 },
    magic: '/animations/magic',
    magic_: { frames: 69, speed: 50, kill: 51, type: 2 },
    /*securly: '/animations/securly',
    securly_: {frames: 1, speed: 9900, kill: 1, type: 3},*/
    anvil: '/animations/anvil',
    anvil_: { frames: 22, speed: 75, kill: 6, type: 1 },
    insta: '/animations/insta',
    insta_: { frames: 22, speed: 75, kill: 21, type: 1 },
    mechagodzilla: '/animations/mechagodzilla',
    mechagodzilla_: { frames: 23, speed: 75, kill: 12, type: 1 },
    fix: '/animations/fix',
    fix_: { frames: 4, speed: 250, kill: 4, type: 1 },
    plant: '/animations/plant',
    plant_: { frames: 4, speed: 250, kill: 4, type: 1 },
    knight: '/animations/knight',
    knight_: { frames: 4, speed: 100, kill: 4, type: 1 },
    cat: '/animations/cat',
    cat_: { frames: 2, speed: 500, kill: 2, type: 1 },
    crate: '/animations/crate',
    crate_: { frames: 31, speed: 75, kill: 21, type: 2 },
    battery: '/animations/battery',
    battery_: { frames: 55, speed: 75, kill: 54, type: 2 },
    evan: '/animations/evan',
    evan_: { frames: 8, speed: 500, kill: 7, type: 1 },
    minecraft: '/animations/minecraft',
    minecraft_: { frames: 22, speed: 100, kill: 15, type: 2 },
    enderman: '/animations/enderman',
    enderman_: { frames: 4, speed: 500, kill: 3, type: 2 },
    wakawaka: '/animations/wakawaka',
    wakawaka_: { frames: 27, speed: 75, kill: 13, type: 2 },
    erase: '/animations/erase',
    erase_: { frames: 28, speed: 75, kill: 18, type: 2 },
    gameover: '/animations/gameover',
    gameover_: { frames: 40, speed: 75, kill: 1, type: 2 },
    ghost: '/animations/ghost',
    ghost_: { frames: 13, speed: 75, kill: 1, type: 1 },
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
    reflector: '/items/reflector',
    usb: '/items/usb',
    toolkitui: '/items/toolkitui',
    boostui: '/items/boostui',
    powermissleui: '/items/powermissleui',
    tacticalui: '/items/tacticalui',
    stealthui: '/items/stealthui',
    builderui: '/items/builderui',
    warriorui: '/items/warriorui',
    medicui: '/items/medicui',
    fireui: '/items/fireui',
  }
};
const menus = {
  start: {
    buttons: [
      [544, 648, 216, 116, function() { PixelTanks.auth(this.username, this.password, 'login') }, true],
      [840, 648, 216, 116, function() { PixelTanks.auth(this.username, this.password, 'signup') }, true],
      [564, 392, 456, 80, function() { this.type = 'username' }, false],
      [564, 520, 456, 80, function() { this.type = 'password' }, false],
    ],
    listeners: {
      keydown: function(e) {
        if (e.key.length === 1) this[this.type] += e.key;
        if (e.keyCode === 8) this[this.type] = this[this.type].slice(0, -1);
        if (e.keyCode === 13) PixelTanks.auth(this.username, this.password, 'login');
      }
    },
    cdraw: function() {
      try {
      if (!this.type) {
        this.type = 'username';
        this.username = '';
        this.password = '';
      }
      GUI.drawText(this.username, 574, 407, 50, '#000000', 0);
      GUI.drawText(this.password.replace(/./g, '*'), 574, 535, 50, '#000000', 0);
      } catch(e) {alert(e)}
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
        const { x, y } = Menus;
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
          if (x > c[0] * 1600 / 1049 && x < (c[0] + 80) * 1600 / 1049 && y > c[1] * 1000 / 653 && y < (c[1] + 74) * 1000 / 653) {
            Menus.removeListeners();
            PixelTanks.user.player = new Tank(levelCoords.indexOf(c) + 3, false, null);
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
    cdraw: function() {},
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
      [340, 376, 416, 116, function() { this.gamemode = 'ffa' }, true],
      [340, 532, 416, 116, function() { this.gamemode = 'duels' }, true],
      [340, 688, 416, 116, function() { this.gamemode = 'tdm' }, true],
      [340, 844, 416, 116, function() { this.gamemode = 'juggernaut' }, true],
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
        this.socket = new MegaSocket((window.location.protocol === 'https:' ? 'wss://' : 'ws://') + this.ip, { keepAlive: false, reconnect: true, autoconnect: true });
        this.socket.on('connect', () => {
          this.socket.send({ username: PixelTanks.user.username, type: 'stats' });
        });
        this.socket.on('message', (d) => {
          this.output = d;
        });
      }
    },
    cdraw: function() {
      if (!this.gamemode) {
        this.gamemode = 'ffa';
        this.output = { FFA: '', DUELS: '', TDM: '' };
        this.ip = '141.148.128.231/ffa';
        this.listeners.keydown({ keyCode: -1, key: '' });
      }
      GUI.drawText(this.gamemode, 1200, 800, 50, '#FFFFFF', 0.5);
      GUI.drawText(this.ip, 800, 276, 50, '#FFFFFF', 0.5);
      GUI.drawText(this.output.FFA.length, 820, 434, 50, '#FFFFFF', 0.5);
      GUI.drawText(this.output.DUELS.length, 820, 590, 50, '#FFFFFF', 0.5);
      GUI.drawText(this.output.TDM.length, 820, 764, 50, '#FFFFFF', 0.5);
      let offset = 0;
      for (const server of this.output[this.gamemode.toUpperCase()]) {
        if (server !== null)
          for (const player of server) {
            GUI.drawText(player, 880, 400 + 40 * offset, 50, '#FFFFFF', 0);
            offset++;
          }
      }
    }
  },
  crate: {
    buttons: [
      [416, 20, 81, 81, 'main', true],
      [232, 308, 488, 488, function() { PixelTanks.openCrate(0) }, false],
      [880, 308, 488, 488, function() { PixelTanks.openCrate(1) }, false],
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
        const { x, y } = Menus;
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
          if (x > c[0] && x < c[0] + 80 && y > c[1] && y < c[1] + 74) {
            Menus.removeListeners();
            PixelTanks.user.player = new Tank(helpCoords.indexOf(c) + 1, false, null);
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
      [1064, 460, 88, 88, () => PixelTanks.upgrade(), true],
      [1112, 816, 88, 88, function() { PixelTanks.switchTab('classTab') }, false],
      [400, 816, 88, 88, function() { PixelTanks.switchTab('itemTab', 1) }, false],
      [488, 816, 88, 88, function() { PixelTanks.switchTab('itemTab', 2) }, false],
      [576, 816, 88, 88, function() { PixelTanks.switchTab('itemTab', 3) }, false],
      [664, 816, 88, 88, function() { PixelTanks.switchTab('itemTab', 4) }, false],
      [756, 220, 88, 88, function() { PixelTanks.switchTab('cosmeticTab') }, false],
      [532, 220, 88, 88, function() { PixelTanks.switchTab('deathEffectsTab') }, false],
    ],
    listeners: {
      mousedown: function(e) {
        const { x, y } = Menus;
        if (this.classTab) {
          if (x < 688 || x > 912 || y < 334 || y > 666) return this.classTab = false;
          for (let xm = 0; xm < 2; xm++) {
            for (let ym = 0; ym < 3; ym++) {
              if (collision(x, y, 0, 0, [702, 810][xm], [348, 456, 564][ym], 88, 88)) {
                if (PixelTanks.userData.classes[[
                    [0, 5, 3],
                    [1, 4, 2]
                  ][xm][ym]]) {
                  PixelTanks.userData.class = [
                    ['tactical', 'fire', 'medic'],
                    ['stealth', 'builder', 'warrior']
                  ][xm][ym];
                } else alert('You need to buy this first!');
                return;
              }
            }
          }
        } else if (this.itemTab) {
          if (x < 580 || x > 1020 || y < 334 || y > 666) return this.itemTab = false;
          const key = { airstrike: [600, 354], super_glu: [708, 354], duck_tape: [816, 354], shield: [924, 354], flashbang: [600, 462], bomb: [708, 462], dynamite: [816, 462], fortress: [924, 462], weak: [600, 570], strong: [708, 570], spike: [816, 570], mine: [904, 570] };
          for (const item in key) {
            if (collision(x, y, 0, 0, key[item][0], key[item][1], 80, 80)) {
              if (!PixelTanks.userData.items.includes(item)) {
                PixelTanks.userData.items[this.currentItem - 1] = item;
              } else alert('You are not allowed to have more than 1 of the same item');
              return;
            }
          }
        } else if (this.cosmeticTab) {
          if (x < 518 || x > 1082 || y < 280 || y > 720) return Menus.menus.inventory.cosmeticTab = false;
          for (let i = 0; i < 16; i++) {
            if (collision(x, y, 0, 0, 598 + (i % 4) * 108, 298 + Math.floor(i / 4) * 108, 88, 88)) {
              if (e.button === 0) {
                PixelTanks.userData.cosmetic = PixelTanks.userData.cosmetics[this.cosmeticMenu * 16 + i];
              } else {
                PixelTanks.userData.cosmetics.splice(this.cosmeticMenu * 16 + i, 1);
              }
              return;
            }
          }
        } else if (this.deathEffectsTab) {
          if (x < 518 || x > 1082 || y < 280 || y > 720) return Menus.menus.inventory.deathEffectsTab = false;
          for (let i = 0; i < 16; i++) {
            if (collision(x, y, 0, 0, 598 + (i % 4) * 108, 298 + Math.floor(i / 4) * 108, 88, 88)) {
              if (e.button === 0) {
                PixelTanks.userData.deathEffect = PixelTanks.userData.deathEffects[this.deathEffectsMenu * 16 + i];
              } else {
                PixelTanks.userData.deathEffects.splice(this.deathEffectsMenu * 16 + i, 1);
              }
              return;
            }
          }
        }
      },
      mousemove: function(e) {
        this.target = { x: e.clientX - window.innerWidth / 2, y: e.clientY - window.innerHeight / 2 };
      },
      keydown: function(e) {
        if (e.key.length === 1 && this.color.length < 7) {
          this.color += e.key;
          PixelTanks.userData.color = this.color;
        }
        if (e.keyCode === 8) this.color = this.color.slice(0, -1);
        if (this.cosmeticTab) {
          if (e.keyCode === 37 && this.cosmeticMenu > 0) this.cosmeticMenu--;
          if (e.keyCode === 39 && this.cosmeticMenu + 1 !== Math.ceil(PixelTanks.userData.cosmetics.length / 16)) this.cosmeticMenu++;
        }
      }
    },
    cdraw: function() {
      if (!this.target) {
        this.time = Date.now();
        this.color = PixelTanks.userData.color;
        this.target = { x: 0, y: 0 };
        this.cosmeticMenu = 0;
        this.deathEffectsMenu = 0;
      }
      const coins = PixelTanks.userData.stats[0],
        xp = PixelTanks.userData.stats[3],
        rank = PixelTanks.userData.stats[4];
      const coinsUP = (rank + 1) * 1000,
        xpUP = (rank + 1) * 100;
      GUI.draw.fillStyle = this.color;
      GUI.draw.fillRect(1008, 260, 32, 32);
      GUI.drawText(this.color, 1052, 260, 30, '#000000', 0);
      GUI.drawText(PixelTanks.user.username, 300, 420, 80, '#000000', .5);
      GUI.drawText('Coins: ' + coins, 300, 500, 50, '#FFE900', .5);
      GUI.drawText('Rank: ' + rank, 300, 550, 50, '#FF2400', .5);
      GUI.drawText('Level Up Progress', 1400, 400, 50, '#000000', .5);
      GUI.drawText((rank < 20 ? coins + '/' + coinsUP : 'MAXED') + ' Coins', 1400, 500, 50, rank < 20 ? (coins < coinsUP ? '#FF2400' : '#90EE90') : '#63666A', .5);
      GUI.drawText((rank < 20 ? xp + '/' + xpUP : 'MAXED') + ' XP', 1400, 550, 50, rank < 20 ? (xp < xpUP ? '#FF2400' : '#90EE90') : '#63666A', .5);
      if (coins < coinsUP || xp < xpUP || rank > 19) {
        GUI.draw.fillStyle = '#000000';
        GUI.draw.globalAlpha = .7;
        GUI.draw.fillRect(1064, 458, 88, 88);
        GUI.draw.globalAlpha = 1;
      }
      for (let i = 0; i < 4; i++) GUI.drawImage(PixelTanks.images.items[PixelTanks.userData.items[i]], [404, 492, 580, 668][i], 820, 80, 80, 1);
      PixelTanks.renderBottom(680, 380, 240, PixelTanks.userData.color);
      GUI.drawImage(PixelTanks.images.tanks.bottom, 680, 380, 240, 240, 1);
      PixelTanks.renderTop(680, 380, 240, PixelTanks.userData.color, (-Math.atan2(this.target.x, this.target.y) * 180 / Math.PI + 360) % 360);
      GUI.drawImage(PixelTanks.images.tanks.top, 680, 380, 240, 270, 1, 120, 120, 0, 0, (-Math.atan2(this.target.x, this.target.y) * 180 / Math.PI + 360) % 360);
      if (PixelTanks.userData.cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic], 680, 380, 240, 270, 1, 120, 120, 0, 0, (-Math.atan2(this.target.x, this.target.y) * 180 / Math.PI + 360) % 360);
      const key = { tactical: [7, 7], fire: [7, 61], medic: [7, 115], stealth: [61, 7], builder: [61, 61], warrior: [61, 115] };
      if (PixelTanks.userData.class) GUI.drawImage(PixelTanks.images.menus.classTab, 1112, 816, 88, 88, 1, 0, 0, 0, 0, undefined, key[PixelTanks.userData.class][0], key[PixelTanks.userData.class][1], 44, 44);
      if (PixelTanks.userData.cosmetic) GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetic], 760, 224, 80, 80, 1);
      const deathEffectData = PixelTanks.images.deathEffects[PixelTanks.userData.deathEffect + '_'];
      if (PixelTanks.userData.deathEffect) GUI.drawImage(PixelTanks.images.deathEffects[PixelTanks.userData.deathEffect], 536, 224, 80, 80, 1, 0, 0, 0, 0, undefined, (Math.floor((Date.now() - this.time) / deathEffectData.speed) % deathEffectData.frames) * 200, 0, 200, 200);
      Menus.menus.inventory.buttonEffect = true;
      if (this.healthTab || this.classTab || this.itemTab || this.cosmeticTab || this.deathEffectsTab) {
        Menus.menus.inventory.buttonEffect = false;
        GUI.drawImage(PixelTanks.images.blocks.void, 0, 0, 1600, 1600, .7);
      }
      if (this.classTab) {
        GUI.drawImage(PixelTanks.images.menus.classTab, 688, 334, 224, 332, 1);
        GUI.draw.strokeStyle = '#FFFF00';
        GUI.draw.lineWidth = 10;
        if (PixelTanks.userData.class === 'tactical') GUI.draw.strokeRect(701, 348, 88, 88);
        else if (PixelTanks.userData.class === 'fire') GUI.draw.strokeRect(701, 456, 88, 88);
        else if (PixelTanks.userData.class === 'medic') GUI.draw.strokeRect(701, 565, 88, 88);
        else if (PixelTanks.userData.class === 'stealth') GUI.draw.strokeRect(814, 348, 88, 88);
        else if (PixelTanks.userData.class === 'builder') GUI.draw.strokeRect(814, 456, 88, 88);
        else if (PixelTanks.userData.class === 'warrior') GUI.draw.strokeRect(814, 565, 88, 88);
      } else if (this.itemTab) {
        GUI.drawImage(PixelTanks.images.menus.itemTab, 580, 334, 440, 332, 1);
        const key = { airstrike: [600, 354], super_glu: [708, 354], duck_tape: [816, 354], shield: [924, 354], flashbang: [600, 462], bomb: [708, 462], dynamite: [816, 462], fortress: [924, 462], weak: [600, 570], strong: [708, 570], spike: [816, 570], mine: [904, 570] };
        for (const item in key) GUI.drawImage(PixelTanks.images.items[item], key[item][0], key[item][1], 80, 80, 1);
      } else if (this.cosmeticTab) {
        const a = this.cosmeticMenu === 0,
          b = this.cosmeticMenu === Math.floor(PixelTanks.userData.cosmetics.length / 16);
        GUI.drawImage(PixelTanks.images.menus.cosmeticTab, 518 + (a ? 62 : 0), 280, 564 - (a ? 62 : 0) - (b ? 62 : 0), 440, 1, 0, 0, 0, 0, undefined, (a ? 31 : 0), 0, 282 - (a ? 31 : 0) - (b ? 31 : 0), 220);
        for (let i = this.cosmeticMenu * 16; i < Math.min((this.cosmeticMenu + 1) * 16, PixelTanks.userData.cosmetics.length); i++) {
          GUI.drawImage(PixelTanks.images.cosmetics[PixelTanks.userData.cosmetics[i]], 598 + (i % 4) * 108, 298 + Math.floor((i % 16) / 4) * 108, 88, 88, 1);
          if (PixelTanks.userData.cosmetics[i] === PixelTanks.userData.cosmetic) {
            GUI.draw.strokeStyle = '#FFFF22';
            GUI.draw.lineWidth = 10;
            GUI.draw.strokeRect(598 + (i % 4) * 108, 298 + Math.floor((i % 16) / 4) * 108, 88, 88);
          }
        }
      } else if (this.deathEffectsTab) {
        const a = this.deathEffectsMenu === 0,
          b = this.deathEffectsMenu === Math.floor(PixelTanks.userData.deathEffects.length / 16);
        GUI.drawImage(PixelTanks.images.menus.deathEffectsTab, 518 + (a ? 62 : 0), 280, 564 - (a ? 62 : 0) - (b ? 62 : 0), 440, 1, 0, 0, 0, 0, undefined, (a ? 31 : 0), 0, 282 - (a ? 31 : 0) - (b ? 31 : 0), 220);
        for (let i = this.deathEffectsMenu * 16; i < Math.min((this.deathEffectsMenu + 1) * 16, PixelTanks.userData.deathEffects.length); i++) {
          const d = PixelTanks.images.deathEffects[PixelTanks.userData.deathEffects[i] + '_'];
          GUI.drawImage(PixelTanks.images.deathEffects[PixelTanks.userData.deathEffects[i]], 598 + (i % 4) * 108, 298 + Math.floor((i % 16) / 4) * 108, 88, 88, 1, 0, 0, 0, 0, undefined, (Math.floor((Date.now() - this.time) / d.speed) % d.frames) * 200, 0, 200, 200);
          if (PixelTanks.userData.deathEffects[i] === PixelTanks.userData.deathEffect) {
            GUI.draw.strokeStyle = 0xffff22;
            GUI.draw.lineWidth = 10;
            GUI.draw.strokeRect(598 + (i % 4) * 108, 298 + Math.floor((i % 16) / 4) * 108, 88, 88);
          }
        }
      }
    },
  },
  shop: {
    buttons: [
      [416, 20, 108, 108, 'main', true],
      [232, 208, 488, 96, function() { /* class tab */ }, true],
      [880, 208, 488, 96, function() { /* ded tab */ }, true],
      [496, 404, 176, 176, function() { PixelTanks.purchase(0) }, true],
      [712, 404, 176, 176, function() { PixelTanks.purchase(1) }, true],
      [928, 404, 176, 176, function() { PixelTanks.purchase(4) }, true],
      [496, 620, 176, 176, function() { PixelTanks.purchase(2) }, true],
      [712, 620, 176, 176, function() { PixelTanks.purchase(5) }, true],
      [928, 620, 176, 176, function() { PixelTanks.purchase(3) }, true],
    ],
    listeners: {},
    cdraw: function() {
      GUI.drawText(PixelTanks.userData.stats[0] + ' coinage', 800, 350, 50, 0x000000, 0.5);
    },
  },
  pause: {
    buttons: [
      [128, 910, 1460, 76, function() {
        PixelTanks.user.player.implode();
        Menus.trigger('main');
      }, true]
    ],
    listeners: {},
    cdraw: () => {},
  },
}
