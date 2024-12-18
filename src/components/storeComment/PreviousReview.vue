<template>
    <div class="flex flex-col gap-y-5" v-if="comments.length > 0">
        <div class="flex flex-row gap-x-5 py-2.5 w-full max-w-screen-lg mx-auto md:px-0" v-for="(comment, index) in comments" :key="index">
            <div class="flex-shrink-0 w-16 h-16 overflow-hidden rounded-full bg-slate-300">
                <img :src="comment.avatar ? comment.avatar : '/src/assets/default_user.png'" alt="avatar" class="object-cover w-full h-full">
            </div>
            <div class="flex flex-col flex-1 w-0 text-left">
                <router-link to="/user" class="font-bold cursor-pointer text-amber-500">{{ comment.userName }}（{{ comment.reviewNum }} 則評論）</router-link>
                <div class="flex gap-3">
                    <span v-if="comment.star" class="px-2 py-1 text-sm font-bold text-white rounded-full bg-amber-500">{{ comment.star }}.0 ★</span>
                    <p v-if="comment.price">均消價位：${{ comment.price }}</p>
                </div>
                <p class="text-slate-500">評論日期：{{ comment.commentTime }}</p>
                <p class="my-3">{{ comment.commentText }}</p>
                <div>
                    <button @click="toggleLike(comment)" class="p-2 rounded-lg shadow ">{{ comment.likeHint }}</button>
                    <button class="p-2 ml-2 rounded-lg shadow" @click="shareComment(comment)">分享評論</button>
                </div>
                <div class="flex gap-4 mt-4 overflow-x-auto scrollbar-hide" style="scroll-snap-type: x mandatory;">
                    <div v-for="(imageUrl, index) in comment.pictures" :key="index" class="flex-shrink-0 w-32 h-32 overflow-hidden">
                        <img :src="imageUrl" @click="showPopup(imageUrl)" class="object-cover w-full h-full cursor-pointer">
                    </div>
                </div>
            </div>
        </div>
        <!-- Popup -->
        <div v-if="popupImage" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
            <div class="relative w-full max-w-screen-md">
                <span
                class="absolute p-2 text-black bg-white rounded-full shadow cursor-pointer top-2 right-2"
                @click="closePopup">
                ✕
                </span>
                <img :src="popupImage" class="object-contain w-1/2 m-auto max-h-1/2" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCommentStore } from '../../stores/commentStore'

// 從 Store 獲取評論數據
const commentStore = useCommentStore()
const comments = computed(() => commentStore.comments)

// 圖片popup
const popupImage = ref(null)

const showPopup = (imageUrl) => {
    popupImage.value = imageUrl;
}
const closePopup = () => {
      popupImage.value = null;
}

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