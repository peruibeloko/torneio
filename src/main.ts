import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './client/App.vue';
import { GameClient } from '@/game/client/GameClient.ts';
import { router } from '@/client/router.ts';
import { useGameInternalStore } from '@/stores/internal.ts';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount('#app');

const internalGame = useGameInternalStore();
internalGame.socket = new WebSocket('/api/game');
new GameClient().setup();
