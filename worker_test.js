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

  static async pushWork(id, ...params) {
    let worker = this.workers.find(w => w.ready);
    if (!worker) worker = await this.pushWorker();
    worker.ready = false;
    const output = await worker[id](...params);
    worker.ready = true;
    return output;
  }
}
Compute.initialize(4);

const blocks = [];
for (let i = 0; i < 10000; i++) blocks.push([Math.random()*2000-200, Math.random()*1400-200, 100, 100]);

setInterval(async () => {
  console.log('Workers: '+Compute.workers.length);
  console.log('Assigning workers+1 tasks');
  let start = Date.now();
  for (let i = 0; i <= Compute.workers.length; i++) {
    Compute.pushWork('collider', 0, 0, 1600, 1000, blocks).then((r) => console.log('Worker #'+i+' finished => '+r));
  }
  
  let end = Date.now()-start;
  console.log('Threaded took '+end+'ms');

  start = Date.now();
  for (let i = 0; i < Compute.workers.length; i++) collider(0, 0, 1600, 1000, blocks);
  end = Date.now()-start;
  console.log('Sync took '+end+'ms');
}, 5000);
