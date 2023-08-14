const Threads = require('threads/worker');
PF = require('pathfinding');
const { expose } = Threads;

const finder = new PF.AStarFinder({ allowDiagonal: true, dontCrossCorners: true });
const up = a => a < 0 ? Math.floor(a) : Math.ceil(a);
const down = a => a < 0 ? Math.ceil(a) : Math.floor(a);
const Compute = {
  pathfind: (sx, sy, tx, ty, map) => finder.findPath(sx, sy, tx, ty, map),
  raycast: (x, y, x2, y2, w) => {
    const dx = x-x2, dy = y-y2, adx = Math.abs(dx), ady = Math.abs(dy);
    const minx = Math.min(x, x2), miny = Math.min(y, y2), maxx = Math.max(x, x2), maxy = Math.max(y, y2);
    const walls = w.filter(w => collision(w.x, w.y, 100, 100, minx, miny, adx, ady));
    let px = Array.from({length: adx+1}, (_, i) => minx+i), py = Array.from({length: ady+1}, (_, i) => miny+i);
    for (const w of walls) {
      if (w.x%100 !== 0) px.push(w.x, w.x+100);
      if (w.y%100 !== 0) py.push(w.y, w.y+100);
    }
    if (dx === 0) {
      for (const p of py) for (const w of walls) if (collision(w.x, w.y, 100, 100, x-.5, p-.5, 1, 1)) return false;
    } else {
      const o = y-(dy/dx)*x;
      for (const w of walls) {
        for (const p of py) if (collision(w.x, w.y, 100, 100, (p-o)/(dy/dx)-.5, p-.5, 1, 1)) return false;
        for (const p of px) if (collision(w.x, w.y, 100, 100, p-.5, (dy/dx)*p+o-.5, 1, 1)) return false;
      }
    }
    return true;
  }
}
expose(Compute);
