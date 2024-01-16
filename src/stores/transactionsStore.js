import { defineStore } from 'pinia'
import { getData } from '../indexedDB'
import { useCategoriesStore } from '@/stores/categoriesStore'
const categoriesStore = useCategoriesStore()

export const useTransactionsStore = defineStore('transactions', {
  state: () => ({
    transactions: [],
    error: "",
    filteredTransactions: [],
  }),
  actions: {
    async getTransactions(){
      if(this.transactions.length === 0){
        try{
          const data = await getData("transactions");
          data.forEach(element => {
            this.transactions.unshift(element);
          });
        }
        catch(err){
          this.error = err;
        }
    }
    },
    async getSumOfCategory(categoryId){
      let sum = 0;
      this.filteredTransactions.map((item) =>{
        if (item.categorieId === categoryId){
          sum += Number(item.sum);
        }
      })
      return sum;
    },
    getFilteredTransactions(periodStart, periodEnd) {
      this.filteredTransactions = [];
      const filtered = this.transactions.filter((transaction) => {
        const transactionDate = new Date(transaction.created);
        console.log(transactionDate >= new Date(periodStart))
        return (transactionDate >= new Date(periodStart)) && (transactionDate <= new Date (periodEnd));
      });
      filtered.forEach(element => {
        this.filteredTransactions.unshift(element);
      });
    },
  },
  getters: {
    getCategories() {
      return this.filteredTransactions.map((t) => t.categorie);
    },
    expensesStats(){
      const categoriesMap = {};
    // Агрегируем данные по категориям
    this.filteredTransactions.forEach((transaction) => {
      const categoryId = transaction.categorieId;
      const categoryPos = categoriesStore.categories.findIndex((e) => e.id === categoryId);
      const categorySum = Number(transaction.sum);
      const transactionTime = transaction.created

      if (categorySum < 0) {
      if (!categoriesMap[categoryId]) {
        categoriesMap[categoryId] = {
          value: categorySum,
          label: transaction.categorie,
          color: categoriesStore.categories[categoryPos].color,
          transactionsAmount: 1
        };
      } else {
        categoriesMap[categoryId].value += categorySum;
        categoriesMap[categoryId].transactionsAmount++;
      }
      }
    });

    // Преобразуем объект в массив
    const statsArray = Object.values(categoriesMap);
    statsArray.sort((a,b) => a.value - b.value )
    console.log(statsArray)
    return statsArray;
    },
    incomeStats(){
      const categoriesMap = {};

    // Агрегируем данные по категориям
    this.filteredTransactions.forEach((transaction) => {
      const categoryId = transaction.categorieId;
      const categoryPos = categoriesStore.categories.findIndex((e) => e.id === categoryId);
      const categorySum = Number(transaction.sum);

      if (categorySum > 0) {
      if (!categoriesMap[categoryId]) {
        categoriesMap[categoryId] = {
          value: categorySum,
          label: transaction.categorie,
          color: categoriesStore.categories[categoryPos].color,
          transactionsAmount: 1
        };
      } else {
        categoriesMap[categoryId].value += categorySum;
        console.log("added")
        categoriesMap[categoryId].transactionsAmount++;
      }
      }
    });

    // Преобразуем объект в массив
    const statsArray = Object.values(categoriesMap);
    statsArray.sort((a,b) => b.value - a.value )
    console.log(statsArray)

    return statsArray;
    },
    expensesCategoryLabels() {
      const expenseLabelsArray = [];
      this.expensesStats.forEach((s) => expenseLabelsArray.push(s.label))
  
      return expenseLabelsArray;
  },
  incomeCategoryLabels() {
    const expenseLabelsArray = [];
      this.incomeStats.forEach((s) => expenseLabelsArray.push(s.label))
  
      return expenseLabelsArray;
},
  getColorsExpense(){
    
    const expenseColorsArray = [];
    this.expensesStats.forEach((s) => expenseColorsArray.push(s.color))
    
    return expenseColorsArray;
  },
  getColorsIncome(){
    const expenseColorsArray = [];
    this.incomeStats.forEach((s) => expenseColorsArray.push(s.color))
    
    return expenseColorsArray;
  }
}
})
