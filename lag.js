const ws = require('websocket').w3cwebsocket;
const msgpack = require('msgpack-lite');

const sockets = [], interval;

// Test #1
// Create a thousand sockets and ping for each
// get min, avg, and max ping
console.log('Beginning Test #1');
console.log('--- Creating WebSockets ---');
for (let i = 0; i < 1000; i++) sockets.push(new ws('ws://localhost:15132'));
setTimeout(() => {
  console.log('Connections completed!');
  console.log('Sending ping messages 60/s for 1 min');
  let average = 0, num = 0, min = Infinity, max = 0;
  interval = setInterval(() => {
    for (const socket of sockets) {
      const id = Math.random();
      socket.startTimes[id] = id;
      socket.onmessage = data => {
        data = msgpack.decode(data);
        const ping = Date.now()-socket.startTimes[id];
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
client.onerror = function() {
    console.log('Connection Error');
};

client.onopen = function() {
    console.log('WebSocket Client Connected');

    function sendNumber() {
        if (client.readyState === client.OPEN) {
            var number = Math.round(Math.random() * 0xFFFFFF);
            client.send(number.toString());
            setTimeout(sendNumber, 1000);
        }
    }
    sendNumber();
};

client.onclose = function() {
    console.log('echo-protocol Client Closed');
};

client.onmessage = function(e) {
    if (typeof e.data === 'string') {
        console.log("Received: '" + e.data + "'");
    }
};
