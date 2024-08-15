class Menu {
  static scaler = document.createElement('canvas');
  constructor(data, id) {
    this.id = id;
    this.listeners = data.listeners;
    this.elements = [];
    this.cdraw = data.cdraw.bind(this);
    this.render = [0, 0, 1600, 1000]; // rewrite structure
    if (PixelTanks.images.menus[this.id] !== undefined) {
      const oldload = PixelTanks.images.menus[this.id].onload;
      PixelTanks.images.menus[this.id].onload = () => {
        oldload();
        try {
        for (const b of data.buttons) {
          let button = document.createElement('INPUT');
          button.type = 'image';
          button.onclick = () => (typeof b[4] === 'function' ? b[4]() :  Menus.trigger(b[4]));
          button.width = 1000*(Menu.scaler.width = b[2])/window.innerHeight;
          button.height = 1000*(Menu.scaler.height = b[3])/window.innerHeight;
          button.style = 'position: absolute; left: calc((100vw-100vh*1.6)/2+'+b[0]+'px); top: '+b[1]+'px';
          Menu.scaler.getContext('2d').drawImage(PixelTanks.images.menus[id], -b[0], -b[1]);
          button.src = Menu.scaler.toDataURL();
          document.body.appendChild(button);
          this.elements.push(button);
        }
        } catch(e) {alert(e)}
      }
    }
  }
  
  addListeners() {
    for (const l in this.listeners) window.addEventListener(l, () => this.listeners[l]());
    for (const b of this.buttons) b.style.visibility = 'visible';
  }
  
  removeListeners() {
    for (const l in this.listeners) window.removeEventListener(l, this.listeners[l]);
    for (const b of this.buttons) b.style.visibility = 'hidden';
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
