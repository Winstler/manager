<template>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel">Назад</ion-button>
        </ion-buttons>
        <ion-title>Редагувати рахунок</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="checkLimit" :strong="true">Підтвердити</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" color="light">
      <ion-list class = "rounded-xl">
      <ion-item>
        <ion-input label-placement="stacked" label="Ім'я рахунку" v-model="obj.name" placeholder="Кредитна картка"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input label-placement="stacked" label="Стан рахунку" v-model = "obj.sum" type="number" :placeholder="'0 ' + settingsStore.settings[0].displayedCurrency"></ion-input>
        <ion-select v-model = "obj.type" aria-label="Тип рахунку" interface="popover" placeholder="Тип рахунку" >
          <ion-select-option value="normal">Звичайний</ion-select-option>
          <ion-select-option value="credit">Кредитна картка</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item v-if = "obj.type == 'credit'">
        <ion-input type = "number" color = "danger" label-placement="stacked" label="Кредитний ліміт" v-model="obj.creditLimit" :placeholder="'0 ' + settingsStore.settings[0].displayedCurrency"></ion-input>
      </ion-item>
      <ion-item v-if = "obj.type == 'credit'">
        <ion-label slot="start">Залишок ліміту:</ion-label>
        <ion-label slot="end" color = "success" class = "italic">{{ obj.sum < 0 ? Number(obj.creditLimit) + Number(obj.sum) + ' ' +settingsStore.settings[0].displayedCurrency : obj.creditLimit + ' ' + settingsStore.settings[0].displayedCurrency}}</ion-label>
      </ion-item>
    </ion-list>
      <ion-button shape = "round" class = "mt-3" id="present-alert" color = "danger" expand="full"><ion-icon slot="start" :icon="trash"></ion-icon>Видалити</ion-button>
      <h2 v-if = "transactionsStore.transactions.filter((t) => t.account === obj.id).length !== 0">Останні транзакції</h2>
      <ion-list v-if = "transactionsStore.transactions.filter((t) => t.account === obj.id).length !== 0" class = "rounded-xl">
          <ion-item class = "flex-row" v-for = "transaction in transactionsStore.transactions.filter((t) => t.account === obj.id)" button @click = "openModalChange(transaction.id, transaction.categorieId, transaction.sum, transaction.account, transaction.categorie, transaction.accountName)">
            <div class = "h-10 w-10 rounded-full mr-2" :style = "{ backgroundColor: transaction.color}"></div>
            <ion-label>
              <h2 class = "flex"><div>{{ transaction.categorie }}</div><div class = "grow"></div><div :class = "transaction.sum >= 0 ? 'text-green-500' : 'text-red-500'">{{ transaction.sum }} {{ settingsStore.settings[0].displayedCurrency }}</div></h2>
              <p><ion-icon :icon="card"></ion-icon> {{ transaction.accountName }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
      <ion-alert
        trigger="present-alert"
        header="Ви впевнені?"
        :message= "`Ви дійсно хочете видалити рахунок ${obj.name} та всі транзакції з ним?`"
        :buttons="alertButtonsDelete"
      ></ion-alert>
      <ion-alert
        :is-open="limitError"
        header="Перевищен кредитний ліміт"
        message="Схоже, що ви неправильно ввели дані. На звичайному рахунку не може бути мінусового стану, або борг на рахунку перевищуе кредитний ліміт. Змініть дані та спробуйте знову."
        :buttons="alertButtons"
        @didDismiss="setOpen(false)">
    </ion-alert>
    </ion-content>
  </template>

<script setup>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonItem,
  IonInput,
  modalController,
  IonAlert,
  IonIcon,
  IonList,
  IonLabel,
  IonSelect,
  IonSelectOption
} from '@ionic/vue'
import { trash, add, card } from 'ionicons/icons'
import { ref } from 'vue'

import { useTransactionsStore } from '@/stores/transactionsStore'

import { useSettingsStore } from '@/stores/settingsStore'
const transactionsStore = useTransactionsStore()
transactionsStore.getTransactions()
const settingsStore = useSettingsStore()

const props = defineProps({
  accountId: String,
  accountName: String,
  accountSum: Number,
  accountType: String,
  creditLimit: Number
})
const obj = ref({
  initialSum: props.accountSum,
  name: props.accountName,
  sum: props.accountSum,
  id: props.accountId,
  type: props.accountType,
  creditLimit: props.creditLimit
})
const limitError = ref(false)
const alertButtons = [
  {
    text: 'Ок',
    handler: () => {
      limitError.value = false
    }
  }
]
const setOpen = (state) => {
  limitError.value = state
}
const checkLimit = () => {
  obj.value.sum = Number(obj.value.sum)
  obj.value.creditLimit = Number(obj.value.creditLimit)
  if (obj.value.creditLimit < 0) obj.value.creditLimit *= (-1)
  if ((obj.value.type == 'normal' && obj.value.sum < 0) || (obj.value.sum < 0 && (obj.value.sum + obj.value.creditLimit) < 0)) {
    limitError.value = true
  } else confirm()
}
const cancel = () => modalController.dismiss(null, 'cancel')
const confirm = () => {
  if (!obj.value.name) {
    obj.value.name = 'Новий рахунок'
  }
  if (isNaN(obj.value.sum) || obj.value.sum === null) {
    obj.value.sum = 0
  }
  if (obj.value.type === 'normal') {
    obj.value.creditLimit = 0
  }
  obj.value.sum = obj.value.sum.toFixed(2)
  modalController.dismiss(obj, 'confirm')
}
const deleteEvent = () => modalController.dismiss(obj.value.id, 'delete')
const alertButtonsDelete = [
  {
    text: 'Назад',
    role: 'cancel'
  },
  {
    text: 'OK',
    role: 'Підтвердити',
    handler: () => {
      deleteEvent()
    }
  }
]

</script>
