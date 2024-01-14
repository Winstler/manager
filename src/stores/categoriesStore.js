import { defineStore } from 'pinia'
import { generateUniqueId, getData, addData, generateRandomColor } from '../indexedDB'

export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: [

    ],
    error: "",
  }),
  actions: {
    async setCategories(){
      const categoriesList = [
        {id: generateUniqueId(), name: "Продукти", isExpense: true, color: "#4287f5"},
        {id: generateUniqueId(), name: "Ресторани та кафе", isExpense: true, color: "#f73b61"},
        {id: generateUniqueId(), name: "Транспорт", isExpense: true, color: "#1e1785"},
        {id: generateUniqueId(), name: "Відпочинок", isExpense: true, color: "#faf734"},
        {id: generateUniqueId(), name: "Покупки", isExpense: true, color: "#9e7316"},
        {id: generateUniqueId(), name: "Зарплата", isExpense: false, color: "#5deb36"},
        {id: generateUniqueId(), name: "Карманні гроші", isExpense: false, color: "#339618"},
      ];
      categoriesList.forEach((item) => addData("categories", item))
    },
    async getCategories(){
      if(this.categories.length === 0){
        try{
          let data = await getData("categories");
          if(data.length === 0){
            console.log("categories have been set")
            await this.setCategories()
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
  },
  getters: {
    getCategoriesNames(){
      return this.categories.map((c) => c.name)
    },
    getCategoriesIds(){
      this.categories.map((c) => c.id)
    },
    filteredExpenses(){
      return this.categories.filter(category => category.isExpense)
    },
    filteredIncomes(){
      return this.categories.filter(category => !category.isExpense)
    },

  }
})
