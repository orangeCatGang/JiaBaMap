<template>
    <div class="flex gap-5 mb-4">
        <div class="flex-shrink-0 w-16 h-16 rounded-full bg-slate-300">
            <img src="../../assets/default_user.png" alt="avatar" class="w-full h-auto overflow-hidden ">
        </div>
        <div class="flex flex-1 md:flex-none md:basis-2/3">
            <div class="w-full text-left md:w-96">
                <button @click="openComment" class="p-2 border-2 border-solid rounded-lg border-amber-500 text-amber-500">留下您對餐廳的評論</button>
                <Stars class="my-2" />
                <div class="flex flex-col" v-if="isExpanded">
                    <textarea
                        v-model="commentText"
                        maxlength="200"
                        class="w-full h-20 border-2 border-solid rounded-sm resize-none"
                        placeholder="發表用餐經驗"
                    ></textarea>
                    <p v-if="commentText.length >= 1" class="text-sm text-slate-500">
                        還可以輸入 {{ 200 - commentText.length }} 字
                    </p>
                    <div class="flex items-center w-full h-10 my-2">
                        <input type="number" v-model="price" placeholder="輸入用餐價格" class="flex-1 h-10 border-2 border-solid rounded-sm">
                        <label class="ml-2">元 / 人</label>
                    </div>
                    <UploadPic />
                    <button @click="submitComment" class="w-full p-2 my-2 font-bold rounded-lg shadow md:flex-1 text-amber-500">送出評論</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import Stars from "./Stars.vue"
import UploadPic from "./UploadPic.vue"
import { useStarsStore } from '../../stores/starStore';
import { useCommentStore } from '../../stores/commentStore';
import { usePicStore } from '../../stores/picStore';

const time = new Date()
const price = ref('')
const commentText = ref('')
let isExpanded = ref(false)

// 引入 Pinia Store
const starsStore = useStarsStore()
const commentStore = useCommentStore()
const picStore = usePicStore()

const submitComment = () => {
    if(!commentText.value.trim()){
        alert('請輸入評論')
        return
    }

    const newComment = {
        id: crypto.randomUUID(),
        userName: "Julie Wang",
        avatar: 'https://cats.com/wp-content/uploads/2024/05/A-long-haired-orange-cat-looks-up-with-gentle-eyes-compressed.jpg',
        reviewNum: 999,
        commentTime: time.toLocaleDateString(),
        star: starsStore.selectIndex,
        price: price.value,
        commentText: commentText.value,
        pictures: picStore.pictures,
        likeStatus: false,
        likeHint: "表示讚賞",
        likeNum: 0
    }
    commentStore.addComment(newComment); // 使用 Pinia Store 更新評論
    //重置輸入框
    commentText.value = ''
    price.value = ''
    picStore.resetPic() // 重置圖片
    starsStore.resetStars() // 重置星星狀態
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
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
}
</style>