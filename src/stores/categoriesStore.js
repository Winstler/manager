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
        {id: generateUniqueId(), name: "Продукти", isExpense: true},
        {id: generateUniqueId(), name: "Ресторани та кафе", isExpense: true},
        {id: generateUniqueId(), name: "Транспорт", isExpense: true},
        {id: generateUniqueId(), name: "Відпочинок", isExpense: true},
        {id: generateUniqueId(), name: "Покупки", isExpense: true},
        {id: generateUniqueId(), name: "Зарплата", isExpense: false},
        {id: generateUniqueId(), name: "Карманні гроші", isExpense: false},
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
    }
  }
})
