<template>
    <div class="box-border z-50 flex flex-col w-full space-x-0 bg-white">

        <div class="flex flex-col">
            <div class="p-3 font-bold text-gray-500">
                <!-- 根據搜尋篩選做變化 -->
                <h3>台灣『美食餐廳』 | 精選TOP 15間熱門店家</h3>
            </div>

            <div class="hidden text-sm text-gray-600 md:flex">
                <div class="px-3">
                    <a href="#">台灣</a>
                </div>

                <div>
                    <font-awesome-icon :icon="['fas', 'chevron-right']" />
                </div>

                <div class="px-3">
                    <span>所有餐廳</span>
                </div>
            </div>
        </div>
        <!-- 篩選區 -->
        <div class="relative flex flex-row items-start w-full px-2 mx-3">

            <!-- 評分分類 -->
            <div class="relative inline-block w-1/4 mx-1 md:w-1/6">
                <button 
                    @click="toggleMenu('ratingMenu')" 
                    class="flex items-center justify-between w-full p-1 mt-2 text-xs text-white rounded-md bg-amber-500">
                    <div>
                        <font-awesome-icon :icon="['fas', 'bars']" />
                    </div>
                    <div>
                        {{ selectedFilters.rating || '最高評分' }}
                    </div>
                    <div>
                        <font-awesome-icon :icon="['fas', 'chevron-down']" />
                    </div>
                </button>

                <div 
                    v-if="menuStates.ratingMenu" 
                    class="absolute left-0 z-10 w-full p-1 mt-1 text-xs text-center text-white rounded-md shadow-md bg-amber-400 top-full">
                    <ul>
                        <li 
                            v-for="option in ['最高評分', '最新餐廳', '最高人氣']" 
                            :key="option" 
                            @click="selectFilter('rating', option)" 
                            class="py-1 cursor-pointer hover:bg-amber-500">
                            {{ option }}
                        </li>
                    </ul>
                </div>
            </div>

            
            <!-- 價位分類 -->
            <div class="relative inline-block w-1/4 mx-1 md:w-1/6">
                <button 
                    @click="toggleMenu('costMenu')" 
                    class="flex items-center justify-between w-full p-1 mt-2 text-xs text-white rounded-md bg-amber-500">
                    <div>
                        <font-awesome-icon :icon="['fas', 'dollar-sign']" />
                    </div>
                    <div>
                        {{ selectedFilters.cost || '平均消費' }}
                    </div>
                    <div>
                        <font-awesome-icon :icon="['fas', 'chevron-down']" />
                    </div>
                </button>

                <div 
                    v-if="menuStates.costMenu" 
                    class="absolute left-0 z-10 w-full p-1 mt-1 text-xs text-center text-white rounded-md shadow-md bg-amber-400 top-full">
                    <ul>
                        <li 
                            v-for="option in ['不選擇', '150以內', '150~600', '600~1200', '1200以上']" 
                            :key="option" 
                            @click="selectFilter('cost', option)" 
                            class="py-1 cursor-pointer hover:bg-amber-500">
                            {{ option }}
                        </li>
                    </ul>
                </div>
            </div>


            <!-- Checkbox -->
            <div class="w-1/4 p-1 mx-1 mt-2 text-xs text-center border rounded-md md:w-1/6 md:border-none ">
                <label>
                    <input type="checkbox" v-model="checkboxFilters.open"> 營業中
                </label>
            </div>

            <div class="w-1/4 p-1 mx-1 mt-2 text-xs text-center border rounded-md md:w-1/6 md:border-none ">
                <label>
                    <input type="checkbox" v-model="checkboxFilters.takeOut"> 外帶外送
                </label>
            </div>

        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

// 選單顯示狀態
const menuStates = ref({
    ratingMenu: false,
    costMenu: false,
});

// 選擇的篩選條件
const selectedFilters = ref({
    rating: '', // 預設顯示 "最高評分"
    cost: '',   // 預設顯示 "平均消費"
});

// Checkbox 選項
const checkboxFilters = ref({
    open: false,    
    takeOut: false, 
});

// 切換選單的顯示狀態
const toggleMenu = (menuName) => {
    Object.keys(menuStates.value).forEach((key) => {
        menuStates.value[key] = key === menuName ? !menuStates.value[key] : false;
    });
};

// 選擇篩選條件，更新對應按鈕的文字
const selectFilter = (filterType, value) => {
    selectedFilters.value[filterType] = value; // 更新篩選條件
    menuStates.value[`${filterType}Menu`] = false; // 關閉選單
};

// 監測螢幕大小變化
const checkScreenWidth = () => {
    if (window.innerWidth > 768) {
        Object.keys(menuStates.value).forEach((key) => {
            menuStates.value[key] = false;
        });
    }
};


onMounted(() => {
    window.addEventListener('resize', checkScreenWidth);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkScreenWidth);
});
</script>
