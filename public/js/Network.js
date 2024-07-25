class Network {
    static get(callback) {
      const {username, token} = PixelTanks.user;
      PixelTanks.socket.send({op: 'database', type: 'get', username, token});
      PixelTanks.socket.on('message', data => {
        if (data.status !== 'success' && data.type !== 'get') return;
        PixelTanks.socket.no('message');
        callback(data.data);
      });
    }

    static update(key, value) {
      const {username, token} = PixelTanks.user;
      PixelTanks.socket.send({op: 'database', type: 'set', username, token, key, value});
      PixelTanks.socket.on('message', data => {
        if (data.success) PixelTanks.socket.no('message');
      });
    }

    static auth(username, password, type, callback) {
      PixelTanks.socket.send({op: 'auth', type, username, password});
      PixelTanks.socket.on('message', data => {
        if (data.status !== 'success') return;
        PixelTanks.socket.no('message');
        PixelTanks.user.username = username;
        PixelTanks.user.token = data.token;
        callback();
      });
    }
    
    static pending = [];
    static loaded = 0;
    static total = 0;
    static errored = 0;
    static load(pack) {
      PixelTanks.images = {};
      for (const image of Network.pending) image.onload = () => {}
      Network.pending.length = 0;
      const timeout = 15; // Image Load Timeout(seconds)
      // stop previous, stop rendering
      for (const group of pack.map) {
        let host = group.host || pack.host;
        PixelTanks.images[group.ref] = {...group.meta};
        for (const id of group.load) Network.perImage(id, host+'/'+group.path+'/'+id, group.ref);
      }
      PixelTanks.images.cosmetics = {};
      PixelTanks.images.deathEffects = {};
      PixelTanks.crates = {cosmetic: pack.cosmetic, deathEffect: pack.deathEffect};
      let host = pack.host || pack.cosmetic.host;
      for (const rarity of pack.cosmetic) for (const cosmetic of rarity) Network.perImage(cosmetic, host+'/'+pack.cosmetic.path+'/'+id, 'cosmetics');
    }

    static perImage(name, src, ref) {
      let i = PixelTanks.images[ref][name] = new Image();
      i.src = src+'.png';
      i.onload = () => Network.handle(1, i);
      i.timeout = setTimeout(i.onerror = () => Network.handle(0, i), timeout*1000);
      Network.pending.push(i);
      Network.total++;
    }
    
    static handle(s, i) {
      clearTimeout(i.timeout);
      if (s) {
        Network.loaded++;
      } else {
        Network.errored++;
        alert(i.src+' failed with code '+s);
        i = Network.failed;
      }
      let done = Network.loaded+Network.errored;
      PixelTanks.updateBootProgress(done/Network.total);
      if (done === Network.total) {
        if (Network.errored) alert('Warning! Missing '+Network.errored+' images.');
        PixelTanks.launch();
      }
    }
  }
