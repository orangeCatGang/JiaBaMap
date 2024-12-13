<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import dayjs from 'dayjs'


const formatDate = (date) => {
 return dayjs(date).format('YYYY-MM-DD HH:mm:ss');
};

const publishedArticles = ref([]); 


const newComment = ref({
 content: '',
 rating: 5
});

const newReply = ref({
 content: '',
 replyingTo: null
});

// 設置 axios 基礎 URL
const api = axios.create({
 baseURL: 'http://localhost:3000/api'
});

// 獲取所有文章
const fetchArticles = async () => {
 try {
   const { data } = await api.get('/articles');
   console.log('從後端獲取的文章:', data);
   publishedArticles.value = data; // 更新 ref 的值
 } catch (error) {
   console.error('獲取文章失敗:', error);
 }
};

// 添加評論
const addComment = async (articleId) => {
 if (!articleId) {
   console.error('No article ID provided');
   return;
 }

 if (!newComment.value.content.trim()) {
   alert('請輸入評論內容');
   return;
 }

 try {
   console.log('Adding comment to article:', articleId); // 添加日誌
   
   await api.post(`/articles/${articleId}/comments`, {
     content: newComment.value.content,
     rating: parseInt(newComment.value.rating),
     user: '訪客',
     date: dayjs().format('YYYY-MM-DD HH:mm:ss')
   });
   
   await fetchArticles();
   newComment.value.content = '';
   newComment.value.rating = 5;
 } catch (error) {
   console.error('Error adding comment:', error.response?.data || error);
 }
};

// 刪除評論
const deleteComment = async (articleId, commentId) => {
 try {
   if (!confirm('確定要刪除這則評論嗎？')) {
     return;
   }
   
   await api.delete(`/articles/${articleId}/comments/${commentId}`);
   await fetchArticles();
 } catch (error) {
   console.error('Error deleting comment:', error);
 }
};

// 添加回覆
const addReply = async (articleId, commentId) => {
 if (!newReply.value.content.trim()) {
   alert('請輸入回覆內容');
   return;
 }
 
 try {
   await api.post(`/articles/${articleId}/comments/${commentId}/replies`, {
     content: newReply.value.content,
     user: '訪客',
     date: dayjs().format('YYYY-MM-DD HH:mm:ss')  // 添加日期
   });
   
   // 重新獲取文章列表以更新回覆
   await fetchArticles();
   newReply.value.content = '';
   newReply.value.replyingTo = null;
 } catch (error) {
   console.error('Error adding reply:', error);
 }
};

// 刪除回覆
const deleteReply = async (articleId, commentId, replyId) => {
 try {
   if (!confirm('確定要刪除這則回覆嗎？')) {
     return;
   }
   
   await api.delete(`/articles/${articleId}/comments/${commentId}/replies/${replyId}`);
   await fetchArticles();
 } catch (error) {
   console.error('Error deleting reply:', error);
 }
};

const toggleContent = (article) => {
 article.showFullContent = !article.showFullContent;
};

const toggleReplyForm = (commentId) => {
 if (newReply.value.replyingTo === commentId) {
   newReply.value.replyingTo = null;  // 關閉表單
 } else {
   newReply.value.replyingTo = commentId;  // 打開表單
 }
};

// 在 onMounted 中調用
onMounted(async () => {
  fetchArticles();      // 然後獲取所有文章
});

</script>

<template>
 <div>
   <Header />
  <div class="max-w-4xl mx-auto mt-8 px-4 md:px-0">
    <article 
      v-for="article in publishedArticles" 
      :key="article.id"
      class="bg-white rounded-lg shadow-lg overflow-hidden mb-8"
    >
      <!-- 桌面版排版 (>=768px) -->
      <div class="hidden md:block">
        <div class="p-6">
          <img 
            :src="article.photo" 
            :alt="article.title"
            class="w-full h-64 object-cover rounded-lg mb-4"
          />
          <div class="space-y-4">
            <h2 class="text-2xl font-bold">{{ article.title }}</h2>
            <div class="flex items-center text-gray-600 space-x-4">
              <span>{{ formatDate(article.date) }}</span>
              <span>{{ article.location }}</span>
              <span>{{ article.price }}</span>
              <span>營業時間: {{ article.openHours }}</span>
            </div>
            <div class="flex items-center space-x-2">
              <span class="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                {{ article.rating }} 分
              </span>
            </div>
            <p class="text-gray-700 leading-relaxed">{{ article.content }}</p>
          </div>
        </div>
      </div>

      <!-- 手機版排版 (<768px) -->
      <div class="md:hidden">
        <div class="relative">
          <img 
            :src="article.photo" 
            :alt="article.title"
            class="w-full h-48 object-cover"
          />
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
            <h2 class="text-xl font-bold text-white">{{ article.title }}</h2>
          </div>
        </div>
        <div class="p-4 space-y-3">
          <div class="flex justify-between items-center text-sm text-gray-600">
            <span>{{ formatDate(article.date) }}</span>
            <span class="bg-red-500 text-white px-2 py-1 rounded-full">
              {{ article.rating }} 分
            </span>
          </div>
          <div class="text-sm text-gray-600">
            <div>{{ article.location }}</div>
            <div>{{ article.price }} | {{ article.openHours }}</div>
          </div>
          <p class="text-gray-700 text-sm" :class="{ 'line-clamp-3': !article.showFullContent }">
            {{ article.content }}
          </p>
          <button 
            class="text-blue-500 text-sm"
            @click="toggleContent(article)"
          >
            {{ article.showFullContent ? '收起' : '繼續閱讀' }}
          </button>
        </div>
      </div>

      <!-- 評論區 -->
        <div class="bg-gray-50 p-4 md:p-6">
          <h3 class="text-lg md:text-xl font-bold mb-4">評論</h3>
          <!-- 評論列表 -->
          <div class="space-y-4 mb-6">
            <div 
              v-for="comment in article.comments" 
              :key="comment.id"
              class="bg-white p-3 md:p-4 rounded-lg shadow"
            >
              <div class="flex justify-between items-center mb-2">
                <span class="font-medium text-sm md:text-base">{{ comment.user }}</span>
                <span class="text-xs md:text-sm text-gray-500">{{ formatDate(comment.date) }}</span>
              </div>
              <p class="text-sm md:text-base text-gray-700">{{ comment.content }}</p>
              <div class="mt-2 text-yellow-400 text-sm md:text-base">
                <span v-for="n in comment.rating" :key="n">★</span>
                <span v-for="n in 5 - comment.rating" :key="n + comment.rating" class="text-gray-300">★</span>
                <span class="text-gray-600 text-xs md:text-sm ml-2">{{ comment.rating }} 分</span>
              </div>

              <!-- 回覆和刪除按鈕 -->
              <div class="flex gap-2">
                <button 
                  @click="toggleReplyForm(comment.id)"
                  class="text-blue-500 text-sm mt-2 hover:text-blue-600"
                >
                  {{ newReply.replyingTo === comment.id ? '取消回覆' : '回覆' }}
                </button>
                <button 
                  @click="deleteComment(article.id, comment.id)"
                  class="text-red-500 text-sm mt-2 hover:text-red-600"
                >
                  刪除
                </button>
              </div>

              <!-- 回覆表單 -->
              <div 
                v-if="newReply.replyingTo === comment.id"
                class="mt-3 pl-4 border-l-2 border-gray-200"
              >
                <div class="relative">
                  <textarea
                    v-model="newReply.content"
                    rows="2"
                    maxlength="200"
                    class="w-full border rounded p-2 text-sm"
                    placeholder="寫下您的回覆..."
                  ></textarea>
                  <p v-if="newReply.content.length > 0" class="text-xs text-gray-500 mt-1">
                    還可以輸入 {{ 200 - newReply.content.length }} 字
                  </p>
                </div>
                <button
                  @click="addReply(article.id, comment.id)"
                  class="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  發表回覆
                </button>
              </div>

              <!-- 回覆列表 -->
              <div 
                v-if="comment.replies.length > 0"
                class="mt-3 pl-4 border-l-2 border-gray-200 space-y-3"
              >
                <div 
                  v-for="reply in comment.replies"
                  :key="reply.id"
                  class="bg-gray-50 p-3 rounded"
                >
                  <div class="flex justify-between items-center mb-1">
                    <div>
                      <span class="font-medium text-sm">{{ reply.user }}</span>
                      <span class="text-xs text-gray-500 ml-2">{{ formatDate(reply.date) }}</span>
                    </div>
                    <button 
                      @click="deleteReply(article.id, comment.id, reply.id)"
                      class="text-red-500 text-sm hover:text-red-600"
                    >
                      刪除
                    </button>
                  </div>
                  <p class="text-sm text-gray-700">{{ reply.content }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 新增評論表單 -->
          <div class="bg-white p-3 md:p-4 rounded-lg">
            <h4 class="font-medium mb-2 text-sm md:text-base">撰寫評論</h4>
            <div class="space-y-3">
              <div>
                <label class="block text-xs md:text-sm text-gray-600 mb-1">評分</label>
                <select 
                  v-model="newComment.rating" 
                  class="border rounded p-2 w-20 md:w-24 text-sm"
                >
                  <option v-for="n in 5" :key="n" :value="n">{{ n }} 分</option>
                </select>
              </div>
              <div class="relative">
                <textarea
                  v-model="newComment.content"
                  rows="3"
                  maxlength="200"
                  class="w-full border rounded p-2 text-sm md:text-base"
                  placeholder="寫下您的評論..."
                ></textarea>
                <p v-if="newComment.content.length > 0" class="text-xs text-gray-500 mt-1">
                  還可以輸入 {{ 200 - newComment.content.length }} 字
                </p>
              </div>
              <button
                @click="addComment(article.id)"
                class="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm md:text-base"
              >
                發表評論
              </button>
            </div>
          </div>
        </div>
    </article>
  </div>
  <Footer />
</div>
</template>

<style scoped>
</style>