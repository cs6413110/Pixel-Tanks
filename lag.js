const ws = require('websocket').w3cwebsocket;
const msgpack = require('msgpack-lite');

const sockets = [];
let interval;

// Test #1
// Create a thousand sockets and ping for each
// get min, avg, and max ping
console.log('Beginning Test #1');
console.log('--- Creating WebSockets ---');
for (let i = 0; i < 10; i++) sockets.push(new ws('ws://localhost:80/ffa'));
setTimeout(() => {
  console.log('Connections completed!');
  console.log('Sending ping messages 60/s for 1 min');
  let average = 0, num = 0, min = Infinity, max = 0;
  interval = setInterval(() => {
    for (const socket of sockets) {
      const id = Math.random();
      socket[id] = Date.now();
      socket.onmessage = data => {
        data = msgpack.decode(new Uint8Array(data.data));
        const ping = Date.now()-socket[id];
        num++;
        average = (average*(num-1)+ping)/num;
        if (ping > max) max = ping;
        if (ping < min) min = ping;
      }
      socket.send(msgpack.encode({type: 'ping', id}));
    }
  }, 1000/60);
  setTimeout(() => {
    clearInterval(interval);
    console.log('Test #1 complete');
    console.log('Average: '+average+' over '+num);
    console.log('Minimum: '+min);
    console.log('Maximum: '+max);
    console.log('-----------------------------------');
    console.log('Test #2: joining tdm servers with 1k fake players with 60/s update changes and ');
    for (const socket of sockets) {
      socket.onmessage = () => {}
      socket.username = 'bot-player#'+Math.random();
      socket.send(msgpack.encode({username: socket.username, type: 'join', gamemode: 'ffa', tank: {rank: sockets.indexOf(socket), username: socket.username, color: '#FFFFFF'}}));
    }
    setTimeout(() => {
      console.log('Moving to random pos for 60ups');
      interval = setInterval(() => {
        for (const socket of sockets) socket.send(msgpack.encode({username: socket.username, type: 'update', data: {x: Math.random()*3000, y: Math.random()*3000, fire: [], use: ['shield']}}));
      }, 1000/60);
      setTimeout(() => {
        clearInterval(interval);
        console.log('done');
      }, 60000);
    }, 5000);
  }, 60000);
}, 5000);
