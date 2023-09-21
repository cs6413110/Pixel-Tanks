const script = document.createElement('SCRIPT');
script.src = 'https://rawgit.com/kawanet/msgpack-lite/master/dist/msgpack.min.js'
const connection = document.createElement('DIV'), servers = document.createElement('DIV'), messages = document.createElement('DIV'), message = document.createElement('input'), server = document.createElement('input'), join = document.createElement('BUTTON');
join.innerHTML = 'Join Server';
join.addEventListener('click', () => {
  setRoom();
});
document.head.appendChild(script);
document.body.appendChild(connection);
document.body.appendChild(servers);
document.body.appendChild(messages);
document.body.appendChild(message);
document.body.appendChild(server);
document.body.appendChild(join);
class MegaSocket {
  constructor(url, options={keepAlive: true, autoconnect: true, reconnect: false}) {
    this.url = url;
    this.options = options;
    this.callstack = {open: [], close: [], message: []};
    if (this.options.autoconnect) {
      this.status = 'connecting';
      this.connect();
    } else {
      this.status = 'idle';
      window.addEventListener('offline', () => {
        this.socket.close();
        this.socket.onclose();
      });
      if (this.options.reconnect) window.addEventListener('online', this.connect.bind(this));
    }
  }

  connect() {
    this.socket = new WebSocket(this.url);
    this.socket.onopen = () => {
      this.socket.binaryType = 'arraybuffer';
      this.status = 'connected';
      if (this.options.keepAlive) this.socket.keepAlive = setInterval(() => {
        this.socket.send(msgpack.encode({op: 'ping'}));
      }, 50000);
      this.callstack.open.forEach(f => f());
    }
    this.socket.onmessage = data => {
      try {
        data = msgpack.decode(new Uint8Array(data.data));
      } catch(e) {
        alert('Socket Encryption Error: ' + data.data+' | '+e);
      }
      if (data.status === 'error') return alert(data.message);
      this.callstack.message.forEach(f => f(data));
    }
    this.socket.onclose = e => {
      clearInterval(this.socket.keepAlive);
      this.status = 'disconnected';
      this.callstack.close.forEach(f => f());
      if (this.options.reconnect) this.connect();
    }
  }

  on(event, operation) {
    if (event === 'connect') this.callstack.open.push(operation);
    if (event === 'message') this.callstack.message.push(operation);
    if (event === 'close') this.callstack.close.push(operation);
  }
  no(event) {
    if (event === 'connect') this.callstack.open = [];
    if (event === 'message') this.callstack.message = [];
    if (event === 'close') this.callstack.close = [];
  }
  send(data) {
    data = msgpack.encode(data);
    this.socket.send(data);
  }
  close() {
    this.socket.close();
  }
}

let room = '';
const username = 'screamFix';
const socket = new MegaSocket('ws://141.148.128.231/ffa', {keepAlive: true, autoconnect: true, reconnect: true});
socket.logs = [];
socket.stats = [];
socket.on('connect', () => {
  setInterval(() => {
    socket.send({type: 'stats'});
  }, 500);
  setInterval(() => {
    socket.send({type: 'logs', room});
  }, 50);
});
socket.on('message', d => {
  if (d.event === 'stats') {
    socket.stats = d.FFA; // only allow room selection from ffa
  } else if (d.event === 'logs') {
    socket.logs = d.logs;
  }
});
const render = () => {
  connection.innerHTML = socket.status;
  servers.innerHTML = JSON.stringify(socket.stats);
  messages.innerHTML = '';
  for (let i = 0; i < socket.logs.length; i++) {
    messages.innerHTML += '<div>'+socket.logs[i].m+'</div>';
  }
}
const setRoom = () => {
  room = server.value
}
const sendMessage = () => {
  socket.send({type: 'chat', room, username, msg: message.value});
  message.value = '';
}
window.onkeydown = (e) => {
  if (e.key === 'Enter') sendMessage();
}
setInterval(() => render(), 15);
