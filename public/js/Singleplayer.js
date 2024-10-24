class Singleplayer extends Engine {
  constructor(level) {
    if (level === null) {
      super(['R1041I13R26I22X11I27X120I22X5SX5I27R21I4X5I4R50I3XI3R55IXIR52I6XI6R29I13R3I3X11I3R27IX11IR2I2X15I2R26IX11I4X17I2R25IX33IR25IX33IR25IX33IR25IX11I4X17I2R25IX11IR2I2X15I2R26I13R3I17R1524']);
      this.ondeath = () => {}; // don't deal with this rn...
    } else {
      const levels = [
      'R3066I29R31IX3Q2IZ2X4QX2QX2I2X3GX3IR31IX5IZX5QX3QX3ZX3QX2IR31IX2SX2IX3IXQX4ZX2QX3QTQZIR31IX8ZIX3QX2QX2GX4QXZIR31IX7Z2IX2QX3QGXIZX4GXIR31I29R145',
      'R2940VX3VX3VR51XQ2XVXQ2XR51XQ2XVXQ2XR51X4VX4R51XVQXIXQVXR51X3QIQX3R51X3VIVX3R51VX3IX3VR51XQX2IX2QXR51XVXVIVXVXR51VXVSIWVWVR51',
      'R2771I9R51IX7IR51I2XI3XI2R52IXQX3IR50I4X3QXI4R47IXQ2XQSX2Q2XIR47I4X3QXI4R50IXQX3IR52I2XI3XI2R51IX7IR51I9R220',
      'R603IRG4R2IR51IR4GR2IR51IR4GR2IR51IRI7R51IRIR2GR54IRIR2GR54IRIR2G4R48I4R56IR3IR55IR2I3R54IRI5R53IR3IR55IR3IR55IR3IR55IR3IR55IR3IR55IR3IR55IR59IRI3RI3R51IRIR5IR51IRI2R3IR52IRIR3IR53IRI3RI3R51IR59IR59IRGR57IR59IRGR57IR59IR59IRGR57IRGR57IR59IR59IRGR57IR21X3R35IR19X3IX4R32IR17X13R29IRGR14XQXWI4QIX4QXR27IR15X3QI5XI2X2Q2X2R26IR15X4I5SI4QX4R25I16X5I4XI6X3R27GR14X4QXI2QI7X3R42X2Q2X5I3WX2QX2R43XQX4IX8QXR45X13R51X4R211',
      'R2834Q7IR52QIQ4WIR52QSQ2WI3R52QIQ4WIR52Q7IR518',
      'R2059I12R48IX4IX5IR48IXSX2IX3IXIR48IX4IX3IXIR48IX4IX3IXIR48I3GI2XZXIXIR48IX6ZXIXIR48IDXQXDXIXIXIR48ITX3TXGXIXIR48IXI3XI4XIR48IVX3VX5IR48I12R869',
      'R1871I33R27IG31IR27ISX2Q2X2WX3Q2X3QXQX3WX4Q3WIR27IG31IR27I33R1456',
      'R60I26R19I14R26IR6I4R9IR12IRIR2IRI3RI5RI4R6IR5IR3I4R6IR3I5R4IRI2RIRIRIR2IR2IRIR9IR5IR6IR6IR2I2R3IR4IRIRI2RIRIR2IR2IRI2R8IR4I2R4I3R6IR2IR4I2R3IRIR2IRIRIR2I4RIR9IR4IR2I4R8IR2IR5IRI3RIR2IRIRIR2IR4IR9IR4IR2I9R3IRI2R5I3R3IR2IRI3R2IR4I3R7IR4I2R9IR3IRIR18IR18IR5I7R3IR3IRIR37IR11IR3IR3IRI7R31IR11IR3IR3IRI4R2I2R5IRIRI2R2I3RI2R2I3RI3R2IR11IR3IR3IR2I2R4I2R4IRIRIRIR2IR2IRIR2IR3IR3IR9I3R3IR3IR6IR2I2R3I3RI2R2I3RI2R2I3R2IR3IR4I6R2I4R3IR5I2R3IR28IR4IR7IR6IR3I4R3IR28IR4IRI7R6IR3IRI3R2I2R2G3XGXQ3XQX11R3IR4IRIR12IR2I3R2IR3IR2X2GXGX3QXQX11R3IR4IRIR2I11R2I2R3IR3IR2G5XQ5X11R3IR4IRI4R11I2R4IR3I2RGXGX3QXQX13R3IR4IR16IR6IR3IRGXG3XQXQ3X11R3IR4I9R4IR3IR6I5RX22R3IR12IR8IR12X22R3IR12IR8IR30IR6IR12IR8IR29I2RI5SI5R7IR8IR15I15R2IX5Q2GQIR6I2R8I2R11I4R16IQIQ5IQIR6IR10I2R10I2R18IQGQ2X4WIR6IR11I2R10I17R2IWX4Q2GQIR6I2R11I2R24I2R2IQIQ5IQIR7I8R5IR24I2R2IQGQ2X5IR13I4R3I2R23I2R2I5TI5R12I3R6IR21I4R7IR17I3R6I2R6I15R10IR14IRI4R7IR6IR24IR13I6R8I2R5IR24IR12I3R13IR5I5RI3R16IR12IR15IR9I3RI13R4IR11I2R15I2R12I3RI2R6IR4IR11IR17IR24IR4IR11IR17IR14IR9IR4IR11IR17I2R13I11R4IR11IR18IR3I11R14IR11IR18IR3IR24IR11IR18IR3I9R16IR11IR18IR10I14R4IR11I10R9I2R22IR4IR20IR10IR7I6R9IR4IR20IR10IR2I6R4I12R3IR20IR10IR2IR24IR20IR10IR2IR24IR20IR10I2RI21R4I2R13I7R11IR21IR5I15R17IRIR19IR5IR31IRI21R37IRIR57IRIR48I10RI50R8IR61',
      'R1215X6G2X14Z2X6R30X18G2X3Z3X4R30X12W3XWX9ZX3R30X14WXWX4I4X5R30X2IX9W5X3IX9R30X12WXWX15R30X3ZX8WXW3X7I3X3R30X6I2X2GX15IZX2R30X7I2X17IX3R30X3GX5IX10ZX4I2X3R30X19Z2X4IX4R30X5ZX9GX9IX4R30X13I6X11R30X2IX20GX6R30X2I2X19GX6R30X4IX21GX3R30X13I5X9ZX2R30X13IX11IX4R30X8GX3I6X12R30X5ZX2G2X20R30X30R30X30R30XI4X10I4X4IX3IX2R30X4I2X14GX2I4X3R30X11Z2X17R30X13Z2X15R30XR59X30R59XR30SX29R579I2R34',
      ];
      if (level > levels.length || level < 1) level = 1;
      super([levels[level-1]]);
    }
  }

  ontick() {
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
