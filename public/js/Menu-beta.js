class Menu {
  static scaler = document.createElement('canvas');
  constructor(data, id) {
    try {
    this.id = id;
    this.listeners = data.listeners;
    this.cdraw = data.cdraw.bind(this);
    this.render = [0, 0, 1600, 1000]; // rewrite structure
    if (PixelTanks.images.menus[this.id] !== undefined) {
      const oldload = PixelTanks.images.menus[this.id].onload;
      PixelTanks.images.menus[this.id].onload = () => {
        oldload();
        for (const b of data.buttons) {
          let button = document.createElement('INPUT');
          button.type = 'image';
          button.onclick = () => (typeof b[4] === 'function' ? b[4]() :  Menus.trigger(b[4]));
          button.width = Menu.scaler.width = b[2];
          button.height = Menu.scaler.height = b[3];
          Menu.scaler.getContext('2d').drawImage(PixelTanks.images.menus[id], -b[0], -b[1]);
          button.src = Menu.scaler.toDataURL();
          document.body.appendChild(button);
        }
      }
    }
    } catch(e) {
      alert(e);
    }
  }
  
  addListeners() {
    for (const l in this.listeners) window.addEventListener(l, () => this.listeners[l]());
  }
  
  removeListeners() {
    for (const l in this.listeners) window.removeEventListener(l, this.listeners[l]);
  }
  
  draw(render) {
    if (render && JSON.stringify(render) !== JSON.stringify(this.render)) {
      this.render = render;
      this.compile(); // recompile???
    } // resize change???
    if (PixelTanks.images.menus[this.id]) GUI.drawImage(PixelTanks.images.menus[this.id], this.render[0], this.render[1], this.render[2], this.render[3], 1);
    this.cdraw();
  }
}
