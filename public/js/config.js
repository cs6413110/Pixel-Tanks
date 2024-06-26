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
    //smoke: '/blocks/nothing',//invis
  },
  bullets: {
    //normal: '/bullets/normal', no image yet :(
    shotgun: '/bullets/shotgun',
    powermissle: '/bullets/powermissle',
    healmissle: '/bullets/healmissle',
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
    'Plasma Ball': '/cosmetics/Plasma',
    "PWR-DMG'S HELM": '/cosmetics/pwr-dmg-helm',
    'venom': '/cosmetics/venom',
    'toxic': '/cosmetics/toxic',
    'spoider': '/cosmetics/spoider',
    'Power Armor': '/cosmetics/power_armor',
    'void knight': '/cosmetics/voidknight',
    'lava': '/cosmetics/lava',
    'Antlers': '/cosmetics/Antlers',
    'static': '/cosmetics/static',
    'disguise': '/cosmetics/disguise',
    'angry hoodie': '/cosmetics/angry_hoodie',
    'PortalCube': '/cosmetics/PortalCube',
    'CompanionCube': '/cosmetics/CompanionCube',
    'googly': '/cosmetics/googly',
    'eyes': '/cosmetics/eyes',
    'zombie': '/cosmetics/zombie',
    'watermelon': '/cosmetics/watermelon',
    'bread': '/cosmetics/bread',
    'eye': '/cosmetics/eye',
    'half glitch': '/cosmetics/half_glitch',
    'glitch': '/cosmetics/glitch',
    'gold helment': '/cosmetics/gold_helment',
    'white horns': '/cosmetics/white_horns',
    'white wings': '/cosmetics/white_wings',
    'blue horns': '/cosmetics/blue_horns',
    'blue wings': '/cosmetics/blue_wings',
    'gold horns': '/cosmetics/gold_horns',
    'gold wings': '/cosmetics/gold_wings',
    'White helment': '/cosmetics/white_helment',
    'dmgcrown': '/cosmetics/dmgcrown',
    'LostKing': '/cosmetics/Jonas',
    'hacker_hoodie': '/cosmetics/hacker_hoodie',
    'totem': '/cosmetics/totem',
    'venomeme': '/cosmetics/venomeme',
    'carnage': '/cosmetics/carnage',
    'brain': '/cosmetics/brain',
    'Hands': '/cosmetics/Hands',
    'silver': '/cosmetics/silver',
    'Purple helment': '/cosmetics/purple_helment',
    'scoped': '/cosmetics/scoped',
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
    'Katana': '/cosmetics/katana',
    'Knife': '/cosmetics/knife',
    'Scared': '/cosmetics/scared',
    'Laff': '/cosmetics/laff',
    'Hacker Hoodie': '/cosmetics/hacker_hoodie',
    'Error': '/cosmetics/error',
    'Purple Grad Hat': '/cosmetics/purple_grad_hat',
    'Bat Wings': '/cosmetics/bat_wings',
    'Fisher Hat': '/cosmetics/fisher_hat',
    'Kill = Ban': '/cosmetics/ban',
    'Blue Ghost': '/cosmetics/blue_ghost',
    'Pumpkin Face': '/cosmetics/pumpkin_face',
    'Pumpkin Hat': '/cosmetics/pumpkin_hat',
    'Red Ghost': '/cosmetics/red_ghost',
    'Candy Corn': '/cosmetics/candy_corn',
    'Orange Ghost': '/cosmetics/orange_ghost',
    'Pink Ghost': '/cosmetics/pink_ghost',
    'Paleontologist': '/cosmetics/paleontologist',
    'Yellow Hoodie': '/cosmetics/yellow_hoodie',
    'bluekatana': '/cosmetics/bluekatana',
    'X': '/cosmetics/x',
    'Sweat': '/cosmetics/sweat',
    'GoldShield': '/cosmetics/GoldShield',
    'Spirals': '/cosmetics/spirals',
    'Spikes': '/cosmetics/spikes',
    'Rudolph': '/cosmetics/rudolph',
    'Reindeer Hat': '/cosmetics/reindeer_hat',
    'Red Hoodie': '/cosmetics/red_hoodie',
    'Question Mark': '/cosmetics/question_mark',
    'Purple-Pink Hoodie': '/cosmetics/purplepink_hoodie',
    'Purple Hoodie': '/cosmetics/purple_hoodie',
    'Aaron': '/cosmetics/aaron',
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
    'Straw Hat': '/cosmetics/strawhat',
    'Evil Eyes': '/cosmetics/evileye',
    'Lego': '/cosmetics/lego',
    'Dead': '/cosmetics/dead',
    'Sun Roof': '/cosmetics/sunroof',
    'Army': '/cosmetics/army',
    'Stamp': '/cosmetics/stamp',
    'Triple Gun': '/cosmetics/triplegun',
    'Hard Hat': '/cosmetics/hardhat',
    'Elf': '/cosmetics/elf',
    'Spooked': '/cosmetics/spooked',
    'Locked': '/cosmetics/locked',
    'Angry Eyes': '/cosmetics/angryeyes',
    'Cute Eyes': '/cosmetics/cuteeyes',
    'Stripes': '/cosmetics/stripe',
    'Hazard': '/cosmetics/hazard',
    'Anime Eyes': '/cosmetics/animeeyes',
    'chip': '/cosmetics/chip',
  },
  menus: {
    ui: '/menus/ui',
    start: '/menus/start',
    main: '/menus/main',
    multiplayer: '/menus/multiplayer',
    singleplayer: '/menus/singleplayer',
    singleplayer2: '/menus/singleplayer2',
    victory: '/menus/victory',
    defeat: '/menus/defeat',
    crate: '/menus/crate',
    settings1: '/menus/settings1',
    settings2: '/menus/settings2',
    inventory: '/menus/inventory',
    classTab: '/menus/classTab',
    itemTab: '/menus/itemTab',
    perkTab: '/menus/perkTab',
    cosmeticTab: '/menus/cosmeticTab', // FIX DUPLICATE USELESS(deathEffecs and cosmetic tab referenceing same imagoge); (NUH UH)
    deathEffectsTab: '/menus/cosmeticTab',
    shop: '/menus/shop',
    shop2: '/menus/shop2',
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
    broke: '/menus/broke',
    locked: '/menus/locked',
    alert: '/menus/alert',
    void: '/blocks/void', //used in crate opening dont delete
    adrenaline1: '/menus/adrenaline1',
    adrenaline2: '/menus/adrenaline2',
    adrenaline3: '/menus/adrenaline3',
    cooldown1: '/menus/cooldown1',
    cooldown2: '/menus/cooldown2',
    cooldown3: '/menus/cooldown3',
    core1: '/menus/core1',
    core2: '/menus/core2',
    core3: '/menus/core3',
    hook1: '/menus/hook1',
    hook2: '/menus/hook2',
    hook3: '/menus/hook3',
    radar1: '/menus/radar1',
    radar2: '/menus/radar2',
    refresh1: '/menus/refresh1',
    refresh2: '/menus/refresh2',
    scavenger1: '/menus/scavenger1',
    scavenger2: '/menus/scavenger2',
    scavenger3: '/menus/scavenger3',
    shield1: '/menus/shield1',
    shield2: '/menus/shield2',
    thermal1: '/menus/thermal1',
    thermal2: '/menus/thermal2',
    thermal3: '/menus/thermal3',
  },
  animations: {
    tape: '/animations/tape',
    tape_: { frames: 17, speed: 50 },
    toolkit: '/animations/toolkit',
    toolkit_: { frames: 16, speed: 50 },
    glu: '/animations/glu',
    glu_: { frames: 45, speed: 50 },
    fire: '/animations/fire',
    fire_: { frames: 1, speed: 50 },
    text: '/animations/text',
    text_: { frames: 37, speed: 50 },
    detonate: '/animations/detonate',
    detonate_: { frames: 28, speed: 20 },
    weakbreak: '/animations/weakbreak',
    weakbreak_: { frames: 37, speed: 10 },
    explosion: '/animations/explosion',
    healexplosion: '/animations/healexplosion',
    smoke: '/animations/smoke',
  },
  deathEffects: {
    banhammer:'/animations/banhammer',
    banhammer_: { frames: 29, speed: 50, kill: 7, type: 1 },
    pokeball:'/animations/pokeball',
    pokeball_: { frames: 85, speed: 50, kill: 18, type: 2 },
    explode: '/animations/explode',
    explode_: { frames: 17, speed: 75, kill: 8, type: 1 },
    clicked: '/animations/clicked',
    clicked_: { frames: 29, speed: 75, kill: 28, type: 2 },
    Cactus: '/animations/Cactus',
    Cactus_: { frames: 19, speed: 23, kill: 9, type: 2 },
    nuke: '/animations/nuke',
    nuke_: { frames: 12, speed: 75, kill: 6, type: 1 },
    error: '/animations/error',
    error_: { frames: 10, speed: 300, kill: 10, type: 2 },
    magic: '/animations/magic',
    magic_: { frames: 69, speed: 50, kill: 51, type: 2 },
    /*securly: '/animations/securly',
    securly_: {frames: 1, speed: 9900, kill: 1, type: 3},*/
    anvil: '/animations/anvil',
    anvil_: { frames: 22, speed: 75, kill: 6, type: 1 },
    insta: '/animations/insta',
    insta_: { frames: 22, speed: 75, kill: 21, type: 1 },
    cat: '/animations/cat',
    cat_: { frames: 2, speed: 500, kill: 2, type: 1 },
    battery: '/animations/battery',
    battery_: { frames: 55, speed: 75, kill: 54, type: 2 },
    evan: '/animations/evan',
    evan_: { frames: 8, speed: 500, kill: 7, type: 1 },
    minecraft: '/animations/minecraft',
    minecraft_: { frames: 22, speed: 100, kill: 15, type: 2 },
    gameover: '/animations/gameover',
    gameover_: { frames: 40, speed: 75, kill: 1, type: 2 },
    skull: '/animations/skull',
    skull_: { frames: 11, speed: 50, kill: 1, type: 1 },
    darksouls: '/animations/darksouls',
    darksouls_: { frames: 56, speed: 50, kill: 33, type: 2 },
    tombstone: '/animations/tombstone',
    tombstone_: { frames: 36, speed: 50, kill: 8, type: 1 }
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
  }
};
