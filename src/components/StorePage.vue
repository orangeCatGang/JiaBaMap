<script setup>
import { ref} from 'vue';
</script>


<template>
    <!-- 橫幅圖片區 -->
    <div class="relative">
        <img src="../assets/logo.jpg" alt="Banner" class="w-full h-48 object-cover">
        <!-- <div class="absolute top-0 left-0 bg-black bg-opacity-50 text-white p-4 text-2xl">
        和牛涮 日式鍋物放題 台南中華西店
        </div> -->
    </div>
    
    <!-- 導航標籤 -->
    <nav class="bg-white px-4 flex overflow-x-auto md:overflow-visible items-center space-x-4 shadow">
        <button class="text-amber-500 font-bold py-4 px-4  border-b-2 border-transparent hover:border-amber-500 whitespace-nowrap">總覽</button>
        <button class="text-amber-500 font-bold py-4 px-4  border-b-2 border-transparent hover:border-amber-500 whitespace-nowrap">照片</button>
        <button class="text-amber-500 font-bold py-4 px-4  border-b-2 border-transparent hover:border-amber-500 whitespace-nowrap">菜單</button>
        <button class="text-amber-500 font-bold py-4 px-4  border-b-2 border-transparent hover:border-amber-500 whitespace-nowrap">評論</button>
        <button class="text-amber-500 font-bold py-4 px-4  border-b-2 border-transparent hover:border-amber-500 whitespace-nowrap">更多餐廳</button>
    </nav>
    <!-- 店家資訊區 -->
    <div class="w-full max-w-[1024px] mx-auto bg-white mt-14 px-4 md:px-6 py-4">
        <div class="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-4">
            <img src="https://lh3.googleusercontent.com/UlqveEhj9MUgmNDR3hi8C6PV4rk5mhPA_KFpn--Px3IwiYmO-_Qhfrwhq5RYNW2t1oKSgzXj-Y8TZepKVjXAKLwrqLByobwYW-tP22EH3dQ=s200" alt="Store Thumbnail" class=" w-40 h-32 rounded-lg object-cover">
            <div class="space-y-2 text-center md:text-left">
                <h2 class="text-3xl font-black text-gray-700">和牛涮 日式鍋物放題 台南中華西店</h2>
                <h3 class="pl-6 font-bold text-gray-500">“王品集團旗下日式鍋物放題，千元有找就能盡情享用頂級和牛，還有豐富的自助吧、和牛咖哩和冰淇淋，讓你飽餐一頓！”</h3>
                <div class="flex flex-wrap justify-center md:justify-start items-center mt-2 gap-2">
                    <span class="text-yellow-500">4.8 ★</span>
                    <span class="text-gray-600">6 則評論</span>
                    <a href="#"><span class="bg-blue-100 text-blue-500 px-2 py-1 rounded">觀看菜單</span></a>
                </div>
                <div class="flex flex-wrap gap-2 justify-center md:justify-start py-2">
                    <a class=" text-black rounded">均消 $900</a>
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
                <img src="../assets/logo.jpg" alt="Store Thumbnail" class="w-40 rounded-lg object-cover">
                <button class=" bg-gray-100 text-gray-500 rounded-lg p-2 mt-20">google評價</button>
            </div>
            <div class="space-y-1">
                <h4 class="text-2xl font-bold py-1">營業時間 11:30 - 23:30</h4>
                <p>店家地址 | 臺南市安平區中華西路二段345號</p>
                <p>均消價位 | $900</p>
                <p>臉書頁面 | 和牛涮台南中華西店</p>
                <p>訂位電話 | 062959677</p>
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
</template>


<style scoped>

</style>