const { parentPort } = require('worker_threads');
const PF = require('pathfinding');

const finder = new PF.AStarFinder({ allowDiagonal: true, dontCrossCorners: true });
const collision = (x, y, w, h, x2, y2, w2, h2) => (x + w > x2 && x < x2 + w2 && y + h > y2 && y < y2 + h2);
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
  },
  collider: (x, y, w, h, rects) => {
    const collided = [];
    for (let i = 0; i < rects.length; i+=2) if (collision(x, y, w, h, rects[i], rects[i+1], 100, 100)) collided.push(i);
    return collided;
  }
}

setInterval(() => setImmediate, 1000);
parentPort.on('message', data => {
  let start = Date.now();
  parentPort.postMessage(Compute[data.task](JSON.parse(data)));
  console.log('Worker time => '+(Date.now()-start));
});
