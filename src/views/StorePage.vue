<script setup>
import { onMounted, ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore } from '../stores/storePage';
import StoreComment from '../components/storeComment/StoreComment.vue'
import Header from "../components/Header.vue";
import StoreType from '../components/HomePage/StoreType.vue';
import SearchTag from '../components/SearchTag.vue';
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

// Store 初始化
const restaurantStore = useStore();

// 從 store 中解構需要的屬性
const {
    storeName,
    rating,
    userRatingCount,
    startPrice,
    endPrice,
    weekdayDescriptions,
    formattedAddress,
    websiteUri,
    nationalPhoneNumber,
    googleMapsUri,
    openNow,
    storePhoto,
    bannerPhoto,
    similarRestaurants,
    recommendedRestaurants,
    staticMapUrl,
} = storeToRefs(restaurantStore);

// 下拉選單狀態
const isDropdownVisible = ref(false);

// 頁面載入時的初始化
onMounted(async () => {
    try {
        await restaurantStore.fetchPlaceDetail();
        console.log('Place details fetched');
        
        await restaurantStore.fetchStorePhoto();
        console.log('storePhoto fetched');

        await restaurantStore.fetchBannerPhoto();
        console.log('bannerPhoto fetched')
        
        await restaurantStore.fetchSimilarRestaurants();
        console.log('similarRestaurants fetched');

        await restaurantStore.fetchRecommendedRestaurants();
        console.log('recommendedRestaurants fetched');
        
        await restaurantStore.fetchSearchTopics();
        console.log('Search topics fetched');
        
    } catch (error) {
        console.error('數據載入錯誤：', error);
    }
});

// 點擊頁面其他地方時隱藏下拉選單
function handleDocumentClick(event) {
    const button = document.getElementById('dropdownButton');
    const menu = document.getElementById('dropdownMenu');
    
    if (!button || !menu) return;

    if (!button.contains(event.target) && !menu.contains(event.target)) {
        isDropdownVisible.value = false;
    }
}

document.addEventListener('click', handleDocumentClick);
</script>

<template>
    <div>
        <Header/>
        <!-- 橫幅圖片區 -->
        <div class="relative">
            <img v-if="bannerPhoto" :src="bannerPhoto" alt="Banner" class="object-cover w-full h-48">
            <img v-else src="../assets/logo.jpg" alt="Banner" class="object-cover w-full h-48">
        </div>

        <!-- 導航標籤 -->
        <nav class="flex items-center px-4 space-x-4 overflow-x-auto bg-white shadow md:overflow-visible">
            <button class="px-4 py-4 font-bold border-b-2 border-transparent text-amber-500 hover:border-amber-500 whitespace-nowrap">總覽</button>
            <button class="px-4 py-4 font-bold border-b-2 border-transparent text-amber-500 hover:border-amber-500 whitespace-nowrap">照片</button>
            <button class="px-4 py-4 font-bold border-b-2 border-transparent text-amber-500 hover:border-amber-500 whitespace-nowrap">菜單</button>
            <button class="px-4 py-4 font-bold border-b-2 border-transparent text-amber-500 hover:border-amber-500 whitespace-nowrap">評論</button>
            <button class="px-4 py-4 font-bold border-b-2 border-transparent text-amber-500 hover:border-amber-500 whitespace-nowrap">更多餐廳</button>
        </nav>

        <!-- 主要內容區 -->
        <div class="w-full max-w-[1024px] mx-auto bg-white mt-14 px-4 md:px-6 py-4">
            <!-- 店家基本資訊 -->
            <div class="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-y-0 md:space-x-4">
                <img :src="storePhoto" alt="Store Thumbnail" class="object-cover w-40 h-32 rounded-lg">
                <div class="space-y-2 text-center md:text-left">
                    <h2 class="py-1 text-3xl font-black text-gray-700">{{ storeName }}</h2>
                    <div class="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                        <span class="px-2 py-1 rounded text-yellow-50 bg-amber-500">{{ rating }} ★</span>
                        <a href="#"><span class="text-gray-400">{{ userRatingCount }}則評論</span></a>
                    </div>
                    <div class="flex flex-wrap justify-center gap-3 py-2 md:justify-start">
                        <a class="text-black rounded">均消價位：{{ `${startPrice}-${endPrice}` }}元</a>
                        <a href="#" class="text-blue-400 rounded"><font-awesome-icon :icon="['fas', 'star']" />找相似餐廳</a>
                        <a href="#" class="hover:text-amber-500">火鍋</a>
                        <a href="#" class="hover:text-amber-500">日本料理</a>
                        <a href="#" class="hover:text-amber-500">咖哩</a>
                        <a href="#" class="hover:text-amber-500">合菜</a>
                    </div>
                </div>
            </div>

            <!-- 店家詳情區 -->
            <div class="flex items-center mt-10 space-x-4">
                <!-- 地圖和評價 -->
                <div class="flex flex-col">
                    <a :href="googleMapsUri" target="_blank" class="cursor-pointer hover:opacity-90">
                        <img :src="staticMapUrl" alt="formattedAddress" class="object-cover w-40 h-40 rounded-lg">
                    </a>
                    <a :href="googleMapsUri" target="_blank" class="cursor-pointer hover:opacity-90">
                        <div class="w-40 mt-2">
                            <div class="flex items-center justify-center py-1 mb-1 rounded bg-amber-500">
                                <font-awesome-icon :icon="['fab', 'google']" class="w-4 h-4 mr-1 text-blue-600"/>
                                <div class="flex items-center">
                                    <span class="text-sm">評價:</span>
                                    <span class="text-sm text-gray-500">{{ userRatingCount }}+</span>
                                </div>
                            </div>   
                        </div>
                    </a>
                </div>

                <!-- 店家資訊 -->
                <div class="space-y-2">
                    <!-- 營業時間下拉選單 -->
                    <div class="relative inline-block ml-12">
                        <button 
                            id="dropdownButton" 
                            class="p-2 font-bold rounded-md text-amber-500 hover:bg-amber-100 focus:outline-none"
                            @click="isDropdownVisible = !isDropdownVisible">
                            {{ openNow? "目前營業中":"目前休息中" }}
                            <span class="ml-1">&#x25BC;</span>
                        </button>
                        <div 
                            id="dropdownMenu" 
                            v-if="isDropdownVisible"
                            class="absolute z-10 w-48 transform -translate-x-1/2 bg-white rounded-md shadow-lg left-1/2"
                        >
                            <ul class="mt-1">
                                <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">{{ weekdayDescriptions[0] }}</a></li>
                                <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">{{ weekdayDescriptions[1] }}</a></li>
                                <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">{{ weekdayDescriptions[2] }}</a></li>
                                <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">{{ weekdayDescriptions[3] }}</a></li>
                                <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">{{ weekdayDescriptions[4] }}</a></li>
                                <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">{{ weekdayDescriptions[5] }}</a></li>
                                <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100 rounded-bl-md rounded-br-md">{{ weekdayDescriptions[6] }}</a></li>
                            </ul>
                        </div>
                    </div>
                    <p>店家地址 | {{ formattedAddress }}</p>
                    <p>均消價位 | {{ `${startPrice}-${endPrice}` }}元</p>
                    <p>訂位電話 | {{ nationalPhoneNumber }}</p>
                    <a :href="websiteUri">
                        <button class="p-2 mt-6 mr-4 rounded-lg shadow"><font-awesome-icon :icon="['fas', 'calendar-week']" class="w-5 h-5 mr-2 text-amber-500" />相關連結</button>
                    </a>
                    <button class="p-2 mt-6 mr-4 rounded-lg shadow"><font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" class="w-5 h-5 mr-2 text-amber-500"/>分享餐廳</button>
                    <a :href="googleMapsUri">
                        <button class="p-2 mt-6 rounded-lg shadow"><font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" class="w-5 h-5 mr-2 text-amber-500"/>google評價</button>
                    </a>
                </div>
            </div>

            <!-- 店家評論 -->
            <StoreComment/>
            <!-- 相似餐廳區 -->
             <div class="md:w-[800px] mx-auto">

                 <div class="mt-10 text-gray-700 md:w-[800px] mx-auto">
                     <h3 class="mb-2 text-2xl font-bold">{{ storeName }} 的相似餐廳</h3>
                     <div v-if="similarRestaurants && similarRestaurants.length" class="relative">
                         <Carousel 
                             :items-to-show="3"
                             :wrap-around="true"
                             :transition="500"
                             snap-align="center"
                             :itemsToScroll="3"
                             :mouseDrag="true"
                             class="flex justify-center"
                         >
                             <Slide 
                                 v-for="restaurant in similarRestaurants.slice(0, 15)" 
                                 :key="restaurant.place_id"
                                 class="flex-shrink-0 px-1"
                             >
                                 <div class="bg-white rounded-lg shadow-md mb-4 max-w-[250px]">
                                     <div class="overflow-hidden">
                                         <img 
                                             v-if="restaurant?.photoUrl" 
                                             :src="restaurant.photoUrl" 
                                             :alt="restaurant.name" 
                                             class="object-cover w-[250px] h-[160px] rounded-t-lg" 
                                         />
                                     </div>
                                     <div class="p-4">
                                         <h4 class="text-lg font-bold truncate max-md:text-center">{{ restaurant?.name }}</h4>
                                         <div class="flex flex-col items-center justify-between gap-2 mt-2 md:flex-row">
                                             <p class="px-2 text-center text-white rounded-full bg-amber-500 w-fit">
                                                 評分: {{ restaurant?.rating }}★
                                             </p>
                                             <p class="text-sm text-gray-400">
                                                 {{ restaurant?.userRatingCount }}則評論
                                             </p>
                                         </div>
                                     </div>
                                 </div>
                             </Slide>
                             
                             <template #addons>
                                 <Navigation />
                             </template>
                         </Carousel>
                     </div>
     
                     <!-- 如果沒有數據顯示加載狀態 -->
                     <div v-else class="py-4 text-center">
                         正在加載餐廳資料...
                     </div>
                 </div>
             </div>



            <!-- 推薦餐廳部分 -->
            <div class="mt-10 text-gray-700 md:w-[800px] mx-auto">
                <h3 class="mb-2 text-2xl font-bold">推薦餐廳</h3>
                <div v-if="recommendedRestaurants && recommendedRestaurants.length" class="relative">
                    <Carousel 
                        :items-to-show="3"
                        :wrap-around="true"
                        :transition="500"
                        snap-align="center"
                        :itemsToScroll="3"
                        :mouseDrag="true"
                        class="flex justify-center"
                    >
                        <Slide 
                            v-for="restaurant in recommendedRestaurants" 
                            :key="restaurant.place_id"
                            class="flex-shrink-0 px-1"
                        >
                            <div class="bg-white rounded-lg shadow-md mb-4 max-w-[250px]">
                                <div class="overflow-hidden">
                                    <img 
                                        v-if="restaurant?.photoUrl" 
                                        :src="restaurant.photoUrl" 
                                        :alt="restaurant.name" 
                                        class="object-cover w-[250px] h-[160px] rounded-t-lg" 
                                    />
                                </div>
                                <div class="p-4">
                                    <h4 class="text-lg font-bold truncate max-md:text-center">{{ restaurant?.name }}</h4>
                                    <div class="flex flex-col items-center justify-between gap-2 mt-2 md:flex-row">
                                        <p class="px-2 text-center text-white rounded-full bg-amber-500 w-fit">
                                            評分: {{ restaurant?.rating }}★
                                        </p>
                                        <p class="text-sm text-gray-400">
                                            {{ restaurant?.userRatingCount }}則評論
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Slide>
                        
                        <template #addons>
                            <Navigation />
                        </template>
                    </Carousel>
                </div>

                <!-- 如果沒有數據顯示加載狀態 -->
                <div v-else class="py-4 text-center">
                    正在加載餐廳資料...
                </div>
            </div>

            <!-- 搜尋相關主題 -->
            <SearchTag/>




        
            <!-- 地圖區域 -->
            <div class="mt-10 text-gray-700">
                <h3 class="mb-2 text-2xl font-bold">和牛涮 日式鍋物放題 台南中華西店 的食記</h3>
            </div>
            <!-- 熱門餐廳分類 -->
            <div class="mt-10 text-gray-700">
                <StoreType/>
            </div>
        </div>
    </div>
</template>


<style scoped>
.carousel__item {
  width: 100%;
}

.carousel__slide {
  width: 100%;
}

/* 自訂導航按鈕樣式 */
.carousel__prev,
.carousel__next {
  background-color: rgb(245 158 11);
  color: white;
  border-radius: 9999px;
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 1;
}

.carousel__prev {
  left: -3rem;
}

.carousel__next {
  right: -2.5rem;
}

.carousel__prev:hover,
.carousel__next:hover {
  background-color: rgb(217 119 6);
}


</style>
