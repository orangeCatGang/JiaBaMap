<template>
  <!-- 地圖容器 -->
  <div ref="mapContainer" style="width: 50%; height: 100vh;"></div>
</template>

<script>
import { ref, onMounted } from "vue";
import loader from "./googleMapsLoader"; // 引入 Google Maps API Loader

export default {
  setup() {
    const map = ref(null); // Google 地圖實例
    const markers = ref([]); // 管理地圖標記的數組
    const places = ref([]); // 從 Local Storage 加載的地點資料
    const mapContainer = ref(null); // 地圖容器引用

    // 從 Local Storage 獲取地點資料
    const fetchPlacesFromLocalStorage = () => {
      const localStorageUtil = {
        get(key) {
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : null;
        },
      };
      places.value = localStorageUtil.get("places") || [];
    };

    // 初始化 Google 地圖
    const initMap = async () => {
  try {
    await loader.load(); // 加載 Google Maps API

    // 創建地圖實例
    map.value = new google.maps.Map(mapContainer.value, {
      center: { lat: 25.033, lng: 121.565 }, // 台北市中心
      zoom: 15,
      mapId: "2179f521a7ab02c3", // Google Cloud Console 的地圖 ID
    });

    console.log("地圖實例初始化成功:", map.value);

    // 延遲檢查 .gm-style 並插入靜態標記
    setTimeout(() => {
      const mapDiv = mapContainer.value.querySelector(".gm-style");
      if (mapDiv) {
        console.log("延遲後找到 .gm-style:", mapDiv);

        // 插入靜態標記
        const staticMarkerContent = document.createElement("div");
        staticMarkerContent.style.width = "60px";
        staticMarkerContent.style.height = "60px";
        staticMarkerContent.style.backgroundColor = "blue";
        staticMarkerContent.style.borderRadius = "50%";
        staticMarkerContent.style.position = "absolute";
        staticMarkerContent.style.zIndex = "1000";
        staticMarkerContent.style.display = "flex";
        staticMarkerContent.style.justifyContent = "center";
        staticMarkerContent.style.alignItems = "center";
        staticMarkerContent.style.color = "white";
        staticMarkerContent.style.fontSize = "16px";
        staticMarkerContent.style.fontWeight = "bold";
        staticMarkerContent.innerHTML = `<span>Test</span>`;

        mapDiv.appendChild(staticMarkerContent);
        console.log("靜態標記手動添加到地圖:", staticMarkerContent);
      } else {
        console.error(".gm-style 找不到，無法插入標記內容");
      }
    }, 1000); // 延遲 1 秒

    // 等待地圖加載完成後更新標記
    google.maps.event.addListenerOnce(map.value, "tilesloaded", () => {
      console.log("地圖加載完成，添加動態標記...");
      updateMarkers();
    });
  } catch (error) {
    console.error("地圖初始化失敗:", error);
  }
};


    // 更新地圖上的標記
    const updateMarkers = () => {
      console.log("更新標記，地點數據:", places.value);
      clearMarkers();

      places.value.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.error("無效的地點幾何信息:", place);
          return;
        }

        const position = {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng,
        };

        const markerContent = document.createElement("div");
        markerContent.style.width = "60px";
        markerContent.style.height = "60px";
        markerContent.style.backgroundColor = "red";
        markerContent.style.borderRadius = "50%";
        markerContent.style.display = "flex";
        markerContent.style.justifyContent = "center";
        markerContent.style.alignItems = "center";
        markerContent.style.color = "white";
        markerContent.style.fontSize = "16px";
        markerContent.style.fontWeight = "bold";
        markerContent.style.boxShadow = "0px 4px 8px rgba(0, 0, 0, 0.3)";
        markerContent.style.border = "2px solid white";
        markerContent.innerHTML = `<span>${place.name[0]}</span>`;

        const marker = new google.maps.marker.AdvancedMarkerElement({
          position,
          map: map.value,
          title: place.name,
          content: markerContent,
        });

        const infoWindow = new google.maps.InfoWindow({
          content: `<div><strong>${place.name}</strong><br>${place.vicinity || ""}</div>`,
        });

        markerContent.addEventListener("click", () => {
          infoWindow.open(map.value, marker);
        });

        markers.value.push(marker);
      });
    };

    // 清除地圖上的標記
    const clearMarkers = () => {
      markers.value.forEach((marker) => (marker.map = null));
      markers.value = [];
    };

    // Vue 的生命周期掛載
    onMounted(() => {
      fetchPlacesFromLocalStorage();
      initMap();
    });

    return {
      mapContainer,
      places,
      markers,
    };
  },
};

</script>
