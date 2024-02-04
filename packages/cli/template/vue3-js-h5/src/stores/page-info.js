import { ref } from 'vue'
import { defineStore } from 'pinia'

export const usePageInfoStore = defineStore('pageInfo', () => {
  const pageTitle = ref('')
  const setPageTitle = (title) => {
    pageTitle.value = title
  }

  return { pageTitle, setPageTitle }
})
