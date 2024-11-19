window.sourceMap = {
  fail: 'data',
  host: 'https://cs6413110.github.io/Pixel-Tanks/public/images',
  map: [ // image loading
    {
      ref: 'blocks', // property stored as on PixelTanks.images
      path: 'blocks', // Location on host, *optional host property to overwrite default
      load: ['barrier', 'strong', 'weak', 'spike', 'floor', 'void', 'gold', 'fire', 'friendlyfire', 'airstrike', 'friendlyairstrike'],
    },
    {
      ref: 'bullets',
      path: 'bullets',
      load: ['normal', 'shotgun', 'powermissle', 'megamissle', 'grapple', 'dynamite', 'fire', 'usb', 'scythe', 'yoink', 'leech', 'rust'],//DONT REMOVE. STOP BEING MEAN TO DMG :((. idc if its bad, let him have his fun, orelse all customs go away. also u broke game by keeping the comma stoopid idot
    },
    {
      ref: 'tanks',
      path: 'tanks',
      load: ['buff', 'reflect', 'base', 'destroyed', 'top', 'bottom', 'bottom2'],
    },
    {
      ref: 'menus',
      path: 'menus',
      load: ['inventory_', 'drone', 'drone_scan', 'drone_in', 'drone_open', 'drone_out', 'crate_', 'ui', 'start', 'main', 'multiplayer', 'singleplayer', 'singleplayer2', 'victory', 'defeat', 'crate', 'settings1', 'settings2', 'inventory', 'classTab', 'itemTab', 'perkTab', 'cosmeticTab', 'shop', 'shop2', 'broke', 'htp1', 'htp2', 'htp3', 'htp4', 'pause', 'help', 'helpinventory', 'helpcosmetic', 'helpclass', 'helpmode', 'helpvocab', 'helpteam', 'broke', 'locked', 'alert', 'adrenaline', 'cooldown', 'core', 'hook', 'radar', 'refresh', 'scavenger', 'shield', 'thermal', 'arrow', 'arrow_friendly'],
    },
    {
      ref: 'animations',
      path: 'animations',
      load: ['tape', 'glu', 'fire', 'detonate', 'explosion', 'healexplosion', 'smoke', 'shield_make', 'shield_break'],
      meta: {
        tape_: { frames: 17, speed: 50 },
        toolkit_: { frames: 16, speed: 50 },
        glu_: { frames: 45, speed: 50 },
        fire_: { frames: 1, speed: 50 },
        detonate_: { frames: 28, speed: 20 },
      },
    },
    {
      ref: 'items',
      path: 'items',
      load: ['airstrike', 'duck_tape', 'super_glu', 'shield', 'flashbang', 'bomb', 'dynamite', 'weak', 'strong', 'spike', 'reflector', 'usb'],
    },
  ],
  cosmetic: {
    path: 'cosmetics',
    common: ['medic', 'police', 'small_scratch', 'spikes', 'moustache', 'pumpkin_face', 'army', 'hardhat', 'halo', 'lego', 'present', 'pumpkin_hat', 'top_hat', 'stamp', 'dead', 'earmuffs', 'ban', 'sweat', 'lava', 'ink', 'bricks'],
    uncommon: ['chip', 'deep_scratch', 'evil_eye', 'inferno_eye', 'motherboard', 'blue_wings', 'blue_horns', 'white_wings', 'white_horns', 'gold_wings', 'gold_horns', 'devil_wings', 'devil_horns', 'hazard', 'angel_wings', 'bat_wings', 'locked', 'mini_tank', 'dust', 'pouch'],
    rare: ['blue_tint', 'glitch', 'blue_helmet', 'white_helmet', 'helmet', 'gold_helmet', 'hacker_hoodie', 'purple', 'sus', 'veins', 'cookie'],
    epic: ['christmas_hat', 'christmas_lights', 'dizzy', 'rage', 'toxic', 'error', 'supersight', 'crown', 'darkcrown'],
    legendary: ['plasma', 'cry', 'missing', 'hoodie'],
    admin: [],
    mythic: ['terminator', 'mlg_glasses', 'power_armor', 'corrupted'],
    meta: {},
  },
  deathEffect: {
    path: 'animations',
    common: ['explode', 'nuke', 'insta', 'evan'],
    uncommon: ['anvil', 'gameover', 'minecraft'],
    rare: ['darksouls', 'magic' /*'Cactus'*/],
    epic: ['battery', 'skull', 'banhammer'],
    legendary: ['error', 'tombstone', 'pokeball'],
    mythic: ['clicked', 'cat'],
    meta: {
      pokeball_: {frames: 85, speed: 50, kill: 18, type: 2},
      explode_: {frames: 17, speed: 75, kill: 8, type: 1},
      clicked_: {frames: 29, speed: 75, kill: 28, type: 2},
      //Cactus_: { frames: 19,  type: 2 },
      nuke_: {frames: 12, speed: 75, kill: 6, type: 1},
      error_: {frames: 10, speed: 300, kill: 10, type: 2},
      magic_: {frames: 69, speed: 50, kill: 51, type: 2},
      securly_: {frames: 1, speed: 9900, kill: 1, type: 3},
      anvil_: {frames: 22, speed: 75, kill: 6, type: 1},
      insta_: {frames: 22, speed: 75, kill: 21, type: 1}, 
      cat_: {frames: 2, speed: 500, kill: 2, type: 1},
      battery_: {frames: 55, speed: 75, kill: 54, type: 2},
      evan_: {frames: 8, speed: 500, kill: 7, type: 1},
      minecraft_: {frames: 22, speed: 100, kill: 15, type: 2},
      gameover_: {frames: 40, speed: 75, kill: 1, type: 2},
      skull_: {frames: 11, speed: 50, kill: 1, type: 1},
      darksouls_: {frames: 56, speed: 50, kill: 33, type: 2},
      tombstone_: {frames: 36, speed: 50, kill: 8, type: 1},
    }
  }
}
