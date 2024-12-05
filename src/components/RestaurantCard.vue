<template>
  <div class="box-border w-1/2 md:w-1/2 pt-2 h-screen overflow-y-auto">
    <div class="flex top-16 flex-col bg-white box-border w-full space-x-0 md:top-6 z-50">
      <div class="flex flex-col">
        <div class="p-3 font-bold text-gray-500">
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

      <div class="relative flex flex-row items-start w-full px-2 mx-3">
        <!-- 餐廳排序 -->
        <div class="relative inline-block w-1/4 mx-1 md:w-1/6">
          <button
            @click="toggleSort"
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
            v-if="sortMenu"
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

        <!-- 價位分類 -->
        <div class="relative inline-block w-1/4 mx-1 md:w-1/6">
          <button
            @click="toggleCost"
            class="bg-amber-500 rounded-md text-white text-xs w-full mt-2 p-1 flex justify-between items-center">
            <div>
              <font-awesome-icon :icon="['fas', 'bars']" />
            </div>
            <span>{{ costOptions[costOrder] }}</span>
            <div>
              <font-awesome-icon :icon="['fas', 'chevron-down']" />
            </div>
          </button>
          <div
            v-if="costMenu"
            class="bg-amber-400 rounded-md text-white text-xs w-full p-1 text-center absolute top-full left-0 mt-1 shadow-md z-10">
            <ul>
              <li
                v-for="(label, value) in costOptions"
                :key="value"
                class="cursor-pointer hover:bg-amber-500 py-1">
                <span>{{ label }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- 篩選條件 -->
        <div class="w-1/4 p-1 mx-1 mt-2 text-xs text-center border rounded-md md:w-1/6 md:border-none">
          <label>
            <input type="checkbox"> 營業中
          </label>
        </div>
        <div class="w-1/4 p-1 mx-1 mt-2 text-xs text-center border rounded-md md:w-1/6 md:border-none">
          <label>
            <input type="checkbox"> 外帶外送
          </label>
        </div>
      </div>
    </div>

    <div 
      v-for="place in sortedPlaces" 
      :key="place.place_id"
      class="flex mt-2 items-center pb-2 border-b">
      <div class="w-40 h-32 ml-3">
        <img v-if="place.photo" :src="place.photo" alt="Place image" class="object-cover w-full h-full" />
      </div>
      <div class="flex flex-col justify-between ml-3 sm:text-xl w-4/5">
        <div class="ml-3">
          <h2 class="font-bold text-gray-500 text-base">
            <a href="#" class="text-amber-500 hover:text-orange-300">{{ place.name }}</a>
          </h2>
        </div>
        <div class="flex mt-3 ml-3 text-xs">
          <div class="bg-red-600 mr-2 rounded-2xl text-white px-2 items-center">
            <p>{{ place.rating }} <font-awesome-icon :icon="['fas', 'star']" /></p>
          </div>
          <p class="mr-2 font-light">(評論數: {{ place.user_ratings_total }})</p>
        </div>
        <div class="flex mt-3 ml-3 text-xs">
          <p class="mr-2 font-light">距離 {{ place.distance.toFixed(2) }} 公里</p>
        </div>
        <div class="mt-3 mx-3 hidden md:flex items-center text-sm">
          <span>
            <font-awesome-icon 
              :icon="['fas' ,'circle']" 
              :style="{color:place.opening_hours?.open_now ? 'green' : 'gray', fontSize:'8px', margin:'2px'}" />
          </span>
          <p> {{ place.opening_hours?.open_now ? '營業中' : '已打烊' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted, onUnmounted } from 'vue';

export default {
  setup() {
    const places = ref([]);
    const sortOrder = ref("default");
    const costOrder = ref("default");
    const sortMenu = ref(false);
    const costMenu = ref(false);

    const sortOptions = {
      default: "預設",
      distance: "最近距離",
      rating: "最高評分",
      reviews: "最高人氣"
    };

    const costOptions = {
      default: "不選擇",
      cost1: "150以內",
      cost2: "150~600",
      cost3: "600~1200",
      cost4: "1200以上"
    };

    const sortedPlaces = computed(() => {
      if (sortOrder.value === "distance") {
        return [...places.value].sort((a, b) => (a.distance || 0) - (b.distance || 0));
      } else if (sortOrder.value === "rating") {
        return [...places.value].sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (sortOrder.value === "reviews") {
        return [...places.value].sort((a, b) => (b.user_ratings_total || 0) - (a.user_ratings_total || 0));
      } else {
        return places.value;
      }
    });

    const fetchDataFromLocalStorage = () => {
      const localStorageUtil = {
        get(key) {
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
      };

      places.value = localStorageUtil.get("places") || [];
      sortOrder.value = localStorageUtil.get("sortOrder") || "default";
    };

    const updateSortOrder = (value) => {
      sortOrder.value = value;
      localStorage.setItem("sortOrder", JSON.stringify(value));
      sortMenu.value = false;
    };

    const toggleSort = () => {
      sortMenu.value = !sortMenu.value;
    };

    const toggleCost = () => {
      costMenu.value = !costMenu.value;
    };


    onMounted(() => {
      fetchDataFromLocalStorage();
      window.addEventListener("places-updated", fetchDataFromLocalStorage);
    });

    onUnmounted(() => {
      window.removeEventListener("places-updated", fetchDataFromLocalStorage);
    });

    return {
      places,
      sortOrder,
      costOrder,
      sortMenu,
      costMenu,
      sortOptions,
      costOptions,
      sortedPlaces,
      updateSortOrder,
      toggleSort,
      toggleCost
    };
  }
};
</script>