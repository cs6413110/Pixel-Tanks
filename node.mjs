import {multiopen, multimessage, multiclose} from './multiplayer.mjs';
import http from 'http';
import fs from 'fs';
import { WebSocketServer } from 'ws';

const server = http.createServer((req, res) => {
  res.end(fs.readFileSync('./public/js/pixel-tanks.js'));
});

const wss = new WebSocketServer({server});
wss.on('connection', function connection(ws) {
  multiopen(ws);
  ws.on('error', console.error);
  ws.on('message', function message(data) {
    multimessage(ws, JSON.parse(data));
  });
  ws.on('close', () => multiclose(ws));
});

server.listen(80);
