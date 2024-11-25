<template>
    <div class="flex gap-2" @mouseleave="resetHoverIndex">
        <div 
        class="w-8 h-8 rounded-full cursor-pointer"
        v-for="starIndex in totalStars"
        :key="starIndex"
        :class="{
        'bg-slate-200': starIndex > hoverIndex && starIndex > selectIndex,
        'bg-amber-500': starIndex <= hoverIndex || starIndex <= selectIndex
        }"
        @mouseenter="setHoverIndex(starIndex)"
        @click="starClick(starIndex)"
        ></div>
        <p>{{ hint[0] }}
            <label v-if="hint[1]" class="p-1 text-sm text-white rounded-full bg-amber-500">{{ hint[1] }}</label>
        </p>
    </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
const hints = ['很不喜歡', '需要加油', '普通', '還不錯', '非常推薦'];
const scores = ['1.0 ★', '2.0 ★', '3.0 ★', '4.0 ★', '5.0 ★']
const totalStars = 5
const hoverIndex = ref(0)
const selectIndex = ref(0)

// 監視
watch(selectIndex, (newScore) => {
    emit('score-update', newScore)
})

const emit = defineEmits(['score-update'])

// 重置
const props = defineProps({
    resetScores: Boolean
})

watch(() => props.resetStatus, (newValue) => {
    if (newValue) {
        imageUrls.value = [] // 清空本地圖片
    }
})

// 評分標籤
const hint = computed(() => {
    if (hoverIndex.value > 0) {
        return [hints[hoverIndex.value - 1], scores[hoverIndex.value - 1]]
    }
    if (selectIndex.value > 0) {
        return [hints[selectIndex.value - 1], scores[selectIndex.value - 1]]
    }
    return ['給予評分']
})

const resetHoverIndex = () => {
    hoverIndex.value = 0
}

const setHoverIndex = (index) => {
    hoverIndex.value = index
}
const starClick = (index) => {
    selectIndex.value = index
}
</script>