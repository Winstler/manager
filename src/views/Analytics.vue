<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-segment v-model="selectedSegment">
          <ion-segment-button value="default">
            <ion-label>Витрати</ion-label>
          </ion-segment-button>
          <ion-segment-button value="income">
            <ion-label>Доходи</ion-label>
          </ion-segment-button>
        </ion-segment>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <PieChartExpenses v-if="selectedSegment === 'default'"/>
        <PieChartIncome v-if="selectedSegment === 'income'"/>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
    import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue';
    import { onMounted, ref } from 'vue';
    import PieChartExpenses from '../components/analytics/expensesChart.vue'
    import PieChartIncome from '../components/analytics/incomeChart.vue'

    import { useTransactionsStore } from '../stores/transactionsStore'
    const transactionsStore = useTransactionsStore();
    

    import { useCategoriesStore} from "@/stores/categoriesStore"
    const categoriesStore = useCategoriesStore();
    
    const selectedSegment = ref("default")
  </script>