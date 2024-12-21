<template>
    <div class="p-4 my-10 lg:p-8">
        <!-- 非編輯模式 -->
        <div v-if="!isEditing">
            <!-- 個人照片 -->
            <div class="flex justify-center">
                <img
                    :src="currentProfilePicture"
                    alt="Profile Picture"
                    class="w-24 h-24 rounded-full object-cover border border-gray-300"
                />
            </div>

            <!-- 名稱和數據 -->
            <div class="text-center mt-4" >
                <h2 class="text-2xl font-bold text-gray-700">{{ userData.name || "使用者" }}</h2>  
            </div>

            <!-- 社群連結 -->
            <div class="mt-4 text-center">
                <p class="text-sm text-gray-500 mb-2">社群連結：</p>
                <a
                    :href="instagramLink"
                    class="text-amber-500 underline hover:text-amber-400"
                    v-if="instagramUsername"
                    target="_blank"
                >
                    Instagram: {{ instagramUsername }}
                </a>
                <p v-else class="text-gray-500 flex items-center justify-center"><font-awesome-icon :icon="['fab', 'instagram']" class="text-amber-500 w-5 h-5 mr-1"/>Instagram 未連結</p>
            </div>

            <!-- 編輯個人檔案按鈕 -->
            <div class=" mt-6 flex justify-center items-center relative">
                <div class="w-full"></div>
                <button
                    @click="toggleEditMode"
                    class="w-full min-w-36 py-2 mx-2 bg-amber-500 text-white rounded-md hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                    編輯個人檔案
                </button>
                <div class="relative w-full ">
                    <button
                        id="dropdownButton"
                        @click="toggleMenu"
                        class=" p-1 text-gray-500 text-2xl hover:bg-amber-100 rounded-md focus:outline-none"
                        >
                        ⋯
                    </button>

                    <!-- 下拉選單 -->
                    <div
                        v-if="menuVisible"
                        class="absolute left-0 mt-2 w-40 bg-white shadow-lg rounded-lg z-10"
                    >
                        <button @click="writeReview" class="block w-full text-left px-4 py-2 text-amber-500 hover:bg-amber-100">
                            撰寫食記
                        </button>
                        <button @click="logout" class="block w-full text-left px-4 py-2 text-amber-500 hover:bg-amber-100">
                            登出
                        </button>
                    </div>
                </div>
            </div>
        
        </div>

<!-- ---------------------------------------------------------------------------------------- -->
        
        <!-- 編輯模式 -->
        <div v-else>
            <!-- 更換照片 -->
            <div class="relative flex justify-center">
                <img
                    :src="currentProfilePicture"
                    alt="Profile Picture"
                    class="w-24 h-24 rounded-full object-cover border border-gray-300"
                />

                <label
                    for="photo-upload"
                    class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20 rounded-full cursor-pointer"
                    >
                    <span class="text-white text-xl"><font-awesome-icon :icon="['fas', 'camera']" /></span>
                </label>
                <input
                    id="photo-upload"
                    type="file"
                    @change="onPhotoChange"
                    accept="image/*"
                    class="hidden"
                />
            </div>

            <!-- 編輯名字 -->
            <div class="text-center mt-4">
                <input
                    v-model="username"
                    type="text"
                    class="border border-gray-300 rounded-md p-2 text-center w-1/2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="輸入名字"
                />
            </div>

            <!-- 編輯 IG 帳號 -->
            <div class="mt-4 text-center">
                <p class="text-sm text-gray-500 mb-2">您的社群連結：</p>
                <span class="text-amber-500 text-2xl"><font-awesome-icon :icon="['fab', 'instagram']" class="text-amber-500 w-5 h-5 mr-1"/></span>
                <div class="flex items-center justify-center">
                    <input
                        v-model="instagramUsername"
                        type="text"
                        placeholder="輸入 IG 帳號"
                        class="border border-gray-300 rounded-md p-2 text-center w-1/2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                </div>
            </div>

            <!-- 保存/取消按鈕 -->
            <div class="mt-6 flex justify-center space-x-4">
                <button
                @click="saveProfile"
                class="px-4 py-2 bg-amber-500 text-white rounded-md hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                儲存
                </button>
                <button
                @click="cancelEdit"
                class="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                取消
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useAuth } from '@/stores/authStore'
// import { useRouter } from 'vue-router';

const user = useAuth()
const { userData, logout } = user
const menuVisible = ref(false);
const isEditing = ref(false);
const profilePicture = ref('https://via.placeholder.com/100'); // 頭像
const username = ref('編輯名稱'); // 使用者名稱
const instagramUsername = ref(''); // IG 帳號
const defaultPicture=ref('https://via.placeholder.com/100')
// const router = useRouter();

// 計算屬性 - 生成 IG 連結
const instagramLink = computed(() => {
    return `https://instagram.com/${instagramUsername.value}`;
});

// 計算屬性 - 確定目前顯示的圖片
const currentProfilePicture = computed(() => {
    return profilePicture.value || userData.picture || defaultPicture.value;
});

// 監聽 userData.picture 的更新
watch(
    () => userData.picture,
    (newValue) => {
        if (newValue) {
            profilePicture.value = newValue; // 使用 Google 圖片作為初始值
        }
    },
    { immediate: true } // 登入後立即執行
);

// 切換編輯模式
const toggleEditMode = () => {
    isEditing.value = true;
    username.value = userData.name || "使用者"; // 初始化為 Google 名稱
    instagramUsername.value = userData.instagram || ''; // 保留現有 Instagram 資料
};

// 保存使用者資料並退出編輯模式
const saveProfile = () => {
    isEditing.value = false;
    userData.name = username.value;
    // 如果有新圖片，更新到 `userData`
    if (profilePicture.value) {
        userData.picture = profilePicture.value;
    }    
    userData.instagram = instagramUsername.value; // 更新 userData 的 IG 資料
};


// 取消編輯，恢復原始值（可擴展為重置到用戶原始數據）
const cancelEdit = () => {
    isEditing.value = false;
    username.value = userData.name; // 恢復 Google 名稱
    profilePicture.value = userData.picture || defaultPicture.value;
    instagramUsername.value = userData.instagram
};


// 切換選單顯示/隱藏
const toggleMenu = () => {
    menuVisible.value = !menuVisible.value;
};

// 撰寫食記的功能
const writeReview = () => {
    alert('撰寫食評功能即將啟用！');
};

// 更新頭像
const onPhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        const newImage = URL.createObjectURL(file);
        user.setPicture(newImage); // 更新 Pinia 資料
    }
};

// 點擊其他地方時關閉下拉選單
const handleClickOutside = (event) => {
    if (
        menuVisible.value &&
        !event.target.closest('#dropdownMenu') && // 點擊的元素不在選單內
        !event.target.closest('#dropdownButton') // 點擊的元素不在按鈕內
    ) {
        menuVisible.value = false; // 關閉選單
    }
};


// 添加全域事件監聽器
onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

// 移除全域事件監聽器
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>


<style scoped>
    /* 標籤覆蓋樣式 */
    label {
        width: 6rem; 
        height: 6rem; 
        transition: background 0.3s;
        left: 50%;
        transform: translateX(-50%);
    }

    label:hover {
        background: rgba(0, 0, 0, 0.5);
    }

    input[type="file"] {
        display: none;
    }
</style>