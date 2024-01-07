<template>
    <ion-page>
      <ion-header>
        <ion-select style = "translate: 43%;" v-model = "period" interface="alert">
          <ion-select-option value="today">Сьогодні</ion-select-option>
          <ion-select-option value="yesterday">Вчора</ion-select-option>
          <ion-select-option value="week">Останні 7 днів</ion-select-option>
          <ion-select-option value="month">Останній 30 днів</ion-select-option>
          <ion-select-option value="year">Останній 365 днів</ion-select-option>
          <ion-select-option value="all">За весь час</ion-select-option>
        </ion-select>
      </ion-header>
      <ion-content>
        <ion-toolbar>
          <ion-segment v-model="selectedSegment" :color = "computedColor">
          <ion-segment-button value="default">
            <ion-label>Витрати</ion-label>
          </ion-segment-button>
          <ion-segment-button value="income">
            <ion-label>Доходи</ion-label>
          </ion-segment-button>
        </ion-segment>
        </ion-toolbar>
        <PieChartExpenses :periodStart = "periodStart" :periodEnd = "periodEnd" v-if="selectedSegment === 'default'"/>
        <PieChartIncome :periodStart = "periodStart" :periodEnd = "periodEnd" v-if="selectedSegment === 'income'"/>
      {{ period }}
        {{ periodStart }}
        {{ periodEnd }}
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
    import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonSegment, IonSegmentButton, IonLabel, IonSelect, IonSelectOption } from '@ionic/vue';
    import { onMounted, ref, computed } from 'vue';
    import PieChartExpenses from '../components/analytics/expensesChart.vue'
    import PieChartIncome from '../components/analytics/incomeChart.vue'

    import { useTransactionsStore } from '../stores/transactionsStore'
    const transactionsStore = useTransactionsStore();
    

    import { useCategoriesStore} from "@/stores/categoriesStore"
    const categoriesStore = useCategoriesStore();
    
    const selectedSegment = ref("default")
    const computedColor = computed(() => selectedSegment.value == "default" ? "danger" : "success");

    const period = ref("today")
    const periodStart = computed (() => {
      switch (period.value) {
        case "today":
          let now = new Date();
          return new Date(now.setHours(0, 0, 0, 0));
          break;
        case "yesterday":
          let yesterday = new Date(Date.now()-86400000);
          return new Date(yesterday.setHours(0, 0, 0, 0));
          break;
        case "week":
          let week = new Date(Date.now()-86400000*7);
          return new Date(week.setHours(0, 0, 0, 0));
          break;
        case "month":
          let month = new Date(Date.now()-86400000*30);
          return new Date(month.setHours(0, 0, 0, 0));
          break;
        case "year":
        let year = new Date(Date.now()-86400000*365);
          return new Date(year.setHours(0, 0, 0, 0));
          break;
        case "all":
          return new Date("1 January 1970");
          break;
        
      }
    });
    const periodEnd = computed (() => {
      switch (period.value) {
        case "today":
          let now = new Date();
          return new Date(now.setHours(23, 59, 59, 999));
          break;
        case "yesterday":
          let yesterday = new Date(Date.now()-86400000);
          return new Date(yesterday.setHours(23, 59, 59, 999));
          break;
          case "week":
          let week = new Date();
          return new Date(week.setHours(23, 59, 59, 999));
          break;
          case "month":
          let month = new Date();
          return new Date(month.setHours(23, 59, 59, 999));
          break;
        case "year":
        let year = new Date();
          return new Date(year.setHours(23, 59, 59, 999));
          break;
        case "all":
          return new Date();
          break;
        
      }
    })
  </script>