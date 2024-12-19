<script setup>
import { onMounted, ref, computed, watch, onUnmounted  } from 'vue';
import { storeToRefs } from 'pinia';
import { useStore } from '../stores/storePage';
import StoreComment from '../components/storeComment/StoreComment.vue'
import Header from "../components/Header.vue";
import StoreType from '../components/HomePage/StoreType.vue';
import SearchTag from '../components/SearchTag.vue';

const restaurantStore = useStore();
onMounted(async () => {
    try {
        restaurantStore.initializeWindowListener();
        
        console.log('Fetching data...'); // 添加日誌
        
        await restaurantStore.fetchPlaceDetail();
        console.log('Place details fetched');
        
        await restaurantStore.fetchStorePhoto();
        console.log('storePhoto fetched');

        await restaurantStore.fetchBannerPhoto();
        console.log('bannerPhoto fetched')
        
        await restaurantStore.fetchSimilarRestaurants(
            import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            "25.0443785,121.5467236",
            1000
        );
        console.log('Similar restaurants fetched');
        
        await restaurantStore.fetchRecommendedRestaurants(
            import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            "25.0443785,121.5467236",
            1000
        );
        
        currentGroupSize.value = getInitialGroupSize();
        window.addEventListener('resize', handleResize);

        console.log('Recommended restaurants fetched');
        
        await restaurantStore.fetchSearchTopics();
        console.log('Search topics fetched');
        
    } catch (error) {
        console.error('數據載入錯誤：', error);
    }
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
});

const {
    storeName,
    rating,
    userRatingCount,
    startPrice,
    endPrice,
    weekDayDescriptions,
    formattedAddress,
    websiteUri,
    nationalPhoneNumber,
    googleMapsUri,
    openNow,
    storePhoto,
    bannerPhoto,
    // 相似餐廳相關
    similarRestaurants,
    currentGroupIndex,
    maxGroupIndex,
    displayRestaurants,
    groupSize,
    
    // 推薦餐廳相關
    recommendedRestaurants,
    recommendedGroupIndex,
    maxRecommendedGroupIndex,
    displayRecommendedRestaurants,
    
    // 靜態地圖
    staticMapUrl,
    
    searchTopics,
    fetchSearchTopics,
} = storeToRefs(restaurantStore);


const {
    nextGroup: handleNextGroup,
    prevGroup: handlePrevGroup,
    nextRecommendedGroup,
    prevRecommendedGroup
} = restaurantStore;


const currentGroupSize = ref(3); // 預設值
const stableGroups = ref([]);


// 監聽視窗大小變化
function handleResize() {
  const newGroupSize = getInitialGroupSize();
  if (newGroupSize !== currentGroupSize.value) {
    currentGroupSize.value = newGroupSize;
    // 重新分組但保持當前頁的相對位置
    const currentFirstItem = recommendedGroupIndex.value * currentGroupSize.value;
    createStableGroups(recommendedRestaurants.value);
    // 計算新的分組索引
    recommendedGroupIndex.value = Math.floor(currentFirstItem / newGroupSize);
  }
}

// 計算當前要顯示的餐廳組
const currentDisplayGroup = computed(() => {
  return stableGroups.value[recommendedGroupIndex.value] || [];
});

// 監聽原始數據變化，重新進行分組
watch([() => recommendedRestaurants.value, currentGroupSize], ([newRestaurants]) => {
  if (newRestaurants && newRestaurants.length > 0) {
    createStableGroups(newRestaurants);
  }
}, { immediate: true });

// 創建固定的分組
const createStableGroups = (restaurants) => {
  const groups = [];
  for (let i = 0; i < restaurants.length; i += currentGroupSize.value) {
    groups.push(restaurants.slice(i, i + currentGroupSize.value));
  }
  stableGroups.value = groups;
};



// 根據螢幕寬度決定每組顯示數量
function getInitialGroupSize() {
  if (window.innerWidth < 768) {  // mobile
    return 2;
  } else if (window.innerWidth < 1024) {  // tablet
    return 3;
  } else {  // desktop
    return 3;
  }
}


// 同樣為推薦餐廳添加處理函數
const handlePrevRecommendedGroup = () => {
  if (recommendedGroupIndex.value <= 0) {
    recommendedGroupIndex.value = maxRecommendedGroupIndex.value;
  } else {
    recommendedGroupIndex.value--;
  }
};

const handleNextRecommendedGroup = () => {
  if (recommendedGroupIndex.value >= maxRecommendedGroupIndex.value) {
    recommendedGroupIndex.value = 0;
  } else {
    recommendedGroupIndex.value++;
  }
};




const isDropdownVisible = ref(false);

// 用於點擊頁面其他地方時隱藏下拉選單
function handleDocumentClick(event) {
    const button = document.getElementById('dropdownButton');
    const menu = document.getElementById('dropdownMenu');
    if (!button || !menu) {
        return; // 如果元素不存在，直接退出函數
    }

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
        <div class="relative w-full h-48">
            <img 
                v-if="bannerPhoto" 
                :src="bannerPhoto" 
                alt="Banner" 
                class="object-cover w-full h-full"
            />
            <img 
                v-else 
                src="../assets/logo.jpg" 
                alt="Banner" 
                class="object-cover w-full h-full"
            />
            <div class="absolute top-0 left-0 w-full h-full bg-gray-800 opacity-25"></div>
        </div>

        <!-- 導航標籤 -->
        <nav class="flex items-center px-4 space-x-4 overflow-x-auto bg-white shadow md:overflow-visible">
            <button class="px-4 py-4 font-bold border-b-2 border-transparent text-amber-500 hover:border-amber-500 whitespace-nowrap">總覽</button>
            <button class="px-4 py-4 font-bold border-b-2 border-transparent text-amber-500 hover:border-amber-500 whitespace-nowrap">照片</button>
            <button class="px-4 py-4 font-bold border-b-2 border-transparent text-amber-500 hover:border-amber-500 whitespace-nowrap">菜單</button>
            <button class="px-4 py-4 font-bold border-b-2 border-transparent text-amber-500 hover:border-amber-500 whitespace-nowrap">評論</button>
            <button class="px-4 py-4 font-bold border-b-2 border-transparent text-amber-500 hover:border-amber-500 whitespace-nowrap">更多餐廳</button>
        </nav>
        <!-- 店家資訊區 -->
        <div class="w-full max-w-[1024px] mx-auto bg-white mt-14 px-4 md:px-6 py-4">
            <div class="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-y-0 md:space-x-4">
                <img :src="storePhoto" alt="Store Thumbnail" class="object-cover w-40 h-32 rounded-lg ">
                <div class="space-y-2 text-center md:text-left">
                    <h2 class="py-1 text-3xl font-black text-gray-700">{{ storeName }}</h2>
                    <div class="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                        <span class="px-2 py-1 rounded text-yellow-50 bg-amber-500">{{ rating }} ★</span>
                        <a href="#"><span class="text-gray-400">{{ userRatingCount }}則評論</span></a>
                    </div>
                    <div class="flex flex-wrap justify-center gap-3 py-2 md:justify-start">
                        <a v-if="startPrice != null && endPrice != null" class="text-black rounded ">均消價位：{{ `${startPrice}-${endPrice}` }}元</a>
                        <a v-else class="text-black rounded ">均消價位：未提供</a>
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
                <div flex flex-col >
                    <a :href="googleMapsUri" target="_blank" class="cursor-pointer hover:opacity-90">
                        <img :src="staticMapUrl" alt="formattedAddress" class="object-cover w-40 h-40 rounded-lg">
                    </a>
                    <!-- 評價部分 -->
                    <a :href="googleMapsUri" target="_blank" class="cursor-pointer hover:opacity-90">
                        <div class="w-40 mt-2">
                            <div class="flex items-center justify-center py-1 mb-1 rounded bg-amber-500 ">
                                <font-awesome-icon :icon="['fab', 'google']" class="w-4 h-4 mr-1 text-blue-600"/>
                                <div class="flex items-center">
                                    <span class="text-sm">評價:</span>
                                    <span class="text-sm text-gray-500">{{ userRatingCount }}+</span>
                                </div>
                            </div>   
                        </div>
                    </a>
                </div>
                <div class="space-y-2">
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
                            <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">{{ weekDayDescriptions[0] }}</a></li>
                            <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">{{ weekDayDescriptions[1] }}</a></li>
                            <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">{{ weekDayDescriptions[2] }}</a></li>
                            <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">{{ weekDayDescriptions[3] }}</a></li>
                            <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">{{ weekDayDescriptions[4] }}</a></li>
                            <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">{{ weekDayDescriptions[5] }}</a></li>
                            <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100 rounded-bl-md rounded-br-md">{{ weekDayDescriptions[6] }}</a></li>
                            </ul>
                        </div>
                    </div>
                    <p>店家地址 | {{ formattedAddress }}</p>
                    <p v-if="startPrice != null && endPrice != null">均消價位 | {{ `${startPrice}-${endPrice}` }}元</p>
                    <p v-else>均消價位 | 未提供</p>
                    <p >訂位電話 | {{ nationalPhoneNumber != null ? nationalPhoneNumber : '未提供' }}</p>
                    <a v-if="websiteUri" :href="websiteUri">
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
                <div class="mt-10 text-gray-700 md:w-[900px] mx-auto">
                    <h3 class="mb-2 text-2xl font-bold">{{ storeName }} 的相似餐廳</h3>
                    <div v-if="displayRestaurants && displayRestaurants.length" class="flex items-center justify-center space-x-4">
                        <!-- 左側切換按鈕 -->
                        <button @click="handlePrevGroup" class="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                            ←
                        </button>

                        <!-- 餐廳展示區 -->
                        <div class="relative w-full overflow-hidden">
                            <transition-group name="slide" tag="div" class="flex">
                                <div v-for="(restaurant, index) in displayRestaurants" :key="restaurant.uniqueId || index" class="flex-shrink-0 w-1/2 px-2 md:w-1/3">
                                    <div class="bg-white rounded-lg shadow-md mb-4 max-w-[250px] mx-auto">
                                        <div class="h-40 overflow-hidden">
                                            <img v-if="restaurant?.photoUrl" :src="restaurant.photoUrl" :alt="restaurant.name" class="object-cover w-full h-40 rounded-t-lg" />
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
                                </div>
                            </transition-group>
                        </div>

                        <!-- 右側切換按鈕 -->
                        <button @click="handleNextGroup" class="p-2 bg-gray-200 rounded-full hover:bg-gray-300">
                            →
                        </button>
                    </div>

                    <!-- 如果沒有數據顯示加載狀態 -->
                    <div v-else class="py-4 text-center">
                        正在加載餐廳資料...
                    </div>

                    <!-- 頁碼指示器 -->
                    <div v-if="displayRestaurants && displayRestaurants.length" class="flex justify-center mt-4 space-x-2">
                        <div v-for="index in (maxGroupIndex + 1)" :key="index" :class="['w-2 h-2 rounded-full cursor-pointer', currentGroupIndex === index - 1 ? 'bg-amber-500' : 'bg-gray-300']" @click="currentGroupIndex = index - 1"></div>
                    </div>
                </div>



                <!-- 推薦餐廳部分 -->
                <div class="mt-10 text-gray-700 md:w-[900px] mx-auto">
                    <h3 class="mb-2 text-2xl font-bold">推薦餐廳</h3>
                    
                    <div v-if="currentDisplayGroup.length" class="flex items-center justify-center space-x-4">
                    <!-- 左側切換按鈕 -->
                    <button 
                    @click="handlePrevRecommendedGroup"
                    class="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                    ←
                    </button>

                    <!-- 餐廳展示區 -->
                    <div class="relative w-full overflow-hidden">
                        <transition-group name="slide" tag="div" class="flex justify-center">
                        <div 
                            v-for="restaurant in currentDisplayGroup" 
                            :key="restaurant.uniqueId || restaurant.name" 
                            :class="[
                            'flex-shrink-0 px-2',
                            currentGroupSize === 2 ? 'w-1/2' : 'w-1/3'
                            ]"
                        >
                            <div class="bg-white rounded-lg shadow-md mb-4 max-w-[250px] mx-auto">
                            <div class="h-40 overflow-hidden">
                                <img 
                                v-if="restaurant?.photoUrl" 
                                :src="restaurant.photoUrl" 
                                :alt="restaurant.name" 
                                class="object-cover w-full h-40 rounded-t-lg"
                                />
                            </div>
                            <div class="p-4">
                                <h4 class="text-lg font-bold truncate max-md:text-center">
                                {{ restaurant?.name }}
                                </h4>
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
                        </div>
                        </transition-group>
                    </div>

                    <!-- 右側切換按鈕 -->
                    <button 
                    @click="handleNextRecommendedGroup"  
                    class="p-2 bg-gray-200 rounded-full hover:bg-gray-300"
                    >
                    →
                    </button>
                </div>

                    <!-- 加載狀態 -->
                    <div v-else class="py-4 text-center">
                    正在加載餐廳資料...
                    </div>

                    <!-- 分頁指示器 -->
                    <div 
                    v-if="stableGroups.length > 0" 
                    class="flex justify-center mt-4 space-x-2"
                    >
                    <div
                    v-for="(_, index) in stableGroups"
                    :key="index"
                    :class="[
                        'w-2 h-2 rounded-full cursor-pointer',
                        recommendedGroupIndex === index ? 'bg-amber-500' : 'bg-gray-300'
                    ]"
                    @click="recommendedGroupIndex = index"
                    />
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


.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-enter-from {
    transform: translateX(100%);
    opacity: 0;
}
.slide-enter-to {
    transform: translateX(0%);
    opacity: 1;
}
.slide-leave-from {
    transform: translateX(0%);
    opacity: 1;
}
.slide-leave-to {
    transform: translateX(-100%);
    opacity: 0;
}


</style>
