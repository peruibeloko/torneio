import { router } from '@/client/router.ts';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './client/App.vue';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);
app.mount('#app');
