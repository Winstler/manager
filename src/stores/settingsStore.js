import { defineStore } from 'pinia'
import { getData } from '../indexedDB'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: [{name: 'displayedCurrency', displayedCurrency: "₴", list: ["$", "€", "₴", "£", "₪"]}],
    error: "",
  }),
  actions: {
    async setSettings(){
      const defaultSettings = [
        {name: 'displayedCurrency', displayedCurrency: "₴", list: ["$", "€", "₴", "£", "₪"]}
      ];
      defaultSettings.forEach((item) => addData("settings", item))
    },
    async getSettings(){
      if(this.settings.length === 0){
        try{
          let data = await getData("settings");
          if(data.length === 0){
            this.setSettings()
            data = await getData("settings");
          }
          data.forEach(element => {
            this.settings.push(element);
          });
        }
        catch(err){
          this.error = err;
        }
    }
    }
  },
  })
