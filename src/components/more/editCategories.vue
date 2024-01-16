<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel">Назад</ion-button>
        </ion-buttons>
        <ion-title>Редагувати категорію</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="confirm" :strong="true">Підтвердити</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" color = "light">
        <ion-segment v-model="selectedSegment" :color = "computedColor">
            <ion-segment-button value="default">
              <ion-label>Для витрат</ion-label>
            </ion-segment-button>
            <ion-segment-button value="income" >
              <ion-label>Для доходів</ion-label>
            </ion-segment-button>
        </ion-segment>
      <ion-item class = "flex-row rounded-b-xl">
        <input class = "mr-2" type="color" data-coloris v-model = "obj.color">
        <ion-input label-placement="stacked" label="Введіть ім'я категорії" v-model="obj.name" placeholder="Нова категорія"></ion-input>
      </ion-item>
      <ion-button shape = "round" class = "mt-3" id="present-alert" color = "danger" expand="full"><ion-icon slot="start" :icon="trash"></ion-icon>Видалити</ion-button>
      <h2 v-if = "transactionsStore.transactions.filter((t) => t.categorieId === obj.id).length !== 0">Останні транзакції</h2>
      <ion-list v-if = "transactionsStore.transactions.filter((t) => t.categorieId === obj.id).length !== 0" class = "rounded-xl">
          <ion-item class = "flex-row" v-for = "transaction in transactionsStore.transactions.filter((t) => t.categorieId === obj.id)" button @click = "openModalChange(transaction)">
            <div class = "h-10 w-10 rounded-full mr-2" :style = "{ backgroundColor: transaction.color}"></div>
            <ion-label>
              <h2 class = "flex"><div>{{ transaction.categorie }}</div><div class = "grow"></div><div :class = "transaction.sum >= 0 ? 'text-green-500' : 'text-red-500'">{{ transaction.sum }} {{ settingsStore.settings[0].displayedCurrency }}</div></h2>
              <p><ion-icon :icon="card"></ion-icon> {{ transaction.accountName }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
    </ion-content>
    <ion-alert
        trigger="present-alert"
        header="Ви впевнені?"
        :message= "`Ви дійсно хочете видалити категорію ${obj.name}? Ви хочете видалити усі транзакції з нею?`"
        :buttons="alertButtonsDelete">
</ion-alert>
  </template>

<script setup>
import {
IonAlert,
IonList,
IonIcon,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonItem,
  IonInput,
  modalController,
  IonSegment,
  IonSegmentButton,
  IonLabel,

} from '@ionic/vue'
import { ref, computed } from 'vue'
import { generateRandomColor } from '../../indexedDB'
import { trash , card, wallet} from 'ionicons/icons'
import TransactionModalChange from '@/components/transactions/TransactionModalChange.vue';

import { useTransactionsStore } from '@/stores/transactionsStore'
  const transactionsStore = useTransactionsStore();
  transactionsStore.getTransactions()

  import { useSettingsStore } from "@/stores/settingsStore"
const settingsStore = useSettingsStore();
settingsStore.getSettings()
const props = defineProps({
    id: String,
    name: String,
    color: String,
    isExpense: Boolean
})

const obj = ref({
  id: props.id,
  name: props.name,
  color: props.color,
  isExpense: props.isExpense, 
})
const cancel = () => modalController.dismiss(null, 'cancel')
const confirm = () => {
  if (!obj.value.name) {
    obj.value.name = 'Нова категорія'
  }
  if(selectedSegment.value === "default"){
    obj.value.isExpense = true
  }
  else {
    obj.value.isExpense = false
  }
  modalController.dismiss(obj, 'confirm')
}

const selectedSegment = ref(props.isExpense ? "default" : "income")
const computedColor = computed(() => selectedSegment.value === 'default' ? 'danger' : 'success')

const alertButtonsDelete = [
  {
    text: 'Назад',
    role: 'cancel'
  },
  {
    text: 'Видалити',
    role: 'delete',
    handler: () => {
        modalController.dismiss(obj, 'delete')
    }
  }
]

const openModalChange = async (t) => {
    const pastSum = t.sum;
    
    const modal = await modalController.create({
      component: TransactionModalChange,
      initialBreakpoint: 0.5,
        breakpoints: [0.5, 1],
      componentProps: {
        sum: Number(t.sum),
        transactionId: t.id,
        categorieId: t.categorieId,
        accountId: t.account,
        created: t.created
      },
    
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      const accountIndex = accountsStore.accounts.findIndex((item) => item.id == data.accountId.replace(/"/g, ""));
      accountsStore.accounts[accountIndex].sum -= Number(pastSum);
      updateData("accounts", unwrapData(accountsStore.accounts[accountIndex]));
      deleteObjectInArray(transactionsStore.transactions, data.transactionId);
      deleteRecordById("transactions", data.transactionId);


      const categorieIndex = categoriesStore.categories.findIndex((item) => item.id == data.categorieId.replace(/"/g, ""))
      const transaction = {
        id: data.transactionId,
        account: data.accountId.replace(/"/g, ""),
        accountName: accountsStore.accounts[accountIndex].name, 
        sum: Number(data.sum),
        categorieId: data.categorieId.replace(/"/g, ""), 
        categorie: categoriesStore.categories[categorieIndex].name,
        created: data.created,
        color: categoriesStore.categories[categorieIndex].color,
      };
      
      
      transactionsStore.transactions.unshift(transaction);
      
      const unwraped = unwrapData(transaction);
      addData("transactions", unwraped);

      accountsStore.accounts[accountIndex].sum = Number(accountsStore.accounts[accountIndex].sum);
      accountsStore.accounts[accountIndex].sum += Number(transaction.sum);
      accountsStore.accounts[accountIndex].sum = parseFloat(accountsStore.accounts[accountIndex].sum.toFixed(2));
      updateData("accounts", unwrapData(accountsStore.accounts[accountIndex]));    }
    if(role === "delete"){
      const accountIndex = accountsStore.accounts.findIndex((item) => item.id == data.value.accountId.replace(/"/g, ""));
      accountsStore.accounts[accountIndex].sum -= Number(data.value.sum);
      accountsStore.accounts[accountIndex].sum = parseFloat(accountsStore.accounts[accountIndex].sum.toFixed(2));
      updateData("accounts", unwrapData(accountsStore.accounts[accountIndex]));
      deleteObjectInArray(transactionsStore.transactions, data.value.id);
      deleteRecordById("transactions", data.value.transactionId);
    }
  };
</script>
