<template>
  <div>
    <h1>搜尋台北市的地點</h1>
    <div>
      <label for="keyword">關鍵字：</label>
      <input v-model="keyword" id="keyword" placeholder="例如：餐廳、咖啡廳" />
    </div>
    <div>
      <label for="district">台北市行政區：</label>
      <select v-model="selectedDistrict" id="district">
        <option v-for="(coords, district) in districts" :key="district" :value="district">
          {{ district }}
        </option>
      </select>
    </div>
    <div>
      <label for="sortOrder">排序方式：</label>
      <select v-model="sortOrder" id="sortOrder">
        <option value="default">預設順序</option>
        <option value="distance">按距離排序</option>
        <option value="rating">按評分排序</option>
      </select>
    </div>
    <button @click="searchPlaces">搜尋</button>

    <ul v-if="sortedPlaces.length">
      <li v-for="place in sortedPlaces" :key="place.place_id">
        <strong>{{ place.name }}</strong> - {{ place.rating }} ★
        <br />
        {{ place.vicinity }}
        <br />
        距離：{{ place.distance ? place.distance.toFixed(2) + ' 公里' : '無資料' }}
      </li>
    </ul>
    <p v-else-if="searched">未找到結果</p>
  </div>
</template>

<script>
import { Loader } from "@googlemaps/js-api-loader";

export default {
  data() {
    return {
      apiKey: "AIzaSyB11WZSiJaHASKBu7OdhbyHl359GrtLzBA", // 請替換為你的 Google Maps API 金鑰
      keyword: "", // 用戶輸入的關鍵字 (例如：餐廳)
      selectedDistrict: "大安區", // 預設行政區為大安區
      sortOrder: "default", // 預設排序方式
      districts: {
        "中正區": { lat: 25.032404, lng: 121.519033 },
        "大同區": { lat: 25.063093, lng: 121.513305 },
        "中山區": { lat: 25.0685, lng: 121.5266 },
        "松山區": { lat: 25.0585, lng: 121.5585 },
        "大安區": { lat: 25.033976, lng: 121.543459 },
        "萬華區": { lat: 25.0354, lng: 121.4997 },
        "信義區": { lat: 25.0306, lng: 121.5701 },
        "士林區": { lat: 25.0922, lng: 121.5245 },
        "北投區": { lat: 25.1321, lng: 121.4987 },
        "內湖區": { lat: 25.083, lng: 121.5868 },
        "南港區": { lat: 25.0553, lng: 121.6171 },
        "文山區": { lat: 24.9987, lng: 121.5549 },
      }, // 各行政區的中心經緯度
      places: [], // 搜尋結果
      searched: false, // 是否已進行搜尋
    };
  },
  computed: {
    sortedPlaces() {
      if (this.sortOrder === "distance") {
        return this.places.sort((a, b) => a.distance - b.distance);
      } else if (this.sortOrder === "rating") {
        return this.places.sort((a, b) => b.rating - a.rating);
      } else {
        return this.places; // 預設順序
      }
    },
  },
  methods: {
    async searchPlaces() {
      this.places = []; // 清空舊的搜尋結果
      this.searched = false;

      if (!this.keyword.trim()) {
        alert("請輸入有效的關鍵字！");
        return;
      }

      const { lat, lng } = this.districts[this.selectedDistrict]; // 根據選擇的行政區獲取經緯度

      const loader = new Loader({
        apiKey: this.apiKey,
        libraries: ["places"],
      });

      await loader.load();

      const service = new google.maps.places.PlacesService(document.createElement("div"));

      const request = {
        location: new google.maps.LatLng(lat, lng), // 使用選擇的行政區經緯度
        radius: 1000, // 搜尋半徑 (公尺)
        keyword: this.keyword, // 使用用戶輸入的關鍵字
      };

      service.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          // 計算每個地點到中心點的距離
          this.places = results.map((place) => ({
            ...place,
            distance: this.calculateDistance(lat, lng, place.geometry.location.lat(), place.geometry.location.lng()),
          }));
        } else {
          console.error("搜尋失敗，狀態：", status);
        }
        this.searched = true;
      });
    },
    calculateDistance(lat1, lng1, lat2, lng2) {
      const R = 6371; // 地球半徑（公里）
      const dLat = this.degToRad(lat2 - lat1);
      const dLng = this.degToRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c; // 距離（公里）
    },
    degToRad(deg) {
      return deg * (Math.PI / 180);
    },
    
  },
};
</script>

<style scoped>
h1 {
  color: #2c3e50;
}
label {
  display: block;
  margin-top: 10px;
  font-weight: bold;
}
input,
select {
  width: 100%;
  max-width: 400px;
  margin-bottom: 10px;
  padding: 5px;
}
button {
  padding: 10px 20px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
button:hover {
  background-color: #2980b9;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 15px;
}
</style>
