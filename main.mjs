import express from 'express';
import expressWs from 'express-ws';
import {promises as fs} from 'fs';
import {MongoClient} from 'mongodb';
import msgpack from 'msgpack-lite';
import Filter from 'bad-words';
import TokenGenerator from 'uuid-token-generator';
import {ffa} from './ffa-server.mjs';

const connectionString = 'mongodb+srv://cs641311:355608-G38@cluster0.z6wsn.mongodb.net/?retryWrites=true&w=majority', port = 80;

const app = express(), client = new MongoClient(connectionString), filter = new Filter(), tokgen = new TokenGenerator(256, TokenGenerator.BASE62), tokens = new Set(), sockets = [];
let db;

(async () => {
  await client.connect();
  db = client.db('data').collection('data');
})();

const valid = (token, username) => tokens.has(`${token}:${username}`);
const routes = {
  auth: async ({ username, type, password }, socket) => {
    if (!username.trim() || /\s|:/.test(username)) return socket.send({ status: 'error', message: 'Invalid username.'});
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

expressWs(app);
app.ws('/', socket => {
  sockets.push(socket);
  socket._send = socket.send;
  socket.send = (data) => socket._send(msgpack.encode(data));
  socket.on('message', (data) => {
    try {
      data = msgpack.decode(Buffer.from(data));
      console.log(data)
    } catch (e) {
      console.log(e);
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

app.get('/verify', (req, res) => res.end(valid(req.query.token, req.query.username).toString()));
app.get('/*', async(req, res) => res.header('Content-Type', 'application/javascript').end(await fs.readFile('./public/js/pixel-tanks.js')));
app.use(ffa);
HyperExpressServer.listen(port);
