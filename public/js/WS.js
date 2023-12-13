class WS {
  constructor(url, options={keepAlive: true, autoconnect: true, reconnect: false}) {
    this.url = url;
    this.options = options;
    this.callstack = {open: [], close: [], message: []};
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
      for (const f of this.callstack.open) f();
    }
    this.socket.onmessage = data => {
      data = msgpackr.unpack(new Uint8Array(data.data));
      if (data.status === 'error') {
        if (data.message === 'Invalid Token.') {
          clearInterval(PixelTanks.autosave);
          if (PixelTanks.user.player) PixelTanks.user.player.implode();
          PixelTanks.user.token = PixelTanks.user.username = undefined;
          return Menus.trigger('start');
        }
        return alert(data.message);
      }
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
    this.socket.send(msgpackr.pack(data));
  }
  
  close() {
    this.socket.close();
    this.socket.onclose();
  }
}
