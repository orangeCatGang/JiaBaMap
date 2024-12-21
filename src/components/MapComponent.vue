<template>
  <div ref="mapContainer" class="hidden md:block md:w-1/2 h-screen"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, onBeforeUnmount, nextTick } from "vue";
import { useRestaurantStore } from '@/stores/searchPage';
import { watch } from 'vue'
import loader from "./googleMapsLoader";

    const store = useRestaurantStore()
  
    const map = ref(null); // Google 地圖實例
    let markers = []; // 使用普通數組管理標記
    let infoWindows = []; // 管理所有 InfoWindow
    const mapContainer = ref(null); // 地圖 DOM 容器
    // const places = ref([]); // 從 Local Storage 加載的地點資料
    // const districts = ref([]);


    watch(() => store.hoveredPlaceId, (newPlaceId) => {
      if (!map.value) return
      
      markers.forEach(marker => {
    marker.setIcon(null); // 使用預設的紅色標記
    marker.setAnimation(null); // 停止任何動畫
    });
      // 找到對應的標記
        const marker = markers.find(m => m.placeId === newPlaceId)
    if (marker) {
      if (newPlaceId) {
        // 放大效果可以通過縮放實現
        marker.setAnimation(google.maps.Animation.BOUNCE); // 或使用 BOUNCE 效果
        google.maps.event.trigger(marker, 'click')
      } else {
        infoWindows.forEach(window => window.close())
      }
    }
})


    



    // 從 Local Storage 加載地點資料
    // const fetchPlacesFromLocalStorage = () => {
    //   const localStorageUtil = {
    //     get(key) {
    //       const value = localStorage.getItem(key);
    //       return value ? JSON.parse(value) : [];
    //     },
    //   };
    //   places.value = localStorageUtil.get("places") || []; // 更新地點資料
    //   districts.value = localStorageUtil.get("districts") || [];
    //   if (map.value && districts.value) {
    //     map.value.setCenter(districts.value); // 動態設置地圖的中心點
    //   }
    //   updateMarkers(); // 每次加載新資料時更新標記
    // };
    

    // 初始化 Google 地圖
    const initMap = async () => {
      
      const customMapStyle = [
        // { featureType: "all", elementType: "labels", stylers: [{ visibility: "off" }] },
        { featureType: "poi", elementType: "all", stylers: [{ visibility: "off" }] },
        { featureType: "road", elementType: "labels", stylers: [{ visibility: "on" }] },
        { featureType: "transit", elementType: "all", stylers: [{ visibility: "on" }] },
        { featureType: "water", elementType: "labels", stylers: [{ visibility: "off" }] },
      ];

      try {
        await loader.load(); // 確保 Google Maps API 加載完成
        const initialCenter = districts.value
        
        map.value = new google.maps.Map(mapContainer.value, {
          center: initialCenter, // 台北市中心
          zoom: 15,
          styles: customMapStyle, // 套用自定義樣式
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

    const updateMarkers = () => {
      if (!map.value) {
          console.warn("地圖尚未初始化，跳過標記更新");
          return;
        }
      clearMarkers()
      places.value.forEach((place) => {
        const marker = new google.maps.Marker({
          position: {
            lat: place.lat,
            lng: place.lng
          },
          map: map.value,
          title: place.name,
          placeId: place.id  // 保存 placeId 以便後續查找
    });
    
      // 添加滑鼠事件
      marker.addListener('mouseover', () => {
      store.setHoveredPlace(place.id);
      google.maps.event.trigger(marker, 'click'); // 觸發 InfoWindow
      });

      marker.addListener('mouseover', () => {
      store.setHoveredPlace(place.id);
      google.maps.event.trigger(marker, 'click');
      
      // 新增這段：滾動到對應的餐廳卡片
      const element = document.querySelector(`[data-place-id="${place.id}"]`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      };
      });



        // 使用 PlacesService 取得地點的詳細資料
        const service = new google.maps.places.PlacesService(map.value);
        service.getDetails({ placeId: place.id }, (placeDetails, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK) {
            // const isOpen = placeDetails.opening_hours?.isOpen(new Date()); // 使用 isOpen() 檢查是否營業
            const openingStatus = place.openNow ? '營業中' : '已打烊'; // 根據 isOpen 判斷營業狀態

            const infoWindow = new google.maps.InfoWindow({
              content: `
                <div class="flex w-[320px] h-[120px] bg-white rounded-lg p-2 overflow-hidden">
                  <button class="absolute text-gray-500 top-1 right-2 hover:text-gray-700" 
                          onclick="this.closest('.gm-style-iw').querySelector('.gm-ui-hover-effect').click()" 
                          style="outline: none;">
                    ✕
                  </button>
                  <img 
                    src="${photoGet(place.photoId) || '/api/placeholder/96/96'}" 
                    alt="${place.name}"
                    class="w-[100px] h-[105px] object-cover"
                  />
                  <div class="pl-2  w-[200px] overflow-hidden">
                    <h3 class="text-base font-medium leading-6 truncate text-amber-500">${place.name}</h3>
                    <div class="flex items-center text-sm text-white">
                      ${place.rating ? `
                        <span class="bg-orange-600 w-[46px] h-[18px] rounded-[9px] flex items-center justify-center">
                          <span class=" text-xs mr-1">${place.rating.toFixed(1)}</span>
                          <span>
                            <svg class="svg-inline--fa fa-star" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="star" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path class="" fill="currentColor" d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"></path></svg></span>
                          </span>
                        <span class="ml-2 text-gray-500">(${place.userRatingCount || 0}則評論)</span>
                      ` : '暫無評分'}
                    </div>
                    <p class="text-sm text-black-700 line-clamp-2">${place.address || '地址未提供'}</p>
                    <span class="block text-sm text-gray-800 font-bold">${openingStatus}</span>
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
              infoWindows.forEach((otherInfoWindow) => otherInfoWindow.close());
              infoWindow.open({
                map: map.value,
                anchor: marker,
              });
            });

            markers.push(marker); // 添加標記到數組
            infoWindows.push(infoWindow); // 添加 InfoWindow 到數組
          } else {
            console.error("無法獲取地點詳細資料", status);
          }
        });
      });
    };


    // 清除地圖上的標記
    const clearMarkers = () => {
      markers.forEach((marker) => {
        marker.setMap(null); // 從地圖上移除標記
      });
      infoWindows.forEach((infoWindow) => {
        infoWindow.close();
      });
      markers = []; // 清空標記數組
      infoWindows = [];
    };

    // 設定事件監聽器以監控 Local Storage 資料變化
    onMounted(async () => {
      try {
        await nextTick();
        if (!mapContainer.value) {
          throw new Error("地圖容器未掛載");
        }if (!map.value) {
          await initMap();
        }
      if (places.value && places.value.length > 0) {
      updateMarkers();
        }
      } catch (error) {
        console.error("mounted 鉤子發生錯誤:", error);
      }
    });

  onBeforeUnmount(() => {
  clearMarkers();
  if (map.value) {
    google.maps.event.clearInstanceListeners(map.value); // 清除地圖上的所有事件
    map.value = null; // 銷毀地圖
  }
});

import { useKeywordStore } from '../stores/keywordStore.js'

const Search = useKeywordStore()

const places = computed(() => Search.result); 
const districts = computed(() => Search.coordinate);

const photoGet = (photoId) =>{
  return `http://localhost:3000/restaurants/photo?id=${photoId}`
} 


watch(
  () => places.value,
  (newPlaces) => {
    if (!map.value) {
      console.warn("地圖尚未初始化，跳過更新");
      return;
    }

    console.log("places 更新:", newPlaces);
    if (newPlaces && newPlaces.length > 0) {
      updateMarkers(); // 數據更新時重新繪製標記
      map.value.setCenter(districts.value)
    } else {
      clearMarkers(); // 如果沒有地點，清空標記
    }
  },
  { immediate: true }
);
</script>