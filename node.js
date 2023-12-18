const {pack} = require('msgpackr/pack');
const {unpack} = require('msgpackr/unpack');
const {multiopen, multimessage, multiclose} = require('./multiplayer.js');
const {MongoClient} = require('mongodb');
const http = require('http');
const fs = require('fs');
const {WebSocketServer} = require('ws');
const ytdl = require('ytdl-core');

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

let db;
(async () => {
  await client.connect();
  db = client.db('data').collection('data');
})();

const server = http.createServer((req, res) => {
  if (req.url.includes('/download')) {
    if (!ytdl.validateID(req.url.replace('/download', ''))) return res.end('Bad ID format');
    res.setHeader('Content-Type', 'octet-stream');
    res.setHeader('Content-Disposition', 'attachment');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    ytdl(`https://youtube.com/watch?v=${req.url.replace('/download', '')}`, {filter: 'videoandaudio', quality: 'highest'}).pipe(res);
  } else {
    res.end(fs.readFileSync('./public/js/pixel-tanks.js'));
  }
});

const wss = new WebSocketServer({noServer: true});
wss.on('connection', function connection(ws) {
  ws._send = ws.send;
  ws.send = data => ws._send(pack(data));
  sockets.add(ws);
  ws.on('error', console.error);
  ws.on('message', data => {
    try {
      data = unpack(data);
    } catch(e) {
      console.log(e);
      return ws.close();
    }
    if (!ws.username) ws.username = data.username;
    if (data.op === 'database') database(data, ws);
    if (data.op === 'auth') auth(data, ws);
  });
  ws.on('close', (a, b, c) => {
    console.log('close: '+a+' '+b+' '+c);
    sockets.delete(ws)
  });
});
const multi = new WebSocketServer({noServer: true});
multi.on('connection', function connection(ws) {
  ws._send = ws.send;
  ws.send = data => ws._send(pack(data));
  multiopen(ws);
  ws.on('error', console.error);
  ws.on('message', data => {
    try {
      data = unpack(data);
    } catch(e) {
      return ws.close();
    }
    multimessage(ws, data);
  });
  ws.on('close', () => multiclose(ws, null, null));
});
server.on('upgrade', (request, socket, head) => {
  const pathname = request.url;
  if (pathname === '/ffa') {
    multi.handleUpgrade(request, socket, head, (ws) => {
      multi.emit('connection', ws, request);
    });
  } else wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
});

server.listen(80);
