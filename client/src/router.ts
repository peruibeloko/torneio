import { createWebHashHistory, createRouter } from 'vue-router';

import Login from './views/Login.vue';
import Submit from './views/Submit.vue';
import Play from './views/Play.vue';

export enum RouteNames {
    LOGIN = 'login',
    SUBMIT  = 'submit',
    PLAY = 'play'
} 

export default createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: RouteNames.LOGIN, component: Login },
    { path: '/submit', name: RouteNames.SUBMIT, component: Submit },
    { path: '/play', name: RouteNames.PLAY, component: Play }
  ]
});
