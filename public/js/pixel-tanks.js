(load = i => document.head.appendChild(Object.assign(document.createElement('SCRIPT'), {src: (i !== 0 ? 'https://cs6413110.github.io/Pixel-Tanks/public/js/' : '')+['https://jimmywarting.github.io/StreamSaver.js/StreamSaver','msgpackr', 'pathfinding', 'AI', 'Block', 'Client', 'Damage', 'Engine', 'GUI', 'MegaSocket', 'Menu', 'Menus', 'Network', 'PixelTanks', 'Shot', 'Singleplayer', 'Tank', 'A'][i]+'.js', onload: i++ < 17 ? () => load(i) : () => {window.onload = PixelTanks.start}})))(0);
