<script setup>
import { useRouter, useRoute } from 'vue-router';
import Header from '../components/Header.vue';
import Footer from '../components/Footer.vue';
import { ref, computed } from 'vue';

const router = useRouter();
const route = useRoute();

// 假資料
const articles = ref([
  { 
    id: 1, 
    title: '台北車站附近美食推薦', 
    date: '2024/11/20', 
    status: 'draft',
    photo: '/src/assets/food1.jpg',
    rating: '-',
    content: '這是一篇關於台北車站附近美食的草稿...',
    location: '台北市中正區'
  },
  { 
    id: 2, 
    title: '東區下午茶清單', 
    date: '2024/11/21', 
    status: 'published',
    photo: '/src/assets/food2.jpg',
    rating: '4.5',
    content: '精選東區下午茶店家...',
    location: '台北市大安區'
  },
  { 
    id: 3, 
    title: '內湖科學園區美食地圖', 
    date: '2024/11/22', 
    status: 'draft',
    photo: '/src/assets/food3.jpg',
    rating: '-',
    content: '整理內科附近的平價美食...',
    location: '台北市內湖區'
  }
]);

// 根據狀態過濾文章
const filteredArticles = computed(() => {
  return articles.value.filter(article => article.status === route.query.status);
});

const changeStatus = (status) => {
  router.push({
    path: '/myarticle',
    query: { status }
  });
};

// 模擬 CRUD 操作
const deleteArticle = (id) => {
  if (confirm('確定要刪除這篇文章嗎？')) {
    articles.value = articles.value.filter(article => article.id !== id);
  }
};

const editArticle = (id) => {
  router.push({
    path: `/myarticle/edit/${id}`
  });
};

</script>

<template>
  <div class="pt-16">
    <div class="min-h-screen bg-white">
      <div class="max-w-4xl mx-auto mt-8 px-4">
        <h2 class="text-5xl font-extrabold mb-6">您的文章</h2>
        
        <div class="flex flex-row-reverse space-x-4 mb-4 text-xl">
          <button class="px-4 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 transition-colors">
            撰寫食記
          </button>
        </div>

        <div class="border-b">
          <div class="flex space-x-8">
            <button 
              @click="changeStatus('draft')" 
              :class="[
                'px-4 py-2 transition-colors',
                route.query.status === 'draft' ? 'text-red-500 border-b-2 border-red-500' : 'hover:text-red-500'
              ]"
            >
              草稿
            </button>
            <button 
              @click="changeStatus('published')" 
              :class="[
                'px-4 py-2 transition-colors',
                route.query.status === 'published' ? 'text-red-500 border-b-2 border-red-500' : 'hover:text-red-500'
              ]"
            >
              已發佈
            </button>
          </div>
        </div>

        <!-- 文章列表 -->
        <div class="mt-6 space-y-4">
          <article 
            v-for="article in filteredArticles" 
            :key="article.id"
            class="flex space-x-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow"
          >
            <div class="w-24 h-24 bg-gray-200 rounded overflow-hidden">
              <img 
                :src="article.photo" 
                :alt="article.title"
                class="w-full h-full object-cover"
                
              />
            </div>
            <div class="flex-1">
              <div class="flex justify-between items-start">
                <h3 class="text-lg font-medium text-gray-800">{{ article.title }}</h3>
                <div class="text-sm text-gray-500">
                  {{ article.location }}
                </div>
              </div>
              <p class="text-sm text-gray-500 mt-1">
                {{ article.date }} · 
                <button 
                  @click="editArticle(article.id)"
                  class="text-blue-500 hover:text-blue-600"
                >
                  編輯
                </button> | 
                <button 
                  @click="deleteArticle(article.id)"
                  class="text-red-500 hover:text-red-600"
                >
                  刪除
                </button>
              </p>
              <p class="text-sm text-gray-400 mt-1">
                滿意評分：{{ article.rating }} 
              </p>
              <p class="text-sm text-gray-600 mt-2 line-clamp-2">
                {{ article.content }}
              </p>
            </div>
          </article>

          <!-- 無文章提示 -->
          <div 
            v-if="filteredArticles.length === 0" 
            class="text-center text-gray-500 py-8 bg-white rounded-lg shadow"
          >
            目前沒有{{ route.query.status === 'draft' ? '草稿' : '已發佈' }}的文章
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
</template>
