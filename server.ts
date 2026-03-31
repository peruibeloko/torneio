import { Hono } from 'hono';
import { upgradeWebSocket, serveStatic } from 'hono/deno';
// import { cors } from "hono/cors";
import { GameServer } from '@/game/GameServer.ts';

const gameServer = new GameServer();

const api = new Hono();

api.post('/createLobby', c => {
  const lobbyCode = gameServer.createLobby();
  return c.text(lobbyCode);
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

// app.use(cors({
//   origin: ["localhost:5137"],
// }));

app.use('/assets/*', serveStatic({ root: './dist' }));
app.use('/', serveStatic({ path: './dist/index.html' }));
app.get('*', c => c.redirect('/'));

export default app;
