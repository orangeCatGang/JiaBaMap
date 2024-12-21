<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from "vue";
import SearchInput from "./SearchInput.vue";
import { useRoute } from "vue-router";
import Login from '../components/Login.vue';
import { useAuth } from '../stores/authStore';

const emit = defineEmits(['search-toggle']);
const route = useRoute();
const user = useAuth();

// 響應式狀態
const isMenuOpen = ref(false);
const menuContainer = ref(null);
const isSearchOpen = ref(false);
const showLoginModal = ref(false);

// 計算屬性
const showSearch = computed(() => route.path !== '/');

// 事件處理函數
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  if (isMenuOpen.value) {
    document.addEventListener('click', handleClickOutside);
  } else {
    document.removeEventListener('click', handleClickOutside);
  }
};

const handleClickOutside = (event) => {
  if (menuContainer.value && !menuContainer.value.contains(event.target)) {
    isMenuOpen.value = false;
  }
};

const toggleSearch = () => {
  isSearchOpen.value = !isSearchOpen.value;
  emit('search-toggle', isSearchOpen.value);
};

const openLoginModal = () => showLoginModal.value = true;
const closeLoginModal = () => showLoginModal.value = false;

// 螢幕寬度檢查
const checkScreenWidth = () => {
  if (window.innerWidth > 768) {
    isMenuOpen.value = false;
  }
};

// 生命週期鉤子
onMounted(() => {
  window.addEventListener("resize", checkScreenWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenWidth);
  document.removeEventListener('click', handleClickOutside);
  isSearchOpen.value = false;
});

// 路由監聽
watch(route, () => {
  isSearchOpen.value = false;
});
</script>

<template>
  <Login :visible="showLoginModal" @close="closeLoginModal" />
  <header class="fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-2 border-b border-orange-200 bg-white">
    <!-- LOGO -->
    <router-link to="/" class="w-[130px] flex-shrink-0">
      <img src="../assets/logo.jpg" alt="Logo" class="w-full">
    </router-link>

    <!-- 中間區域：搜尋欄 -->
    <div class="hidden md:flex flex-1 justify-center mx-4">
      <div v-if="showSearch" class="w-[400px]">
        <SearchInput />
      </div>
    </div>

    <!-- 主選單 -->
    <div class="items-center space-x-4 md:flex main-menu">
      <!-- 登入/登出按鈕 -->
      <div class="flex items-center space-x-4">
        <button v-if="!user.userData" 
                class="p-2 rounded-md text-amber-500 hover:bg-amber-100 min-w-20" 
                @click="openLoginModal">
          登入
        </button> 
        <button v-else 
                class="p-2 rounded-md text-amber-500 hover:bg-amber-100 min-w-20" 
                @click="user.logout">
          登出
        </button> 
        <router-link to="/myarticle" class="p-2 rounded-md text-amber-500 hover:bg-amber-100 min-w-20">
          發表食記
        </router-link> 
        <router-link to="/articlelist" class="p-2 rounded-md text-amber-500 hover:bg-amber-100 min-w-20">
          專欄文章
        </router-link>
      </div>

      <!-- 下拉選單群組 -->
      <div class="flex items-center space-x-4">
        <!-- 店家專區的下拉選單 -->
        <div class="relative inline-block text-left group whitespace-nowrap">
          <button class="p-2 rounded-md text-amber-500 hover:bg-amber-100 focus:outline-none min-w-20 flex items-center justify-center">
            <span class="whitespace-nowrap">店家專區</span>
            <span class="ml-1 inline-flex items-center">&#x25BC;</span>
          </button>
          <div class="absolute z-50 hidden w-32 mt-0 bg-white rounded-md shadow-lg group-hover:block right-0">
            <ul class="py-1">
              <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">店家加入</a></li>
              <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">行銷方案</a></li>
              <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100 rounded-bl-md rounded-br-md">邀請部落客</a></li>
            </ul>
          </div>
        </div>

        <!-- 排行榜的下拉選單 -->
        <div class="relative inline-block text-left group whitespace-nowrap">
          <button class="p-2 rounded-md text-amber-500 hover:bg-amber-100 focus:outline-none min-w-20 flex items-center justify-center">
            <span class="whitespace-nowrap">排行榜</span>
            <span class="ml-1 inline-flex items-center">&#x25BC;</span>
          </button>
          <div class="absolute z-50 hidden w-32 mt-0 bg-white rounded-md shadow-lg group-hover:block right-0">
            <ul class="py-1">
              <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">週排行</a></li>
              <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100 rounded-bl-md rounded-br-md">月排行</a></li>
            </ul>
          </div>
        </div>

        <!-- 會員頭貼 -->
        <div v-if="user.userData" class="relative inline-block text-left group hidden md:block">
          <div class="w-10 h-10 rounded-full cursor-pointer bg-slate-400">
            <img :src="user.userData.avatar || '/src/assets/default_user.png'" alt="avatar" class="w-full h-full rounded-full object-cover">
          </div>
          <!-- 會員下拉選單 -->
          <div class="absolute right-0 z-50 hidden w-36 mt-0 bg-white rounded-md shadow-md group-hover:block">
            <ul class="py-1">
              <li>
                <router-link to="/user" class="block px-4 py-2 text-amber-500 hover:bg-amber-100 whitespace-nowrap">
                  <font-awesome-icon :icon="['fas', 'user']" class="mr-2 text-amber-500" />
                  個人檔案
                </router-link>
              </li>
              <li>
                <router-link to="/user" class="block px-4 py-2 text-amber-500 hover:bg-amber-100 rounded-bl-md rounded-br-md whitespace-nowrap">
                  <font-awesome-icon :icon="['fas', 'bookmark']" class="mr-2 text-amber-500" />
                  珍藏餐廳
                </router-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- 手機版選單 -->
    <div ref="menuContainer" class="md:hidden">
      <!-- 手機版按鈕 -->
      <div class="flex items-center space-x-4">
        <button @click="toggleSearch" class="text-amber-500">
          <font-awesome-icon :icon="['fas', 'magnifying-glass']" class="w-5 h-5" />
        </button>
        <button @click="toggleMenu" class="text-amber-500 focus:outline-none">
          <font-awesome-icon :icon="['fas', 'bars']" class="w-6 h-6" />
        </button>
      </div>

      <!-- 手機版搜尋欄 -->
      <div v-if="isSearchOpen" 
           class="absolute left-0 right-0 p-4 bg-white shadow-md top-full w-full">
        <div class="max-w-[600px] mx-auto">
          <SearchInput />
        </div>
      </div>

      <!-- 手機版下拉選單 -->
      <div v-if="isMenuOpen" class="absolute z-50 w-48 bg-white rounded-lg shadow-md top-16 right-4">
        <ul class="flex flex-col mt-2">
          <li href="#" class="flex cursor-pointer align-center">
            <div class="w-10 h-10 ml-2 rounded-full bg-slate-400">
              <img :src="user.userData?.avatar || '/src/assets/default_user.png'" alt="avatar">
            </div>
            <router-link to="/user" class="pl-4 font-bold leading-10 text-amber-500">
              {{ user.userData?.name || '訪客' }}
            </router-link>
          </li>
          <hr class="mt-2 border-amber-200">
          <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">月排行</a></li>
          <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">週排行</a></li>
          <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">搜尋餐廳</a></li>
          <hr class="border-amber-200">
          <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">線上訂位</a></li>
          <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">美食專欄</a></li>
          <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">發表食記</a></li>
          <hr class="border-amber-200">
          <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">行銷方案</a></li>
          <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">邀請部落客</a></li>
          <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">店家加入</a></li>
          <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">聯絡我們</a></li>
          <hr class="border-amber-200">
          <li v-if="!user.userData">
            <a @click="openLoginModal" class="block p-2 text-amber-500 hover:bg-amber-100 cursor-pointer">登入</a>
          </li>
          <li v-else>
            <a @click="user.logout" class="block p-2 text-amber-500 hover:bg-amber-100 cursor-pointer">登出</a>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<style scoped>
.absolute {
  position: absolute;
}

/* 統一下拉選單樣式 */
.group:hover .group-hover\:block {
  display: block;
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 50;
}

/* 修正在不同頁面的選單位置 */
.main-menu .relative {
  position: relative;
}

@media (max-width: 768px) {
  header {
    flex-wrap: nowrap;
  }
  .main-menu {
    display: none !important;
  }
  .hamburger-menu {
    display: flex;
  }
}

@media (min-width: 769px) {
  .main-menu {
    display: flex;
  }
  .hamburger-menu {
    display: none;
  }
}

/* 修正下拉選單的位置和對齊 */
.main-menu {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.main-menu > div {
  display: flex;
  align-items: center;
}

/* 確保下拉選單的定位 */
.group {
  position: relative;
}
</style>
