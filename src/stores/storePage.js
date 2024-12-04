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

  const openNow = ref("");
  const storePhoto = ref("");
  const storeMap = ref("");
  const googleMapsUri = ref("");

  const similarRestaurants = ref([]);
  const currentGroupIndex = ref(0);
  const groupSize = 3;
  const recommendedRestaurants = ref([]);
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


   // 計算最大組索引
  const maxGroupIndex = computed(() => {
    const length = similarRestaurants.value.length;
    // 修改計算方式，確保能夠完整顯示所有餐廳
    return Math.ceil(length / groupSize) - 1;
  });

  // 當前頁面顯示的餐廳
  const currentGroupRestaurants = computed(() => {
    const start = currentGroupIndex.value * groupSize;
    const end = start + groupSize;
    return similarRestaurants.value.slice(start, end);
  });

  // 下一組
  const nextGroup = () => {
    if (currentGroupIndex.value < maxGroupIndex.value) {
      currentGroupIndex.value++;
      console.log('Next group clicked:', currentGroupIndex.value); // 添加日誌
    }
  };

  // 上一組
  const prevGroup = () => {
    if (currentGroupIndex.value > 0) {
      currentGroupIndex.value--;
      console.log('Previous group clicked:', currentGroupIndex.value); // 添加日誌
    }
  };

  // 获取相似餐厅的方法
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

  
  
  const fetchRecommendedRestaurants = async () => {
    try {
      // 根據當前餐廳獲取推薦餐廳的 API 調用
      const apiBaseUrl = import.meta.env.VITE_RECOMMENDED_RESTAURANTS_API_BASE_URL;
      const apiKey = import.meta.env.VITE_API_KEY;
      const placesId = "ChIJPwFtMx-oQjQRyDjE21ZvByc"; // 替換為實際的 placesId
  
      const res = await fetch(
        `${apiBaseUrl}/recommended?placesId=${placesId}&key=${apiKey}`
      );
      const resJson = await res.json();
  
      recommendedRestaurants.value = resJson.restaurants || [];
    } catch (err) {
      console.log("Failed to fetch recommended restaurants from API.");
      console.log(err);
    }
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

    similarRestaurants,
    currentGroupIndex,
    maxGroupIndex,
    currentGroupRestaurants,
    nextGroup,
    prevGroup,
    fetchSimilarRestaurants,

    recommendedRestaurants,
    searchTopics,

    
    fetchRecommendedRestaurants,
    fetchSearchTopics
    
  };

});
