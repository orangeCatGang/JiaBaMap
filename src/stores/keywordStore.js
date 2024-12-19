// store.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useKeywordStore = defineStore('keyword', {
  state: () => ({
    keyword: "", //關鍵字
    sortOrder:"default", //排序
    sortOptions:{
      default: "預設",
      distance: "最近距離",
      rating: "最高評分",
      reviews: "最高人氣"
    },
    selectedDistrict: "中正區", //當前選擇地區 
    coordinate: { lat: 25.032404, lng: 121.519033 },//當前地區座標
    districts:{ //地區選項
        "我的位置": null,
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
    },
    selectedCost:"default",
    costOptions: {
      default: "全部",
      cost1: "200內",
      cost2: "201~400",
      cost3: "401~600",
      cost4:"601~800",
      cost5: "801~1000",
      cost6: "1000以上",
    },
   isOpen: false,
   result:[], //搜尋資料 
  }),
  
  getters: {
    filteredResult: (state) => {
      let filtered = [...state.result]; 
      
      
      // 過濾營業中
      if (state.isOpen) {
        filtered = filtered.filter((place) => place.openNow);
      }
      
      // 過濾價格分類
      if (state.selectedCost !== 'default') {
        filtered = filtered.filter((place) => {
          const price = place.startPrice || 0;
        if (state.selectedCost === 'cost1') return price <= 200;
        if (state.selectedCost === 'cost2') return price >= 200 && price < 400;
        if (state.selectedCost === 'cost3') return price >= 400 && price < 600;
        if (state.selectedCost === 'cost4') return price >= 600 && price < 800;
        if (state.selectedCost === 'cost5') return price >= 800 && price < 1000;
        if (state.selectedCost === 'cost6') return price >= 1000;
      });
      }
      // 與店家距離
      const calculateDistance = (lat1, lng1, lat2, lng2) => {
        const R = 6371; 
        const toRadians = (deg) => deg * (Math.PI / 180); 
        const dLat = toRadians(lat2 - lat1);
        const dLng = toRadians(lng2 - lng1);
        const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
        Math.sin(dLng / 2) ** 2;
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; 
      };
      
      filtered = filtered.map((place) => ({
        ...place,
        distance: calculateDistance(
          state.coordinate.lat, 
          state.coordinate.lng, 
          place.lat, 
          place.lng
        )
      }));
      
      // 排序
      const sortFunctions = {
        default: () => 0,
        rating: (a, b) => (b.rating || 0) - (a.rating || 0),
        reviews: (a, b) => (b.userRatingCount || 0) - (a.userRatingCount || 0),
        distance: (a, b) => a.distance - b.distance,
      };
      filtered.sort(sortFunctions[state.sortOrder]);
      return filtered;
    },
  },
  
  
  actions: {
     navigateToSearch(router, tag) {
      this.keyword = tag
      router.push({
        path: "/search",
        query: { keyword: tag },
      }).then(() => {
        // 確保導航完成後執行搜尋
        this.handleSearch();
      });
    },
    

    //取得keyword並搜尋
    setKeyword(value){
      this.keyword = value
    },
    async handleSearch(){
      if(!this.keyword || this.keyword == ""){
        alert("請輸入有效關鍵字!!!")
        return
      }
      const response = await axios.get(`http://localhost:3000/restaurants/search?keyword=${this.keyword}&lat=${this.coordinate.lat}&lng=${this.coordinate.lng}`)
      this.result = response.data
    },

    // 取得座標
    selectDistrict(districtName) {
      if (districtName === "我的位置"){
          navigator.geolocation.getCurrentPosition( (position) => {
            this.districts[districtName] = {
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                    };
                  })
                }
      if (this.districts[districtName]) {
        this.selectedDistrict = districtName
        this.coordinate = this.districts[districtName]
      } else {
        alert("尚未取得您的位置，請允許定位後再試！")
      }
    },

    setSortOrder(value){
      this.sortOrder = value
    },
    setOpen(){
      this.isOpen = !this.isOpen
    },
    setCostRange(value){
       this.selectedCost = value
   },
   setResult(value){
     this.result = value;
   }
    
  }
})