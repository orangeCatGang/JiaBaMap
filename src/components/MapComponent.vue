<template>
  <div ref="mapContainer" style="width: 50%; height: 100vh;"></div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";
import loader from "./googleMapsLoader";

export default {
  setup() {
    const map = ref(null); // Google 地圖實例
    let markers = []; // 使用普通數組管理標記
    const mapContainer = ref(null); // 地圖 DOM 容器
    const places = ref([]); // 從 Local Storage 加載的地點資料

    // 從 Local Storage 加載地點資料
    const fetchPlacesFromLocalStorage = () => {
      const localStorageUtil = {
        get(key) {
          const value = localStorage.getItem(key);
          return value ? JSON.parse(value) : [];
        },
      };
      places.value = localStorageUtil.get("places") || []; // 更新地點資料
      updateMarkers(); // 每次加載新資料時更新標記
    };

    // 初始化 Google 地圖
    const initMap = async () => {
      try {
        await loader.load(); // 確保 Google Maps API 加載完成
        map.value = new google.maps.Map(mapContainer.value, {
          center: { lat: 25.033, lng: 121.565 }, // 台北市中心
          zoom: 15,
        });

        console.log("地圖初始化完成");

        // 地圖加載完成後首次更新標記
        google.maps.event.addListenerOnce(map.value, "tilesloaded", () => {
          updateMarkers();
        });
      } catch (error) {
        console.error("地圖初始化失敗:", error);
      }
    };

    // 更新地圖上的標記
    const updateMarkers = () => {
      clearMarkers(); // 清除舊標記

      places.value.forEach((place) => {
        if (!place.geometry || !place.geometry.location) {
          console.error("無效的地點資料:", place);
          return;
        }

        const position = place.geometry.location;

        const marker = new google.maps.Marker({
          position,
          map: map.value,
          title: place.name,
        });

        markers.push(marker); // 將新標記保存到數組中
      });

      console.log("新標記已添加:", markers);
    };

    // 清除地圖上的標記
    const clearMarkers = () => {
      markers.forEach((marker) => {
        marker.setMap(null); // 從地圖上移除標記
      });
      markers = []; // 清空標記數組
      console.log("標記已清除");
    };

    // 設定事件監聽器以監控 Local Storage 資料變化
    onMounted(() => {
      // 初始化地圖
      initMap();

      // 監聽自定義事件，當 Local Storage 更新時觸發
      window.addEventListener("places-updated", fetchPlacesFromLocalStorage);

      // 初次從 Local Storage 加載地點資料
      fetchPlacesFromLocalStorage();
    });

    onUnmounted(() => {
      // 移除事件監聽器
      window.removeEventListener("places-updated", fetchPlacesFromLocalStorage);
    });

    return {
      mapContainer,
    };
  },
};
</script>
