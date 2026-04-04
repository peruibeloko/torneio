import { Hono } from 'hono';
import { serveStatic, upgradeWebSocket } from 'hono/deno';
import { JoinMsg } from '@/game/client/ClientMessages.ts';
import { GameServer } from '@/game/server/GameServer.ts';

const gameServer = new GameServer();

const api = new Hono();

api.post('/createLobby', c => {
  const lobbyCode = gameServer.createLobby();
  return c.text(lobbyCode);
});

api.post('/joinLobby', async c => {
  const body = await c.req.json<JoinMsg>();
  const gameInfo = gameServer.joinLobby(body.lobbyCode, body.player);
  return c.json(gameInfo);
});

api.get(
  '/game',
  upgradeWebSocket(() => ({
    onMessage({ data }, socket) {
      if (!socket.raw) return;
      gameServer.handleMsg(JSON.parse(data as string), socket.raw);
    }
  }))
);

const app = new Hono();

app.route('/api', api);

app.use('/assets/*', serveStatic({ root: './dist' }));
app.use('/', serveStatic({ path: './dist/index.html' }));
app.get('*', c => c.redirect('/'));

export default app;
