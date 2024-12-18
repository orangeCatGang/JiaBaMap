<script setup>
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'
import RestaurantCard from './components/RestaurantCard.vue'
import MapComponent from './components/MapComponent.vue'
import FilterBar from './components/FilterBar.vue'
import Login from './components/Login.vue'
</script>

<template>
  <Login />
  <!-- <Header /> -->
  <!-- <FilterBar /> -->
  <div class="overflow-x-auto hide-scrollbar">
    <!-- <div class="flex">
      <RestaurantCard />
      <MapComponent/>
    </div> -->
    <RouterView />
    <Footer />
  </div>
</template>

<style scoped>
/* 隱藏滾動條 */
.hide-scrollbar {
  overflow-x: auto;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}

.hide-scrollbar::-webkit-scrollbar {
  display: none; /* Chrome, Safari, Opera */
}
</style>


