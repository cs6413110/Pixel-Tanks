import { expose } from 'threads/worker';

const finder = new PF.AStarFinder({ allowDiagonal: true, dontCrossCorners: true });
const up = a => a < 0 ? Math.floor(a) : Math.ceil(a);
const down = a => a < 0 ? Math.ceil(a) : Math.floor(a);
const Compute = {
  pathfind: (sx, sy, tx, ty, map) => finder.findPath(sx, sy, tx, ty, map),
  collision: (x, y, w, h, x2, y2, w2, h2) => (x + w > x2 && x < x2 + w2 && y + h > y2 && y < y2 + h2),
  toAngle: (x, y) => (-Math.atan2(x, y)*180/Math.PI+360)%360,
  toPoint: angle => {
    const theta = (-angle) * Math.PI / 180, y = Math.cos(theta), x = Math.sin(theta);
    return x === 0 ? {x, y: y/Math.abs(y)} : {x: x/Math.abs(x), y: y/Math.abs(x)}
  },
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
