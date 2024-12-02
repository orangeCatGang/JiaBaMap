import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import UserProfile from '../views/UserProfile.vue'
import StorePage from '../views/StorePage.vue'
import SearchPage from '../views/SearchPage.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomePage,
  },
  {
    path: '/store',
    name: 'store',
    component: StorePage,
  },
  {
    path: '/user',
    name: 'user',
    component: UserProfile,
  },
  {
    path: '/search',
    name: 'search',
    component: SearchPage,
  }

]

const router = createRouter({
    history: createWebHistory(),
    routes,
  });

export default router