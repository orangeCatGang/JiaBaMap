

<template>
  <div>
    <!-- 相似餐廳 -->
    <div class="mt-10 text-gray-700" v-if="restaurantStore.similarRestaurants.length">
      <h3 class="mb-2 text-2xl font-bold">{{ restaurantStore.storeName }} 的相似餐廳</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          v-for="restaurant in restaurantStore.similarRestaurants" 
          :key="restaurant.id" 
          class="bg-white rounded-lg shadow-md"
        >
          <img 
            :src="restaurant.image" 
            :alt="restaurant.name" 
            class="w-full h-40 object-cover rounded-t-lg"
          >
          <div class="p-4">
            <h4 class="font-bold text-lg">{{ restaurant.name }}</h4>
            <p class="text-gray-500">{{ restaurant.cuisine }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 其他推薦餐廳 -->
    <div class="mt-10 text-gray-700" v-if="restaurantStore.recommendedRestaurants.length">
      <h3 class="mb-2 text-2xl font-bold">{{ restaurantStore.storeName }} 的其他推薦餐廳</h3>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div 
          v-for="restaurant in restaurantStore.recommendedRestaurants" 
          :key="restaurant.id" 
          class="bg-white rounded-lg shadow-md"
        >
          <img 
            :src="restaurant.image" 
            :alt="restaurant.name" 
            class="w-full h-40 object-cover rounded-t-lg"
          >
          <div class="p-4">
            <h4 class="font-bold text-lg">{{ restaurant.name }}</h4>
            <p class="text-gray-500">{{ restaurant.cuisine }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜尋相關主題 -->
    <div class="mt-10 text-gray-700" v-if="restaurantStore.searchTopics.length">
      <h3 class="mb-2 text-2xl font-bold">🔍 搜尋更多相關主題</h3>
      <div class="flex flex-wrap gap-2">
        <button 
          v-for="topic in restaurantStore.searchTopics" 
          :key="topic" 
          class="px-3 py-1 bg-amber-100 text-amber-500 rounded-full hover:bg-amber-200"
        >
          {{ topic }}
        </button>
      </div>
    </div>
  </div>
</template>
  

<script setup>
import { onMounted } from 'vue';
import { storeToRefs } from 'pinia';
import { useRestaurantStore } from '../stores/storePage';

const restaurantStore = useRestaurantStore();
const { 
  storeName, 
  similarRestaurants, 
  recommendedRestaurants, 
  searchTopics,
 
} = storeToRefs(restaurantStore);



onMounted(async () => {
  // 獲取相關餐廳和搜尋主題的數據
  await restaurantStore.fetchSimilarRestaurants();
  await restaurantStore.fetchRecommendedRestaurants();
  await restaurantStore.fetchSearchTopics();
});
</script>