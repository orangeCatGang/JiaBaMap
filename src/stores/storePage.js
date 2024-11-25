import { ref } from "vue";
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
  };
});
