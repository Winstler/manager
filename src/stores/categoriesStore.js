import { defineStore } from 'pinia'
import { generateUniqueId, getData, addData } from '../indexedDB'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [

    ],
    error: "",
  }),
  actions: {
    async setCategories(){
      const categoriesList = [
        {id: generateUniqueId(), name: "Groceries"},
        {id: generateUniqueId(), name: "Restaurant"},
        {id: generateUniqueId(), name: "Transport"},
        {id: generateUniqueId(), name: "Leisure"},
        {id: generateUniqueId(), name: "Shopping"},
      ];
      categoriesList.forEach((item) => addData("categories", item))
    },
    async getCategories(){
      if(this.categories.length === 0){
        try{
          let data = await getData("categories");
          if(data.length === 0){
            this.setCategories()
            data = await getData("categories");
          }
          data.forEach(element => {
            this.categories.push(element);
          });
        }
        catch(err){
          this.error = err;
        }
    }
    }
  }
})
