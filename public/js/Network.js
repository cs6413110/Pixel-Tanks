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
  }

  class Loader {
    static loadImage(source, t, i) {
      this.total++;
      return new Promise((resolve, reject) => {
        const image = new Image();
        image.crossOrigin = 'Anonymous';
        image.onload = () => {
          this.loaded++;
          PixelTanks.updateBootProgress(Math.round(this.loaded/this.total*100)/100);
          resolve(image);
        }
        image.onerror = () => alert(`Failed to load image: ${source}`);
        image.src = `https://cs6413110.github.io/Pixel-Tanks/public/images${source}.png`;
        this.key[t][i] = image;
      });
    }
  
    static async loadImages(key) {
      Loader.key = key;
      Loader.loaded = Loader.total = 0;
      const promises = [];
      for (const t in key) for (const i in key[t]) if (!i.endsWith('_')) promises.push(this.loadImage(key[t][i], t, i));
      await Promise.all(promises);
      PixelTanks.launch();
    }
  }
