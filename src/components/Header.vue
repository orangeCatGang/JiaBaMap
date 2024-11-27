<script setup>
import { ref, onMounted, onUnmounted} from 'vue';

const isMenuOpen = ref(false);

const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
};

const checkScreenWidth = () => {
    if (window.innerWidth > 768) {
        isMenuOpen.value = false;  // 自動關閉選單
    }
};

// 使用 onMounted 和 onUnmounted 來設置和移除事件監聽器
onMounted(() => {
    window.addEventListener('resize', checkScreenWidth);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkScreenWidth);
});
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
                <span class=" min-w-16">台南市</span>
                <button class="text-sm focus:outline-none">&times;</button>
            </div>
            <!-- 地點圖標 -->
            <font-awesome-icon :icon="['fas', 'map-marker-alt']" class="text-amber-500 w-5 h-5" />
            <!-- 搜索按鈕 -->
            <button class="bg-amber-500 text-white py-1 px-4 rounded-full shadow-md focus:outline-none ml-52">
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