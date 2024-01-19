import { defineStore } from 'pinia'
import { getData, addData} from '../indexedDB'

export const useSettingsStore = defineStore('settings', {
  state: () => ({
    settings: [
      { name: 'displayedCurrency', displayedCurrency: "₴", list: ["$", "€", "₴", "£", "¥", "", "₪"] },
      { name: 'defaultAccount', accountId: "" }],
    error: "",
  }),
  actions: {
    async getSettings(){
        try{
          let currency = localStorage.getItem("currency");
          if(currency.length !== 0) this.settings[0].displayedCurrency = currency;
          let account = localStorage.getItem("account");
          if(account.length !== 0) this.settings[1].accountId = account;
        }
        catch(err){
          this.error = err;
        }
    }
  },
  })
