<template>
    <div class="box-border w-full h-screen pt-2 mt-2 overflow-y-auto lg:mt-12">
        <div class="flex items-center pb-2 mt-2 border-b">
                <!-- 餐廳圖 -->
                <div class="w-40 h-32">
                <img src="https://lh3.googleusercontent.com/GN-TM_OkaDI-lsN8ADeP84BQqZmKrWoquqrF3GbFGZYFNKGcSg6JnFS-WVO4--3jXHGwGzwy9-r59Pq5Sf_cx0EIwi0ZcQ=s200" 
                 class="object-cover w-full h-full mx-3 rounded-md"
                >
                </div>
                <!-- 餐廳排名、名稱 -->
                <div class="flex flex-col justify-between ml-3 sm:text-xl">
                    <div class="ml-3 text-left">
                        <h2 class="text-base font-bold text-gray-500">
                            {{ restaurant.rank }}. 
                            <a href="#" class="text-amber-500 hover:text-orange-300">{{ restaurant.name }}</a>
                        </h2>
                    </div>
                    <!-- 餐廳內容 -->
                    <div class="flex mt-3 ml-3 text-xs">

                        <div class="items-center px-2 mr-2 text-white bg-red-600 rounded-2xl">
                            <p>{{ restaurant.rating }} <font-awesome-icon :icon="['fas', 'star']" /></p>
                        </div>

                        <p class="mr-2 font-light">(評論數: {{ restaurant.reviews }})</p>
                        <p class="mr-2 font-bold">均消: {{ restaurant.cost }}</p>
                    </div>

                    <!-- 需判斷是否營業 -->
                    <div class="items-center hidden mx-3 mt-3 text-sm md:flex">
                        <span class="mr-2 text-center text-green-600">
                            <font-awesome-icon :icon="['fas', 'circle']" style="font-size: 8px;" />
                        </span>
                        <p>營業時間: {{ restaurant.openingHours }}</p>
                    </div>

                    <div class="flex flex-wrap items-center mt-3 ml-3">

                        <span>
                            <a href="#" 
                               class="items-center hidden px-3 py-1 mb-1 mr-2 text-sm bg-gray-200 rounded-full md:block">
                                <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" class="text-orange-400"/>
                                 相似餐廳
                            </a>
                        </span>

                        <span>
                            <a href="#" 
                               class="items-center hidden px-3 py-1 mb-1 mr-2 text-sm bg-gray-200 rounded-full md:block">
                                <font-awesome-icon :icon="['fas', 'location-dot']" class="text-orange-400"/>
                                 附近                 
                            </a>
                        </span>

                        <span>
                            <a href="#"
                                v-for="tag in restaurant.tags" 
                                :key="`${restaurant.name}-${tag}`" 
                                class="items-center inline-block px-3 py-1 mb-1 mr-2 text-sm bg-gray-200 rounded-full"
                            >
                            {{ tag }}
                            </a>
                        </span>
                    </div>    
                </div>
         </div>
    </div>
</template>
 

<script setup>
import { ref } from "vue";

const restaurant = ref(
    {
    rank: 1,
    name: "麻的 小辛辣｜麻辣干鍋 台中美村店",
    rating: 4.9,
    reviews: 2,
    cost: 600,
    openingHours: "12:00-14:30, 16:00-22:00",
    tags: ["新開幕", "午餐", "晚餐"],
    imageUrl: "/image/麻的小辛辣.jpeg"
    },
);

</script>