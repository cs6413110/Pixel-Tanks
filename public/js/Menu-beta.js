class Menu {
  constructor(data, id) {
    this.id = id;
    this.listeners = data.listeners;
    this.cdraw = data.cdraw.bind(this);
    for (const b of data.buttons) {
      let button = document.createElement('button');
      button.style = 'position: abosolute;';
      button.onclick = () => (typeof b[4] === 'function' ? b[4]() :  Menus.trigger(b[4]));
      button.innerText = id+'.'+b[4];
      document.body.appendChild(button);
    }
    this.render = [0, 0, 1600, 1000]; // rewrite structure
    if (PixelTanks.images.menus[this.id] !== undefined) {
      const oldload = PixelTanks.images.menus[this.id].onload;
      PixelTanks.images.menus[this.id].onload = () => {
        oldload();
        this.compile();
      }
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
