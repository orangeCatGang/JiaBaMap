<script setup>
import { ref } from 'vue';
import StoreComment from '../components/storeComment/StoreComment.vue'

const isDropdownVisible = ref(false);

// 用於點擊頁面其他地方時隱藏下拉選單
function handleDocumentClick(event) {
    const button = document.getElementById('dropdownButton');
    const menu = document.getElementById('dropdownMenu');

    if (!button.contains(event.target) && !menu.contains(event.target)) {
        isDropdownVisible.value = false;
    }
}

document.addEventListener('click', handleDocumentClick);
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
        <div class="flex flex-col items-center space-y-4 md:flex-row md:items-start md:space-y-0 md:space-x-4">
            <img src="https://lh3.googleusercontent.com/UlqveEhj9MUgmNDR3hi8C6PV4rk5mhPA_KFpn--Px3IwiYmO-_Qhfrwhq5RYNW2t1oKSgzXj-Y8TZepKVjXAKLwrqLByobwYW-tP22EH3dQ=s200" alt="Store Thumbnail" class="object-cover w-40 h-32 rounded-lg ">
            <div class="space-y-2 text-center md:text-left">
                <h2 class="text-3xl font-black py-1 text-gray-700">和牛涮 日式鍋物放題 台南中華西店</h2>
                <div class="flex flex-wrap items-center justify-center gap-3 md:justify-start">
                    <span class=" px-2 py-1 text-yellow-50 bg-amber-500 rounded">4.8 ★</span>
                    <a href="#"><span class="text-gray-400">6 則評論</span></a>
                </div>
                <div class="flex flex-wrap justify-center gap-3 py-2 md:justify-start">
                    <a class="text-black rounded ">均消 $900</a>
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
                <img src="../assets/logo.jpg" alt="Store Thumbnail" class="object-cover w-40 rounded-lg">
            </div>
            <div class="space-y-2">
                <div class="relative inline-block ml-12">
                    <button 
                    id="dropdownButton" 
                    class="text-amber-500 rounded-md p-2 hover:bg-amber-100 focus:outline-none font-bold"
                    @click="isDropdownVisible = !isDropdownVisible">
                        現正營業 : 11:30 - 23:30
                        <span class="ml-1">&#x25BC;</span>
                    </button>
                    <div 
                    id="dropdownMenu" 
                    v-if="isDropdownVisible"
                    class="absolute w-48  bg-white rounded-md shadow-lg z-10 left-1/2 transform -translate-x-1/2"
                    >
                        <ul class="mt-1">
                        <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">星期一 11:30 - 23:30</a></li>
                        <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">星期二 11:30 - 23:30</a></li>
                        <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">星期三 11:30 - 23:30</a></li>
                        <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">星期四 11:30 - 23:30</a></li>
                        <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">星期五 11:30 - 23:30</a></li>
                        <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100">星期六 11:30 - 23:30</a></li>
                        <li><a href="#" class="block p-2 text-amber-500 hover:bg-amber-100 rounded-bl-md rounded-br-md">星期日 11:30 - 23:30</a></li>
                        </ul>
                    </div>
                </div>
                <p>店家地址 | 臺南市安平區中華西路二段345號</p>
                <p>均消價位 | $900</p>
                <p>訂位電話 | 062959677</p>
                <button class="p-2 mt-6 mr-4 rounded-lg shadow"><font-awesome-icon :icon="['fas', 'calendar-week']" class="w-5 h-5 mr-2 text-amber-500" />相關連結</button>
                <button class="p-2 mt-6 mr-4 rounded-lg shadow"><font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" class="w-5 h-5 mr-2 text-amber-500"/>分享餐廳</button>
                <button class="p-2 mt-6 rounded-lg shadow"><font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" class="w-5 h-5 mr-2 text-amber-500"/>google評價</button>
            </div>
        </div>
        <!-- 地圖區域 -->
        <div class="mt-10 text-gray-700">
            <h3 class="mb-2 text-2xl font-bold">和牛涮 日式鍋物放題 台南中華西店 的用戶評論</h3>
            <StoreComment />
        </div>
        <!-- 地圖區域 -->
        <div class="mt-10 text-gray-700">
            <h3 class="mb-2 text-2xl font-bold">和牛涮 日式鍋物放題 台南中華西店 的相似餐廳</h3>
        </div>
        <!-- 地圖區域 -->
        <div class="mt-10 text-gray-700">
            <h3 class="mb-2 text-2xl font-bold">和牛涮 日式鍋物放題 台南中華西店 的其他推薦餐廳</h3>
        </div>
        <!-- 地圖區域 -->
        <div class="mt-10 text-gray-700">
            <h3 class="mb-2 text-2xl font-bold">🔍 搜尋更多相關主題</h3>
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
</template>


<style scoped>

</style>