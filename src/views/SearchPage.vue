<template>
    <div>
        <Header />
        <!-- <FilterBar /> -->
        <div class="flex">
            <RestaurantCard />
            <MapComponent/>
        </div>
    </div>
</template>
<script setup>
import RestaurantCard from '../components/RestaurantCard.vue';
import MapComponent from '../components/MapComponent.vue';
import FilterBar from '../components/FilterBar.vue';
import Header from "../components/Header.vue";

</script>