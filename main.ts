import App from '@/App.vue';
import { GameClient } from '@/game/GameClient.ts';
import { router } from '@/router.ts';
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { useGameInternalStore } from './stores/gameInternal.ts';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount('#app');

const internalGame = useGameInternalStore();
internalGame.socket = new WebSocket('/api/game');
new GameClient();
