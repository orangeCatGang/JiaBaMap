<script setup>
import Header from './components/Header.vue'; // 引入 Header 組件
import Footer from './components/Footer.vue'; // 引入 Footer 組件

</script>

<template>
    <Header />
    <div class="overflow-x-scroll">
      <RouterView />
      <Footer />
    </div>
</template>

