class Menu {
  constructor(data, id) {
    const {buttons, listeners, cdraw} = data;
    this.id = id;
    this.buttons = buttons;
    this.listeners = listeners;
    this.buttonEffect = true;
    this.cdraw = cdraw.bind(this);
    this.listeners.click = this.onclick;
    for (const l in this.listeners) this.listeners[l] = this.listeners[l].bind(this);
    for (const b of this.buttons) {
      if (typeof b[4] === 'function') b[4] = b[4].bind(this);
      b[6] = 0;
    }
    this.render = [0, 0, 1600, 1000];
    if (PixelTanks.images.menus[this.id] !== undefined) {
      const oldload = PixelTanks.images.menus[this.id].onload;
      PixelTanks.images.menus[this.id].onload = () => {
        oldload();
        this.compile();
      }
    }
  }
  
  addListeners() {
    for (const l in this.listeners) window.addEventListener(l, this.listeners[l]);
  }
  
  removeListeners() {
    for (const l in this.listeners) window.removeEventListener(l, this.listeners[l]);
  }
  
  onclick() {
    for (const b of this.buttons) {
      if (Engine.collision(Menus.x, Menus.y, 0, 0, this.render[0]+b[0], this.render[1]+b[1], b[2]*this.render[2]/1600, b[3]*this.render[3]/1000)) {
        return typeof b[4] === 'function' ? b[4]() : Menus.trigger(b[4]);
      }
    }
  }

  compile() {
    this.cache = [];
    for (const b of this.buttons) {
      const x = this.render[0]+b[0]*this.render[2]/1600, y = this.render[1]+b[1]*this.render[3]/1000, w = b[2]*this.render[2]/1600, h = b[3]*this.render[3]/1000;
      const canvas = document.createElement('canvas'), draw = canvas.getContext('2d');
      canvas.width = w*PixelTanks.resizer;
      canvas.height = h*PixelTanks.resizer;
      draw.setTransform(PixelTanks.resizer, 0, 0, PixelTanks.resizer, -x*PixelTanks.resizer, -y*PixelTanks.resizer);
      if (PixelTanks.images.menus[this.id]) draw.drawImage(PixelTanks.images.menus[this.id], this.render[0], this.render[1], this.render[2], this.render[3]);
      this.cache.push([x, y, w, h, canvas]);
    }
  }
  
  draw(render) {
    if (render && JSON.stringify(render) !== JSON.stringify(this.render)) {
      this.render = render;
      this.compile();
    }
    if (PixelTanks.images.menus[this.id]) GUI.drawImage(PixelTanks.images.menus[this.id], this.render[0], this.render[1], this.render[2], this.render[3], 1);
    this.cdraw();
    if (!this.buttonEffect) return;
    for (const b of this.buttons) {
      if (b[5]) {
        const [x, y, w, h, canvas] = this.cache[this.buttons.indexOf(b)];
        if (Engine.collision(x, y, w, h, Menus.x, Menus.y, 0, 0)) {
          b[6] = Math.min(b[6]+1, 10);
        } else {
          b[6] = Math.max(b[6]-1, 0);
        }
        GUI.drawImage(canvas, x-b[6], y-b[6]*h/w, w+b[6]*2, h+b[6]*2*h/w, 1);
      }
    }
  }
}
