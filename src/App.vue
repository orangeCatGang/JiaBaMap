<script setup>
import Search from './components/Search.vue';

</script>

<template>
  <header>
    <!-- <Search /> -->
    <!-- <Places/> -->
    <RouterView />
  </header>
  <div id="app">
    <router-view /> 
  </div>
</template>

