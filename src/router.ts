import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./pages/Home.vue')
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: () => import('./pages/Lobby.vue'),
      beforeEnter(to, from) {
        if (from.name !== 'home') return { name: 'home' };
      }
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('./pages/Game.vue'),
      beforeEnter(to, from) {
        if (from.name !== 'lobby' && from.name !== 'home')
          return { name: 'home' };
      }
    }
  ]
});

export { router };
