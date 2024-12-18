import { ref, computed, onMounted, onUnmounted, watch, onErrorCaptured } from "vue";
import { defineStore } from "pinia";

export const useStore = defineStore("store", () => {
  const windowWidth = ref(window.innerWidth);
  const groupSize = ref(3);
  const totalItems = 20;

  // 基本資料的 ref
  const storeName = ref("");
  const rating = ref("");
  const userRatingCount = ref("");
  const startPrice = ref("");
  const endPrice = ref("");
  const weekDayDescriptions = ref("");
  const formattedAddress = ref("");
  const websiteUri = ref("");
  const nationalPhoneNumber = ref("");
  const storeMap = ref(null);
  const openNow = ref("");
  const storePhoto = ref("");
  const googleMapsUri = ref("");
  const bannerPhoto = ref("");

  let placesId = ""

  const StoreId = (router, placeId) => {
    placesId = placeId
    router.push({
      path: "/store",
      })
  }
  
  const cachedItemsPerPage = ref(3);
  // 相似餐廳相關狀態
  const similarRestaurants = ref([]);
  const currentGroupIndex = ref(0);

  // 推薦餐廳相關狀態
  const recommendedRestaurants = ref([]);
  const recommendedGroupIndex = ref(0);
  const searchTopics = ref([]);

  // 視窗監聽器
  const initializeWindowListener = () => {
    const updateSize = () => {
      windowWidth.value = window.innerWidth;
    };
    window.addEventListener('resize', updateSize);
    updateSize();
  };


  const photoIds = [];
  const fetchPlaceDetail = async () => {
    // // FIXME
    // const placesId = "ChIJPwFtMx-oQjQRyDjE21ZvByc";

    //串接後端API
    try {
      const res = await fetch(
        `http://localhost:3000/restaurants/details?id=${placesId}`
      );
      const resJson = await res.json();

      storeName.value = resJson.displayName;
      rating.value = resJson.rating;
      userRatingCount.value = resJson.userRatingCount;
      startPrice.value = resJson.startPrice;
      endPrice.value = resJson.endPrice;
      weekDayDescriptions.value = resJson.weekDayDescriptions;
      formattedAddress.value = resJson.formattedAddress;
      websiteUri.value = resJson.websiteUri;
      nationalPhoneNumber.value = resJson.nationalPhoneNumber;
      googleMapsUri.value = resJson.googleMapsUri;
      openNow.value = resJson.openNow;
      resJson.photoIds.forEach((id) => {
        photoIds.push(id);
      }); //一個array含兩組id
      console.log(photoIds);
    } catch (err) {
      console.log("Failed to fetch place detail from Google API.");
      console.log(err);
    }
  };

  const fetchStorePhoto = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/restaurants/photo?id=${photoIds[0]}`
      );
      console.log(res);
      storePhoto.value = URL.createObjectURL(await res.blob());
    } catch (err) {
      console.log("Failed to fetch place photos from Google API.");
      console.log(err);
    }
  };

  const fetchBannerPhoto = async () => {
    try {
      const res = await fetch(
        `http://localhost:3000/restaurants/photo?id=${photoIds[1]}`
      );
      console.log(res);
      bannerPhoto.value = URL.createObjectURL(await res.blob());
    } catch (err) {
      console.log("Failed to fetch place photos from Google API.");
      console.log(err);
    }
  };

  const staticMapUrl = computed(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    const zoom = 15; // 縮放級別
    const size = "160x160"; // 地圖大小
    const marker = "color:red|label"; // 標記點樣式

    // 如果沒有位置資訊，返回空
    if (!formattedAddress.value) return null;

    return `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(
      formattedAddress.value
    )}&zoom=${zoom}&size=${size}&markers=${marker}|${encodeURIComponent(
      formattedAddress.value
    )}&key=${apiKey}`;
  });

  // 獲取類似餐廳
  const fetchSimilarRestaurants = async (apiKey, location, radius) => {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=restaurant&key=${apiKey}`
    try {
      console.log('Fetching similar restaurants...');
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
      const res = await fetch(proxyUrl + apiUrl)

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`);
      }

      const resJson = await res.json()
      console.log('API Response:', resJson); // 查看 API 回應

      if (resJson.status !== "OK") {
        console.error(
          `Google API Error: ${resJson.status}`,
          resJson.error_message
        );
        return;
      }
      similarRestaurants.value = resJson.results.map((restaurant) => ({
        name: restaurant.name,
        rating: restaurant.rating || "N/A",
        userRatingCount: restaurant.user_ratings_total || 0,
        address: restaurant.vicinity || "Unknown Address",
        location: restaurant.geometry?.location,
        isOpen: restaurant.opening_hours?.open_now || false,
        photoUrl: restaurant.photos
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${restaurant.photos[0].photo_reference}&key=${apiKey}`
          : null,
        place_id: restaurant.place_id
      }))
      console.log('Mapped restaurants:', similarRestaurants.value); 
      resetGroupIndex()
    } catch (err) {
      console.error("Fetch error:", err.message);
    }
  }
  // 處理分頁切換
  const handlePrevGroup = () => {
    if (recommendedGroupIndex.value <= 0) {
      recommendedGroupIndex.value = maxRecommendedGroupIndex.value;
    } else {
      recommendedGroupIndex.value--;
    }
  };

  const handleNextGroup = () => {
    if (recommendedGroupIndex.value >= maxRecommendedGroupIndex.value) {
      recommendedGroupIndex.value = 0;
    } else {
      recommendedGroupIndex.value++;
    }
  };


  // maxGroupIndex 計算
  const maxGroupIndex = computed(() => {
    if (!similarRestaurants.value?.length) return 0;
    const itemsPerPage = windowWidth.value >= 768 ? 3 : 2;
    return Math.ceil(totalItems / itemsPerPage) - 1;
  });


  // 當前頁面顯示的餐廳
  const currentGroupRestaurants = computed(() => {
    const start = currentGroupIndex.value * groupSize;
    const end = start + groupSize;
    return similarRestaurants.value.slice(start, end);
  });

  // 修改導航方法以使用新的計算邏輯
  const nextGroup = () => {
    if (currentGroupIndex.value >= maxGroupIndex.value) {
      currentGroupIndex.value = 0;
    } else {
      currentGroupIndex.value++;
    }
  };

  const prevGroup = () => {
    if (currentGroupIndex.value <= 0) {
      currentGroupIndex.value = maxGroupIndex.value;
    } else {
      currentGroupIndex.value--;
    }
  };

  // displayRestaurants 計算
  const displayRestaurants = computed(() => {
    const restaurants = similarRestaurants.value || [];
    if (!restaurants.length) return [];

    const itemsPerPage = windowWidth.value >= 768 ? 3 : 2;
    if (itemsPerPage !== cachedItemsPerPage.value) {
      cachedItemsPerPage.value = itemsPerPage;
      currentGroupIndex.value = 0; // 重置當前頁碼
    }

    const start = currentGroupIndex.value * cachedItemsPerPage.value;
    const end = start + cachedItemsPerPage.value;

    return restaurants.slice(start, end).map((restaurant, index) => ({
      ...restaurant,
      uniqueId: `${restaurant.place_id}-${currentGroupIndex.value}-${index}`
    }));
  });

  // 推薦餐廳的方法
  const nextRecommendedGroup = () => {
    if (recommendedGroupIndex.value >= maxRecommendedGroupIndex.value) {
      recommendedGroupIndex.value = 0;
    } else {
      recommendedGroupIndex.value++;
    }
  };

  const prevRecommendedGroup = () => {
    if (recommendedGroupIndex.value <= 0) {
      recommendedGroupIndex.value = maxRecommendedGroupIndex.value;
    } else {
      recommendedGroupIndex.value--;
    }
  };


  // 修改 maxRecommendedGroupIndex 計算
  const maxRecommendedGroupIndex = computed(() => {
    if (!recommendedRestaurants.value?.length) return 0;
    // 根據螢幕寬度決定每頁顯示數量
    const itemsPerPage = windowWidth.value >= 768 ? 3 : 2;
    // 計算總頁數
    return Math.ceil(12 / itemsPerPage) - 1; // 12組資料，大螢幕4頁，小螢幕6頁
  });

  // 修改 displayRecommendedRestaurants 計算
  // 修改 displayRecommendedRestaurants 計算
  const displayRecommendedRestaurants = computed(() => {
    const restaurants = recommendedRestaurants.value || [];
    if (!restaurants.length) return [];

    const itemsPerPage = windowWidth.value >= 768 ? 3 : 2;
    const start = recommendedGroupIndex.value * itemsPerPage;

    // 確保每頁都是唯一的餐廳資料
    const uniqueRestaurants = new Set();
    const result = [];

    while (result.length < itemsPerPage && uniqueRestaurants.size < restaurants.length) {
      const randomIndex = Math.floor(Math.random() * restaurants.length);
      const restaurant = restaurants[randomIndex];
      if (!uniqueRestaurants.has(restaurant.place_id)) {
        uniqueRestaurants.add(restaurant.place_id);
        result.push({
          ...restaurant,
          uniqueId: `${restaurant.place_id}-${recommendedGroupIndex.value}-${result.length}`
        });
      }
    }

    return result;
  });

  // 獲取推薦餐廳（不同種類）
  const fetchRecommendedRestaurants = async (apiKey, location, radius) => {
    // 定義不同的餐廳類型
    const restaurantTypes = ["cafe", "bakery", "bar", "meal_takeaway"];
    let allRestaurants = [];

    try {
      // 為每種類型獲取餐廳
      for (const type of restaurantTypes) {
        const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`;

        const proxyUrl = "https://cors-anywhere.herokuapp.com/";
        const res = await fetch(proxyUrl + apiUrl);

        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

        const resJson = await res.json();

        if (resJson.status === "OK") {
          // 從每種類型選取前幾個結果
          const typeRestaurants = resJson.results
            .slice(0, 3)
            .map((restaurant) => ({
              name: restaurant.name,
              rating: restaurant.rating || "N/A",
              userRatingCount: restaurant.user_ratings_total || 0,
              photoUrl: restaurant.photos
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${restaurant.photos[0].photo_reference}&key=${apiKey}`
                : null,
              place_id: restaurant.place_id,
              type: type, // 添加類型標記
            }));

          allRestaurants = [...allRestaurants, ...typeRestaurants];
        }
      }

      // 隨機打亂結果
      recommendedRestaurants.value = allRestaurants
        .sort(() => Math.random() - 0.5)
        .slice(0, 15); // 限制總數量

      recommendedGroupIndex.value = 0;
    } catch (err) {
      console.error("Fetch recommended restaurants error:", err.message);
    }
  };

  // 重置索引
  const resetGroupIndex = () => {
    currentGroupIndex.value = 0;
    recommendedGroupIndex.value = 0;
  };


  const fetchSearchTopics = async () => {
    try {
      // 獲取搜尋主題的 API 調用
      const apiBaseUrl = import.meta.env.VITE_SEARCH_TOPICS_API_BASE_URL;
      const apiKey = import.meta.env.VITE_API_KEY;
      const placesId = "ChIJPwFtMx-oQjQRyDjE21ZvByc"; // 替換為實際的 placesId

      const res = await fetch(
        `${apiBaseUrl}/topics?placesId=${placesId}&key=${apiKey}`
      );
      const resJson = await res.json();

      searchTopics.value = resJson.topics || [];
    } catch (err) {
      console.log("Failed to fetch search topics from API.");
      console.log(err);
    }
  };

  return {
    // 視窗相關
    windowWidth,
    initializeWindowListener,
    groupSize,
    // 基本資料
    storeName,
    rating,
    userRatingCount,
    startPrice,
    endPrice,
    weekDayDescriptions,
    formattedAddress,
    websiteUri,
    nationalPhoneNumber,
    storePhoto,
    bannerPhoto,
    storeMap,
    googleMapsUri,
    openNow,
    placesId,
    StoreId,
    
    // API 方法
    fetchPlaceDetail,
    fetchStorePhoto,
    fetchBannerPhoto,
    staticMapUrl,
    // 相似餐廳相關
    similarRestaurants,
    currentGroupIndex,
    maxGroupIndex,
    displayRestaurants,
    groupSize,
    handlePrevGroup,
    handleNextGroup,
    nextGroup,
    prevGroup,
    fetchSimilarRestaurants,
    // 推薦餐廳相關
    recommendedRestaurants,
    recommendedGroupIndex,
    maxRecommendedGroupIndex,
    displayRecommendedRestaurants,
    nextRecommendedGroup,
    prevRecommendedGroup,
    fetchRecommendedRestaurants,
    // 其他
    searchTopics,
    fetchSearchTopics,
  };
});
