<script setup>
import Header from './components/Header.vue'; // 引入 Header 組件
import Footer from './components/Footer.vue'; // 引入 Footer 組件

</script>

<template>
    <Header />
    <div class="overflow-x-auto hide-scrollbar">
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


