<script>
import { ref, onMounted, onUnmounted } from "vue";
import loader from "./googleMapsLoader.js";

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
  setup() {
    // 控制選單開關的狀態
    const isMenuOpen = ref(false);

    const toggleMenu = () => {
      isMenuOpen.value = !isMenuOpen.value;
    };

    const checkScreenWidth = () => {
      if (window.innerWidth > 768) {
        isMenuOpen.value = false; // 自動關閉選單
      }
    };

    // 在元件掛載和卸載時設置和移除事件監聽器
    onMounted(() => {
      window.addEventListener("resize", checkScreenWidth);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", checkScreenWidth);
    });

    return {
      isMenuOpen,
      toggleMenu,
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
    <!-- 頁頭（導航欄） -->
    <header class="p-2 flex justify-between items-center flex-wrap space-y-2 md:space-y-0 space-x-4 border-b border-orange-200">
        <!-- LOGO -->
        <a href="#"><img src="../assets/logo.jpg" alt="Logo" class="w-[130px]"></a>
        <!-- 搜尋欄容器 -->
        <div class="hidden md:flex items-center px-4 bg-white rounded-full shadow-sm border border-gray-200 space-x-2 h-11 ml-52 " >
            <input
            type="text"
            v-model="keyword"
            id="keyword"
            placeholder="美食分類、餐廳"
            class=" flex-1  py-2 outline-none text-gray-600 placeholder-gray-400 "
            />
            <!-- 餐具圖標 -->
            <font-awesome-icon :icon="['fas', 'utensils']" class="text-amber-500 w-5 h-5" />
            <div class="h-full border-l border-gray-300 mx-2 -my-2"></div>
    
            <!-- 城市選擇按鈕 -->
            <div class="flex items-center space-x-1 bg-amber-100 text-amber-500 rounded-full px-3 py-1">
                <!-- <span class=" min-w-16">台南市</span>
                <button class="text-sm focus:outline-none">&times;</button> -->
                <select v-model="selectedDistrict" id="district">
                    <option v-for="(coords, district) in districts" :key="district" :value="district">
                      {{ district }}
                    </option>
                  </select>
            </div>
            <!-- 地點圖標 -->
            <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="text-amber-500 w-5 h-5" />
            <!-- 搜索按鈕 -->
            <button class="bg-amber-500 text-white py-1 px-4 rounded-full shadow-md focus:outline-none ml-52" @click="searchPlaces">
                <font-awesome-icon :icon="['fas', 'search']" class="w-4 h-4" />
            </button>
        </div>
        <!-- 主選單 -->
        <div class="md:flex items-center space-x-4 main-menu">
            <a href="#" class="text-amber-500 hover:bg-amber-100 rounded-md p-2 min-w-20">發表食記</a>
            <a href="#" class="text-amber-500 hover:bg-amber-100 rounded-md p-2 min-w-20">專欄文章</a>
            <!-- 店家專區的下拉選單 -->
            <div class="relative group inline-block text-left">
                <button class="text-amber-500 rounded-md hover:bg-amber-100 p-2 focus:outline-none min-w-20">
                    店家專區
                    <span>&#x25BC;</span>
                </button>
                <div class="absolute hidden group-hover:block mt-0 w-48 bg-white rounded-md shadow-lg z-10">
                    <ul class="mt-2">
                    <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">店家加入</a></li>
                    <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">行銷方案</a></li>
                    <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100 rounded-bl-md rounded-br-md">邀請部落客</a></li>
                    </ul>
                </div>
            </div>
            <!-- 排行榜的下拉選單 -->
            <div class="relative group inline-block text-left">
                <button class="text-amber-500 rounded-md hover:bg-amber-100 p-2 focus:outline-none min-w-20">
                    排行榜
                    <span>&#x25BC;</span>
                </button>
                <div class="absolute hidden group-hover:block mt-0 w-48 bg-white rounded-md shadow-lg z-10">
                    <ul class="mt-2">
                    <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">週排行</a></li>
                    <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100 rounded-bl-md rounded-br-md">月排行</a></li>
                    </ul>
                </div>
            </div>
        </div>
        <!-- 主選單：小於 768px 顯示為漢堡圖標 -->
        <div class="md:hidden flex items-center space-x-4 hamburger-menu">
            <a href="#"><font-awesome-icon :icon="['fas', 'magnifying-glass']" class="text-amber-500 w-5 h-5" /></a>
            <button @click="toggleMenu" class="text-amber-500 focus:outline-none">
            <font-awesome-icon :icon="['fas', 'bars']" class="w-6 h-6" />
            </button>
        </div>
        <!-- 小螢幕的下拉選單 -->
        <div v-if="isMenuOpen" class="absolute top-16 right-4 w-48 bg-white shadow-md rounded-lg z-50">
            <ul class="flex flex-col mt-2">
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