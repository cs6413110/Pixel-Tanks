window.sourceMap = {
  fail: 'data',
  host: 'https://cs6413110.github.io/Pixel-Tanks/public/images',
  map: [ // image loading
    {
      ref: 'blocks', // property stored as on PixelTanks.images
      path: 'blocks', // Location on host, *optional host property to overwrite default
      load: ['barrier', 'strong', 'weak', 'spike', 'floor', 'void', 'gold', 'fire', 'friendlyfire', 'airstrike', 'instastrike', 'doom', 'friendlyairstrike'],
    },
    {
      ref: 'ice', // property stored as on PixelTanks.images
      path: 'ice', // Location on host, *optional host property to overwrite default
      load: ['barrier', 'strong', 'weak', 'spike', 'floor', 'void', 'gold', 'fire', 'friendlyfire', 'airstrike', 'friendlyairstrike'],
    },
    {
      ref: 'bullets',
      path: 'bullets',
      load: ['normal', 'shotgun', 'powermissle', 'healmissle', 'megamissle', 'grapple', 'dynamite', 'fire', 'usb', 'scythe', 'yoink', 'leech', 'rust'],//DONT REMOVE. STOP BEING MEAN TO DMG :((. idc if its bad, let him have his fun, orelse all customs go away. also u broke game by keeping the comma stoopid idot
    },
    {
      ref: 'tanks',
      path: 'tanks',
      load: ['buff', 'reflect', 'base', 'destroyed', 'top', 'bottom', 'bottom2'],
    },
    {
      ref: 'menus',
      path: 'menus',
      load: ['ui', 'start', 'main', 'multiplayer', 'singleplayer', 'singleplayer2', 'victory', 'defeat', 'crate', 'settings1', 'settings2', 'inventory', 'classTab', 'itemTab', 'perkTab', 'cosmeticTab', 'shop', 'shop2', 'broke', 'htp1', 'htp2', 'htp3', 'htp4', 'pause', 'help', 'helpinventory', 'helpcosmetic', 'helpclass', 'helpmode', 'helpvocab', 'helpteam', 'broke', 'locked', 'alert', 'adrenaline', 'cooldown', 'core', 'hook', 'radar', 'refresh', 'scavenger', 'shield', 'thermal', 'arrow', 'arrow_friendly'],
    },
    {
      ref: 'animations',
      path: 'animations',
      load: ['tape', 'glu', 'fire', 'text', 'detonate', 'explosion', 'healexplosion', 'smoke', 'shield_make', 'shield_break'],
      meta: {
        tape_: { frames: 17, speed: 50 },
        toolkit_: { frames: 16, speed: 50 },
        glu_: { frames: 45, speed: 50 },
        fire_: { frames: 1, speed: 50 },
        text_: { frames: 37, speed: 50 },
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
    rare: ['blue_tint', 'glitch', 'blue_helmet', 'white_helmet', 'helmet', 'gold_helmet', 'hacker_hoodie', 'hoodie', 'purple', 'sus', 'veins', 'cookie'],
    epic: ['christmas_hat', 'christmas_lights', 'dizzy', 'rage', 'toxic', 'crown', 'darkcrown', 'error', 'dark_crown',  'lostcrown', 'blue_crown', 'supersight'],
    legendary: ['plasma', 'cry', 'missing'],    //imma just delete the cosmetic
    admin: [], // LOL IT NEEDS ADMIN TO NOT EPLODE DELETE IT THEN
    mythic: ['terminator', 'mlg_glasses', 'power_armor', 'corrupted', 'oneterminator'], //STOAP
  },
  deathEffect: {
  }
}
