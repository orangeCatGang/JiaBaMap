<template>
    <div>
        <Header @search-toggle="handleSearchToggle" />
        <div :class="['flex', { 'mt-20': isSearchOpen }]">
            <RestaurantCard />
            <MapComponent/>
        </div>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import RestaurantCard from '../components/RestaurantCard.vue';
import MapComponent from '../components/MapComponent.vue';
import Header from "../components/Header.vue";

const isSearchOpen = ref(false);

const handleSearchToggle = (isOpen) => {
  isSearchOpen.value = isOpen;
};
</script>