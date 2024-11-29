import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // 從環境變數中讀取金鑰
  version: "weekly",
  libraries: ["places", "marker", "maps"], // 添加所需功能庫
  region: "TW", // 設置地區（台灣）
  language: "zh-TW", // 設置語言（繁體中文）
});

loader.load()
  .then((google) => {
    console.log("Google Maps API 加載成功");
    // 在這裡執行你的地圖初始化邏輯
  })
  .catch((error) => {
    console.error("Google Maps API 加載失敗:", error.message);
  });

export default loader;
