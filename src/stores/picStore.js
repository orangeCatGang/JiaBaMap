import { defineStore } from "pinia"
import { ref, computed } from "vue"

export const usePicStore = defineStore('picture', () => {
    const maxImages = ref(5)
    const pictures = ref([])
    const isDisabled = computed(() => pictures.value.length >= maxImages.value)

    const addPic = (imageUrl) => {
        if(pictures.value.length < maxImages.value){
            pictures.value.push(imageUrl)
        } else {
            alert(`最多只能上傳 ${maxImages.value} 張圖片`)
        }
    }
    const removePic = (index) => {
        pictures.value.splice(index, 1)
    }
    const resetPic = () => {
        pictures.value = []
    }

    return{
        maxImages,
        isDisabled,
        pictures,
        addPic,
        removePic,
        resetPic
    }
})