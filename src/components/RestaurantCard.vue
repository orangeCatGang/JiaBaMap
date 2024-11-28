<template>
    <div class="box-border w-1/2 md:w-1/2 pt-2 h-screen overflow-y-auto mt-2 md:mt-16 lg:mt-12">
        <div 
             v-for="place in sortedPlaces" 
             :key="place.place_id"
             class="flex mt-2 items-center pb-2 border-b "
        >
                <!-- 餐廳圖 -->
                <div class="w-40 h-32">
                <!-- <img
                 :src="restaurant.imageUrl" 
                 class="w-full h-full object-cover mx-3 rounded-md"
                > -->
                <img v-if="place.photo" :src="place.photo" alt="Place image" class="object-cover w-full h-full" />
                </div>
                <!-- 餐廳排名、名稱 -->
                <div class="flex flex-col justify-between ml-3 sm:text-xl">
                    <div class="ml-3">
                        <h2 class="font-bold text-gray-500 text-base">
                            <!-- {{ restaurant.rank }}.  -->
                            <a href="#" class="text-amber-500 hover:text-orange-300">{{ place.name }}</a>
                        </h2>
                    </div>
                    <!-- 餐廳內容 -->
                    

                    <div class="flex mt-3 ml-3 text-xs">

                        <div class=" bg-red-600 mr-2 rounded-2xl text-white px-2 items-center">
                            <p>{{ place.rating }} <font-awesome-icon :icon="['fas', 'star']" /></p>
                        </div>

                        <p class="mr-2 font-light">(評論數: {{ place.user_ratings_total }})</p>
                        <!-- <p class="mr-2 font-bold">均消: {{ restaurant.cost }}</p> -->
                    </div>

                    <!-- 需判斷是否營業 -->
                    <div class="mt-3 mx-3 hidden md:flex items-center text-sm">
                        <span class="text-green-600 mr-2 text-center">
                            <font-awesome-icon :icon="['fas', 'circle']" style="font-size: 8px;" />
                        </span>
                        <!-- <p>營業時間: {{ restaurant.openingHours }}</p> -->
                    </div>

                    <div class="mt-3 ml-3 flex flex-wrap items-center">

                        <span>
                            <a href="#" 
                               class="hidden md:block bg-gray-200 rounded-full px-3 py-1 text-sm mr-2 mb-1 items-center">
                                <font-awesome-icon :icon="['fas', 'wand-magic-sparkles']" class="text-orange-400"/>
                                 相似餐廳
                            </a>
                        </span>

                        <span>
                            <a href="#" 
                               class="hidden md:block bg-gray-200 rounded-full px-3 py-1 text-sm mr-2 mb-1 items-center">
                                <font-awesome-icon :icon="['fas', 'location-dot']" class="text-orange-400"/>
                                 附近                 
                            </a>
                        </span>

                        <span>
                            <!-- <a href="#"
                                v-for="tag in restaurant.tags" 
                                :key="`${restaurant.name}-${tag}`" 
                                class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm mr-2 mb-1 items-center"
                            >
                            {{ tag }}
                            </a> -->
                        </span>
                    </div>    
                </div>
         </div>
    </div>
</template>
 

<script>
        export default {
            props: {
                places:{
                    type:Array,
                    required: false,
                    default: () => [],
                }, 
                sortOrder: String,
            },
            computed: {
                sortedPlaces() {
                    if (this.sortOrder === "distance") {
                        return this.places.sort((a, b) => a.distance - b.distance);
                    } else if (this.sortOrder === "rating") {
                        return this.places.sort((a, b) => b.rating - a.rating);
                    } else {
                        return this.places;
                    }
                },
            },
        };
        </script>