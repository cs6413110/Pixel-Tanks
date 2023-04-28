import HyperExpress from 'hyper-express';
import fs from 'fs';
import {MongoClient} from 'mongodb';
import Filter from 'bad-words';
import TokenGenerator from 'uuid-token-generator';
import jsonpack from 'jsonpack';
import { Multiplayer } from './ffa-server.mjs';
const client = new MongoClient('mongodb+srv://cs641311:355608-G38@cluster0.z6wsn.mongodb.net/?retryWrites=true&w=majority');
const filter = new Filter();
const tokgen = new TokenGenerator(256, TokenGenerator.BASE62);
const Server = new HyperExpress.Server({fast_buffers: true});
const Router = new HyperExpress.Router();
var db, tokens = [], sockets = [], auth = (token, username) => {return typeof tokens.find(t => t.token === token && t.username === username) === 'object'}, encode = (c) => {var x='charCodeAt',b,e={},f=c.split(""),d=[],a=f[0],g=256;for(b=1;b<f.length;b++)c=f[b],null!=e[a+c]?a+=c:(d.push(1<a.length?e[a]:a[x](0)),e[a+c]=g,g++,a=c);d.push(1<a.length?e[a]:a[x](0));for(b=0;b<d.length;b++)d[b]=String.fromCharCode(d[b]);return d.join("")}, decode = (b) => {var a,e={},d=b.split(""),c=d[0],f=d[0],g=[c],h=256,o=256;for(b=1;b<d.length;b++)a=d[b].charCodeAt(0),a=h>a?d[b]:e[a]?e[a]:f+c,g.push(a),c=a.charAt(0),e[o]=f+c,o++,f=a;return g.join("")};

(async() => {
  await client.connect();
  db = await client.db('data').collection('data');
})();

Router.ws('/', {idle_timeout: Infinity}, (socket) => {
  sockets.push(socket);
  socket._send = socket.send;
  socket.send = function(data) {this._send(encode(jsonpack.pack(data)))}.bind(socket);
  socket.on('message', async(data) => {
    try {
      data = jsonpack.unpack(decode(data));
    } catch(e) {
      return socket.destroy();
    };
    if (!socket.username) socket.username = data.username;
    if (data.op === 'auth') {
      if (data.username === '' || !data.username || data.username.includes(' ') || data.username.includes(':')) return socket.send({status: 'error', message: 'Invalid username.'});
      if (data.username !== filter.clean(data.username)) return socket.send({status: 'error', message: 'Username contains inappropriate word.'});
      var item = await db.findOne({username: data.username}), token = tokgen.generate();
      if (data.type === 'signup') {if (item === null) {if (await db.insertOne({username: data.username, password: data.password, playerdata: '{}'})) {socket.send({status: 'success', token: token})} else return socket.send({status: 'error', message: 'Error creating account.'})} else return socket.send({status: 'error', message: 'This account already exists.'})} else if (data.type === 'login') {if (item === null) {return socket.send({status: 'error', message: 'This account does not exist.'})} else {if (item.password === data.password) {socket.send({status: 'success', token: token})} else return socket.send({status: 'error', message: 'Incorrect password.'})};
      } else return socket.destroy();
      tokens.push({username: data.username, token: token});
    } else if (data.op === 'database') {
      if (!data.token) return socket.send({status: 'error', message: 'No token.'});
      if (auth(data.token, data.username)) return socket.send({status: 'error', message: 'Invalid token.'});
      if (data.type === 'get') try {socket.send({status: 'success', type: 'get', data: await db.findOne({username: data.username}, (name, value) => {if (name === 'password') return undefined; else return value})})} catch(e) {socket.send({status: 'error', message: 'Error getting: '+e})} else if (data.type === 'set') try {db.updateOne({username: data.username}, {$set: Object.defineProperty(await db.findOne({username: data.username}), data.key, {value: data.value})})} catch(e) {socket.send({status: 'error', message: 'Error setting: '+e})} else socket.send({status: 'error', message: 'Invalid or no task.'});
    } else socket.send({status: 'error', message: 'Invalid or no operation.'});
  });
});

Server.get('/verify', (req, res) => {
  console.log(auth(req.query.token, req.query.username).toString());
  res.end(auth(req.query.token, req.query.username).toString());
});

Server.get('/*', (req, res) => {
  res.header('Content-Type', 'application/javascript').end(fs.readFileSync('/home/ubuntu/Pixel-Tanks/public/js/pixel-tanks.js'));
});

Server.use(Router);
Server.use(Multiplayer);
Server.listen(80);
