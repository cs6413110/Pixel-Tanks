import HyperExpress from 'hyper-express';
import fs from 'fs';
import { MongoClient } from 'mongodb';
import Filter from 'bad-words';
import TokenGenerator from 'uuid-token-generator';
import jsonpack from 'jsonpack';
import { Core } from './ffa-server.mjs';

const HyperExpressServer = new HyperExpress.Server({fast_buffers: true});
const Router = new HyperExpress.Router();
const db = {tokens: [], sockets: []};
const filter = new Filter();
const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);
const client = new MongoClient(connectionString);

const connectionString = 'mongodb+srv://cs641311:355608-G38@cluster0.z6wsn.mongodb.net/?retryWrites=true&w=majority';
const port = 80;

const valid = (token, username) => typeof db.tokens.find((t) => t.token === token && t.username === username) === 'object';
const encode = (c) => {
  var x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("");
}
const decode = (b) => {
  var a,e={},d=b.split(""),c=d[0],f=d[0],g=[c],h=256,o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("");
}

const routes = {
  auth: async ({ username, type, password }, socket) => {
    if (['', ' ', undefined].includes(username) || username.includes(' ') || username.includes(':')) return socket.send({status: 'error', message: 'Invalid username.'});
    if (username !== filter.clean(username)) return socket.send({status: 'error', message: 'Username contains inappropriate word.'});
    var item = await db.findOne({ username }), token = tokgen.generate();
    if (type === 'signup') {
      if (item !== null) return socket.send({status: 'error', message: 'This account already exists.'});
      await db.insertOne({username, password, playerdata: '{}'});
    } else if (type === 'login') {
      if (item === null) return socket.send({status: 'error', message: 'This account does not exist.'});
      if (item.password !== password) return socket.send({status: 'error', message: 'Incorrect password.'});
    } else return socket.destroy();
    socket.send({status: 'success', token});
    db.tokens.push({username, token});
  },

  database: async ({ token, username, type, key, value }, socket) => {
    if (!token) return socket.send({ status: 'error', message: 'No token.' });
    if (!valid(token, username)) return socket.send({ status: 'error', message: 'Invalid token.' });

    try {
      if (type === 'get') {
        socket.send({
          status: 'success',
          type: 'get',
          data: await db.findOne({ username }, (name, value) => {
            return name === 'password' ? undefined : value;
          }),
        });
      } else if (type === 'set') {
        await db.findOneAndUpdate(
          { username },
          { $set: Object.defineProperty(await db.findOne({ username }), key, { value }) }
        );
      } else socket.send({ status: 'error', message: 'Invalid or no task.' });
    } catch (e) {
      socket.send({ status: 'error', message: 'Error getting: ' + e });
    }
  },
};

Router.ws('/', { idle_timeout: Infinity }, (socket) => {
  db.sockets.push(socket);
  socket._send = socket.send;
  socket.send = function (data) {
    this._send(encode(jsonpack.pack(data)));
  }.bind(socket);

  socket.on('message', (data) => {
    try {
      data = jsonpack.unpack(decode(data));
    } catch (e) {
      return socket.destroy();
    }

    if (!socket.username) socket.username = data.username;

    try {
      routes[data.op](data, socket);
    } catch (e) {
      return socket.send({ status: 'error', message: 'Invalid or no operation.' });
    }
  });
});

HyperExpressServer.get('/verify', (req, res) => res.end(valid(req.query.token, req.query.username).toString()));
HyperExpressServer.get('/*', async (req, res) => {
  try {
    res.header('Content-Type', 'application/javascript').end(await readFileAsync('/home/ubuntu/Pixel-Tanks/public/js/pixel-tanks.js'));
  } catch (e) {
    res.status(500).end('Internal Server Error');
  }
});

HyperExpressServer.use(Router);
HyperExpressServer.use(Core);
HyperExpressServer.listen(port);
