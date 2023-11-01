import {multiopen, multimessage, multiclose} from './multiplayer.mjs';
import http from 'http';
import fs from 'fs';
import {MongoClient} from 'mongodb';
import { WebSocketServer } from 'ws';

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
  res.end(fs.readFileSync('./public/js/pixel-tanks.js'));
});

const wss = new WebSocketServer({server});
wss.on('connection', function connection(ws) {
  console.log('connection to main');
  ws._send = ws.send;
  ws.send = data => ws._send(JSON.stringify(data));
  sockets.add(ws);
  ws.on('error', console.error);
  ws.on('message', data => {
    try {
      data = JSON.parse(data);
    } catch(e) {
      console.log('err');
      return ws.close();
    }
    console.log('message to main');
    if (!ws.username) ws.username = data.username;
    if (data.op === 'database') database(data, ws);
    if (data.op === 'auth') auth(data, ws);
  });
  ws.on('close', () => {
    console.log('close');
    sockets.delete(ws)
  });
});
const multi = new WebSocketServer({server, path: '/ffa'});
multi.on('connection', function connection(ws) {
  console.log('conneciton to multi');
  ws._send = ws.send;
  ws.send = data => ws._send(JSON.stringify(data));
  multiopen(ws);
  ws.on('error', console.error);
  ws.on('message', data => {
    console.log('message to multi');
    try {
      data = JSON.parse(data);
    } catch(e) {
      return ws.close();
    }
    multimessage(ws, data);
  });
  ws.on('close', () => multiclose(ws, null, null));
});

server.listen(80);
