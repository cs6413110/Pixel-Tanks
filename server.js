const Sentry = require('@sentry/node');
//const { ProfilingIntegration } = require('@sentry/profiling-node');
const express = require('express');
const expressWs = require('express-ws');
const fs = require('fs').promises;
const { MongoClient } = require('mongodb');
const Filter = require('bad-words');
const TokenGenerator = require('uuid-token-generator');
const { ffa } = require('./ffa-server.js');

const connectionString = 'mongodb+srv://cs641311:355608-G38@cluster0.z6wsn.mongodb.net/?retryWrites=true&w=majority', port = process.env.PORT || 80;

const app = express(), client = new MongoClient(connectionString), filter = new Filter(), tokgen = new TokenGenerator(256, TokenGenerator.BASE62), tokens = new Set(), sockets = [];
let db;

Sentry.init({
  dsn: 'https://d900a2c488024fb294768830690d53dd@o4504300641517568.ingest.sentry.io/4505286074957824',
  tracesSampleRate: 1.0,
  //profilesSampleRate: 1.0,
  integrations: [
    new Sentry.Integrations.Http({tracing: true}),
    new Sentry.Integrations.Express({app}),
    new Sentry.Integrations.Mongo(),
    //new ProfilingIntegration(),
  ],
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

let transactionNum = 1;
function profile() {
  const transaction = Sentry.startTransaction({
    op: 'Profiling/Performance',
    name: 'Transaction',
  });
  transactionNum++;
  setTimeout(() => {
    transaction.finish();
    profile();
  }, 300000);
}
setTimeout(() => profile());

(async () => {
  await client.connect();
  console.log('Database Client Connected!');
  db = client.db('data').collection('data');
  console.log('Fetched Database!');
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
  socket.send = (data) => socket._send(JSON.stringify(data));
  socket.on('message', (data) => {
    try {
      data = JSON.parse(data);
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
app.get('/play', async(req, res) => res.header('Content-Type', 'text/html').end(`<script src='/'></script>`));
app.get('/verify', (req, res) => res.end(valid(req.query.token, req.query.username).toString()));
app.get('/', async(req, res) => res.header('Content-Type', 'application/javascript').end(await fs.readFile('./public/js/pixel-tanks.js')));
app.use(Sentry.Handlers.errorHandler());
app.listen(port);
