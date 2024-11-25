<template>
  <div>
    <CommentInput @submitComment="addComment" />
    <PreviousReview :comments="comments" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
// 留言框
import CommentInput from './CommentInput.vue'
// 先前的評論
import PreviousReview from './PreviousReview.vue'

const comments = ref([])

const addComment = (newComment) => {
  comments.value.unshift(newComment)
}
</script>

