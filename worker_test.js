const Threads = require('threads');
const {spawn, Worker} = Threads;

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
    const worker = await spawn(new Worker('./public/js/compute.js'));
    worker.ready = true;
    this.workers.push(worker);
    return worker;
  }

  static async pushWork(id, callback, ...params) {
    let worker = this.workers.find(w => w.ready);
    if (!worker) worker = await this.pushWorker();
    worker.ready = false;
    let start = Date.now();
    worker[id](...params).then(o => {
      worker.ready = true;
      console.log('worker took '+(Date.now()-start));
      callback(o);
    });
  }
}
Compute.initialize(4);

const blocks = [];
for (let i = 0; i < 10000; i++) blocks.push([Math.random()*2000-200, Math.random()*1400-200, 100, 100]);

setInterval(async () => {
  let counter = 0;
  for (let i = 0; i <= Compute.workers.length; i++) {
    Compute.pushWork('collider', r => {
      console.log('Worker #'+i+' finished');
      counter++;
      let endThreaded = process.hrtime(startThreaded);
      if (counter === Compute.workers.length) console.log('Threaded took '+(endThreaded[0]*1000000+endThreaded[1])+'ns');
    }, 0, 0, 1600, 1000, blocks);
  }

  let startSync = process.hrtime();
  for (let i = 0; i < Compute.workers.length; i++) collider(0, 0, 1600, 1000, blocks);
  let endSync = process.hrtime(startSync);
  console.log('Sync took '+(endSync[0]*1000000+endSync[1])+'ns');
}, 5000);
