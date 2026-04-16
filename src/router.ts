import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('./pages/home.vue')
    },
    {
      path: '/lobby',
      name: 'lobby',
      component: () => import('./pages/lobby.vue'),
      beforeEnter(to, from) {
        if (from.name !== 'home') return { name: 'home' };
      }
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('./pages/game.vue'),
      beforeEnter(to, from) {
        if (from.name !== 'lobby' && from.name !== 'home')
          return { name: 'home' };
      }
    }
  ]
});

export { router };
