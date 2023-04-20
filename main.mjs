import HyperExpress from 'hyper-express';
import LiveDirectory from 'live-directory';
import {MongoClient} from 'mongodb';
import Filter from 'bad-words';
import TokenGenerator from 'uuid-token-generator';
import jsonpack from 'jsonpack';

const client = new MongoClient('mongodb+srv://cs641311:355608-G38@cluster0.z6wsn.mongodb.net/?retryWrites=true&w=majority');
const filter = new Filter();
const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);
const Server = new HyperExpress.Server({
  fast_buffers: true,
  key_file_name: 'key.pm',
  cert_file_name: 'cert.pm',
});
const Router = new HyperExpress.Router();
var db, tokens = [], sockets = [];

(async() => {
  await client.connect();
  db = await client.db('data').collection('data');
})();

Router.ws('/', {idle_timeout: Infinity}, (socket) => {
  sockets.push(socket);
  socket.originalSend = socket.send;
  socket.send = function(data) {this.originalSend(A.en(jsonpack.pack(data)))}.bind(socket);
  socket.on('message', async (data) => {
    try {data = jsonpack.unpack(A.de(data))} catch(e) {return socket.destroy()};
    if (!socket.username) socket.username = data.username;
    if (data.op === 'auth') {
      if (data.username === '' || !data.username || data.username.includes(' ') || data.username.includes(':')) return socket.send({status: 'error', message: 'Invalid username.'});
      if (data.username !== filter.clean(data.username)) socket.send({status: 'error', message: 'Username contains inappropriate word.'});
      var item = await db.findOne({username: data.username}), token = tokgen.generate();
      if (data.type === 'signup') {if (item === null) {if (await db.insertOne({username: data.username, password: data.password, playerdata: '{}'})) {socket.send({status: 'success', token: token})} else return socket.send({status: 'error', message: 'Error creating account.'})} else return socket.send({status: 'error', message: 'This account already exists.'})} else if (data.type === 'login') {if (item === null) {return socket.send({status: 'error', message: 'This account does not exist.'})} else {if (item.password === data.password) {socket.send({status: 'success', token: token})} else return socket.send({status: 'error', message: 'Incorrect password.'})};
      } else return socket.destroy();
      tokens.push({username: data.username, token: token});
    } else if (data.op === 'database') {
      if (!data.token) return socket.send({status: 'error', message: 'No token.'});
      if (A.each(tokens, function(d) {if (this.token === d.token) return true}, {key: 'username', value: data.username}, {token: data.token}) ? false : true) return socket.send({status: 'error', message: 'Invalid token.'});
      if (data.type === 'get') try {socket.send({status: 'success', type: 'get', data: await db.findOne({username: data.username}, (name, value) => {if (name === 'password') return undefined; else return value})})} catch(e) {socket.send({status: 'error', message: 'Error getting: '+e})} else if (data.type === 'set') try {db.updateOne({username: data.username}, {$set: Object.defineProperty(await db.findOne({username: data.username}), data.key, {value: data.value})})} catch(e) {socket.send({status: 'error', message: 'Error setting: '+e})} else socket.send({status: 'error', message: 'Invalid or no task.'});
    } else socket.send({status: 'error', message: 'Invalid or no operation.'});
  });
});

const settings = {static: false, watcher: {awaitWriteFinish: {stabilityThreshold: 100, pollInterval: 100}}, cache: {max_file_count: 250, max_file_size: 1024 * 1024}}
const PixelTanks = new LiveDirectory('./pixel-tanks/', settings);
const Kingdoms = new LiveDirectory('./kingdoms/', settings);

Server.use((req, res, next) => {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate').header('Expires', '-1').header('Pragma', 'no-cache');
  next();
});

Server.get('/verify', (req, res) => {
  res.end(A.each(tokens, function(d) {if (this.token === d.token) return true}, {key: 'username', value: req.query.username}, {token: req.query.token}) ? 'true' : 'false');
});

Server.get('/*', (req, res) => {
  var path = req.path, file, key = {
    'html': 'text/html',
    'js': 'application/javascript',
    'png': 'image/png',
    'json': 'application/json',
  }
  if (path === '/') path = '/index.html';
  if (!path.includes('.')) path += '.html';
  if (req.hostname.includes('king')) file = Kingdoms.get(path); else file = PixelTanks.get(path);
  res.header('Content-Type', key[path.split('.')[1]]);
  if (file === undefined) return res.status(404).end('404');
  if (file.cached) return res.send(file.content); else return file.stream().pipe(res);
});

class A {
    static each(arr, func, filter, param) {
      var l = 0;
      while (l<arr.length) {
        if ((filter === undefined || filter === null) ? true : (arr[l][filter.key] === filter.value)) {
          var r = undefined;
          if (typeof func === 'string') {
            r = arr[l][func](param);
          } else {
            r = func.bind(arr[l])({ ...param, i: l });
          }
          if (r !== undefined) return r;
        }
        l++;
      }
    }

    static search(arr, filter) {
      var l = 0;
      while (l<arr.length) {
        if (arr[l][filter.key] === filter.value) {
          return arr[l];
        }
        l++;
      }
    }

    static collider(rect1, rect2) {
      if ((rect1.x > rect2.x || rect1.x+rect1.w > rect2.x) && (rect1.x < rect2.x+rect2.w || rect1.x+rect1.w < rect2.x+rect2.w) && (rect1.y > rect2.y || rect1.y+rect1.h > rect2.y) && (rect1.y < rect2.y+rect2.h || rect1.y+rect1.h < rect2.y+rect2.h)) return true;
      return false;
    }

    static assign(obj, keys, values) {
      A.each(keys, function(d) {obj[this] = d.values[d.i]}, null, {values: values});
    }

    static en(c) {var x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")}

    static de(b) {var a,e={},d=b.split(""),c=d[0],f=d[0],g=[c],h=256,o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")}
  }

Server.use(Router);

import { Multiplayer } from './pixel-tanks/ffa-server.mjs';
Server.use(Multiplayer);

Server.listen(443);
