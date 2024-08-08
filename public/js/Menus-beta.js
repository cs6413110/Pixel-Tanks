class Menus {
  static start() {
    Menus.renderer = requestAnimationFrame(Menus.render);
  }
  
  static render() {
    Menus.renderer = requestAnimationFrame(Menus.render);
    GUI.clear();
    Menus.redraw();
  }
  
  static mouseLog(e) {
    Menus.x = (e.clientX-(window.innerWidth-window.innerHeight*1.6)/2)/window.innerHeight*1000;
    Menus.y = e.clientY/window.innerHeight*1000;
  }
  
  static stop() {
    cancelAnimationFrame(Menus.renderer);
    Menus.renderer = undefined;
  }
  
  static trigger(name) {
    if (Menus.current) Menus.menus[Menus.current].removeListeners();
    if (Menus.renderer === undefined) Menus.start();
    Menus.current = name;
    Menus.menus[Menus.current].addListeners();
  }
  
  static redraw() {
    if (!Menus.current) return;
    Menus.menus[Menus.current].draw([0, 0, 1600, 1000]);
  }
  
  static removeListeners() {
    Menus.stop();
    Menus.menus[Menus.current].removeListeners();
  }
}
