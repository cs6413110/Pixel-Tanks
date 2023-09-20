import * as Sentry from '@sentry/node';
import { ProfilingIntegration } from '@sentry/profiling-node';
import express from 'express';
import expressWs from 'express-ws';
import {promises as fs} from 'fs';
import {MongoClient} from 'mongodb';
import msgpack from 'msgpack-lite';
import Filter from 'bad-words';
import TokenGenerator from 'uuid-token-generator';
import {Engine, AI, ffa} from './ffa-server.mjs';

const connectionString = 'mongodb+srv://cs641311:355608-G38@cluster0.z6wsn.mongodb.net/?retryWrites=true&w=majority', port = 80;

const app = express(), client = new MongoClient(connectionString), filter = new Filter(), tokgen = new TokenGenerator(256, TokenGenerator.BASE62), tokens = new Set(), sockets = [];
let db;

Sentry.init({
  dsn: 'https://d900a2c488024fb294768830690d53dd@o4504300641517568.ingest.sentry.io/4505286074957824',
  tracesSampleRate: 1.0,
  profilesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({tracing: true}),
    new Sentry.Integrations.Express({app}),
    new Sentry.Integrations.Mongo(),
    new ProfilingIntegration(),
  ],
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

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
    } else return;
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
  ping: () => {},
};

expressWs(app);
app.ws('/', socket => {
  sockets.push(socket);
  socket._send = socket.send;
  socket.send = (data) => socket._send(msgpack.encode(data));
  socket.on('message', (data) => {
    try {
      data = msgpack.decode(data);
    } catch (e) {
      console.log('Invalid Data: '+data);
      return socket.close();
    }
    if (!socket.username) socket.username = data.username;
    try {
      routes[data.op](data, socket);
    } catch (e) {
      return socket.send({status: 'error', message: 'Invalid or no operation.'});
    }
  });
});

app.use(ffa);
app.get('/verify', (req, res) => res.end(valid(req.query.token, req.query.username).toString()));
app.get('/*', async(req, res) => res.header('Content-Type', 'application/javascript').end(await fs.readFile('./public/js/pixel-tanks.js')));
app.use(Sentry.Handlers.errorHandler());
app.listen(port);

let canProfile = true;
const Profile = (arr, update) => {
  for (let e of arr) {
    if (typeof e !== 'function') continue;
    if (/^\s*class\s+/.test(e.toString())) {
      const n = e.name;
      for (const p of Object.getOwnPropertyNames(e)) {
        if (typeof e[p] === 'function') {
          e[p] = function() {
            if (canProfile) const t = Sentry.startTransaction({op: 'Production', name: n+'.'+e[p].name});
            const r = f.o.apply(this, arguments);
            if (canProfile) {
              t.finish();
              canProfile = false;
              setTimeout(() => { canProfile = true }, 300000);
            }
            return r;
          }
        }
      }
      for (const p of Object.getOwnPropertyNames(e.prototype)) {
        if (typeof e.prototype[p] === 'function') {
          e.prototype[p] = function() {
            if (canProfile) const t = Sentry.startTransaction({op: 'Production', name: n+'.'+p});
            const r = f.o.apply(this, arguments);
            if (canProfile) {
              t.finish();
              canProfile = false;
              setTimeout(() => { canProfile = true }, 300000);
            }
            return r;
          }
        }
      }
    }
  }
}
Profile([Engine, AI]);
