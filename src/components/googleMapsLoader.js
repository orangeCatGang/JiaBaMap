import { Loader } from "@googlemaps/js-api-loader";

const loader = new Loader({
  apiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, // 環境變數中的 API 金鑰
  version: "weekly",
  libraries: ["places", "marker"], // 根據需求添加功能庫
});

export default loader;
