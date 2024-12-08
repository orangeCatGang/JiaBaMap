import { defineStore } from 'pinia'

export const useRestaurantStore = defineStore('restaurant', {
  state: () => ({
    hoveredPlaceId: null
  }),
  actions: {
    setHoveredPlace(placeId) {
      this.hoveredPlaceId = placeId
    }
  }
})