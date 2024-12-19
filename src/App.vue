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
  <div class="relative min-h-screen">
    <Header />
    <div class="overflow-x-auto hide-scrollbar">
      <RouterView />
      <Footer />
    </div>
  </div>
</template>

<style scoped>
/* 隱藏滾動條 */
.hide-scrollbar {
  overflow-x: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
  padding-top: 60px;
}

.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
</style>


