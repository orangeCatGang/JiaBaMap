<script setup>
import { onMounted, ref, computed, watch  } from 'vue';
import { storeToRefs } from 'pinia';
import { useRestaurantStore } from '../stores/storePage';
import StoreComment from '../components/storeComment/StoreComment.vue'
import Header from "../components/Header.vue";


const restaurantStore = useRestaurantStore();
onMounted(async () => {
    try {
        restaurantStore.initializeWindowListener();
        
        console.log('Fetching data...'); // 添加日誌
        
        await restaurantStore.fetchPlaceDetail();
        console.log('Place details fetched');
        
        await restaurantStore.fetchPhotos();
        console.log('Photos fetched');
        
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
        console.log('Recommended restaurants fetched');
        
        await restaurantStore.fetchSearchTopics();
        console.log('Search topics fetched');
        
    } catch (error) {
        console.error('數據載入錯誤：', error);
    }
});

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
    nextGroup,
    prevGroup,
    nextRecommendedGroup,
    prevRecommendedGroup
} = restaurantStore;

// 添加事件處理函數
const handlePrevGroup = () => {
    if (currentGroupIndex.value <= 0) {
        currentGroupIndex.value = maxGroupIndex.value;
    } else {
        currentGroupIndex.value--;
    }
};

const handleNextGroup = () => {
    if (currentGroupIndex.value >= maxGroupIndex.value) {
        currentGroupIndex.value = 0;
    } else {
        currentGroupIndex.value++;
    }
};

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
            <img src="../assets/logo.jpg" alt="Banner" class="object-cover w-full h-48">
            <!-- <div class="absolute top-0 left-0 p-4 text-2xl text-white bg-black bg-opacity-50">
            和牛涮 日式鍋物放題 台南中華西店
            </div> -->
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
                        <a class="text-black rounded ">均消價位：{{ `${startPrice}-${endPrice}` }}元</a>
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
                        <div class="mt-2 w-40">
                            <div class="flex items-center mb-1 py-1 rounded bg-amber-500 justify-center ">
                                <font-awesome-icon :icon="['fab', 'google']" class="text-blue-600 w-4 h-4 mr-1"/>
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

                <!-- 相似餐廳 -->
            <div class="mt-10 text-gray-700 w-[900px] mx-auto">
                <h3 class="mb-2 text-2xl font-bold">{{ storeName }} 的相似餐廳</h3>
                <div class="flex items-center justify-center space-x-4">
                    <!-- 左側切換按鈕 -->
                    <button 
                        @click="handlePrevGroup"
                        class="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                    >
                        ←
                    </button>
                    <!-- 餐廳展示區 -->
                    <div class="relative w-full overflow-hidden">
                        <div 
                            class="flex transition-transform duration-500 ease-in-out"
                            :style="{ transform: `translateX(-${currentGroupIndex * 100}%)` }"
                        >
                            <div 
                                v-for="restaurant in displayRestaurants" 
                                :key="restaurant.place_id" 
                                class="flex-shrink-0 w-1/3 px-2"
                            >
                                <div class="bg-white rounded-lg shadow-md mb-4 w-[250px] mx-auto">
                                    <div class="h-40 overflow-hidden">
                                        <img 
                                            v-if="restaurant.photoUrl"
                                            :src="restaurant.photoUrl" 
                                            :alt="restaurant.name" 
                                            class="w-full h-40 object-cover rounded-t-lg"
                                        >
                                    </div>
                                    <div class="p-4">
                                        <h4 class="font-bold text-lg truncate">{{ restaurant.name }}</h4>
                                        <div class="flex justify-between items-center mt-2">
                                            <p class="text-white bg-amber-500 px-2 rounded-full">評分: {{ restaurant.rating }}★</p>
                                            <p class="text-sm text-gray-400">{{ restaurant.userRatingCount }}則評論</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                        <!-- 右側切換按鈕 -->
                        <button 
                            @click="handleNextGroup"
                            class="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                            →
                        </button>
                    </div>
                        <!-- 頁碼指示器 -->
                        <div class="flex justify-center mt-4 space-x-2">
                            <div 
                                v-for="index in (maxGroupIndex + 1) || 1" 
                                :key="index"
                                :class="[
                                    'w-2 h-2 rounded-full cursor-pointer',
                                    currentGroupIndex === index - 1 ? 'bg-amber-500' : 'bg-gray-300'
                                ]"
                                @click="currentGroupIndex = index - 1"
                            ></div>
                        </div>
                    </div>



                <!-- 推薦餐廳部分 -->
                <div class="mt-10 text-gray-700  w-[900px] mx-auto">
                    <h3 class="mb-2 text-2xl font-bold">{{ storeName }} 的其他推薦餐廳</h3>
                    <div class="flex items-center justify-center space-x-4">
                        <button 
                            @click="handlePrevRecommendedGroup"
                            class="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                            ←
                        </button>

                        <div class="relative w-full  overflow-hidden">
                        <div 
                            class="flex transition-transform duration-500 ease-in-out"
                            :style="{ transform: `translateX(-${recommendedGroupIndex * 100}%)` }"
                        >
                            <div 
                            v-for="restaurant in displayRecommendedRestaurants" 
                            :key="restaurant.place_id" 
                            class="flex-shrink-0 w-1/3 px-2"
                            >
                            <div class="bg-white rounded-lg shadow-md mb-4 mx-auto w-[250px]" >
                                <div class="h-40 overflow-hidden">
                                    <img 
                                    v-if="restaurant.photoUrl"
                                    :src="restaurant.photoUrl" 
                                    :alt="restaurant.name" 
                                    class="w-full h-40 object-cover rounded-t-lg"
                                    >
                                </div>
                                <div class="p-4">
                                <h4 class="font-bold text-lg truncate">{{ restaurant.name }}</h4>
                                <div class="flex justify-between items-center mt-2">
                                        <p class="text-white bg-amber-500 rounded-full px-2">評分: {{ restaurant.rating }}★</p>
                                    <p class="text-sm text-gray-400">{{ restaurant.userRatingCount }}則評論</p>
                                </div>
                                </div>
                            </div>
                            </div>
                        </div>
                        </div>

                        <button 
                        @click="handleNextRecommendedGroup"
                        class="p-2 rounded-full bg-gray-200 hover:bg-gray-300"
                        >
                        →
                        </button>
                    </div>

                    <!-- 頁碼指示器 -->
                    <div class="flex justify-center mt-4 space-x-2">
                        <div 
                            v-for="index in maxRecommendedGroupIndex + 1" 
                            :key="index"
                            :class="[
                                'w-2 h-2 rounded-full cursor-pointer',
                                recommendedGroupIndex === index - 1 ? 'bg-amber-500' : 'bg-gray-300'
                            ]"
                            @click="recommendedGroupIndex = index - 1">
                        </div>
                    </div>
                </div>

                <!-- 搜尋相關主題 -->
                <div class="mt-8">
                    <h3 class="flex items-center mb-4">
                        <span class="text-lg font-bold">🔍 搜尋更多相關主題</span>
                    </h3>

                    <div class="flex flex-wrap gap-2">
                        <!-- 第一行標籤 -->
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">麻辣小吃餐廳</a>
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">台中美食餐廳</a>
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">新美點點</a>
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">台中餐港飲</a>
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">新美點美食餐廳</a>

                        <!-- 第二行標籤 -->
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">麻辣小餐</a>
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">taichungfood</a>
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">台中必吃</a>
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">台中必吃美食</a>
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">美行路美食</a>

                        <!-- 第三行標籤 -->
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">台中空間</a>
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">台中美食餐廳饗</a>
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">台中</a>
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">新美必吃</a>
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">台中麻辣</a>

                        <!-- 第四行標籤 -->
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">美行路麻辣千鍋</a>
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">台中紀記</a>
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">養生豐樂都</a>
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">新美美食</a>
                        <a href="#" class="px-3 py-1.5 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-full text-sm">sogo美食</a>
                    </div>
                </div>




        
            <!-- 地圖區域 -->
            <div class="mt-10 text-gray-700">
                <h3 class="mb-2 text-2xl font-bold">和牛涮 日式鍋物放題 台南中華西店 的食記</h3>
            </div>
            <!-- 地圖區域 -->
            <div class="mt-10 text-gray-700">
                <h3 class="mb-2 text-2xl font-bold">熱門餐廳分類</h3>
            </div>
        </div>
    </div>
</template>


<style scoped>


.transition-transform {
    transition: transform 0.5s ease-in-out;
}
</style>
