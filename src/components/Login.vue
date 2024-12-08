<template>
<div  v-if="visible" class="modal-overlay bg-black/50 w-full h-screen flex justify-center items-center fixed top-0 left-0 z-50 ml-0" @click.self="closeModal">
        <div class="flex-col w-1/5 h-1/2 justify-items-center bg-white rounded-lg p-3 leading-10">
            <h1>登入 「 JiaBaMap 」</h1>
            <div class="">
                <img src="../assets/logo.jpg" alt="">
            </div>
            <p class="m-3">按下登入以使用更多功能！！</p>
            <div id="googleButton"></div>
            <div v-if="userData" class="user-info">
                <h3>登錄成功！</h3>
                <p>名稱：{{ userData.name }}</p>
                <p>Email：{{ userData.email }}</p>
                <img :src="userData.picture" alt="用戶頭像" />
                <button @click="logout">登出</button>
              </div>
        </div>
    </div>

</template>

<script setup>
import { ref, onMounted, watch, nextTick} from "vue";
import { useRouter } from 'vue-router';




const router = useRouter();
const googleButton = ref(null); 
const userData = ref(null);


const storedUserData = localStorage.getItem("userData");
if (storedUserData) {
  userData.value = JSON.parse(storedUserData); // 如果有用戶數據，則加載到頁面上
}


const initializeGoogleButton = () => {
       const buttonContainer = document.querySelector("#googleButton");
        
       if (buttonContainer) {
       buttonContainer.innerHTML = ""; // 防止重複渲染
        }

      if (window.google && window.google.accounts) {
        // 初始化 Google 登錄
        window.google.accounts.id.initialize({
          client_id: "912148148886-m74apbsn2dokgrafs9mto26en07memc2.apps.googleusercontent.com", 
          callback: handleCredentialResponse, 
        });
    }

     // 渲染 Google 按鈕到綁定的容器
     window.google.accounts.id.renderButton(buttonContainer, {
        
          type: "standard",
          shape: "pill",
          theme: "outline",
          size: "large",
        });
}

const handleCredentialResponse = (response) => {
  console.log("Google 登錄成功，返回的 ID Token:", response.credential);

  const userObject = decodeJwt(response.credential);
  userData.value = userObject;
  localStorage.setItem("userData", JSON.stringify(userObject));
  console.log("用戶數據已儲存到 localStorage", userObject);

  // 重定向到 User

    router.push({ name: 'user' }); 
  
}

  const decodeJwt = (token) => {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map((c) => {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
};

const logout = () => {
  localStorage.removeItem("userData");
  userData.value = null;
  console.log("用戶已登出，localStorage 已清空");
};


const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
    // required: true,
  },
});


const emit = defineEmits(['close']);

const closeModal = () => {
  emit('close'); // 觸發父組件的 close 事件
};

watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      nextTick(() => {
        initializeGoogleButton();
      });
    }
  }
);

onMounted(() => {
  if (props.visible) {
    nextTick(() => {
      initializeGoogleButton();
    });
  }
});



</script>


<style scoped>
  
    </style>

