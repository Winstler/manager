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
        {id: generateUniqueId(), name: "Продукти", isExpense: true, color: generateRandomColor()},
        {id: generateUniqueId(), name: "Ресторани та кафе", isExpense: true, color: generateRandomColor()},
        {id: generateUniqueId(), name: "Транспорт", isExpense: true, color: generateRandomColor()},
        {id: generateUniqueId(), name: "Відпочинок", isExpense: true, color: generateRandomColor()},
        {id: generateUniqueId(), name: "Покупки", isExpense: true, color: generateRandomColor()},
        {id: generateUniqueId(), name: "Зарплата", isExpense: false, color: generateRandomColor()},
        {id: generateUniqueId(), name: "Карманні гроші", isExpense: false, color: generateRandomColor()},
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
