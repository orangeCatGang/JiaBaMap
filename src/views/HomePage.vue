<script>
import { ref, onMounted, onUnmounted } from "vue";
import loader from "../components/googleMapsLoader";
import StoreType from "../components/HomePage/StoreType.vue"
import SearchInput from "../components/SearchInput.vue";

import Login from '../components/Login.vue';

// Local Storage 工具方法
const localStorageUtil = {
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new Event("places-updated"));
  },
  get(key) {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  },
};

export default {
  components: {
    StoreType,
    Login,
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

    const showLoginModal = ref(false); // 是否顯示登錄小畫面

    // 開啟登錄小畫面
    const openLoginModal = () => {
      showLoginModal.value = true;
    };

    // 關閉登錄小畫面
    const closeLoginModal = () => {
      showLoginModal.value = false;
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
      showLoginModal,
      openLoginModal,
      closeLoginModal
    };
  },
  data() {
    return {
      keyword: "", // 用戶輸入的關鍵字
      selectedDistrict: "大安區", // 預設行政區
      sortOrder: "default", // 預設排序方式
      districts: {
        "中正區": { lat: 25.032404, lng: 121.519033 },
        "大同區": { lat: 25.063093, lng: 121.513305 },
        "中山區": { lat: 25.0685, lng: 121.5266 },
        "松山區": { lat: 25.0585, lng: 121.5585 },
        "大安區": { lat: 25.033976, lng: 121.543459 },
        "萬華區": { lat: 25.0354, lng: 121.4997 },
        "信義區": { lat: 25.0306, lng: 121.5701 },
        "士林區": { lat: 25.0922, lng: 121.5245 },
        "北投區": { lat: 25.1321, lng: 121.4987 },
        "內湖區": { lat: 25.083, lng: 121.5868 },
        "南港區": { lat: 25.0553, lng: 121.6171 },
        "文山區": { lat: 24.9987, lng: 121.5549 },
      },
      places: [], // 搜尋結果
      searched: false, // 是否已搜尋
    };
  },
  methods: {
    async searchPlaces() {
      this.places = [];
      this.searched = false;
      console.log("test")

      if (!this.keyword.trim()) {
        alert("請輸入有效的關鍵字！");
        return;
      }

      const { lat, lng } = this.districts[this.selectedDistrict];

      // 使用 Google Maps Loader
      await loader.load();

      const service = new google.maps.places.PlacesService(
        document.createElement("div")
      );

      const request = {
        location: new google.maps.LatLng(lat, lng),
        radius: 1000,
        keyword: this.keyword,
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          this.places = results.map((place) => ({
            ...place,
            distance: this.calculateDistance(
              lat,
              lng,
              place.geometry.location.lat(),
              place.geometry.location.lng()
            ),
            photo:
              place.photos && place.photos[0]
                ? place.photos[0].getUrl({ maxWidth: 400 })
                : null,
          }));

          // 儲存資料到 Local Storage
          localStorageUtil.set("places", this.places);
          localStorageUtil.set("sortOrder", this.sortOrder);
        } else {
          console.error("搜尋失敗，狀態：", status);
        }

        this.searched = true;
      });
    },
    calculateDistance(lat1, lng1, lat2, lng2) {
      const R = 6371;
      const dLat = this.degToRad(lat2 - lat1);
      const dLng = this.degToRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.degToRad(lat1)) *
          Math.cos(this.degToRad(lat2)) *
          Math.sin(dLng / 2) *
          Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    degToRad(deg) {
      return deg * (Math.PI / 180);
    },
  },
};
</script>




<template>
  <div>
    <header>
      <!-- 頁頭（導航欄） -->
      <div class="flex flex-wrap items-center justify-between p-2 space-y-2 bg-transparent md:space-y-0">
        <!-- LOGO -->
        <router-link to="/"><img src="../assets/logo.jpg" alt="Logo" class="w-[130px]"></router-link>
        <!-- 主選單 -->
          <div class="items-center md:flex main-menu">
            <button  class="p-2 mr-4 rounded-md text-amber-500 hover:bg-amber-100 min-w-20" @click="openLoginModal">點擊登入</button>
            <Login :visible="showLoginModal" @close="closeLoginModal" />
            <a href="#" class="p-2 mr-4 rounded-md text-amber-500 hover:bg-amber-100 min-w-20">發表食記</a>
            <a href="#" class="p-2 mr-4 rounded-md text-amber-500 hover:bg-amber-100 min-w-20">專欄文章</a>
            <!-- 店家專區的下拉選單 -->
            <div class="relative inline-block text-left group">
                <button class="p-2 mr-4 rounded-md text-amber-500 hover:bg-amber-100 focus:outline-none min-w-20">
                    店家專區
                    <span>&#x25BC;</span>
                </button>
                <div class="absolute z-10 hidden w-32 mt-0 bg-white rounded-md shadow-md group-hover:block">
                    <ul class="mt-2">
                    <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">店家加入</a></li>
                    <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">行銷方案</a></li>
                    <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100 rounded-bl-md rounded-br-md">邀請部落客</a></li>
                    </ul>
                </div>
                </div>
                <!-- 排行榜的下拉選單 -->
                <div class="relative inline-block text-left group">
                  <button class="p-2 mr-4 rounded-md text-amber-500 hover:bg-amber-100 focus:outline-none min-w-20">
                      排行榜
                      <span>&#x25BC;</span>
                  </button>
                <div class="absolute z-10 hidden w-32 mt-0 bg-white rounded-md shadow-md group-hover:block">
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
              <SearchInput />
              <button @click="toggleMenu" class="text-amber-500 focus:outline-none">
              <font-awesome-icon :icon="['fas', 'bars']" class="w-6 h-6" />
              </button>
          </div>
          <!-- 小螢幕的下拉選單 -->
          <div v-if="isMenuOpen" class="absolute z-50 w-48 bg-white rounded-md shadow-md top-16 right-4">
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
              <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100 rounded-bl-md rounded-br-md">登出</a></li>
            </ul>
          </div>
        </div>
        <!-- 下拉end -->
      </div>
    </header>
      <!-- 搜尋區塊 -->
      <div class="relative flex flex-col items-center justify-center w-screen m-auto text-center bg-top bg-no-repeat bg-cover h-96 bg-index_searchBG"
      aria-label="Photo by Ivan Torres on Unsplash">
        <div class="absolute inset-0 bg-gray-800 opacity-40"></div>
          <h1 class="z-10 px-3 mt-8 text-3xl text-white md:text-5xl text-bold">想知道哪裡有美食？</h1>
          <h2 class="z-10 px-3 mt-5 text-lg text-white md:text-xl text-bold">從超過 50,000 家精選餐廳中，探索您不知道的熱門美食。</h2>
          <!-- 搜尋欄容器 -->
          <div class="z-10 hidden md:flex items-center mt-10 bg-white rounded-full h-11 ">
             <SearchInput />
          </div>
      </div>
      <!-- 餐廳分類按鈕 -->
      <StoreType/>
    <!-- content end -->
  </div>
</template>

<style scoped>
/* 如果需要自定義一些額外樣式可以在這裡加入 */

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