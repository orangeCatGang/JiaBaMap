import { createRouter, createWebHistory } from 'vue-router'

import StorePage from '../components/StorePage.vue'
const routes = [
  {
      path: '/store',
      name: 'store',
      component: StorePage,
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
  });

export default router