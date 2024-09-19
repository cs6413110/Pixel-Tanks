class MegaSocket {
  constructor(url, options={keepAlive: true, autoconnect: true, reconnect: false}) {
    this.url = url;
    this.options = options;
    this.callstack = {connect: [], close: [], message: []};
    this.status = 'idle';
    window.addEventListener('offline', () => this.socket.close());
    if (this.options.reconnect) window.addEventListener('online', () => this.connect());
    if (this.options.autoconnect) this.connect();
  }
  connect() {
    this.status = 'connecting';
    this.socket = new WebSocket(this.url);
    this.socket.binaryType = 'arraybuffer';
    this.socket.onopen = () => {
      this.status = 'connected';
      if (this.options.keepAlive) this.socket.keepAlive = setInterval(() => this.socket.send(msgpackr.pack({type: 'ping', op: 'ping'})), 30000);
      for (const f of this.callstack.connect) f();
    }
    this.socket.onmessage = data => {
      data = msgpackr.unpack(new Uint8Array(data.data));
      if (data.status === 'error') return alert(data.message);
      this.callstack.message.forEach(f => f(data));
    }
    this.socket.onclose = e => {
      clearInterval(this.socket.keepAlive);
      this.status = 'disconnected';
      for (const f of this.callstack.close) f();
      if (this.options.reconnect) this.connect();
    }
  }
  on = (e, o) => this.callstack[e].push(o);
  no = e => this.callstack[e] = [];
  send = d => (if (this.socket.readyState === 1) this.socket.send(msgpackr.pack(d)));
  close = () => this.socket.close();
}
