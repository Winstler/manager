<template>
    <Bar
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'

    ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

  import { useCategoriesStore} from "@/stores/categoriesStore"
  const categoriesStore = useCategoriesStore();
  categoriesStore.getCategories()

  import { useTransactionsStore } from '@/stores/transactionsStore'
  const transactionsStore = useTransactionsStore();
  transactionsStore.getTransactions();


  export default {
    name: 'BarChart',
    components: { Bar },
    props: { periodStart: Date, periodEnd: Date },
    computed: {
      chartData() {
        transactionsStore.getFilteredTransactions(this.periodStart, this.periodEnd)
        return {
          labels: ["monday", "tuesay", "wed", "thurs", "fri", "sat"],
          datasets: [{
            data: [-10, -20, -30, -40, 60, 34]
          }]
        }
    },
      chartOptions() { return {
        responsive: true
      }}
    }
  }

  </script>