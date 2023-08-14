const { Worker, SHARED_ENV } = require('worker_threads');

const collision = (x, y, w, h, x2, y2, w2, h2) => (x + w > x2 && x < x2 + w2 && y + h > y2 && y < y2 + h2);
const collider = (x, y, w, h, rects) => {
  const collided = [];
  for (let i = 0; i < rects.length; i++) if (collision(x, y, w, h, rects[i][0], rects[i][1], rects[i][2], rects[i][3])) collided.push(i);
  return collided;
}

class Compute {
  static initialize(t) {
    this.workers = [];
    for (let i = 0; i < t; i++) this.pushWorker();
  }

  static async pushWorker() {
    console.log('worker created');
    const worker = new Worker('./public/js/compute.js', { env: SHARED_ENV });
    worker.ready = true;
    worker.on('message', data => {
      worker.ready = true;
      worker.callback(data);
    });
    this.workers.push(worker);
    return worker;
  }

  static async pushWork(id, callback) {
    let worker = this.workers.find(w => w.ready);
    if (worker === undefined) worker = await this.pushWorker();
    worker.ready = false;
    worker.callback = callback;
    worker.postMessage({task: id});
  }
}
Compute.initialize(4);

const blocks = [];
for (let i = 0; i < 1000; i++) blocks.push(Math.random()*2000-200, Math.random()*1400-200);
new Worker('process.env.DATA = `'+JSON.stringify([0, 0, 1600, 1000, blocks])+'`', { eval: true, env: SHARE_ENV }).on('exit', () => {
  console.log(process.env.DATA);
}); 

setInterval(async () => {
  let counter = 0, startThreaded = Date.now();
  for (let i = 0; i < Compute.workers.length; i++) {
    Compute.pushWork('collider', r => {
      counter++;
      if (counter === Compute.workers.length) console.log('Threaded took '+(Date.now()-startThreaded)+'ms');
    });
  }

  let startSync = Date.now();
  for (let i = 0; i < Compute.workers.length; i++) collider(0, 0, 1600, 1000, blocks);
  console.log('Sync took '+(Date.now()-startSync)+'ms');
}, 5000);
