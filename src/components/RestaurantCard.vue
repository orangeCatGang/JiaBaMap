<template>
    <div class="box-border w-1/2 md:w-1/2 pt-2 h-screen overflow-y-auto">
    
        <div class=" flex top-16 flex-col bg-white box-border w-full space-x-0  md:top-6 z-50">

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

        
        <div class="flex flex-row w-full  px-2 mx-3 items-start relative">
            <button
              @click="toggleMenu"
              class="bg-amber-500 rounded-md text-white text-xs w-full mt-2 p-1 flex justify-between items-center">
              <div>
                  <font-awesome-icon :icon="['fas', 'bars']" />
              </div>
              <span>{{ sortOptions[sortOrder] }}</span>
              <div>
                <font-awesome-icon :icon="['fas', 'chevron-down']" />
            </div>
            </button>
            
            <div
                v-if="menuVisible"
                class="bg-amber-400 rounded-md text-white text-xs w-full p-1 text-center absolute top-full left-0 mt-1 shadow-md z-10">
                <ul>
                  <li
                    v-for="(label, value) in sortOptions"
                    :key="value"
                    @click="updateSortOrder(value)"
                    class="cursor-pointer hover:bg-amber-500 py-1">
                    <span>{{ label }}</span>
                  </li>
                </ul>
            </div>
            
        </div>
    </div>
    
    
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
                        <p> {{ place.opening_hours?.open_now ? '營業中' : '營業中' }}</p>
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
  data() {
    return {
      places: [], // 從 Local Storage 加載的餐廳列表
      sortOrder: "default", // 從 Local Storage 加載的排序方式
      menuVisible: false, // 控制下拉菜單顯示
      sortOptions: {
        default: "預設",
        distance: "最近距離",
        rating: "最高評分",
      },
    };
  },
  computed: {
    // 排序後的地點資料
    sortedPlaces() {
      if (this.sortOrder === "distance") {
        return [...this.places].sort((a, b) => {
          return (a.distance || 0) - (b.distance || 0); // 防止 distance 為空
        });
      } else if (this.sortOrder === "rating") {
        return [...this.places].sort((a, b) => {
          return (b.rating || 0) - (a.rating || 0); // 防止 rating 為空
        });
      } else {
        return this.places; // 默認順序
      }
    },
  },
  methods: {
    // 從 Local Storage 獲取資料
    fetchDataFromLocalStorage() {
      const localStorageUtil = {
        get(key) {
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
      };

      // 加載資料並設置默認值
      this.places = localStorageUtil.get("places") || [];
      this.sortOrder = localStorageUtil.get("sortOrder") || "default";
    },

    // 更新排序方式並保存到 Local Storage
    updateSortOrder(value) {
      this.sortOrder = value;
      localStorage.setItem("sortOrder", JSON.stringify(value));
      this.menuVisible = false; // 關閉菜單
    },

    toggleMenu() {
      this.menuVisible = !this.menuVisible; // 切換下拉菜單
    },
  },
  mounted() {
    this.fetchDataFromLocalStorage();

    // 可選：監聽 Local Storage 的更新
    window.addEventListener("places-updated", this.fetchDataFromLocalStorage);
  },
  beforeDestroy() {
    // 清除事件監聽器
    window.removeEventListener("places-updated", this.fetchDataFromLocalStorage);
  },
};
</script>
