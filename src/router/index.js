import { createRouter, createWebHistory } from 'vue-router'

import StorePage from '../components/StorePage.vue'
import Search from '../components/Search.vue'
const routes = [
  {
    path: '/',
    name: 'Search',
    component: Search,
  },  
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