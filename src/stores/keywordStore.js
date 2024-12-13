// store.js
import { defineStore } from 'pinia'
import axios from 'axios'

export const useKeywordStore = defineStore('keyword', {
  state: () => ({
    keyword: "",
    sortOrder:{
      default: "預設",
      distance: "最近距離",
      rating: "最高評分",
      reviews: "最高人氣"
    },
    selectedDistrict: "中正區",
    coordinate: { lat: 25.032404, lng: 121.519033 },
    districts:{
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
    result:[],
  }),
  actions: {
    navigateToSearch(router, tag) {
      this.keyword = tag
      router.push({
        path: "/search",
        query: { keyword: tag },
      })
    },
    

    //取得keyword
    setKeyword(value){
      this.keyword = value
    },
    async handleSearch(){
      if(!keyword.value || keyword.value == ""){
        alert("請輸入有效關鍵字")
        return
      }
      this.setKeyword(keyword.value)
      const response = await axios.get(`http://localhost:3000/restaurants/search?keyword=${this.keyword}&lat=${this.coordinate.lat}&lng=${this.coordinate.lng}`)
      this.result = response.data
      
      
    },

    // 取得座標
    selectDistrict(districtName) {
      if (this.districts[districtName]) {
        this.selectedDistrict = districtName
        this.coordinate = this.districts[districtName]
      } else {
        console.error(`行政區 "${districtName}" 不存在！`)
      }
    },

  }
})