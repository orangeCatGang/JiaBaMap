import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import UserProfile from '../views/UserProfile.vue'
import StorePage from '../views/StorePage.vue'
import SearchPage from '../views/SearchPage.vue'
import Login from '../components/Login.vue'
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
    meta: { requiresAuth: true },
  },
  {
    path: '/search',
    name: 'search',
    component: SearchPage,
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
  },

]

const router = createRouter({
    history: createWebHistory(),
    routes,
  });


//檢查有用戶資料才能訪問user
  // router.beforeEach((to, from, next) => {
  //   const isAuthenticated = localStorage.getItem('userData'); 
  //   if (to.meta.requiresAuth && !isAuthenticated) {
  //     alert("請先登入")
  //     next({ name: 'login' }); // 未登入，回到登入頁面
  //   } else {
  //     next(); // 允許訪問
  //   }
  // });
  

export default router