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
    publishedArticles.value = data;
  } catch (error) {
    console.error('獲取文章失敗:', error);
    // 使用假資料作為後備
    publishedArticles.value = [{
      id: "1",
      title: "山下的咖啡店",
      photo: "https://images.unsplash.com/photo-1554118811-1e0d58224f24",
      date: "2024-03-15 09:30:00",
      location: "台北市松山區民生東路四段 97 巷 12 號",
      price: "均消 $300-500",
      openHours: "週二至週日 11:00-21:00",
      likes: 0,
      isLiked: false,
      content: "隱身在巷弄裡的溫馨咖啡店，店面不大但格外溫馨。老闆是日本留學歸國的咖啡師，對咖啡有獨到的見解。店內使用的咖啡豆都是精選的單品豆，現烘現磨，香氣四溢。最推薦他們的手沖耶加雪菲，清爽的花香中帶有柑橘的香甜，讓人回味無窮。甜點也都是店內手作，特別推薦開心果千層蛋糕，口感細膩不會太甜。座位不多，建議提前預約。庭院有個小花園，天氣好的時候在那裡喝咖啡特別愜意。",
      showFullContent: true,
      comments: [
        {
          id: "c1",
          user: "小明",
          content: "咖啡真的很棒！老闆很用心在挑選咖啡豆，每次來都能品嚐到不同風味。甜點也很精緻，特別喜歡那個開心果千層。",
          likes: 0,
          isLiked: false,
          date: "2024-03-16 14:20:00",
          replies: [
            {
              id: "r1",
              user: "店長",
              content: "謝謝您的支持！我們會繼續努力，歡迎常來喔！",
              date: "2024-03-16 15:30:00",
              likes: 0,
              isLiked: false,
              showOptions: false
            }
          ]
        },
        {
          id: "c2",
          user: "咖啡控",
          content: "耶加雪菲真的很讚，酸度適中不會太強烈，很適合下午悠閒的時光。就是價格稍微貴了點。",
          likes: 0,
          isLiked: false,
          date: "2024-03-17 16:45:00",
          replies: []
        },
        {
          id: "c3",
          user: "美食探索家",
          content: "環境很舒適，很適合工作或是和朋友聊天。不過假日人比較多，建議先訂位。",
          likes: 0,
          isLiked: false,
          date: "2024-03-18 11:15:00",
          showOptions: false,
          replies: []
        }
      ]
    }];
  }
};

// 新增點讚功能
const toggleLike = async (articleId, commentId, replyId) => {
  try {
    const article = publishedArticles.value.find(a => a.id === articleId);
    if (!article) return;

    if (replyId && commentId) {
      // 為回覆點讚
      const comment = article.comments.find(c => c.id === commentId);
      if (comment) {
        const reply = comment.replies.find(r => r.id === replyId);
        if (reply) {
          reply.isLiked = !reply.isLiked;
          reply.likes += reply.isLiked ? 1 : -1;
          await api.post(`/articles/${articleId}/comments/${commentId}/replies/${replyId}/like`);
        }
      }
    } else if (commentId) {
      // 為評論點讚
      const comment = article.comments.find(c => c.id === commentId);
      if (comment) {
        comment.isLiked = !comment.isLiked;
        comment.likes += comment.isLiked ? 1 : -1;
        await api.post(`/articles/${articleId}/comments/${commentId}/like`);
      }
    } else {
      // 為文章點讚
      article.isLiked = !article.isLiked;
      article.likes += article.isLiked ? 1 : -1;
      await api.post(`/articles/${articleId}/like`);
    }
  } catch (error) {
    console.error('點讚失敗:', error);
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
     user: '訪客',
     date: dayjs().format('YYYY-MM-DD HH:mm:ss')
   });
   
   await fetchArticles();
   newComment.value.content = '';
   
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
                <button 
                  @click="toggleLike(article.id)"
                  class="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
                >
                  <font-awesome-icon 
                    :icon="[article.isLiked ? 'fas' : 'far', 'thumbs-up']" 
                    class="text-xl"
                  />
                  <span>{{ article.likes }}</span>
                </button>
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
              <button 
                  @click="toggleLike(article.id)"
                  class="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
                >
                  <font-awesome-icon 
                    :icon="[article.isLiked ? 'fas' : 'far', 'thumbs-up']" 
                    class="text-xl"
                  />
                  <span>{{ article.likes }}</span>
              </button>
            </div>
            <div class="text-sm text-gray-600">
              <div>{{ article.location }}</div>
              <div>{{ article.price }} | {{ article.openHours }}</div>
            </div>
            <div class="relative">
              <p class="text-gray-700 text-sm line-clamp-3" :class="{ 'line-clamp-none': !article.showFullContent }">
                {{ article.content }}
              </p>
              <button 
                @click="toggleContent(article)"
                class="text-blue-500 text-sm mt-2"
              >
                {{ article.showFullContent ? '繼續閱讀' : '收起' }}
              </button>
            </div>
          </div>
        </div>

        <!-- 評論區域 -->
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
              

              <div class="flex items-center justify-between mt-2">
                  <div class="flex gap-4 items-center">
                    <button 
                  @click="toggleLike(article.id, comment.id)"
                  class="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
                >
                  <font-awesome-icon 
                    :icon="[comment.isLiked ? 'fas' : 'far', 'thumbs-up']" 
                    class="text-xl"
                  />
                  <span>{{ comment.likes }}</span>
                </button>
                  <button 
                    @click="toggleReplyForm(comment.id)"
                    class="text-blue-500 text-sm hover:text-blue-600"
                  >
                    {{ newReply.replyingTo === comment.id ? '取消回覆' : '回覆' }}
                  </button>
                </div>
                
                <!-- 三點選單 -->
                <div class="relative">
                  <button 
                    @click="comment.showOptions = !comment.showOptions"
                    class="text-gray-500 hover:text-gray-700 px-2 font-bold"
                  >
                    ⋮
                  </button>
                  <!-- 下拉選單 -->
                  <div 
                    v-if="comment.showOptions"
                    class="absolute right-0 mt-1 bg-white rounded-lg shadow-lg py-1 min-w-[100px] z-10"
                  >
                    <button 
                      @click="deleteComment(article.id, comment.id); comment.showOptions = false"
                      class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                    >
                      刪除
                    </button>
                  </div>
                </div>
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
                  v-if="comment.replies && comment.replies.length > 0"
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
                    <!-- 三點選單 -->
                    <div class="relative">
                      <button 
                        @click="reply.showOptions = !reply.showOptions"
                        class="text-gray-500 hover:text-gray-700 px-2 font-bold"
                      >
                        ⋮
                      </button>
                      <!-- 下拉選單 -->
                      <div 
                        v-if="reply.showOptions"
                        class="absolute right-0 mt-1 bg-white rounded-lg shadow-lg py-1 min-w-[100px] z-10"
                      >
                        <button 
                          @click="deleteReply(article.id, comment.id, reply.id); reply.showOptions = false"
                          class="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50"
                        >
                          刪除
                        </button>
                      </div>
                    </div>
                  </div>
                  <p class="text-sm text-gray-700">{{ reply.content }}</p>
                  <!-- 點讚按鈕 -->
                  <div class="flex gap-2 mt-2">
                    <button 
                      @click="toggleLike(article.id, comment.id, reply.id)"
                      class="flex items-center space-x-1 text-blue-500 hover:text-blue-600"
                    >
                      <font-awesome-icon 
                        :icon="[reply.isLiked ? 'fas' : 'far', 'thumbs-up']" 
                        class="text-lg"
                      />
                      <span>{{ reply.likes }}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 新增評論表單 -->
          <div class="bg-white p-3 md:p-4 rounded-lg">
            <h4 class="font-medium mb-2 text-sm md:text-base">撰寫評論</h4>
            <div class="space-y-3">
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