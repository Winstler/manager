import { defineStore } from 'pinia'
import { getData } from '../indexedDB'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    currency: {displayedCurrency: "₴", list: ["$", "€", "₴", "£", "₪"]},
    error: "",
  }),
  actions: {
    async getSettings(){
      if(this.settings.length === 0){
        try{

        }
        catch(err){
          this.error = err;
        }
    }
    }
  }
})
