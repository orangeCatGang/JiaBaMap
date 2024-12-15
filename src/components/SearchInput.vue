<script setup>
  // import { ref, reactive, computed, watch } from "vue";
  // import loader from "../components/googleMapsLoader.js";
  // import { useRouter, useRoute } from "vue-router";
  // import debounce from 'lodash/debounce';  
  
  // // Local Storage 工具方法
  // const localStorageUtil = {
  //   set(key, value) {
  //     localStorage.setItem(key, JSON.stringify(value));
  //     window.dispatchEvent(new Event("places-updated"));
  //   },
  //   get(key) {
  //     const value = localStorage.getItem(key);
  //     return value ? JSON.parse(value) : null;
  //   },
  // };

  // const updateLocalStorage = (placesData, sortOrderData, locationData) => {
  //   localStorageUtil.set("places", placesData);
  //   localStorageUtil.set("sortOrder", sortOrderData);
  //   localStorageUtil.set("location", locationData);
  // }

  // export default {
  //   setup() {    
  //     // 搜尋功能
  //     const route = useRoute();
  //     const router = useRouter();
  //     const keyword = ref("");
  //     const selectedDistrict = ref("大安區");
  //     const sortOrder = ref("default");
  //     const searched = ref(false);
  //     const places = ref([]);
  //     const userLocation = ref(null);
  //     const isLocating = ref(false);
  //     //搜尋範圍
  //     const districts = reactive({
  //       "我的位置": null,
  //       "中正區": { lat: 25.032404, lng: 121.519033 },
  //       "大同區": { lat: 25.063093, lng: 121.513305 },
  //       "中山區": { lat: 25.0685, lng: 121.5266 },
  //       "松山區": { lat: 25.0585, lng: 121.5585 },
  //       "大安區": { lat: 25.033976, lng: 121.543459 },
  //       "萬華區": { lat: 25.0354, lng: 121.4997 },
  //       "信義區": { lat: 25.0306, lng: 121.5701 },
  //       "士林區": { lat: 25.0922, lng: 121.5245 },
  //       "北投區": { lat: 25.1321, lng: 121.4987 },
  //       "內湖區": { lat: 25.083, lng: 121.5868 },
  //       "南港區": { lat: 25.0553, lng: 121.6171 },
  //       "文山區": { lat: 24.9987, lng: 121.5549 },
  //     });

  //     //排序
  //     const sortedPlaces = computed(() => {
  //       if (sortOrder.value === "distance") {
  //         return [...places.value].sort((a, b) => (a.distance || 0) - (b.distance || 0));
  //       } else if (sortOrder.value === "rating") {
  //         return [...places.value].sort((a, b) => (b.rating || 0) - (a.rating || 0));
  //       } else if (sortOrder.value === "reviews") {
  //         return [...places.value].sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0));
  //       } else {
  //         return places.value;
  //       }
  //     });
  
      
  //     const calculateDistance = (lat1, lng1, lat2, lng2) => {
  //       const R = 6371;
  //       const dLat = degToRad(lat2 - lat1);
  //       const dLng = degToRad(lng2 - lng1);
  //       const a =
  //         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  //         Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  //       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //       return R * c;
  //     };
  
  //     const degToRad = (deg) => {
  //       return deg * (Math.PI / 180);
  //     };
      
  //     // 更新URL Query 
  //     const updateQuery = (newKeyword) => {
  //       router.push({
  //         name: "search", // 確保路由名稱正確
  //         query: { ...route.query, keyword: newKeyword },
  //       });
  //     };

  //     //"我的位置"定位
  //     const locateUser = () => {
  //       if(isLocating.value) return;
  //       isLocating.value = true;
       
  //       navigator.geolocation.getCurrentPosition(
  //         (position) => {
  //           userLocation.value = {
  //             lat: position.coords.latitude,
  //             lng: position.coords.longitude,
  //           };
  //           isLocating.value = false;
  //         },
  //         (error) => {
  //           console.error("定位失敗：", error.message);
  //           isLocating.value = false;
  //           alert("定位失敗，請檢查瀏覽器權限！");
  //         }
  //       );
  //     };
      
  //     //執行搜尋
  //     const debouncedSearchPlaces = debounce(async () => {
  //       places.value = [];
  //       searched.value = false;
  
  //       let lat, lng;
  //       if (selectedDistrict.value === "我的位置") {
  //     // 只有選擇「我的位置」時檢查 userLocation
  //     if (!userLocation.value) {
  //       alert("尚未取得您的位置，請允許定位後再試！");
  //       return;
  //     }
  //     lat = userLocation.value.lat;
  //     lng = userLocation.value.lng;
  //       } else {
  //     // 對於其他行政區，直接從 districts 中獲取座標
  //     const district = districts[selectedDistrict.value];
  //     if (!district) {
  //       alert("無效的地區選擇！");
  //       return;
  //     }
  //     lat = district.lat;
  //     lng = district.lng;
  //   }
  
  //   await loader.load();
  
  //   const service = new google.maps.places.PlacesService(document.createElement("div"));
  
  //   const request = {
  //     location: new google.maps.LatLng(lat, lng),
  //     radius: 1000,
  //     keyword: keyword.value,
  //   };
  
  //   service.nearbySearch(request, (results, status) => {
  //     if (status === google.maps.places.PlacesServiceStatus.OK) {
  //       places.value = results.map((place) => ({
  //         ...place,
  //         distance: calculateDistance(
  //           lat,
  //           lng,
  //           place.geometry.location.lat(),
  //           place.geometry.location.lng()
  //         ),
  //         photo:
  //           place.photos && place.photos[0]
  //             ? place.photos[0].getUrl({ maxWidth: 400 })
  //             : null,
  //       }));

  //       updateLocalStorage(places.value, sortOrder.value, { lat, lng});
  //     } else {
  //       console.error("搜尋失敗，狀態：", status);
  //     }
  
  //         searched.value = true;
  //       });
  //     }, 800);

  //   // enter 按鈕事件
  //  const handleEnterKey = async () => {
  //     if (!keyword.value || keyword.value == "") {
  //       alert("請輸入有效的關鍵字！");
  //       return;
  //     }

  //     debouncedUpdateQuery(keyword.value);
  //     await debouncedSearchPlaces(); 
  //   };

  //   const debouncedUpdateQuery = debounce(updateQuery, 1000);


  //   watch(selectedDistrict, (newDistrict) => {
  //     if (newDistrict === "我的位置") {
  //       locateUser();
  //     }
  //   });

  //     // 監聽 URL 的 keyword 變化
  //     watch(
  //   () => route.query.keyword,
  //   (newKeyword) => {
  //      if (newKeyword !== keyword.value) {
  //         keyword.value = newKeyword || "";
  //         debouncedSearchPlaces();
  //       }
  //    },
  //   { immediate: true }
  //   );


  
   
  
    
  //   return {
  //     keyword,
  //     selectedDistrict,
  //     sortOrder,
  //     searched,
  //     places,
  //     districts,
  //     sortedPlaces,
  //     userLocation,
  //     isLocating,
  //     locateUser,
  //     debouncedSearchPlaces,
  //     handleEnterKey
  //     };
  //   },
  // };
import { useKeywordStore } from '../stores/keywordStore.js'
import { computed } from 'vue'

const Search = useKeywordStore()

const keyword = computed( {
  get:() => Search.keyword,
  set:(value) => Search.setKeyword(value)
}) 
const handleEnterKey = Search.handleSearch

const selectedDistrict = computed({
  get: () => Search.selectedDistrict, 
  set: (value) => Search.selectDistrict(value) 
})
const districts = computed(() => Search.districts)



</script>


<template>
  <!-- 統一的搜尋框 -->
  <form
    class="flex items-center px-4 space-x-2 bg-white border rounded-full  shadow-sm border-amber-500 h-11 md:space-x-4"
    @submit.prevent="handleEnterKey">
    <!-- 輸入框 -->
     <div>
      <input
      type="text"
      v-model="keyword"
      id="keyword"
      placeholder="美食分類、餐廳"
      class="w-40 md:w-full text-amber-500 placeholder-amber-300 px-2 py-1 outline-none"
    />
     </div>
    
    <!-- 桌面版餐廳圖示 -->
    <font-awesome-icon :icon="['fas', 'utensils']" class="w-5 h-5 text-amber-500 md:block hidden" />
    
    <div class="h-full mx-2 -my-2 border-l border-gray-300"></div>

    <!-- 地區選擇框 (桌面版) -->
    <div class="hidden md:flex items-center space-x-1 border-[1.5px] border-amber-100 text-amber-500 rounded-full px-3 py-1">
      <select 
      class="outline-none" 
      v-model="selectedDistrict" 
      id="district"
      >
        <option class="bg-white" v-for="(coords, district) in districts" :key="district" :value="district">
          {{ district}}
        </option>
      </select>
    </div>
    
    <!-- 地圖圖示 -->
    <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="w-5 h-5 text-amber-500 md:block hidden" />
    
    <!-- 搜尋按鈕 -->
    <button
      class="px-4 py-1 text-white rounded-full shadow-md bg-amber-500 focus:outline-none ml-52 cursor-pointer">
      <font-awesome-icon :icon="['fas', 'search']" class="w-4 h-4" />
    </button>
  </form>
</template>
