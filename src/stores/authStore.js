import { defineStore } from 'pinia'
import { ref, watch } from "vue"
import { useRouter } from 'vue-router';
 
export const useAuth = defineStore('auth', () => {
  const userData = ref(JSON.parse(localStorage.getItem('userData')) || null);
  const router = useRouter()

// 監聽資料變化並更新 localStorage
watch(userData, (newValue) => {
  if (newValue) {
      localStorage.setItem('userData', JSON.stringify(newValue));
  } else {
      localStorage.removeItem('userData'); // 清除資料
  }
}, { deep: true });

    const initializeGoogleButton = () => {
        const buttonContainer = document.querySelector("#googleButton");
         
        if (buttonContainer) {
        buttonContainer.innerHTML = ""; // 防止重複渲染
         }
 
       if (window.google && window.google.accounts) {
         // 初始化 Google 登錄
         window.google.accounts.id.initialize({
           client_id: import.meta.env.VITE_GOOGLE_LOGIN_KEY, 
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
   localStorage.setItem('userData', JSON.stringify(userObject)); // 存入 localStorage
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
   userData.value = null;
   localStorage.removeItem('userData'); // 清除 localStorage
   router.push({ name: 'home' });
   console.log("用戶已登出");
 };


    return {
        useAuth,
        initializeGoogleButton,
        userData,
        logout,
    };
})