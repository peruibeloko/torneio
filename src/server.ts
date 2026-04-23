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
  
  const lobbyExists = gameServer.lobbyExists(body.lobbyCode.toUpperCase());
  if (!lobbyExists) return c.notFound();
  
  const lobbyInfo = gameServer.joinLobby(body.lobbyCode.toUpperCase(), body.player);
  console.log('lobbyInfo response', lobbyInfo);
  return c.json(lobbyInfo);
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
