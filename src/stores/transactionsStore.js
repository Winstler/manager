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
    },
    async getSumOfCategory(categoryId){
      let sum = 0;
      this.transactions.map((item) =>{
        if (item.categorieId === categoryId){
          sum += Number(item.sum);
        }
      })
      return sum;
    }
  },
  getters: {
    getCategories() {
      return this.transactions.map((t) => t.categorie);
    },
    expensesStats(){
      const categoriesMap = {};

    // Агрегируем данные по категориям
    this.transactions.forEach((transaction) => {
      const categoryId = transaction.categorieId;
      const categorySum = Number(transaction.sum);

      if (categorySum < 0) {
      if (!categoriesMap[categoryId]) {
        categoriesMap[categoryId] = {
          value: categorySum,
          label: transaction.categorie,
        };
      } else {
        categoriesMap[categoryId].value += categorySum;
      }
      }
    });

    // Преобразуем объект в массив
    const statsArray = Object.values(categoriesMap);

    return statsArray;
    },
    incomeStats(){
      const categoriesMap = {};

    // Агрегируем данные по категориям
    this.transactions.forEach((transaction) => {
      const categoryId = transaction.categorieId;
      const categorySum = Number(transaction.sum);

      if (categorySum > 0) {
      if (!categoriesMap[categoryId]) {
        categoriesMap[categoryId] = {
          value: categorySum,
          label: transaction.categorie,
        };
      } else {
        categoriesMap[categoryId].value += categorySum;
      }
      }
    });

    // Преобразуем объект в массив
    const statsArray = Object.values(categoriesMap);

    return statsArray;
    },
    expensesCategoryLabels() {
      const uniqueExpenseLabels = new Set();
  
      // Собираем уникальные метки категорий
      this.transactions.forEach((transaction) => {
        const categorySum = Number(transaction.sum);

        if (categorySum < 0) {
          uniqueExpenseLabels.add(transaction.categorie);
        }
      });
  
      // Преобразуем Set в массив
      const expenseLabelsArray = Array.from(uniqueExpenseLabels);
  
      return expenseLabelsArray;
  },
  incomeCategoryLabels() {
    const uniqueExpenseLabels = new Set();

    // Собираем уникальные метки категорий
    this.transactions.forEach((transaction) => {
      const categorySum = Number(transaction.sum);

      if (categorySum > 0) {
        uniqueExpenseLabels.add(transaction.categorie);
      }
    });

    // Преобразуем Set в массив
    const expenseLabelsArray = Array.from(uniqueExpenseLabels);

    return expenseLabelsArray;
},
  getColorsExpense(){
    const uniqueExpenseColors = new Set();

    // Собираем уникальные метки категорий
    this.transactions.forEach((transaction) => {
      const categorySum = Number(transaction.sum);

      if (categorySum < 0) {
        uniqueExpenseColors.add(transaction.color);
      }
    });

    // Преобразуем Set в массив
    const expenseColorsArray = Array.from(uniqueExpenseColors);

    return expenseColorsArray;
  },
  getColorsIncome(){
    const uniqueIncomeColors = new Set();

    // Собираем уникальные метки категорий
    this.transactions.forEach((transaction) => {
      const categorySum = Number(transaction.sum);

      if (categorySum > 0) {
        uniqueIncomeColors.add(transaction.color);
      }
    });

    // Преобразуем Set в массив
    const incomeColorsArray = Array.from(uniqueIncomeColors);

    return incomeColorsArray;
  }
}
  
})
