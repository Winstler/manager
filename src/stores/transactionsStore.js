import { defineStore } from 'pinia'
import { getData } from '../indexedDB'

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [],
    error: "",
  }),
  actions: {
    async getTransactions(){
      if(this.transactions.length === 0){
        try{
          const data = await getData("transactions");
          data.forEach(element => {
            this.transactions.push(element);
          });
        }
        catch(err){
          this.error = err;
        }
    }
    }
  }
})
