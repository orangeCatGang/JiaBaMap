<template>
    <div class="flex gap-5">
        <div class="w-12 h-12 rounded-full bg-slate-300">
            <img src="../../assets/default_user.png" alt="avatar" class="w-full h-auto overflow-hidden ">
        </div>
        <div class="flex">
            <div class="text-left w-96">
                <button @click="openComment" class="p-2 border-2 border-solid rounded-lg border-amber-500 text-amber-500">留下您對餐廳的評論</button>
                <Stars @score-update="updateScore" :resetScores="resetScores" class="my-2" />
                <div class="flex flex-col" v-if="isExpanded">
                    <input type="text" v-model="commentText" class="w-full h-20 border-2 border-solid rounded-sm" placeholder="發表用餐經驗">
                    <div class="flex items-center w-full h-10 my-2">
                        <input type="number" v-model="price" placeholder="輸入用餐價格" class="flex-1 h-10 border-2 border-solid rounded-sm">
                        <label class="ml-2">元/人</label>
                    </div>
                    <UploadPic @pics-update="updatePics" :resetPics="resetPics" />
                    <button @click="submitComment" class="w-full p-2 my-2 mr-4 font-bold rounded-lg shadow text-amber-500">送出評論</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, resolveDirective } from 'vue'
import Stars from "./Stars.vue"
import UploadPic from "./UploadPic.vue"

const time = new Date()
const price = ref('')
const score = ref('')
const pictures = ref([])
const commentText = ref('')
let isExpanded = ref(false)
let resetPics = ref(false)
let resetScores = ref(false)

const updateScore = (newScore) => {
    score.value = newScore;
};
const updatePics = (pics) => {
    pictures.value = pics
}

const emit = defineEmits(['submitComment'])
const comment = ref({})

const submitComment = () => {
    if(!commentText.value.trim()){
        alert('請輸入評論')
        return
    }

    comment.value = {
        id: crypto.randomUUID(),
        userName: "Julie Wang",
        avatar: 'https://cats.com/wp-content/uploads/2024/05/A-long-haired-orange-cat-looks-up-with-gentle-eyes-compressed.jpg',
        reviewNum: 999,
        commentTime: time.toLocaleDateString(),
        star: score.value,
        price: price.value,
        commentText: commentText.value,
        pictures: pictures.value,
        likeStatus: false,
        likeHint: "表示讚賞",
        likeNum: 0
    }
    console.log("Submit comments:", comment.value)
    emit('submitComment', comment.value)
    commentText.value = ''
    price.value = ''
    score.value = ''
    pictures.value = []
    resetPics.value = true // 通知子元件重置
    setTimeout(() => (resetPics.value = false), 0) // 恢復狀態
    resetScores.value = true
}

const openComment = () => {
    isExpanded.value = !isExpanded.value
}
</script>

<style scoped>
/* 隱藏數字輸入框的小箭頭 */
/* Chrome, Safari, Edge, Opera */
input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}
</style>