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
          let button = document.createElement('BUTTON'), image = document.createElement('IMG');
          button.onclick = () => (typeof b[4] === 'function' ? b[4]() :  Menus.trigger(b[4]));
          button.width = image.width = window.innerHeight*(Menu.scaler.width = b[2])/1000;
          button.height = image.height = window.innerHeight*(Menu.scaler.height = b[3])/1000;
          const leftOffset = (window.innerWidth-window.innerHeight*1.6)/2+b[0]/1000*window.innerHeight;
          button.style = 'position: absolute; left: '+leftOffset+'px; top: '+(window.innerHeight*b[1]/1000)+'px; padding: 0;';  
          Menu.scaler.getContext('2d').drawImage(PixelTanks.images.menus[id], -b[0], -b[1]);
          image.src = Menu.scaler.toDataURL();
          button.appendChild(image);
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
