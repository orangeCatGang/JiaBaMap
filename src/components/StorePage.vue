<script setup>
import { onMounted, ref  } from 'vue';
import { storeToRefs } from 'pinia';
import { useRestaurantStore } from '../stores/storePage';
import StoreComment from '../components/storeComment/StoreComment.vue'


const restaurantStore = useRestaurantStore();
onMounted(async () => {
    await restaurantStore.fetchPlaceDetail();
    await restaurantStore.fetchPhotos();
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
} = storeToRefs(restaurantStore);

</script>


<template>
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
        <div class="flex flex-col md:flex-row items-center space-y-4 md:flex-row md:items-start space-y-4 md:space-y-0 md:space-x-4">
            <img :src="storePhoto" alt="Store Thumbnail" class=" w-40 h-32 rounded-lg object-cover">
            <div class="space-y-2 text-center md:text-left">
                <h2 class="text-3xl font-black text-gray-700">{{ storeName }}</h2>
                <h3 class="pl-6 font-bold text-gray-500">“王品集團旗下日式鍋物放題，千元有找就能盡情享用頂級和牛，還有豐富的自助吧、和牛咖哩和冰淇淋，讓你飽餐一頓！”</h3>
                <div class="flex flex-wrap items-center justify-center gap-2 mt-2 md:justify-start">
                    <span class="text-yellow-500">{{ rating }} ★</span>
                    <span class="text-gray-600">{{ userRatingCount }}則評論</span>
                    <a href="#"><span class="px-2 py-1 text-blue-500 bg-blue-100 rounded">觀看菜單</span></a>
                </div>
                <div class="flex flex-wrap justify-center gap-2 py-2 md:justify-start">
                    <a class=" text-black rounded">{{ `${startPrice}-${endPrice}` }}</a>
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
            <div>
                <img :src="storeMap" alt="Store Thumbnail" class="w-40 rounded-lg object-cover">
                <a :href="googleMapsUri">
                    <button class=" bg-gray-100 text-gray-500 rounded-lg p-2 mt-20">google評價</button>
                </a>
            </div>
            <div class="space-y-1">
   <a href="#"><span class="bg-blue-100 text-blue-500 px-2 py-1 rounded">觀看菜單</span></a>
                <h4 class="text-2xl font-bold py-1">{{ openNow? "營業中":"休息中" }}</h4>
                <h4 class="text-2xl font-bold py-1">{{ weekdayDescriptions }}</h4>
                <p>店家地址 | {{ formattedAddress }}</p>
                <p>均消價位 | {{ `${startPrice}-${endPrice}` }}</p>
                <p>相關連結 | <a :href="websiteUri">點我</a> </p>
                <p>訂位電話 | {{ nationalPhoneNumber }}</p>
                <p>您是餐廳老闆？想要更多行銷服務請至 店家專區</p>
    
                <button class="p-2 mt-6 mr-4 rounded-lg shadow"><font-awesome-icon :icon="['fas', 'calendar-week']" class="w-5 h-5 mr-2 text-amber-500" />線上訂位</button>
                <button class="p-2 mt-6 rounded-lg shadow"><font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" class="w-5 h-5 mr-2 text-amber-500"/>分享餐廳</button>
            </div>
        </div>
        <!-- 地圖區域 -->
        <div class="mt-4 text-gray-700">
            <h3 class="mb-2 text-2xl font-bold">和牛涮 日式鍋物放題 台南中華西店 的最新照片 1483張</h3>
        </div>
        <!-- 地圖區域 -->
        <div class="mt-4 text-gray-700">
            <h3 class="mb-2 text-2xl font-bold">和牛涮 日式鍋物放題 台南中華西店 的菜單</h3>
        </div>
        <!-- 地圖區域 -->
        <div class="mt-4 text-gray-700">
            <h3 class="mb-2 text-2xl font-bold">和牛涮 日式鍋物放題 台南中華西店 的用戶評論</h3>
            <StoreComment />
        </div>
        <!-- 地圖區域 -->
        <div class="mt-4 text-gray-700">
            <h3 class="mb-2 text-2xl font-bold">和牛涮 日式鍋物放題 台南中華西店 的相似餐廳</h3>
        </div>
        <!-- 地圖區域 -->
        <div class="mt-4 text-gray-700">
            <h3 class="mb-2 text-2xl font-bold">和牛涮 日式鍋物放題 台南中華西店 的其他推薦餐廳</h3>
        </div>
        <!-- 地圖區域 -->
        <div class="mt-4 text-gray-700">
            <h3 class="mb-2 text-2xl font-bold">🔍 搜尋更多相關主題</h3>
        </div>
        <!-- 地圖區域 -->
        <div class="mt-4 text-gray-700">
            <h3 class="mb-2 text-2xl font-bold">和牛涮 日式鍋物放題 台南中華西店 的食記</h3>
        </div>
        <!-- 地圖區域 -->
        <div class="mt-4 text-gray-700">
            <h3 class="mb-2 text-2xl font-bold">熱門餐廳分類</h3>
        </div>
    </div>
</template>


<style scoped>

</style>