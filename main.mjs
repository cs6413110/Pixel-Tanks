import {Server, Router} from 'hyper-express';
import {promises as fs} from 'fs';
import {MongoClient} from 'mongodb';
import Filter from 'bad-words';
import TokenGenerator from 'uuid-token-generator';
import msgpack from 'jsonpack';
import {Core} from './ffa-server.mjs';

const connectionString =
  'mongodb+srv://cs641311:355608-G38@cluster0.z6wsn.mongodb.net/?retryWrites=true&w=majority', port = 80;

const HyperExpressServer = new Server({fast_buffers: true}), router = new Router(), client = new MongoClient(connectionString), filter = new Filter(), tokgen = new TokenGenerator(256, TokenGenerator.BASE62), tokens = new Set(), sockets = [];
let db;

(async () => {
  await client.connect();
  db = client.db('data').collection('data');
})();

const valid = (token, username) => tokens.has(`${token}:${username}`);
const encode = (c) => {let x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")}
const decode = (b) => {let a,e={},d=b.split(""),c=d[0],f=d[0],g=[c],h=256,o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")}
const routes = {
  auth: async ({ username, type, password }, socket) => {
    if (['', ' ', undefined].includes(username) || username.includes(' ') || username.includes(':')) return socket.send({ status: 'error', message: 'Invalid username.'});
    if (username !== filter.clean(username)) return socket.send({status: 'error', message: 'Username contains inappropriate word.'});
    const item = await db.findOne({username}), token = tokgen.generate();
    if (type === 'signup') {
      if (item !== null) return socket.send({status: 'error', message: 'This account already exists.'});
      await db.insertOne({username, password, playerdata: '{}'});
    } else if (type === 'login') {
      if (item === null) return socket.send({status: 'error', message: 'This account does not exist.'});
      if (item.password !== password) return socket.send({status: 'error', message: 'Incorrect password.'});
    } else return socket.destroy();
    socket.send({status: 'success', token});
    tokens.add(`${token}:${username}`);
  },
  database: async ({ token, username, type, key, value }, socket) => {
    if (!token) return socket.send({status: 'error', message: 'No token.'});
    if (!valid(token, username)) return socket.send({status: 'error', message: 'Invalid token.'});
    try {
      if (type === 'get') {
        socket.send({status: 'success', type: 'get', data: await db.findOne({username}, {projection: {password: 0}})});
      } else if (type === 'set') {
        await db.findOneAndUpdate({username}, {$set: {[key]: value}});
      } else socket.send({status: 'error', message: 'Invalid or no task.'});
    } catch (e) {
      socket.send({status: 'error', message: 'Error getting: '+e});
    }
  },
};

router.ws('/', {idle_timeout: Infinity}, (socket) => {
  sockets.push(socket);
  socket._send = socket.send;
  socket.send = (data) => {
    socket._send(msgpack.pack(data));
  };
  socket.on('message', (data) => {
    try {
      data = msgpack.unpack(decode(data));
    } catch (e) {
      return socket.destroy();
    }
    if (!socket.username) socket.username = data.username;
    try {
      routes[data.op](data, socket);
    } catch (e) {
      return socket.send({status: 'error', message: 'Invalid or no operation.'});
    }
  });
});

HyperExpressServer.get('/verify', (req, res) => res.end(valid(req.query.token, req.query.username)));
HyperExpressServer.get('/*', async(req, res) => {
  res.header('Content-Type', 'application/javascript').end(await fs.readFile('/home/ubuntu/Pixel-Tanks/public/js/pixel-tanks.js'));
});
HyperExpressServer.use(router);
HyperExpressServer.use(Core);
HyperExpressServer.listen(port);
