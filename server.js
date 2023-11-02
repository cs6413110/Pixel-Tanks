console.log('start');
const msgpackr = require('msgpackr');
console.log(3);
const {multiopen, multimessage, multiclose} = require('./multiplayer.js');
const {MongoClient} = require('mongodb');
const client = new MongoClient('mongodb+srv://cs641311:355608-G38@cluster0.z6wsn.mongodb.net/?retryWrites=true&w=majority');
const tokens = new Set(), sockets = new Set();
const valid = (token, username) => tokens.has(`${token}:${username}`);
const auth = async({username, type, password}, socket) => {
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

let db, ips = 0, ops = 0;
(async () => {
  await client.connect();
  db = client.db('data').collection('data');
})();
setInterval(() => {
  console.log('IPS: '+ips+' OPS: '+ops+' #: '+sockets.size);
  ops = 0;
  ips = 0;
}, 1000);

const server = Bun.serve({
  port: process.env.PORT || 80,
  fetch(req, server) {
    const url = new URL(req.url);
    if (server.upgrade(req, {data: {isMain: url.pathname === '/'}})) return;
    if (url.pathname === '/') return new Response(Bun.file('./public/js/pixel-tanks.js'));
    if (url.pathname === '/play') return new Response(Bun.file('./play.html'));
    if (url.pathname === '/verify') return new Reponse(valid(req.query.token, req.query.username).toString());
  },
  websocket: {
    open(socket) {
      socket._send = socket.send;
      socket.send = data => {
        ops++;
        socket._send(msgpackr.pack(data));
      }
      sockets.add(socket);
      if (!socket.data.isMain) multiopen(socket);
    },
    message(socket, data) {
      ips++;
      try {
        data = msgpackr.unpack(data);
      } catch(e) {
        return socket.close();
      }
      if (socket.data.isMain) {
        if (!socket.username) socket.username = data.username;
        if (data.op === 'database') database(data, socket);
        if (data.op === 'auth') auth(data, socket);
      } else multimessage(socket, data);
    },
    close(socket, code, reason) {
      sockets.delete(socket);
      if (!socket.data.isMain) multiclose(socket, code, reason);
    }
  },
});
