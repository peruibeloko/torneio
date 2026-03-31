import App from '@/App.vue';
import { GameClient } from '@/game/GameClient.ts';
import router from '@/router.ts';
import { createApp, InjectionKey } from 'vue';

export const ClientKey = Symbol() as InjectionKey<GameClient>;

createApp(App).use(router).mount('#app');
