<script>
  import { ref, reactive, computed, onMounted, onUnmounted, watch } from "vue";
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
      
      // 搜尋功能
      const keyword = ref("");
      const selectedDistrict = ref("大安區");
      const sortOrder = ref("default");
      const searched = ref(false);
      const places = ref([]);
      const userLocation = ref(null);
      const isLocating = ref(false);
      //搜尋範圍
      const districts = reactive({
        "我的位置": null,
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
      });
      //排序
      const sortedPlaces = computed(() => {
        if (sortOrder.value === "distance") {
          return [...places.value].sort((a, b) => (a.distance || 0) - (b.distance || 0));
        } else if (sortOrder.value === "rating") {
          return [...places.value].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        } else if (sortOrder.value === "reviews") {
          return [...places.value].sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0));
        } else {
          return places.value;
        }
      });
  
      
      const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371;
        const dLat = degToRad(lat2 - lat1);
        const dLng = degToRad(lng2 - lng1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };
  
      const degToRad = (deg) => {
        return deg * (Math.PI / 180);
      };
  
      //"我的位置"定位
      const locateUser = () => {
        isLocating.value = true;
  
        navigator.geolocation.getCurrentPosition(
          (position) => {
            userLocation.value = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            isLocating.value = false;
          },
          (error) => {
            console.error("定位失敗：", error.message);
            isLocating.value = false;
            alert("定位失敗，請檢查瀏覽器權限！");
          }
        );
      };
      
      //執行搜尋
      const searchPlaces = async () => {
        places.value = [];
        searched.value = false;
  
        if (!keyword.value.trim()) {
          alert("請輸入有效的關鍵字！");
          return;
        }
  
        let lat, lng;
        if (selectedDistrict.value === "我的位置") {
      // 只有選擇「我的位置」時檢查 userLocation
      if (!userLocation.value) {
        alert("尚未取得您的位置，請允許定位後再試！");
        return;
      }
      lat = userLocation.value.lat;
      lng = userLocation.value.lng;
    } else {
      // 對於其他行政區，直接從 districts 中獲取座標
      const district = districts[selectedDistrict.value];
      if (!district) {
        alert("無效的地區選擇！");
        return;
      }
      lat = district.lat;
      lng = district.lng;
    }
  
        await loader.load();
  
        const service = new google.maps.places.PlacesService(document.createElement("div"));
  
        const request = {
          location: new google.maps.LatLng(lat, lng),
          radius: 1000,
          keyword: keyword.value,
        };
  
        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            places.value = results.map((place) => ({
              ...place,
              distance: calculateDistance(
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
  
            localStorageUtil.set("places", places.value);
            localStorageUtil.set("sortOrder", sortOrder.value);
            localStorageUtil.set("districts", userLocation.value);
            localStorageUtil.set("districts", { lat, lng });
          } else {
            console.error("搜尋失敗，狀態：", status);
          }
  
          searched.value = true;
        });
      };
  
      watch(selectedDistrict, (newDistrict) => {
        if (newDistrict === "我的位置") {
          locateUser();
        }
      });
  
      
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
        keyword,
        selectedDistrict,
        sortOrder,
        searched,
        places,
        districts,
        sortedPlaces,
        userLocation,
        isLocating,
        locateUser,
        searchPlaces,
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
          <div class="items-center hidden px-4 space-x-2 bg-white border rounded-full shadow-sm md:flex border-amber-400 h-11 ml-52 " >
              <input
              type="text"
              v-model="keyword"
              id="keyword"
              @keydown.enter="searchPlaces"
              placeholder="美食分類、餐廳"
              class="flex-1 py-2 outline-none text-amber-500 placeholder-amber-300"
              />
              <!-- 餐具圖標 -->
              <font-awesome-icon :icon="['fas', 'utensils']" class="w-5 h-5 text-amber-500" />
              <div class="h-full mx-2 -my-2 border-l border-gray-300"></div>
      
              <!-- 城市選擇按鈕 -->
              <div class="flex items-center space-x-1 border-[1.5px]  border-amber-100 text-amber-500 rounded-full px-3 py-1">
                  <!-- <span class=" min-w-16">台南市</span>
                  <button class="text-sm focus:outline-none">&times;</button> -->
                  <select class="" v-model="selectedDistrict" id="district">
                      <option class="bg-white " v-for="(coords, district) in districts" :key="district" :value="district">
                        {{ district }}
                      </option>
                    </select>
              </div>
              <!-- 地點圖標 -->
              <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="w-5 h-5 text-amber-500" />
              <!-- 搜索按鈕 -->
              <button class="px-4 py-1 text-white rounded-full shadow-md bg-amber-500 focus:outline-none ml-52" @click="searchPlaces"
              >
                  <font-awesome-icon :icon="['fas', 'search']" class="w-4 h-4" />
              </button>
          </div>
          <!-- 主選單 -->
          <div class="items-center space-x-4 md:flex main-menu">
              <a href="#" class="p-2 rounded-md text-amber-500 hover:bg-amber-100 min-w-20">發表食記</a>
              <a href="#" class="p-2 rounded-md text-amber-500 hover:bg-amber-100 min-w-20">專欄文章</a>
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