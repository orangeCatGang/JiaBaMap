<script setup>
import { ref } from 'vue';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';

const publishedArticles = ref([
 {
   id: 1,
   title: '信義區隱藏版深夜食堂',
   date: '2024/12/15',
   status: 'published',
   photo: '',
   rating: '4.8',
   content: '深夜12點後，信義區的美食才正要開始！這間位於信義區巷弄內的深夜食堂，不只提供日式料理，還有道地的台灣小炒。老闆從日本學藝回來，將傳統台菜融入日式料理技法，創造出獨特的美食體驗。必點菜色包括炙燒鮭魚蓋飯、三杯雞烏龍麵等創意料理。店內裝潢簡約溫馨，非常適合下班後小酌一番。座位數量不多，建議提前預約。',
   location: '台北市信義區松仁路XX巷',
   price: '300-500元',
   openHours: '19:00-03:00',
   showFullContent: false,
   comments: [
     {
       id: 101,
       user: '美食達人小芳',
       date: '2024/12/16',
       content: '炙燒鮭魚蓋飯真的超推！魚肉鮮嫩不乾柴，醬汁也很特別',
       rating: 5,
       replies: [
        {
          id: Date.now(),
          user: '店家',
          date: new Date().toLocaleDateString(),
          content: "謝謝小芳支持，現在開放民眾吃到爽1個月，吃到撞到"
        }
       ]
     },
     {
       id: 102,
       user: '夜貓子阿明',
       date: '2024/12/18',
       content: '終於找到宵夜新選擇，環境乾淨舒適，服務態度也很好',
       rating: 4,
       replies: [
        {
          id: Date.now(),
          user: '小帥',
          date: new Date().toLocaleDateString(),
          content: "爆幹難吃，爛屎"
        }
       ]
     }
   ]
 },
 {
   id: 2,
   title: '大安森林公園周邊早午餐特搜',
   date: '2024/12/13',
   status: 'published',
   photo: '',
   rating: '4.6',
   content: '大安森林公園周邊的早午餐選擇眾多，這次特別推薦一間結合歐式麵包與台式口味的特色店家。招牌餐點「台式叉燒蛋卷」使用自製歐式麵包，搭配特製叉燒和半熟蛋，還有清爽的季節生菜。店內供應的咖啡也是一大亮點，使用台灣在地咖啡豆，香氣濃郁。用餐環境明亮寬敞，周末建議先訂位。早晨的陽光灑進店內，配上一杯現煮咖啡，完美的一天就此展開。',
   location: '台北市大安區新生南路X段',
   price: '200-350元',
   openHours: '08:00-15:00',
   showFullContent: false,
   comments: [
     {
       id: 201,
       user: '咖啡控小林',
       date: '2024/12/12',
       content: '咖啡很香醇，餐點份量十足，CP值高！',
       rating: 5,
       replies: [
      {
        id: Date.now(),
        user: '訪客',
        date: new Date().toLocaleDateString(),
        content: "好香，好好吃"
      }
      ]      
     },
     {
       id: 202,
       user: '週末美食家',
       date: '2024/12/14',
       content: '環境很舒服，但假日人真的滿多的，建議避開尖峰時間',
       rating: 4,
       replies: []
     }
   ]
 }
]);

const newComment = ref({
 content: '',
 rating: 5
});

const newReply = ref({
 content: '',
 replyingTo: null
});

const addComment = (articleId) => {
 if (!newComment.value.content.trim()) {
   alert('請輸入評論內容');
   return;
 }

 const article = publishedArticles.value.find(a => a.id === articleId);
 if (article) {
   article.comments.push({
     id: Date.now(),
     user: '訪客',
     date: new Date().toLocaleDateString(),
     content: newComment.value.content,
     rating: newComment.value.rating,
     replies: []
   });
   newComment.value.content = '';
   newComment.value.rating = 5;
 }
};

const toggleContent = (article) => {
 article.showFullContent = !article.showFullContent;
};

const addReply = (articleId, commentId) => {
 if (!newReply.value.content.trim()) {
   alert('請輸入回覆內容');
   return;
 }

 const article = publishedArticles.value.find(a => a.id === articleId);
 if (article) {
   const comment = article.comments.find(c => c.id === commentId);
   if (comment) {
     comment.replies.push({
       id: Date.now(),
       user: '訪客',
       date: new Date().toLocaleDateString(),
       content: newReply.value.content
     });
     newReply.value.content = '';
     newReply.value.replyingTo = null;
   }
 }
};

const toggleReplyForm = (commentId) => {
 newReply.value.replyingTo = newReply.value.replyingTo === commentId ? null : commentId;
};
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
               <span>{{ article.date }}</span>
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
             <span>{{ article.date }}</span>
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
               <span class="text-xs md:text-sm text-gray-500">{{ comment.date }}</span>
             </div>
             <p class="text-sm md:text-base text-gray-700">{{ comment.content }}</p>
             <div class="mt-2 text-yellow-400 text-sm md:text-base">
               <span v-for="n in comment.rating" :key="n">★</span>
               <span v-for="n in 5 - comment.rating" :key="n + comment.rating" class="text-gray-300">★</span>
               <span class="text-gray-600 text-xs md:text-sm ml-2">{{ comment.rating }} 分</span>
             </div>

             <!-- 回覆按鈕 -->
             <button 
               @click="toggleReplyForm(comment.id)"
               class="text-blue-500 text-sm mt-2 hover:text-blue-600"
             >
               {{ newReply.replyingTo === comment.id ? '取消回覆' : '回覆' }}
             </button>

             <!-- 回覆表單 -->
             <div 
               v-if="newReply.replyingTo === comment.id"
               class="mt-3 pl-4 border-l-2 border-gray-200"
             >
               <textarea
                 v-model="newReply.content"
                 rows="2"
                 class="w-full border rounded p-2 text-sm"
                 placeholder="寫下您的回覆..."
               ></textarea>
               <button
                 @click="addReply(article.id, comment.id)"
                 class="mt-2 bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
               >
                 發表回覆
               </button>
             </div>

             <!-- 顯示回覆列表 -->
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
                   <span class="font-medium text-sm">{{ reply.user }}</span>
                   <span class="text-xs text-gray-500">{{ reply.date }}</span>
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
             <textarea
               v-model="newComment.content"
               rows="3"
               class="w-full border rounded p-2 text-sm md:text-base"
               placeholder="寫下您的評論..."
             ></textarea>
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
.line-clamp-3 {
 display: -webkit-box;
 -webkit-line-clamp: 3;
 -webkit-box-orient: vertical;
 overflow: hidden;
}
</style>