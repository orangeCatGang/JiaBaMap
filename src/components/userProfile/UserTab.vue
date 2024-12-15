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
            <PreviousReview/>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import KeepList from './KeepList.vue';
import PreviousReview from '../storeComment/PreviousReview.vue';
const activeTab = ref('review')

const clickReview = () => activeTab.value = 'review'
const clickArticle = () => activeTab.value = 'article'
const clickKeep = () => activeTab.value = 'keep'

</script>