<template>
    <div>
        <!-- tab選單 -->
        <div class="border-b border-gray-200 dark:border-gray-700">
            <ul class="flex flex-wrap -mb-px text-sm font-medium text-center text-gray-500 dark:text-gray-400">
                <li class="flex-1">
                    <a 
                        @click="clickReview"
                        :class="[
                            'inline-flex items-center justify-center w-full p-4 border-b-2 rounded-t-lg cursor-pointer group',
                            // 當 activeTab 是 review 時，套用 text-amber-500 和 border-amber-500
                            activeTab === 'review' 
                                ? 'text-amber-500 border-amber-500' 
                                : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                        ]"
                    >
                        <font-awesome-icon
                            :icon="['fas', 'bowl-food']"
                            :class="[
                                'w-4 h-4 me-2',
                                // 當 activeTab 是 review 時，圖示顏色變為 amber-500
                                activeTab === 'review' ? 'text-amber-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300'
                            ]" 
                            aria-hidden="true" />餐廳評論
                    </a>
                </li>
                <li class="flex-1">
                    <a 
                        @click="clickArticle" 
                        :class="[
                            'inline-flex items-center justify-center w-full p-4 border-b-2 rounded-t-lg cursor-pointer group',
                            // 當 activeTab 是 article 時，套用 text-amber-500 和 border-amber-500
                            activeTab === 'article' 
                                ? 'text-amber-500 border-amber-500' 
                                : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                        ]"
                    >
                        <font-awesome-icon
                        :icon="['fas', 'star-half-stroke']"
                        :class="[
                            'w-4 h-4 me-2',
                            // 當 activeTab 是 article 時，圖示顏色變為 amber-500
                            activeTab === 'article' ? 'text-amber-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300'
                        ]" 
                        aria-hidden="true" />所有食記
                    </a>
                </li>
                <li class="flex-1">
                    <a 
                        @click="clickKeep" 
                        :class="[
                            'inline-flex items-center justify-center w-full p-4 border-b-2 rounded-t-lg cursor-pointer group',
                            // 當 activeTab 是 keep 時，套用 text-amber-500 和 border-amber-500
                            activeTab === 'keep' 
                                ? 'text-amber-500 border-amber-500' 
                                : 'text-gray-500 border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300'
                        ]"
                    >
                        <font-awesome-icon
                        :icon="['fas', 'bookmark']"
                        :class="[
                            'w-4 h-4 me-2',
                            // 當 activeTab 是 keep 時，圖示顏色變為 amber-500
                            activeTab === 'keep' ? 'text-amber-500' : 'text-gray-400 group-hover:text-gray-500 dark:text-gray-500 dark:group-hover:text-gray-300'
                        ]" 
                        aria-hidden="true" />我的珍藏
                    </a>    
                </li>
            </ul>
        </div>
        <!-- tab 內容 -->
        <!-- 所有食記 -->
        <div v-show="activeTab === 'article'">
            <h2>最新食記</h2>
            <p>暫無食記</p>
        </div>
        
        <!-- 我的珍藏 -->
        <div v-show="activeTab === 'keep'">
            <KeepList />
        </div>

        <!-- 餐廳評論 -->
        <div v-show="activeTab === 'review'">
            <h2 class="my-8 font-bold text-left text-amber-500">Julie Wang 的 5 則評論</h2>
            <!-- PreviousReview -->
            <div class="flex flex-col gap-x-5">
                <div class="flex gap-x-5 gap-y-6">
                    <div class="w-12 h-12 overflow-hidden rounded-full bg-slate-300">
                        <img src="/src/assets/default_user.png" alt="avatar" class="object-cover w-full h-full">
                    </div>
                    <div class="flex flex-col text-left">
                        <a class="font-bold" href="#">Julie Wang<span>（5 則評論）</span></a>
                        <div class="flex gap-3">
                        <span class="p-1 text-sm text-white rounded-full bg-amber-500">5.0 ★</span>
                        <p>均消價位：$ 400</p>
                        </div>
                        <p class="text-slate-500">2024/11/28 到訪了<a href="#">涓豆腐</a></p>
                        <p class="my-3">第一次吃涓豆腐，真的很好吃！<br>小菜都很有水準，而且可以一直續<br>石鍋飯很Q彈，湯頭很好喝，最喜歡雪濃湯的湯頭<br>甜點也很好吃，冰淇淋跟鬆餅很配<br>跟朋友去聚餐的好選擇
                        </p>
                        <div>
                        <button class="p-2 rounded-lg shadow ">表示讚賞</button>
                        <button class="p-2 ml-2 rounded-lg shadow">分享評論</button>
                        </div>
                        <div class="flex gap-4 bg-slate-400"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import KeepList from './KeepList.vue';
const activeTab = ref('review')

const clickReview = () => activeTab.value = 'review'
const clickArticle = () => activeTab.value = 'article'
const clickKeep = () => activeTab.value = 'keep'

</script>