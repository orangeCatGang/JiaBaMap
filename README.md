<h1 align="center">JiaBaMap 呷飽地圖 🍽️</h1>

<p align="center">
  <img alt="Version" src="https://img.shields.io/badge/version-0.0.0-blue.svg?cacheSeconds=2592000" />
  <a href="https://github.com/orangeCatGang/JiaBaMap" target="_blank">
    <img alt="Documentation" src="https://img.shields.io/badge/documentation-yes-brightgreen.svg" />
  </a>
</p>

<p align="center">
  一個由七人團隊開發的美食地圖平台，幫助使用者探索和分享美食體驗。
</p>

## ✨ 功能特點

- 📍 整合 Google Maps API 的互動式地圖
- 🔍 餐廳搜尋與篩選
- 📝 使用者評論與評分系統
- 📱 響應式設計，支援多種裝置
- 🖼️ 餐廳照片上傳與分享
- 👥 使用者互動功能

## ⚠️ 重要設置

在使用本專案前，請確保已在 Google Cloud Console 開啟以下 API：

1. **Places API (New)**
   - 用於地點搜尋和資訊獲取
   - 必須啟用才能使用地點搜尋功能

2. **Maps JavaScript API**
   - 用於地圖顯示和互動
   - 必須啟用才能顯示地圖介面

> **注意**：缺少任一 API 都會導致地圖功能無法正常運作。

## 🚀 快速開始

### 環境需求

- Node.js (推薦 v20.18.1 或更高版本)
- npm 或 yarn

### 安裝步驟

1. Clone專案
```sh
git clone https://github.com/orangeCatGang/JiaBaMap.git
cd JiaBaMap
```

2. 安裝依賴
```sh
npm install
```

3. 環境設置
- 在專案根目錄建立 `.env.local` 檔案
- 添加以下內容：
```sh
VITE_GOOGLE_MAPS_API_KEY=<your google api key>
```

4. 啟動開發伺服器
```sh
npm run dev
```

5. 建立生產版本
```sh
npm run build
```


## 🛠️ 技術棧

- Vue 3
- Vite
- Tailwind CSS
- Google Maps API
- Axios
- Font Awesome
- DayJS

## 👥 開發團隊

- 團隊成員：7人


## 🤝 貢獻

歡迎提出貢獻、問題和功能請求！
請查看 [issues page](https://github.com/orangeCatGang/JiaBaMap/issues).

## ⭐️ 支持我們

如果這個專案對你有幫助，請給我們一個星星 ⭐️

---

_This README was developed with ❤️ by the JiaBaMap Team_
