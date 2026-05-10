import { ClientMessage } from '@/game/client/ClientMessages.ts';
import { GameServer } from '@/game/server/GameServer.ts';
import { Hono } from 'hono';
import { serveStatic, upgradeWebSocket } from 'hono/deno';
import { decode } from 'msgpack';

const gameServer = new GameServer();
const app = new Hono();

app.get(
  '/game',
  upgradeWebSocket(() => ({
    onOpen(_, ws) {
      if (!ws.raw) return;
      console.info('[server] New client connected succesfully, status is %d', ws.raw.readyState);
    },
    onMessage({ data }, socket) {
      if (!socket.raw) return;
      const arrData = new Uint8Array(data as ArrayBuffer);
      gameServer.handleMsg(decode(arrData) as ClientMessage, socket.raw);
    }
  }))
);

app.use('/assets/*', serveStatic({ root: './dist' }));
app.use('/', serveStatic({ path: './dist/index.html' }));
app.get('*', c => c.redirect('/'));

export default app;
