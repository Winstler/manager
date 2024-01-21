<template>
<ion-segment v-model="selectedSegment" :color = "computedColor">
    <ion-segment-button value="default">
        <ion-label>Витрати</ion-label>
    </ion-segment-button>
    <ion-segment-button value="income">
      <ion-label>Доходи</ion-label>
    </ion-segment-button>
</ion-segment>
<ion-item v-if = "selectedSegment=='default'" class = "my-4 " v-for="category in categoriesStore.filteredExpensesForLists" button @click = "editCategory(category)" style ="flex items-center">
    <div class="h-10 w-10 rounded-full mr-2" :style="{ backgroundColor: category.color }"></div>
    <ion-label>{{ category.name }}</ion-label>
</ion-item>
<ion-item v-else class = "my-4" v-for="category in categoriesStore.filteredIncomesForLists" button @click = "editCategory(category)" style ="flex items-center">
    <div class="h-10 w-10 rounded-full mr-2" :style="{ backgroundColor: category.color }"></div>
    <ion-label>{{ category.name }}</ion-label>
</ion-item>
</template>
<script setup>
import { IonAlert, IonSegment, IonSegmentButton, IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonItem, IonLabel, modalController, IonIcon, IonList, IonToast, IonSelect, IonSelectOption } from '@ionic/vue'
import { addCircle, trash } from 'ionicons/icons'
import editCategorie from '@/components/more/editCategories.vue'
import { generateUniqueId, addData, changeObjectInArray, updateData, unwrapData, deleteObjectInArray, deleteRecordById, deleteAllRecordWithConditions} from '@/indexedDB'
import { ref, computed } from 'vue'

import { useCategoriesStore } from '@/stores/categoriesStore'
const categoriesStore = useCategoriesStore()

import { useTransactionsStore } from '@/stores/transactionsStore'
  const transactionsStore = useTransactionsStore();
  transactionsStore.getTransactions()

const selectedSegment = ref('default')
const computedColor = computed(() => selectedSegment.value == 'default' ? 'danger' : 'success')

async function editCategory (c) {
    const modal = await modalController.create({
    component: editCategorie,
    componentProps: {
      id: c.id,
      name: c.name,
      color: c.color,
      isExpense: c.isExpense
    },
    color: "light"

  })
  modal.present()
  const { data, role } = await modal.onWillDismiss();
  if (role === 'confirm') {
    changeObjectInArray(categoriesStore.categories, data.value.id, data.value)
    const unwraped = unwrapData(data.value)
    updateData('categories', unwraped)
  } else if (role === 'delete') {
    deleteObjectInArray(categoriesStore.categories, data.value.id)
    deleteRecordById('categories', data.value.id)
    deleteAllTransactions(data.value.id)
    deleteAllRecordWithConditions('transactions', 'categorieId', data.value.id)
  }
}

function deleteAllTransactions (categorieId) {
  const filteredArray = transactionsStore.transactions.filter((item) => item.categorieId != categorieId)
  transactionsStore.transactions = filteredArray
}



</script>