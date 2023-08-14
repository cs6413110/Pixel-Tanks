const Threads = require('threads');
const {spawn, Worker} = Threads;

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
    if (worker === undefined) worker = this.pushWorker();
    worker.ready = false;
    const output = await worker[id](...params);
    worker.ready = true;
    return output;
  }
}
Compute.initialize(4);

const blocks = [];
for (let i = 0; i < 100; i++) blocks.push([Math.random()*2000-200, Math.random()*1400-200, 100, 100]);

setInterval(() => {
  console.log('Workers: '+Compute.workers.length);
  console.log('Assigning workers+1 tasks');
  for (let i = 0; i <= Compute.workers.length; i++) {
    console.log('Worker #'+i+' finished => '+await Compute.pushWork('collider', 0, 0, 1600, 1000, blocks));
  }
}, 5000);
