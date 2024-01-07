<template>
    <Pie
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
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
    name: 'PieChart',
    components: { Pie },
    props: { periodStart: Date, periodEnd: Date },
    computed: {
      chartData() {  transactionsStore.getFilteredTransactions(this.periodStart, this.periodEnd) 
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