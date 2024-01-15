<template>
  <div v-if = "noStatsmsg" class = "bg-white rounded-b-xl flex justify-center align-center text-xl italic p-5">Нема статистики за цей період</div>
    <Pie
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
    <div v-if = "!noStatsmsg" class = "bg-white rounded-xl m-4 p-4">За цей період було зароблено <span class ="text-lg text-green-500 italic">{{ totalSum }} {{ currency }}</span></div>
  </template>
  
  <script>
  import { Pie } from 'vue-chartjs'
  import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
  
  ChartJS.register(ArcElement, Tooltip, Legend)


  import { useCategoriesStore} from "@/stores/categoriesStore"
  const categoriesStore = useCategoriesStore();
  categoriesStore.getCategories()

  import { useTransactionsStore } from '@/stores/transactionsStore'
  const transactionsStore = useTransactionsStore();
  transactionsStore.getTransactions()

  export default {
    data () {
    return {
      noStatsmsg: false
    }
  },
    name: 'PieChart',
    components: { Pie },
    props: { periodStart: Date, periodEnd: Date, currency: String },
    computed: {
      totalSum() {
      let sum = 0;
      transactionsStore.incomeStats.forEach(e => {
        sum += Number(e.value);
      });
      return sum;
    },
      chartData() {  transactionsStore.getFilteredTransactions(this.periodStart, this.periodEnd) 
        if (transactionsStore.filteredTransactions.length === 0) {
        this.noStatsmsg = true
      } else {
        this.noStatsmsg = false
      }
        return {
        labels: transactionsStore.incomeCategoryLabels,
        datasets: [ {backgroundColor: transactionsStore.getColorsIncome,
                    data: transactionsStore.incomeStats
            }
        ]
      }
    },
      chartOptions() { return {
        responsive: true
      }}
    }
  }

  </script>