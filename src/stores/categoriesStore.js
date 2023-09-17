import { defineStore } from 'pinia'
import { getData } from '../indexedDB'

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    categories: [],
    error: "",
  }),
  actions: {
    
  }
})
