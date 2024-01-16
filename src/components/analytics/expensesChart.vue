<!-- eslint-disable vue/no-side-effects-in-computed-properties -->

<template>
  <div v-if = "noStatsmsg" class = "bg-white rounded-b-xl flex justify-center align-center text-xl italic p-5">Нема статистики за цей період</div>
    <Pie
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
  <div v-if = "!noStatsmsg" class = "bg-white rounded-xl m-4 p-4">За цей період було витрачено <span class ="text-lg text-red-500 italic">{{ totalSum }} {{ currency }}</span></div>
</template>

<script>
import { IonList, IonItem, IonLabel } from '@ionic/vue';
import { defineComponent } from 'vue';
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { useCategoriesStore } from '@/stores/categoriesStore'
const categoriesStore = useCategoriesStore()



import { useTransactionsStore } from '@/stores/transactionsStore'
const transactionsStore = useTransactionsStore()

ChartJS.register(ArcElement, Tooltip, Legend)


export default {
  
  data () {
    return {
      noStatsmsg: false,
      categoriesStats: this.fetchData(),
    }
  },
  created() {
    this.fetchData();
  },
  name: 'PieChart',
  components: { Pie, IonList, IonItem, IonLabel },
  props: { periodStart: Date, periodEnd: Date, currency: String },
  methods:{
    fetchData(){
      transactionsStore.getFilteredTransactions(this.periodStart, this.periodEnd)
      if (transactionsStore.filteredTransactions.length === 0) {
        this.noStatsmsg = true
      } else {
        this.noStatsmsg = false
      }
      return transactionsStore.expensesStats;
    }
  },
  computed: {
    totalSum() {
      let sum = 0;
      transactionsStore.expensesStats.forEach(e => {
        sum += Number(e.value);
      });
      return sum * (-1);
    },
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

  },
  
}

</script>