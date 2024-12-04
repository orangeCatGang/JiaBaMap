import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useRestaurantStore = defineStore("restaurant", () => {
  const storeName = ref("");
  const rating = ref("");
  const userRatingCount = ref("");
  const startPrice = ref("");
  const endPrice = ref("");
  const weekdayDescriptions = ref("");
  const formattedAddress = ref("");
  const websiteUri = ref("");
  const nationalPhoneNumber = ref("");
  const storeMap = ref(null);
  const openNow = ref("");
  const storePhoto = ref("");
  const googleMapsUri = ref("");

  

  const groupSize = ref(3);

  // 監聽視窗大小變化
  const initializeWindowListener = () => {
    window.addEventListener('resize', () => {
      groupSize.value = window.innerWidth >= 640 ? 3 : 4;
    });
    // 初始化時也要設置一次
    groupSize.value = window.innerWidth >= 640 ? 3 : 4;
  };
  
  // 相似餐廳相關狀態
  const similarRestaurants = ref([]);
  const currentGroupIndex = ref(0);

  // 推薦餐廳相關狀態
  const recommendedRestaurants = ref([]);
  const recommendedGroupIndex = ref(0);

  const searchTopics = ref([]);

  const fetchPlaceDetail = async () => {
    const apiBaseUrl = import.meta.env.VITE_PLACES_DETAIL_API_BASE_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    // FIXME
    const placesName = "places/ChIJPwFtMx-oQjQRyDjE21ZvByc";
    const fieldsMask =
      "id,displayName,photos,formattedAddress,googleMapsUri,currentOpeningHours,nationalPhoneNumber,priceRange,rating,websiteUri,userRatingCount";
    const langCode = "zh-TW";

    try {
      const res = await fetch(
        `${apiBaseUrl}${placesName}?fields=${fieldsMask}&key=${apiKey}&languageCode=${langCode}`
      );
      const resJson = await res.json();

      storeName.value = resJson.displayName.text;
      rating.value = resJson.rating;
      userRatingCount.value = resJson.userRatingCount;
      startPrice.value = resJson.priceRange.startPrice.units;
      endPrice.value = resJson.priceRange.endPrice.units;
      weekdayDescriptions.value =
        resJson.currentOpeningHours.weekdayDescriptions;
      formattedAddress.value = resJson.formattedAddress;
      websiteUri.value = resJson.websiteUri;
      nationalPhoneNumber.value = resJson.nationalPhoneNumber;
      googleMapsUri.value = resJson.googleMapsUri;
      openNow.value = resJson.currentOpeningHours.openNow;
    } catch (err) {
      console.log("Failed to fetch place detail from Google API.");
      console.log(err);
    }
  };

  const fetchPhotos = async () => {
    const apiBaseUrl = import.meta.env.VITE_PHOTOS_API_BASE_URL;
    const apiKey = import.meta.env.VITE_API_KEY;
    // FIXME
    const photosName =
      "places/ChIJPwFtMx-oQjQRyDjE21ZvByc/photos/AdDdOWrh62xmB7s8LhxpSHRtikDhi4_XyMKnQGP9aYKB-KCZrfdYTSsumwrfvoQu6YMI-X4_5wJJUH--CLZnYoySKfLDioyHMqyOfGf_3hxcT_jlfGW-Yla5yrv-6a3HDpvzfk3JhTVgDs8Ka3wguYr-VRwuxFT2NQ-KmMLW";

    try {
      const res = await fetch(
        `${apiBaseUrl}${photosName}/media?key=${apiKey}&maxHeightPx=800&maxWidthPx=800`
      );
      console.log(res);
      storePhoto.value = URL.createObjectURL(await res.blob());
    } catch (err) {
      console.log("Failed to fetch place photos from Google API.");
      console.log(err);
    }
  };


   // 計算最大頁數索引
   const maxGroupIndex = computed(() => {
    if (!similarRestaurants.value?.length) return 0;
    return Math.max(0, Math.ceil(similarRestaurants.value.length / groupSize.value) - 1);
  });

  // 當前頁面顯示的餐廳
  const currentGroupRestaurants = computed(() => {
    const start = currentGroupIndex.value * groupSize;
    const end = start + groupSize;
    return similarRestaurants.value.slice(start, end);
  });

  // 下一組 - 修改為循環邏輯
  const nextGroup = () => {
    if (currentGroupIndex.value >= maxGroupIndex.value) {
      currentGroupIndex.value = 0; // 回到第一頁
    } else {
      currentGroupIndex.value++;
    }
  };

  // 上一組 - 修改為循環邏輯
  const prevGroup = () => {
    if (currentGroupIndex.value <= 0) {
      currentGroupIndex.value = maxGroupIndex.value; // 跳到最後一頁
    } else {
      currentGroupIndex.value--;
    }
  };

  // 計算要顯示的餐廳列表，包括補充的餐廳
  const displayRestaurants = computed(() => {
    const restaurants = similarRestaurants.value || [];
    if (!restaurants.length) return [];
    
    const remainingSlots = (restaurants.length % groupSize.value);
    if (remainingSlots > 0) {
        return [...restaurants, ...restaurants.slice(0, groupSize.value - remainingSlots)];
    }
    return restaurants;
});

  // 獲取類似餐廳
  const fetchSimilarRestaurants = async (apiKey, location, radius) => {
    const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=restaurant&key=${apiKey}`

    try {
      const proxyUrl = 'https://cors-anywhere.herokuapp.com/'
      const res = await fetch(proxyUrl + apiUrl)

      if (!res.ok) {
        throw new Error(`HTTP Error: ${res.status}`)
      }

      const resJson = await res.json()
      
      if (resJson.status !== "OK") {
        console.error(`Google API Error: ${resJson.status}`, resJson.error_message)
        return
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
      console.log(similarRestaurants.value);
      // 重置组索引
      resetGroupIndex()
    } catch (err) {
      console.error("Fetch error:", err.message)
    }
  }

  // 推薦餐廳的計算屬性
  const displayRecommendedRestaurants = computed(() => {
    const restaurants = recommendedRestaurants.value || [];
    if (!restaurants.length) return [];
    
    const remainingSlots = (restaurants.length % groupSize.value);
    if (remainingSlots > 0) {
        return [...restaurants, ...restaurants.slice(0, groupSize.value - remainingSlots)];
    }
    return restaurants;
});

const maxRecommendedGroupIndex = computed(() => {
  if (!recommendedRestaurants.value?.length) return 0;
  return Math.max(0, Math.ceil(recommendedRestaurants.value.length / groupSize.value) - 1);
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

  
  // 獲取推薦餐廳（不同種類）
  const fetchRecommendedRestaurants = async (apiKey, location, radius) => {
    // 定義不同的餐廳類型
    const restaurantTypes = ['cafe', 'bakery', 'bar', 'meal_takeaway'];
    let allRestaurants = [];

    try {
      // 為每種類型獲取餐廳
      for (const type of restaurantTypes) {
        const apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${apiKey}`;
        
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const res = await fetch(proxyUrl + apiUrl);

        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);

        const resJson = await res.json();
        
        if (resJson.status === "OK") {
          // 從每種類型選取前幾個結果
          const typeRestaurants = resJson.results.slice(0, 3).map((restaurant) => ({
            name: restaurant.name,
            rating: restaurant.rating || "N/A",
            userRatingCount: restaurant.user_ratings_total || 0,
            photoUrl: restaurant.photos
              ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${restaurant.photos[0].photo_reference}&key=${apiKey}`
              : null,
            place_id: restaurant.place_id,
            type: type // 添加類型標記
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


  console.log('Group Size:', groupSize.value);
console.log('Similar Restaurants:', similarRestaurants.value);
console.log('Recommended Restaurants:', recommendedRestaurants.value);

  return {
    storeName,
    rating,
    userRatingCount,
    startPrice,
    endPrice,
    weekdayDescriptions,
    formattedAddress,
    websiteUri,
    nationalPhoneNumber,
    storePhoto,
    storeMap,
    googleMapsUri,
    openNow,
    fetchPlaceDetail,
    fetchPhotos,

     // 相似餐廳相關
     similarRestaurants,
     currentGroupIndex,
     maxGroupIndex,
     displayRestaurants,
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

     // 搜尋主題
    searchTopics,
    fetchSearchTopics,
    
    initializeWindowListener,
    groupSize,
  };

});
