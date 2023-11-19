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
    computed: {
      chartData() { return {
        labels: transactionsStore.expensesCategoryLabels,
        datasets: [ {backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                    data: transactionsStore.expensesStats
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