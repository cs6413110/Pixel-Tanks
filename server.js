const { MongoClient } = require('mongodb');
//const { ffa } = require('./ffa-server.js');
const client = new MongoClient'mongodb+srv://cs641311:355608-G38@cluster0.z6wsn.mongodb.net/?retryWrites=true&w=majority')
const tokens = new Set(), sockets = [];
const valid = (token, username) => tokens.has(`${token}:${username}`);
const auth = ({username, type, password}, socket) => {
  const item = await db.findOne({username}), token = Math.random();
  if (type === 'signup') {
    if (item !== null) return socket.send({status: 'error', message: 'This account already exists.'});
    await db.insertOne({username, password, playerdata: '{}'});
  } else if (type === 'login') {
    if (item === null) return socket.send({status: 'error', message: 'This account does not exist.'});
    if (item.password !== password) return socket.send({status: 'error', message: 'Incorrect password.'});
  } else return;
  socket.send({status: 'success', token});
  tokens.add(`${token}:${username}`);
}
const database = async({token, username, type, key, value}, socket) => {
  if (!token) return socket.send({status: 'error', message: 'No token.'});
  if (!valid(token, username)) return socket.send({status: 'error', message: 'Invalid Token.'});
  if (type === 'get') {
    socket.send({status: 'success', type, data: await db.findOne({username}, {projection: {password: 0}})});
  } else if (type === 'set') {
    await db.findOneAndUpdate({username}, {$set: {[key]: value}});
  }
}

let db;
(async () => {
  await client.connect();
  db = client.db('data').collection('data');
})();

const server = Bun.serve({
  port: process.env.PORT || 80,
  fetch(req, server) {
    const url = new URL(req.url);
    if (server.upgrade(req)) return;
    if (url.pathname === '/') return new Response(Bun.file('./public/js/pixel-tanks.js'));
    if (url.pathname === '/play') return new Response(`<script src='/'></script>`);
    if (url.pathname === '/verify') return new Reponse(valid(req.query.token, req.query.username).toString());
  },
  websocket: {
    open(socket) {
      sockets.push(socket);
      socket._send = socket.send;
      socket.send = data => socket._send(JSON.stringify(data));
    },
    message(socket, data) {
      try {
        data = JSON.parse(data);
      } catch(e) {
        return socket.close();
      }
      if (!socket.username) socket.username = data.username;
      if (data.op === 'database') database(data, socket);
      if (data.op === 'auth') auth(data, socket);
    },
  },
});
