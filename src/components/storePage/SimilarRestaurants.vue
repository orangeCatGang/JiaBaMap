<script setup>
import { storeToRefs } from 'pinia';
import { useStore } from '../../stores/storePage';
import { Carousel, Slide, Navigation } from 'vue3-carousel'
import 'vue3-carousel/dist/carousel.css'

const restaurantStore = useStore();
const { storeName, similarRestaurants } = storeToRefs(restaurantStore);

</script>

<template>
    <div class="w-full">
        <div class="mt-10 text-gray-700">
            <h3 class="mb-2 text-2xl font-bold">{{ storeName }} 的相似餐廳</h3>
            <div v-if="similarRestaurants && similarRestaurants.length" class="relative">
                <Carousel 
                    :breakpoints="{
                        640: {
                            itemsToShow: 2,
                            snapAlign: 'start',
                        },
                        768: {
                            itemsToShow: 3,
                            snapAlign: 'center',
                        }
                    }"
                    :wrap-around="true"
                    :transition="500"
                    :mouseDrag="true"
                    :touchDrag="true"
                    :gap="1"
                    class="flex justify-center"
                >
                    <Slide 
                        v-for="restaurant in similarRestaurants.slice(0, 15)" 
                        :key="restaurant.place_id"
                        class="flex-shrink-0 px-1"
                    >
                        <div class="bg-white rounded-lg shadow-md mb-4 max-w-[250px]">
                            <a :href="restaurant.googleMapsUri" target="_blank">
                                <div class="overflow-hidden">
                                    <img 
                                        v-if="restaurant?.photoUrl" 
                                        :src="restaurant.photoUrl" 
                                        :alt="restaurant.name" 
                                        class="object-cover w-[250px] h-[160px] rounded-t-lg" 
                                    />
                                </div>
                                <div class="p-4">
                                    <h4 class="text-lg font-bold truncate max-md:text-center">{{ restaurant?.name }}</h4>
                                    <div class="flex flex-col items-center justify-between gap-2 mt-2 md:flex-row">
                                        <p class="px-2 text-center text-white rounded-full bg-amber-500 w-fit">
                                            評分: {{ restaurant?.rating }}★
                                        </p>
                                        <p class="text-sm text-gray-400">
                                            {{ restaurant?.userRatingCount }}則評論
                                        </p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </Slide>
                    
                    <template #addons>
                        <Navigation>
                            <template #next>
                                <button class="bg-amber-500 opacity-80 rounded-full p-3 shadow-lg hover:bg-gray-300">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M9 18L15 12L9 6" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </template>
                            <template #prev>
                                <button class="bg-amber-500 opacity-80 rounded-full p-3 shadow-lg hover:bg-gray-300">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M15 18L9 12L15 6" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
                                    </svg>
                                </button>
                            </template>
                        </Navigation>
                    </template>
                </Carousel>
            </div>
            
            <!-- 如果沒有數據顯示加載狀態 -->
            <div v-else class="py-4 text-center">
                正在加載餐廳資料...
            </div>
        </div>
    </div>
</template>