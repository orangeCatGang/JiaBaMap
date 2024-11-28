<template>
  <!-- 地圖容器 -->
  <div ref="mapContainer" style="width: 50%; height: 100vh;"></div>
</template>

<script>
import { onMounted, watch, ref } from "vue";
import loader from "./googleMapsLoader"; // 引入 Google Maps API Loader

export default {
  props: {
    places: {
      type: Array, // 資料結構 [{ name, geometry: { location: { lat, lng } } }]
      required: false,
      default: () => [], 
    },
  },
  setup(props) {
    const map = ref(null); // Google Map 實例
    let markers = []; // 使用普通數組來管理標記
    const mapContainer = ref(null); // 地圖 DOM 容器

    // 初始化地圖
    const initMap = () => {
      const customMapStyle = [
        { featureType: "all", elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
        { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "transit", elementType: "all", stylers: [{ visibility: "off" }] },
        { featureType: "water", elementType: "labels", stylers: [{ visibility: "off" }] },
      ];

      loader.load().then(() => {
        // 初始化 Google Maps 實例
        map.value = new google.maps.Map(mapContainer.value, {
          center: { lat: 25.033, lng: 121.565 }, // 台北市中心
          zoom: 15,
          styles: customMapStyle, // 套用自定義樣式
        });

        // 地圖加載完成後更新標記
        google.maps.event.addListenerOnce(map.value, "tilesloaded", () => {
          updateMarkers();
        });
      });
    };

    // 更新標記
    const updateMarkers = () => {
      // 清除舊的標記
      console.log("Clearing old markers...");
      markers.forEach((marker, index) => {
        marker.setMap(null); // 從地圖上移除標記
        console.log(`Marker #${index} removed from map`);
      });

      // 清空標記數組
      markers = [];
      console.log("Markers cleared:", markers);

      // 添加新的標記
      console.log("Adding new markers...");
      props.places.forEach((place) => {
        // 檢查地點數據的有效性
        if (!place.geometry || !place.geometry.location) {
          console.error("Invalid geometry for place:", place);
          return;
        }

        // 確保位置是普通對象
        const position = place.geometry.location.toJSON();

        // 創建新標記
        const marker = new google.maps.Marker({
          position,
          map: map.value,
          title: place.name, // 標記名稱
        });

        // 設定 InfoWindow（資訊視窗）
        const infoWindow = new google.maps.InfoWindow({
          content: `<div><strong>${place.name}</strong><br>${place.vicinity}</div>`,
        });

        // 點擊標記時顯示 InfoWindow
        marker.addListener("click", () => {
          infoWindow.open(map.value, marker);
        });

        // 保存標記到普通數組
        markers.push(marker);
      });

      console.log("New markers added:", markers);
    };

    // 監聽 props.places 的變化
    watch(
      () => props.places,
      (newPlaces, oldPlaces) => {
        console.log("Places updated:", { newPlaces, oldPlaces });
        if (map.value) updateMarkers(); // 在地圖存在時更新標記
      },
      { deep: true } // 深度監聽以捕捉陣列變化
    );

    // 初始化地圖
    onMounted(initMap);

    return {
      mapContainer,
    };
  },
};
</script>
