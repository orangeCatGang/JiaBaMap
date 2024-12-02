<script>
import Header from './components/Header.vue'; // 引入 Header 組件
import Footer from './components/Footer.vue'; // 引入 Footer 組件
import RestaurantCard from './components/RestaurantCard.vue';
import MapComponent from './components/MapComponent.vue';
import FilterBar from './components/FilterBar.vue';


export default {
  components: {
    Header,
    FilterBar,
    RestaurantCard,
    MapComponent,
    Footer,
  },
};

</script>

<template>
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


