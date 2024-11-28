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
    let infoWindows = []; // 管理所有 InfoWindow
    const mapContainer = ref(null); // 地圖 DOM 容器

    // 初始化地圖
    const initMap = () => {
      const customMapStyle = [
        // { featureType: "all", elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
        { featureType: "road", elementType: "labels", stylers: [{ visibility: "on" }] },
        { featureType: "transit", elementType: "all", stylers: [{ visibility: "on" }] },
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

     // 更新標記，添加 InfoWindow 管理邏輯
     const updateMarkers = () => {
      // 清除舊的標記和 InfoWindow
      markers.forEach((marker) => marker.setMap(null));
      infoWindows.forEach((infoWindow) => infoWindow.close());

      // 重新初始化標記和 InfoWindow 陣列
      markers = [];
      infoWindows = [];

      props.places.forEach((place) => {
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
          title: place.name,
        });

         // 設定 InfoWindow（資訊視窗）
         const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="flex w-[320px] h-[114px] bg-white rounded-lg p-2 overflow-hidden">
                <button class="absolute top-1 right-2 text-gray-500 hover:text-gray-700" 
                        onclick="this.closest('.gm-style-iw').querySelector('.gm-ui-hover-effect').click()" 
                        style="outline: none;">
                  ✕
                </button>
                <img 
                  src="${place.photos?.[0]?.getUrl() || '/api/placeholder/96/96'}" 
                  alt="${place.name}"
                  class="w-[100px] h-[100px] object-cover"
                />
                <div class=" pl-2 pt-1 w-[200px] overflow-hidden">
                  <h3 class="text-amber-500 font-medium text-base leading-6 truncate">${place.name}</h3>
                  <div class="flex items-center text-sm text-white">
                    ${place.rating ? `
                      <span class="bg-red-500 w-[46px] h-[18px] rounded-[9px] flex items-center justify-center">
                        <span class="ml-1 text-xs font-bold">${place.rating.toFixed(1)}</span>
                        <svg class="w-4 h-2 text-white fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512">
                          <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
                        </svg>
                      </span>
                      <span class="ml-2 text-gray-500">(${place.user_ratings_total}則評論)</span>
                    ` : '暫無評分'}
                  </div>
                  <p class="text-sm text-black-700 line-clamp-2">${place.vicinity}</p>
                  <span class="block">${place.opening_hours?.isOpen() ? '營業中' : '已打烊'}</span>
                </div>
              </div>
            `,
          });

        google.maps.event.addListener(infoWindow, 'domready', () => {
          // 找到所有需要調整的元素
          const closeButton = document.querySelector('.gm-ui-hover-effect');
          const contentWrapper = document.querySelector('.gm-style-iw-c');
          const contentChild = document.querySelector('.gm-style-iw-d');
          const backgroundWrapper = document.querySelector('.gm-style-iw-t');
          const contnetPadd = document.querySelector('.gm-style-iw-ch');
          
          if (closeButton) {
            closeButton.style.display = 'none';
          }
          
          if (contentWrapper) {
            contentWrapper.style.padding = '0';
            contentWrapper.style.borderRadius = '4px'; // 調整圓角
            contentWrapper.style.overflow = 'hidden'; // 確保內容不會溢出
          }
        
          if (contentChild) {
            contentChild.style.padding = '0';
            contentChild.style.overflow = 'hidden'; // 防止捲軸出現
          }
          
          if (backgroundWrapper) {
            backgroundWrapper.style.background = 'transparent';
          }

          if(contnetPadd){
            contnetPadd.style.padding = '0';
          }
        });

          marker.addListener("click", () => {
            // 關閉所有其他 InfoWindow
            infoWindows.forEach((otherInfoWindow) => {
              if (otherInfoWindow !== infoWindow && otherInfoWindow.getMap()) {
                otherInfoWindow.close();
              }
            });

            // 確保不會重複觸發開/關切換
            if (!infoWindow.getMap()) {
              infoWindow.open(map.value, marker);
            }
          });

                // 保存標記到普通數組
                markers.push(marker);

                // 保存 InfoWindow
                infoWindows.push(infoWindow);
              });
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
