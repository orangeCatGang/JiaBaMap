// store.js
import { defineStore } from 'pinia'

export const useKeywordStore = defineStore('keyword', {
  state: () => ({
    keyword: ''
  }),
  actions: {
    navigateToSearch(router, tag) {
      this.keyword = tag
      router.push({
        path: "/search",
        query: { keyword: tag },
      })
    }
  }
})