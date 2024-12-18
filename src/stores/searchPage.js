import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useRestaurantStore = defineStore('restaurant', () => {
  const hoveredPlaceId = ref(null);

  function setHoveredPlace(placeId) {
    hoveredPlaceId.value = placeId;
  }


  return {
    hoveredPlaceId,
    setHoveredPlace,
  };
});
