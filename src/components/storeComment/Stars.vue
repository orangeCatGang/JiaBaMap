<template>
    <div class="flex gap-2" @mouseleave="resetHoverIndex">
        <div 
        class="w-8 h-8 rounded-full cursor-pointer"
        v-for="starIndex in starsStore.totalStars"
        :key="starIndex"
        :class="{
        'bg-slate-200': starIndex > starsStore.hoverIndex && starIndex > starsStore.selectIndex,
        'bg-amber-500': starIndex <= starsStore.hoverIndex || starIndex <= starsStore.selectIndex
        }"
        @mouseenter="setHoverIndex(starIndex)"
        @click="starClick(starIndex)"
        ></div>
        <p>{{ starsStore.hint[0] }}
            <label v-if="starsStore.hint[1]" class="px-2 py-1 text-sm text-white rounded-full bg-amber-500">{{ starsStore.hint[1] }}</label>
        </p>
    </div>
</template>

<script setup>
import { useStarsStore } from '../../stores/starStore'
const starsStore = useStarsStore()

const resetHoverIndex = () => {
    starsStore.setHoverIndex(0)
}

const setHoverIndex = (index) => {
    starsStore.setHoverIndex(index)
}
const starClick = (index) => {
    starsStore.setSelectIndex(index)
}
</script>