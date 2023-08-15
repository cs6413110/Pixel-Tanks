const { Worker, SHARE_ENV } = require('worker_threads');

const collision = (x, y, w, h, x2, y2, w2, h2) => (x + w > x2 && x < x2 + w2 && y + h > y2 && y < y2 + h2);
const raycast = (x, y, x2, y2, w) => {
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

class Compute {
  static initialize(t) {
    this.workers = [];
    for (let i = 0; i < t; i++) this.pushWorker();
  }

  static async pushWorker() {
    console.log('worker created');
    const worker = new Worker('./public/js/compute.js');
    worker.ready = true;
    worker.on('message', data => {
      worker.ready = true;
      worker.callback(data);
    });
    this.workers.push(worker);
    return worker;
  }

  static async pushWork(id, callback, ...params) {
    let worker = this.workers.find(w => w.ready);
    if (!worker) worker = await this.pushWorker();
    worker.ready = false;
    worker.callback = callback;
    worker.postMessage({task: id, params});
  }
}
Compute.initialize(4);

const blocks = [];
for (let i = 0; i < 100; i++) blocks.push({x: Math.random()*2000-200, y: Math.random()*1400-200});

setInterval(async () => {
  let counter = 0, startThreaded = Date.now();
  for (let i = 0; i < Compute.workers.length; i++) {
    Compute.pushWork('raycast', r => {
      counter++;
      if (counter === Compute.workers.length) console.log('Threaded took '+(Date.now()-startThreaded)+'ms');
    }, 0, 0, 1600, 1000, blocks);
  }
}, 10000);

setTimeout(() => {
  setInterval(() => {
    let startSync = Date.now();
    for (let i = 0; i < Compute.workers.length; i++) raycast(0, 0, 1600, 1000, blocks);
    console.log('Sync took '+(Date.now()-startSync)+'ms');
  }, 10000);
}, 5000);
