import { ClientMessage } from '@/game/client/ClientMessages.ts';
import { GameServer } from '@/game/server/GameServer.ts';
import { Hono } from 'hono';
import { serveStatic, upgradeWebSocket } from 'hono/deno';
import { decode } from 'msgpack';

const gameServer = new GameServer();

const api = new Hono();

api.get(
  '/game',
  upgradeWebSocket(() => ({
    onMessage({ data }, socket) {
      if (!socket.raw) return;
      const arrData = new Uint8Array(data as ArrayBuffer);
      gameServer.handleMsg(decode(arrData) as ClientMessage, socket.raw);
    }
  }))
);

const app = new Hono();

app.route('/api', api);

app.use('/assets/*', serveStatic({ root: './dist' }));
app.use('/', serveStatic({ path: './dist/index.html' }));
app.get('*', c => c.redirect('/'));

export default app;
