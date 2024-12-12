<template>
    <div class="flex flex-col gap-x-5" v-if="comments.length > 0">
        <div class="flex gap-x-5 gap-y-6" v-for="(comment, index) in comments" :key="index">
            <div class="w-12 h-12 overflow-hidden rounded-full bg-slate-300">
                <img :src="comment.avatar ? comment.avatar : '/src/assets/default_user.png'" alt="avatar" class="object-cover w-full h-full">
            </div>
            <div class="flex flex-col text-left">
                <a class="font-bold" href="#">{{ comment.userName }}<span>（{{ comment.reviewNum }} 則評論）</span></a>
                <div class="flex gap-3">
                    <span v-if="comment.star" class="p-1 text-sm text-white rounded-full bg-amber-500">{{ comment.star }}.0 ★</span>
                    <p v-if="comment.price">均消價位：${{ comment.price }}</p>
                </div>
                <p class="text-slate-500">評論日期：{{ comment.commentTime }}</p>
                <p class="my-3">{{ comment.commentText }}</p>
                <div>
                    <button @click="toggleLike(comment)" class="p-2 rounded-lg shadow ">{{ comment.likeHint }}</button>
                    <button class="p-2 ml-2 rounded-lg shadow" @click="shareComment(comment)">分享評論</button>
                </div>
                <div class="flex gap-4">
                    <div v-for="(imageUrl, index) in comment.pictures" :key="index" class="overflow-hidden w-52 h-52">
                        <img :src="imageUrl" class="w-full my-2">
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// 讚數
let likeNum = ref(0)
let likeHint = ref('表示讚賞')
let likeStatus = ref(false)

const props = defineProps({
    comments: {
        type: Array,
        default: () => [],
    }
})
console.log("Received comments:", props.comments)


// 讚數+1
const toggleLike = (comment) => {
    if (comment.likeStatus){
        comment.likeNum--
        comment.likeHint = "表示讚賞"
    } else {
        comment.likeNum++
        comment.likeHint = `❤ + ${comment.likeNum}`
    }
    comment.likeStatus = !comment.likeStatus
}

//分享
const shareComment = (comment) => {
    if(navigator.share){
        navigator.share({
            title: '我看到一家超讚的餐廳',
            text: `${comment.commentText} - 評分：${comment.star} ★`,
            url: window.location.href
        })
        .then(() => console.log('分享成功'))
        .catch((error) => console.log('分享失敗：', error))
    } else {
        alert('您的瀏覽器不支援分享功能')
    }
}

</script>