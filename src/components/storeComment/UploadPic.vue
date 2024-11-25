<template>
    <div class="wrap">
        <!-- 用隱藏的 input type=file 來觸發檔案選擇器 -->
        <input type="file" ref="fileInput" @change="handleFileChange" hidden>
        <!-- 圖片預覽 -->
        <div v-if="imageUrls" class="flex gap-4">
            <div v-for="(imageUrl, index) in imageUrls" :key="index" class="relative overflow-hidden w-52 h-52">
                <div @click="deleteImg" class="absolute text-lg font-bold leading-7 text-center text-white bg-red-500 rounded-full cursor-pointer w-7 h-7 top-2 right-2 ">X</div>
                <img :src="imageUrl" class="w-full my-2">
            </div>
        </div>
        <!-- 點擊按鈕上傳圖片 -->
        <button @click="triggerFileInput"
        :class="{
            'my-2 text-white bg-slate-200':isDisabled,
            'my-2 text-white bg-amber-500 ':!isDisabled,
        }"
        class="w-full p-2 mr-4 font-bold rounded-lg shadow"
        :disabled="isDisabled">附上相片（至多十張）</button>
    </div>
</template>
<script setup>
import { computed, ref, watch } from  'vue'
const fileInput = ref(null)
const imageUrls = ref([])
const maxImages = 2
let isDisabled = computed(() => imageUrls.value.length >= maxImages)

const triggerFileInput = () => {
    fileInput.value.click()
}

const props = defineProps({
    resetPics: Boolean
})

watch(() => props.resetStatus, (newValue) => {
    if (newValue) {
        imageUrls.value = [] // 清空本地圖片
    }
})

const deleteImg = () => {
    imageUrls.value.pop()
}

const emit = defineEmits(['pics-update'])

const handleFileChange = (e) => {
    const file = e.target.files[0]
    if(file){
        const reader = new FileReader()
        reader.onload = (event) => {
            imageUrls.value.push(event.target.result)
            emit('pics-update', imageUrls.value)
        }
        reader.readAsDataURL(file)
    }
}

</script>