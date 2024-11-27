<script setup>
import { ref } from 'vue';
</script>


<template>
    <footer class="bg-amber-500 text-white py-6 px-4 text-center md:text-left">
        <div class="container mx-auto w-[70%] flex flex-col md:flex-row  justify-between">
            <!-- 第一欄 -->
            <div class="mb-8 md:mb-0">
                <h4 class="font-bold mb-4">相關連結</h4>
                <ul class="space-y-2">
                    <li><a href="#" class="custom-underline">愛食記粉絲專頁</a></li>
                    <li><a href="#" class="custom-underline">Instagram</a></li>
                    <li><a href="#" class="custom-underline">聯絡我們</a></li>
                    <li><a href="#" class="custom-underline">服務條款</a></li>
                    <li><a href="#" class="custom-underline">隱私政策</a></li>
                </ul>
            </div>
            <!-- 第二欄 -->
            <div class="mb-8 md:mb-0">
                <h4 class="font-bold mb-4">愛食記應用程式</h4>
                <ul class="space-y-2">
                    <li><a href="#" class="custom-underline">iOS App</a></li>
                    <li><a href="#" class="custom-underline">Android App</a></li>
                </ul>
            </div>
            <!-- 第三欄 -->
            <div>
                <h4 class="font-bold mb-4">店家專區</h4>
                <ul class="space-y-2">
                    <li><a href="#" class="custom-underline">如何加入愛食記？</a></li>
                    <li><a href="#" class="custom-underline">聯繫部落客</a></li>
                </ul>
                <p class="text-gray-400 text-sm mt-4">v: 1.8.3, 67</p>
            </div>
        </div>
        <!-- 底部版權 -->
        <div class="text-center mt-4 text-gray-400">
            <p>Copyright © Tsunami Works 2013-2024 ❤️</p>
        </div>
    </footer>
</template>

<style scoped>
.custom-underline:hover {
    text-decoration: underline;
    text-underline-offset: 4px; /* 你可以調整這個值來改變底線的距離 */
}
</style>