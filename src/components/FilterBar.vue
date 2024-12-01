<template>
    <div class=" flex top-32 flex-col bg-white box-border w-full space-x-0  md:top-6 md:my-12 lg:my-12 z-50">

        <div class="flex flex-col">
            <div class="p-3 font-bold text-gray-500">
                <!-- 根據搜尋篩選做變化 -->
                <h3>台灣『美食餐廳』 | 精選TOP 15間熱門店家</h3>
            </div>

            <div class="hidden md:flex text-sm text-gray-600">
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
        <div class="flex flex-row w-full  px-2 mx-3 items-start relative">

            <!-- 評分分類 -->
            <div class="relative inline-block w-1/4 md:w-1/6 mx-1">
                <button 
                    @click="toggleMenu('ratingMenu')" 
                    class="bg-amber-500 rounded-md text-white text-xs w-full mt-2 p-1 flex justify-between items-center">
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
                    class="bg-amber-400 rounded-md text-white text-xs w-full p-1 text-center absolute top-full left-0 mt-1 shadow-md z-10">
                    <ul>
                        <li 
                            v-for="option in ['最高評分', '最新餐廳', '最高人氣']" 
                            :key="option" 
                            @click="selectFilter('rating', option)" 
                            class="cursor-pointer hover:bg-amber-500 py-1">
                            {{ option }}
                        </li>
                    </ul>
                </div>
            </div>

            
            <!-- 價位分類 -->
            <div class="relative inline-block w-1/4 md:w-1/6 mx-1">
                <button 
                    @click="toggleMenu('costMenu')" 
                    class="bg-amber-500 rounded-md text-white text-xs w-full mt-2 p-1 flex justify-between items-center">
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
                    class="bg-amber-400 rounded-md text-white text-xs w-full p-1 text-center absolute top-full left-0 mt-1 shadow-md z-10">
                    <ul>
                        <li 
                            v-for="option in ['不選擇', '150以內', '150~600', '600~1200', '1200以上']" 
                            :key="option" 
                            @click="selectFilter('cost', option)" 
                            class="cursor-pointer hover:bg-amber-500 py-1">
                            {{ option }}
                        </li>
                    </ul>
                </div>
            </div>


            <!-- Checkbox -->
            <div class="p-1 border w-1/4 md:w-1/6 mx-1 rounded-md text-center text-xs mt-2 md:border-none ">
                <label>
                    <input type="checkbox" v-model="checkboxFilters.open"> 營業中
                </label>
            </div>

            <div class="p-1 border w-1/4 md:w-1/6 mx-1 rounded-md text-center text-xs mt-2 md:border-none ">
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
