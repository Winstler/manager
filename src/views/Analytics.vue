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
      <ion-content color="light">
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
        <PieChartExpenses :periodStart = "periodStart" :periodEnd = "periodEnd" :currency = "settingsStore.settings[0].displayedCurrency" v-if="selectedSegment === 'default'"/>
        <PieChartIncome :periodStart = "periodStart" :periodEnd = "periodEnd" v-else :currency = "settingsStore.settings[0].displayedCurrency"/>
        <h2 class = "mx-4" v-if="selectedSegment === 'default'">Топ категорій</h2>
  <ion-list v-if="selectedSegment === 'default'" class = "mx-4 rounded-xl">
    <ion-item class = "my-4" v-for="category in transactionsStore.expensesStats" button @click = "editCategory(category)" style ="flex items-center">
      <div class="h-10 w-10 rounded-full mr-2" :style="{ backgroundColor: category.color }"></div>
      <ion-label>{{ category.label }}
        <ion-label class=""><div class ="text-gray-600">Тразакцій: {{category.transactionsAmount}}</div></ion-label>
      </ion-label>
      <ion-label slot = "end" color = "danger">{{ category.value }} {{ settingsStore.settings[0].displayedCurrency}}</ion-label>
    </ion-item>
  </ion-list>
  <h2 class = "mx-4" v-if="selectedSegment === 'income'">Топ категорій</h2>
  <ion-list v-if="selectedSegment === 'income'" class = "mx-4 rounded-xl">
    <ion-item class = "my-4" v-for="category in transactionsStore.incomeStats" button @click = "editCategory(category)" style ="flex items-center">
      <div class="h-10 w-10 rounded-full mr-2" :style="{ backgroundColor: category.color }"></div>
      <ion-label>{{ category.label }}
        <ion-label class=""><div class ="text-gray-600">Тразакцій: {{category.transactionsAmount}}</div></ion-label>
      </ion-label>
      <ion-label slot = "end" color = "success">{{ category.value }} {{ settingsStore.settings[0].displayedCurrency}}</ion-label>
    </ion-item>
  </ion-list>
      </ion-content>
    </ion-page>
  </template>

<script setup>
import { IonList, IonItem, IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonSegment, IonSegmentButton, IonLabel, IonSelect, IonSelectOption } from '@ionic/vue'
import { onMounted, ref, computed } from 'vue'
import PieChartExpenses from '../components/analytics/expensesChart.vue'
import PieChartIncome from '../components/analytics/incomeChart.vue'

import { useSettingsStore } from '@/stores/settingsStore'
const settingsStore = useSettingsStore()
settingsStore.getSettings();

import { useTransactionsStore } from '../stores/transactionsStore'

import { useCategoriesStore } from '@/stores/categoriesStore'
const transactionsStore = useTransactionsStore()
const categoriesStore = useCategoriesStore()

const selectedSegment = ref('default')
const computedColor = computed(() => selectedSegment.value == 'default' ? 'danger' : 'success')

const period = ref('today')
const periodStart = computed(() => {
  switch (period.value) {
    case 'today':
      const now = new Date()
      return new Date(now.setHours(0, 0, 0, 0))
      break
    case 'yesterday':
      const yesterday = new Date(Date.now() - 86400000)
      return new Date(yesterday.setHours(0, 0, 0, 0))
      break
    case 'week':
      const week = new Date(Date.now() - 86400000 * 7)
      return new Date(week.setHours(0, 0, 0, 0))
      break
    case 'month':
      const month = new Date(Date.now() - 86400000 * 30)
      return new Date(month.setHours(0, 0, 0, 0))
      break
    case 'year':
      const year = new Date(Date.now() - 86400000 * 365)
      return new Date(year.setHours(0, 0, 0, 0))
      break
    case 'all':
      return new Date('1 January 1970')
      break
  }
})
const periodEnd = computed(() => {
  switch (period.value) {
    case 'today':
      const now = new Date()
      return new Date(now.setHours(23, 59, 59, 999))
      break
    case 'yesterday':
      const yesterday = new Date(Date.now() - 86400000)
      return new Date(yesterday.setHours(23, 59, 59, 999))
      break
    case 'week':
      const week = new Date()
      return new Date(week.setHours(23, 59, 59, 999))
      break
    case 'month':
      const month = new Date()
      return new Date(month.setHours(23, 59, 59, 999))
      break
    case 'year':
      const year = new Date()
      return new Date(year.setHours(23, 59, 59, 999))
      break
    case 'all':
      return new Date()
      break
  }
})
</script>
<style>
ion-item:last-child {
  --border-style: none
}
</style>