import { defineStore } from 'pinia'
import { getData } from '../indexedDB'

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [],
    error: "",
  }),
  actions: {
    async getAccounts(){
      if(this.accounts.length === 0){
        try{
          const data = await getData("accounts");
          data.forEach(element => {
            this.accounts.push(element);
          });
        }
        catch(err){
          this.error = err;
        }
    }
    }
  }
})
