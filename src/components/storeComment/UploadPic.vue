<template>
    <div>
        <!-- 用隱藏的 input type=file 來觸發檔案選擇器 -->
        <input type="file" ref="fileInput" @change="handleFileChange" hidden>
        <!-- 圖片預覽 -->
        <div v-if="pictures.length" class="flex flex-wrap">
            <div v-for="(imageUrl, index) in pictures" :key="index" class="relative w-1/3 p-1 overflow-hidden md:w-1/2">
                <div @click="deleteImg(index)" class="absolute text-lg font-bold leading-7 text-center text-white bg-red-500 rounded-full cursor-pointer w-7 h-7 top-2 right-2">X</div>
                <img :src="imageUrl" >
            </div>
        </div>
        <!-- 點擊按鈕上傳圖片 -->
        <button @click="triggerFileInput"
        :class="{
            'my-2 text-white bg-slate-200':isDisabled,
            'my-2 text-white bg-amber-500 ':!isDisabled,
        }"
        class="w-full p-2 mr-4 font-bold rounded-lg shadow"
        :disabled="isDisabled">附上相片（至多五張）</button>
    </div>
</template>

<script setup>
import { computed, ref } from  'vue'
import { usePicStore } from '../../stores/picStore'

const picStore = usePicStore()
const fileInput = ref(null)
const pictures = computed(() => picStore.pictures)
const isDisabled = computed(() => picStore.isDisabled)

const triggerFileInput = () => {
    fileInput.value.click()
}

const deleteImg = (index) => {
    picStore.removePic(index)
}

const handleFileChange = (e) => {
    const file = e.target.files[0]
    if(file){
        const reader = new FileReader()
        reader.onload = (event) => {
            picStore.addPic(event.target.result)
        }
        reader.readAsDataURL(file)
    }
}

</script>