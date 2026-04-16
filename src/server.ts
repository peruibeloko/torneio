import { Hono } from 'hono';
import { serveStatic, upgradeWebSocket } from 'hono/deno';
import { ClientMessage, JoinMsg } from '@/game/client/ClientMessages.ts';
import { GameServer } from '@/game/server/GameServer.ts';
import { decode } from 'msgpack';

const gameServer = new GameServer();

const api = new Hono();

api.post('/createLobby', c => {
  console.log('createLobby request');
  const lobbyCode = gameServer.createLobby();
  console.log('lobbyCode response', lobbyCode);
  return c.text(lobbyCode);
});

api.post('/joinLobby', async c => {
  const body = await c.req.json<JoinMsg>();
  console.log('joinLobby request', body);
  const gameInfo = gameServer.joinLobby(body.lobbyCode, body.player);
  console.log('gameInfo response', gameInfo);
  return c.json(gameInfo);
});

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
