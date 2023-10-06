const ws = require('websocket').w3cwebsocket;
const msgpack = require('msgpack-lite');

const sockets = [];
let interval;

// Test #1
// Create a thousand sockets and ping for each
// get min, avg, and max ping
console.log('Beginning Test #1');
console.log('--- Creating WebSockets ---');
for (let i = 0; i < 1000; i++) sockets.push(new ws('ws://localhost:80/ffa'));
setTimeout(() => {
  console.log('Connections completed!');
  console.log('Sending ping messages 60/s for 1 min');
  let average = 0, num = 0, min = Infinity, max = 0;
  interval = setInterval(() => {
    for (const socket of sockets) {
      const id = Math.random();
      socket[id] = id;
      socket.onmessage = data => {
        data = msgpack.decode(data.data);
        const ping = Date.now()-socket[id];
        num++;
        average = (average*num+ping)/num;
        if (ping > max) max = ping;
        if (ping < min) min = ping;
      }
      socket.send(msgpack.encode({type: 'ping', id}));
    }
  }, 1000/60);
  setTimeout(() => {
    clearInterval(interval);
    console.log('Test #1 complete');
    console.log('Average: '+average);
    console.log('Minimum: '+min);
    console.log('Maximum: '+max);
  }, 60000);
}, 5000);
