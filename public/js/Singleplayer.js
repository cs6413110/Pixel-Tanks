class Singleplayer extends Engine {
  constructor(level) {
    if (typeof level === 'object') { // custom level handler for breads
      super([level.code]);
      
      this.level = level.name;
    } else {
      const levels = [
      'R3066I29R31IX3Q2IZ2X4QX2QX2I2X3GX3IR31IX5IZX5QX3QX3ZX3QX2IR31IX2SX2IX3IXQX4ZX2QX3QTQZIR31IX8ZIX3QX2QX2GX4QXZIR31IX7Z2IX2QX3QGXIZX4GXIR31I29R145',
      'R2940VX3VX3VR51XQ2XVXQ2XR51XQ2XVXQ2XR51X4VX4R51XVQXIXQVXR51X3QIQX3R51X3VIVX3R51VX3IX3VR51XQX2IX2QXR51XVXVIVXVXR51VXVSIWVWVR51',
      'S1R3599',
      'S1R3599',
      'S1R3599',
      'S1R3599'
    ];
      if (level > levels.length || level < 1) level = 1;
      super([levels[level-1]]);
      this.level = level;
    }
  }

  ontick() {

    /*
      DELETE ALL THESE COMMENTS AFTER U READ
      How to use custom levels with custom names(for tutorials):
      
      When creating the tank, do:
      ...new Client({name: 'bread-level#128372183213', code: *insert code NO COMMA*}, false, null)

      To run a normal level do:
      ...new Client(1, false, null);
      *runs the first level in existance*

      HOW DO I DRAW MEH TEXT:

      Use the tutorial below. The level name for custom levels is the one you set :)
    */
    if (this.level === 1) {
      // GUI.drawText(...
    } else if (this.level === 'custom bread level') {
      const drawBlockX = 5, drawBlockY = 3;
      GUI.drawText('HALP', drawBlockX*100+50, drawBlockY*100+50, 50, '#FFFFFF', .5);
      // 50 => Text size
      // F spam => color hex code
      // .5 => center text(0 = start left, 1 = start right)
      // delete all my comments when u add ur cringe
    }
  }

  ondeath(t, m) {
    if (t.username !== PixelTanks.userData.username) {
      let e = 0;
      for (const ai of this.ai) if (Engine.getTeam(ai.team) === 'squad') e++;
      if (e === 1) {
        setTimeout(() => {
          PixelTanks.user.player.implode();
          Menus.menus.victory.stats = {kills: 'n/a', coins: 'n/a'};
          Menus.trigger('victory');
        }, 3000)
      }
      return PixelTanks.user.player.killRewards();
    }
    t.ded = true;
    setTimeout(() => {
      PixelTanks.user.player.implode();
      Menus.menus.defeat.stats = {kills: 'n/a', coins: 'n/a'};
      Menus.trigger('defeat');
    }, 2000);
  }

  override(data) {
    PixelTanks.user.player.tank.x = data.x;
    PixelTanks.user.player.tank.y = data.y;
    if (PixelTanks.user.player.dx) {
      PixelTanks.user.player.dx.t = Date.now()
      PixelTanks.user.player.dx.o = PixelTanks.user.player.tank.x;
    }
    if (PixelTanks.user.player.dy) {
      PixelTanks.user.player.dy.t = Date.now();
      PixelTanks.user.player.dy.o = PixelTanks.user.player.tank.y;
    }
  }
}
