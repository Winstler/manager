import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { getData, addData, unwrapData, changeObjectInArray, updateAccount, deleteObjectInArray, deleteAccountById} from '../indexedDB'

export const useAccountsStore = defineStore('accounts', {
  state: () => ({
    accounts: [],
    accountsErr: "",
  }),
  actions: {
    async getAccounts(){
      try{
        const data = await getData("accounts");
        data.forEach(element => {
          this.accounts.push(element);
        });
      }
      catch(err){
        this.accountsError = err;
      }
    }
  }
})
