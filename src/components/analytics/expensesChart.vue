<!-- eslint-disable vue/no-side-effects-in-computed-properties -->

<template>
  <div v-if = "noStatsmsg" class = "bg-white rounded-b-xl flex justify-center align-center text-xl italic p-5">Нема статистики за цей період</div>
    <Pie
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
  </template>

<script>
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

import { useCategoriesStore } from '@/stores/categoriesStore'

import { useTransactionsStore } from '@/stores/transactionsStore'
ChartJS.register(ArcElement, Tooltip, Legend)
const categoriesStore = useCategoriesStore()
categoriesStore.getCategories()
const transactionsStore = useTransactionsStore()
transactionsStore.getTransactions()

export default {
  data () {
    return {
      noStatsmsg: false
    }
  },
  name: 'PieChart',
  components: { Pie },
  props: { periodStart: Date, periodEnd: Date },
  computed: {
    chartData () {
      transactionsStore.getFilteredTransactions(this.periodStart, this.periodEnd)
      if (transactionsStore.filteredTransactions.length === 0) {
        this.noStatsmsg = true
      } else {
        this.noStatsmsg = false
      }
      return {
        labels: transactionsStore.expensesCategoryLabels,
        datasets: [{
          backgroundColor: transactionsStore.getColorsExpense,
          data: transactionsStore.expensesStats
        }]
      }
    },
    chartOptions () {
      return {
        responsive: true
      }
    }
  }
}

</script>
