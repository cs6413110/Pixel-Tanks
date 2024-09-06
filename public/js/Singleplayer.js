class Singleplayer extends Engine {
  constructor(level) {
    if (typeof level === 'object') { // custom level handler for breads
      super([level.code]);
      
      this.level = level.name;
    } else {
      const levels = [
      'R3066I29R31IX3Q2IZ2X4QX2QX2I2X3GX3IR31IX5IZX5QX3QX3ZX3QX2IR31IX2SX2IX3IXQX4ZX2QX3QTQZIR31IX8ZIX3QX2QX2GX4QXZIR31IX7Z2IX2QX3QGXIZX4GXIR31I29R145',
      'R2940VX3VX3VR51XQ2XVXQ2XR51XQ2XVXQ2XR51X4VX4R51XVQXIXQVXR51X3QIQX3R51X3VIVX3R51VX3IX3VR51XQX2IX2QXR51XVXVIVXVXR51VXVSIWVWVR51',
      'R2771I9R51IX7IR51I2XI3XI2R52IXQX3IR50I4X3QXI4R47IXQ2XQSX2Q2XIR47I4X3QXI4R50IXQX3IR52I2XI3XI2R51IX7IR51I9R220',
      'R603IRG4R2IR51IR4GR2IR51IR4GR2IR51IRI7R51IRIR2GR54IRIR2GR54IRIR2G4R48I4R56IR3IR55IR2I3R54IRI5R53IR3IR55IR3IR55IR3IR55IR3IR55IR3IR55IR3IR55IR59IRI3RI3R51IRIR5IR51IRI2R3IR52IRIR3IR53IRI3RI3R51IR59IR59IRGR57IR59IRGR57IR59IR59IRGR57IRGR57IR59IR59IRGR57IR21X3R35IR19X3IX4R32IR17X13R29IRGR14XQXWI4QIX4QXR27IR15X3QI5XI2X2Q2X2R26IR15X4I5SI4QX4R25I16X5I4XI6X3R27GR14X4QXI2QI7X3R42X2Q2X5I3WX2QX2R43XQX4IX8QXR45X13R51X4R211',
      'R2834Q7IR52QIQ4WIR52QSQ2WI3R52QIQ4WIR52Q7IR518',
      'R2059I12R48IX4IX5IR48IXSX2IX3IXIR48IX4IX3IXIR48IX4IX3IXIR48I3GI2XZXIXIR48IX6ZXIXIR48IDXQXDXIXIXIR48ITX3TXGXIXIR48IXI3XI4XIR48IVX3VX5IR48I12R869',
      'R1871I33R27IG31IR27ISX2Q2X2WX3Q2X3QXQX3WX4Q3WIR27IG31IR27I33R1456',
      'R3600',
      'R3600',
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
