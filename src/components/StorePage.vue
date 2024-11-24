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
    <header class="bg-white p-4 flex justify-between items-center space-x-4">
        <!-- LOGO -->
        <a href="#"><img src="../assets/logo.jpg" alt="Logo" class="h-14"></a>
        <!-- 搜尋欄容器 -->
        <div class="flex items-center px-4 bg-white rounded-full shadow-lg border border-gray-300 space-x-2 h-11 ml-52" >
            <input
            type="text"
            v-model="keyword" 
            id="keyword"
            placeholder="美食分類、餐廳"
            class=" flex-1 px-4 py-2 rounded-full outline-none text-gray-600 placeholder-gray-400"
            />

            <!-- 餐具圖標 -->
            <font-awesome-icon :icon="['fas', 'utensils']" class="text-amber-500 w-5 h-5" />

            <div class="h-full border-l border-gray-300 mx-2 -my-2"></div>
            
            <!-- 城市選擇按鈕 -->
            <div class="flex items-center space-x-1 bg-amber-100 text-amber-500 rounded-full px-3 py-1">
                <span>台南市</span>
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
        <div class="hidden md:flex items-center space-x-4">
            <a href="#" class="text-amber-500 hover:bg-amber-100 rounded-md p-2">發表食記</a>
            <a href="#" class="text-amber-500 hover:bg-amber-100 rounded-md p-2">專欄文章</a>

            <!-- 店家專區的下拉選單 -->
            <div class="relative group inline-block text-left">
                <button class="text-amber-500 rounded-md hover:bg-amber-100 p-2 focus:outline-none">
                    店家專區
                    <span>&#x25BC;</span>
                </button>
                <div class="absolute hidden group-hover:block mt-0 w-48 bg-white rounded-md shadow-lg z-10">
                    <ul class="mt-2">
                    <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">店家加入</a></li>
                    <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">行銷方案</a></li>
                    <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">邀請部落客</a></li>
                    </ul>
                </div>
            </div>

            <!-- 排行榜的下拉選單 -->
            <div class="relative group inline-block text-left">
                <button class="text-amber-500 rounded-md hover:bg-amber-100 p-2 focus:outline-none">
                    排行榜
                    <span>&#x25BC;</span>
                </button>
                <div class="absolute hidden group-hover:block mt-0 w-48 bg-white rounded-md shadow-lg z-10">
                    <ul class="mt-2">
                    <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">週排行</a></li>
                    <li><a href="#" class="block px-4 py-2 text-amber-500 hover:bg-amber-100">月排行</a></li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 主選單：小於 768px 顯示為漢堡圖標 -->
        <div class="md:hidden flex items-center space-x-4">
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

    <!-- 橫幅圖片區 -->
    <div class="relative">
        <img src="../assets/logo.jpg" alt="Banner" class="w-full h-48 object-cover">
        <!-- <div class="absolute top-0 left-0 bg-black bg-opacity-50 text-white p-4 text-2xl">
        和牛涮 日式鍋物放題 台南中華西店
        </div> -->
    </div>
    
    <!-- 導航標籤 -->
    <nav class="bg-white  px-6 flex items-center space-x-4 shadow">
        <button class="text-amber-500 font-bold py-4 px-4  border-b-2 border-transparent hover:border-amber-500">總覽</button>
        <button class="text-amber-500 font-bold py-4 px-4  border-b-2 border-transparent hover:border-amber-500">照片</button>
        <button class="text-amber-500 font-bold py-4 px-4  border-b-2 border-transparent hover:border-amber-500">菜單</button>
        <button class="text-amber-500 font-bold py-4 px-4  border-b-2 border-transparent hover:border-amber-500">評論</button>
        <button class="text-amber-500 font-bold py-4 px-4  border-b-2 border-transparent hover:border-amber-500">更多餐廳</button>
    </nav>

    <!-- 店家資訊區 -->
    <div class=" w-full max-w-[1054px] mx-auto bg-white mt-14 px-6 py-3">
        <div class="flex items-center space-x-4">
            <img src="https://lh3.googleusercontent.com/UlqveEhj9MUgmNDR3hi8C6PV4rk5mhPA_KFpn--Px3IwiYmO-_Qhfrwhq5RYNW2t1oKSgzXj-Y8TZepKVjXAKLwrqLByobwYW-tP22EH3dQ=s200" alt="Store Thumbnail" class=" w-40 h-32 rounded-lg object-cover">
            <div>
                <h2 class="text-3xl font-black text-gray-700">和牛涮台南中華西店</h2>
                <h3 class="pl-6 font-bold text-gray-500">“王品集團旗下日式鍋物放題，千元有找就能盡情享用頂級和牛，還有豐富的自助吧、和牛咖哩和冰淇淋，讓你飽餐一頓！”</h3>
                <div class="flex items-center mt-2 space-x-2">
                    <span class="text-yellow-500">4.8 ★</span>
                    <span class="text-gray-600">6 則評論</span>
                    <span class="bg-blue-100 text-blue-700 px-2 py-1 rounded">觀看菜單</span>
                </div>
                <div class=" flex gap-2 py-1">
                    <a class=" text-black rounded">均消 $900</a>
                    <a href="#" class="text-blue-700 rounded">找相似餐廳</a>
                    <a href="#">火鍋</a>
                    <a href="#">日本料理</a>
                    <a href="#">咖哩</a>
                    <a href="#">合菜</a>
                </div>
            </div>
        </div>
        <!-- 店家詳情區 -->
        <div class="flex items-center mt-10 space-x-4">
            <div>
                <img src="../assets/logo.jpg" alt="Store Thumbnail" class="w-40 rounded-lg object-cover">
                <button class=" bg-gray-100 rounded-lg p-2 mt-20">google評價</button>
            </div>
            <div>
                <h4 class="text-2xl font-bold">營業時間 11:30 - 23:30</h4>
                <p>店家地址|臺南市安平區中華西路二段345號</p>
                <p>均消價位| $900</p>
                <p>臉書頁面|和牛涮台南中華西店</p>
                <p>訂位電話|062959677</p>
                <p>您是餐廳老闆？想要更多行銷服務請至 店家專區</p>
                

                <button class="rounded-lg p-2 mt-6 shadow mr-4"><font-awesome-icon :icon="['fas', 'calendar-week']" class="text-amber-500 w-5 h-5 mr-2" />線上訂位</button>
                <button class="rounded-lg p-2 mt-6 shadow"><font-awesome-icon :icon="['fas', 'arrow-up-from-bracket']" class="text-amber-500 w-5 h-5 mr-2"/>分享餐廳</button>
            </div>
        </div>


        <!-- 地圖區域 -->
        <div class="mt-4 text-gray-700">
            <h3 class="text-2xl font-bold mb-2">和牛涮 日式鍋物放題 台南中華西店 的最新照片 1483張</h3>
        </div>
        <!-- 地圖區域 -->
        <div class="mt-4 text-gray-700">
            <h3 class="text-2xl font-bold mb-2">和牛涮 日式鍋物放題 台南中華西店 的菜單</h3>
        </div>
        <!-- 地圖區域 -->
        <div class="mt-4 text-gray-700">
            <h3 class="text-2xl font-bold mb-2">和牛涮 日式鍋物放題 台南中華西店 的用戶評論</h3>
        </div>
        <!-- 地圖區域 -->
        <div class="mt-4 text-gray-700">
            <h3 class="text-2xl font-bold mb-2">和牛涮 日式鍋物放題 台南中華西店 的相似餐廳</h3>
        </div>
        <!-- 地圖區域 -->
        <div class="mt-4 text-gray-700">
            <h3 class="text-2xl font-bold mb-2">和牛涮 日式鍋物放題 台南中華西店 的其他推薦餐廳</h3>
        </div>
        <!-- 地圖區域 -->
        <div class="mt-4 text-gray-700">
            <h3 class="text-2xl font-bold mb-2">🔍 搜尋更多相關主題</h3>
        </div>
        <!-- 地圖區域 -->
        <div class="mt-4 text-gray-700">
            <h3 class="text-2xl font-bold mb-2">和牛涮 日式鍋物放題 台南中華西店 的食記</h3>
        </div>
        <!-- 地圖區域 -->
        <div class="mt-4 text-gray-700">
            <h3 class="text-2xl font-bold mb-2">熱門餐廳分類</h3>
        </div>
    </div>

    <!-- 頁尾 -->
    <footer class="bg-amber-500 text-white py-6 px-4">
        <div class="container mx-auto" style="max-width: calc(100% - 468px);">
            <div class="flex flex-col md:flex-row justify-between">
                <!-- 第一欄 -->
                <div class="mb-8 md:mb-0">
                    <h4 class="font-bold mb-4">相關連結</h4>
                    <ul class="space-y-2">
                        <li><a href="#" class="hover:underline">愛食記粉絲專頁</a></li>
                        <li><a href="#" class="hover:underline">Instagram</a></li>
                        <li><a href="#" class="hover:underline">聯絡我們</a></li>
                        <li><a href="#" class="hover:underline">服務條款</a></li>
                        <li><a href="#" class="hover:underline">隱私政策</a></li>
                    </ul>
                </div>

                <!-- 第二欄 -->
                <div class="mb-8 md:mb-0">
                    <h4 class="font-bold mb-4">愛食記應用程式</h4>
                    <ul class="space-y-2">
                        <li><a href="#" class="hover:underline">iOS App</a></li>
                        <li><a href="#" class="hover:underline">Android App</a></li>
                    </ul>
                </div>

                <!-- 第三欄 -->
                <div>
                    <h4 class="font-bold mb-4">店家專區</h4>
                    <ul class="space-y-2">
                        <li><a href="#" class="hover:underline">如何加入愛食記？</a></li>
                        <li><a href="#" class="hover:underline">聯繫部落客</a></li>
                    </ul>
                    <p class="text-gray-400 text-sm mt-4">v: 1.8.3, 67</p>
                </div>
            </div>
        </div>

        <!-- 底部版權 -->
        <div class="text-center mt-4 text-gray-400">
            <p>Copyright © Tsunami Works 2013-2024 ❤️</p>
        </div>
    </footer>
</template>


<style scoped>
/* 如果需要自定義一些額外樣式可以在這裡加入 */
.absolute {
    position: absolute;
}
</style>