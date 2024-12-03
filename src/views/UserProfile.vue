<template>
    <div>
        <Header />
        <div class="sm:flex justify-center w-3/4 m-auto gap-9">
            <div class="w-full sm:w-2/3 ">
                <div class=" bg-slate-400 h-1/3">個人資料</div>
                <UserTab />
            </div>
            <div class=" my-10 w-full sm:w-1/3 h-screen">
                <RatingCard />
            </div>
        </div>
    </div>
</template>

<script setup>
import Header from '../components/Header.vue'
import UserTab from '../components/userProfileComment/UserTab.vue'
import RatingCard from '../components/userProfileComment/RatingCard.vue';
</script>