import { defineStore } from 'pinia'
import { getData, addData} from '../indexedDB'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: [
      { name: 'displayedCurrency', displayedCurrency: "₴", list: ["$", "€", "₴", "£", "₪"] },
      { name: 'defaultAccount', accountId: "hry" }],
    error: "",
  }),
  actions: {
    async setSettings(){
      const settingsList = [
        { name: 'displayedCurrency', displayedCurrency: "₴", list: ["$", "€", "₴", "£", "₪"] },
        { name: 'defaultAccount', accountId: "hry" }
      ];
      settingsList.forEach((item) => addData("settings", item))
    },
    async getSettings(){
      if(this.settings.length === 0){
        try{
          let data = await getData("settings");
          if(data.length === 0){
            console.log("settings have been set")
            await this.setSettings()
            data = await getData("settings");
          }
          data.forEach(element => {
            console.log("pushed")
            this.settings.unshift(element);
          });
        }
        catch(err){
          this.error = err;
        }
    }
    }
  },
  })
