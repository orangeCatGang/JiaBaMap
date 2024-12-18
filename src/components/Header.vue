<script>
  import { ref, onMounted, onUnmounted, } from "vue";
  import SearchInput from "./SearchInput.vue";

  export default {
    components: {
      SearchInput
    },
    setup() {
      // 控制選單開關的狀態
      const isMenuOpen = ref(false);
      const menuContainer = ref(null);
  
      const toggleMenu = () => {
        isMenuOpen.value = !isMenuOpen.value;
        if (isMenuOpen.value) {
          document.addEventListener('click', handleClickOutside);
        } else {
          document.removeEventListener('click', handleClickOutside);
        }
      };
  
      const checkScreenWidth = () => {
        if (window.innerWidth > 768) {
          isMenuOpen.value = false; // 自動關閉選單
        }
      };
  
      const handleClickOutside = (event) => {
        if (menuContainer.value && !menuContainer.value.contains(event.target)) {
          isMenuOpen.value = false; // 點擊外部時關閉選單
        }
      };
     
      
      // 在元件掛載和卸載時設置和移除事件監聽器
      onMounted(() => {
        window.addEventListener("resize", checkScreenWidth);
        document.addEventListener('click', handleClickOutside);
  
      });
  
      onUnmounted(() => {
        window.removeEventListener("resize", checkScreenWidth);
        document.removeEventListener('click', handleClickOutside);
      });
  
      return {
        isMenuOpen,
        toggleMenu,
        menuContainer,
      };
    },
  };
  </script>
  
  
  <template>
      <!-- 頁頭（導航欄） -->
      <header class="flex flex-wrap items-center justify-between p-2 space-x-4 space-y-2 border-b border-orange-200 md:space-y-0">
          <!-- LOGO -->
          <router-link to="/"><img src="../assets/logo.jpg" alt="Logo" class="w-[130px]"></router-link>
          <!-- 搜尋欄容器 -->
            <div>
            <SearchInput />
            </div>
          <!-- 主選單 -->
          <div class="items-center space-x-4 md:flex main-menu">
            <router-link to="/myarticle" class="p-2 rounded-md text-amber-500 hover:bg-amber-100 min-w-20">
                    發表食記
            </router-link> 
              <router-link to="/articlelist" class="p-2 rounded-md text-amber-500 hover:bg-amber-100 min-w-20">
                專欄文章
              </router-link>
              <!-- 店家專區的下拉選單 -->
              <div class="relative inline-block text-left group">
                  <button class="p-2 rounded-md text-amber-500 hover:bg-amber-100 focus:outline-none min-w-20">
                      店家專區
                      <span>&#x25BC;</span>
                  </button>
                  <div class="absolute z-10 hidden w-32 mt-0 bg-white rounded-md shadow-lg group-hover:block">
                      <ul class="mt-2">
                      <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">店家加入</a></li>
                      <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">行銷方案</a></li>
                      <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100 rounded-bl-md rounded-br-md">邀請部落客</a></li>
                      </ul>
                  </div>
              </div>
              <!-- 排行榜的下拉選單 -->
              <div class="relative inline-block text-left group">
                  <button class="p-2 rounded-md text-amber-500 hover:bg-amber-100 focus:outline-none min-w-20">
                      排行榜
                      <span>&#x25BC;</span>
                  </button>
                  <div class="absolute z-10 hidden w-32 mt-0 bg-white rounded-md shadow-lg group-hover:block">
                      <ul class="mt-2">
                      <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">週排行</a></li>
                      <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100 rounded-bl-md rounded-br-md">月排行</a></li>
                      </ul>
                  </div>
              </div>
              <!-- 會員頭貼 -->
              <div class="relative inline-block text-left group">
                <div class="w-10 h-10 rounded-full cursor-pointer bg-slate-400">
                  <img src="/src/assets/default_user.png" alt="avatar">
                </div>
                <!-- 會員下拉選單 -->
                <div class="absolute right-0 z-10 hidden w-32 mt-0 bg-white rounded-md shadow-md group-hover:block">
                  <ul class="mt-2">
                    <li>
                      <router-link to="/user" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">
                        <font-awesome-icon
                          :icon="['fas', 'user']"
                          class="mr-4 text-amber-500" />個人檔案
                      </router-link>
                    </li>
                    <li>
                        <router-link to="/user" class="block px-4 py-2 text-amber-500 hover:bg-amber-100 rounded-bl-md rounded-br-md">
                          <font-awesome-icon
                          :icon="['fas', 'bookmark']"
                          class="mr-4 text-amber-500" />珍藏餐廳
                        </router-link>
                    </li>
                  </ul>
                </div>
              </div> 
              <!-- 會員頭貼end -->
          </div>
          <div ref="menuContainer" class="md:hidden">
            <!-- 主選單：小於 768px 顯示為漢堡圖標 -->
            <div class="flex items-center space-x-4 md:hidden hamburger-menu">
                <a href="#"><font-awesome-icon :icon="['fas', 'magnifying-glass']" class="w-5 h-5 text-amber-500" /></a>
                <button @click="toggleMenu" class="text-amber-500 focus:outline-none">
                <font-awesome-icon :icon="['fas', 'bars']" class="w-6 h-6" />
                </button>
            </div>
            <!-- 小螢幕的下拉選單 -->
            <div v-if="isMenuOpen" class="absolute z-50 w-48 bg-white rounded-lg shadow-md top-16 right-4">
                <ul class="flex flex-col mt-2">
                  <li href="#" class="flex cursor-pointer align-center">
                      <div class="w-10 h-10 ml-2 rounded-full bg-slate-400">
                        <img src="/src/assets/default_user.png" alt="avatar">
                      </div>
                      <router-link to="/user" class="pl-4 font-bold leading-10 text-amber-500">Julie Wang</router-link>
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
                    <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">登出</a></li>
                </ul>
            </div>
            <!-- 下拉end -->
          </div>
      </header>
  </template>
  
  <style scoped>
  /* 如果需要自定義一些額外樣式可以在這裡加入 */
  .absolute {
      position: absolute;
  }
  
  @media (max-width: 768px) {
      header {
          flex-wrap: nowrap;
      }
      .hidden {
          display: none !important;
      }
      .main-menu {
          display: none; /* 小於等於 768px 隱藏主選單 */
      }
      .hamburger-menu {
          display: flex; /* 小於等於 768px 顯示漢堡選單 */
      }
  }
  
  @media (min-width: 769px) {
      .main-menu {
          display: flex; /* 大於等於 769px 顯示主選單 */
      }
      .hamburger-menu {
          display: none; /* 大於等於 769px 隱藏漢堡選單 */
      }
  }
  </style>
