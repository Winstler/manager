<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel">Назад</ion-button>
        </ion-buttons>
        <ion-title>Новий рахунок</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="checkLimit" :strong="true">Підтвердити</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" color ="light">
      <ion-list class = "rounded-lg">
      <ion-item>
        <ion-input label-placement="stacked" label="Ім'я рахунку" v-model="obj.name" placeholder="Рахунок"></ion-input>
      </ion-item>
      <ion-item >
        <ion-input  label-placement="stacked" label="Стан рахунку"  v-model = "obj.sum" type="number"  :placeholder="'0 ' + settingsStore.settings[0].displayedCurrency"></ion-input>
        <ion-select label-placement="stacked" label = "Тип рахунку" v-model = "obj.type" aria-label="Тип рахунку" interface="popover" placeholder="Тип рахунку">
          <ion-select-option value="normal">Звичайний</ion-select-option>
          <ion-select-option value="credit">З лімітом</ion-select-option>
          <ion-select-option value="noLimit">Без обмежень</ion-select-option>
        </ion-select>
      </ion-item>
      <ion-item v-if = "obj.type == 'credit'">
        <ion-input type = "number" color = "danger" label-placement="stacked"  label="Кредитний ліміт" v-model="obj.creditLimit" :placeholder="'0 ' + settingsStore.settings[0].displayedCurrency"></ion-input>
      </ion-item>
      <ion-item v-if = "obj.creditLimit">
        <ion-label slot="start">Залишок ліміту:</ion-label>
        <ion-label slot="end" :color = "limitColor" class = "italic">{{ obj.sum < 0 ? Number(obj.creditLimit) + Number(obj.sum) + ' ' +settingsStore.settings[0].displayedCurrency : obj.creditLimit + ' ' + settingsStore.settings[0].displayedCurrency}}</ion-label>
      </ion-item>
    </ion-list>
      <div class = "bg-white mt-2 rounded-lg"><p v-if = "obj.type == 'normal'" class = "m-4 py-2 text-gray-500 text-sm">Баланс звичайного рахунку не може бути менше 0</p></div>
      <div class = "bg-white mt-2 rounded-lg"><p v-if = "obj.type == 'credit'" class = "m-4 py-2 text-gray-500 text-sm">Рахунки з лімітом можуть мати баланс менше 0 при умові достатнього ліміту</p></div>
      <div class = "bg-white mt-2 rounded-lg"><p v-if = "obj.type == 'noLimit'" class = "m-4 py-2 text-gray-500 text-sm">Цей рахунок не має жодних лімітів</p></div>
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
import {IonList,
  IonLabel,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonItem,
  IonInput,
  modalController,
  IonSelect,
  IonSelectOption,
  IonAlert
} from '@ionic/vue'
import { ref, computed } from 'vue'
import { generateUniqueId } from '../../indexedDB'
import { useSettingsStore } from '@/stores/settingsStore'
const settingsStore = useSettingsStore()
const limitError = ref(false)
const checkLimit = () => {
  obj.value.sum = Number(obj.value.sum)
  obj.value.creditLimit = Number(obj.value.creditLimit)
  if (obj.value.creditLimit < 0) obj.value.creditLimit *= (-1)
  if(obj.value.type === 'noLimit'){ 
    console.log(5)
    obj.value.creditLimit = Infinity
  }
  if ((obj.value.type === 'normal' && obj.value.sum < 0) || (obj.value.sum < 0 && (obj.value.sum + obj.value.creditLimit) < 0)) {
    limitError.value = true
  } else confirm()
}
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
const obj = ref({
  name: '',
  sum: null,
  id: generateUniqueId(),
  type: 'normal',
  creditLimit: null
})

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
  else if(obj.value.type === 'noLimit') obj.value.creditLimit = Infinity
  obj.value.sum = obj.value.sum.toFixed(2)
  modalController.dismiss(obj, 'confirm')
}
const avaibleLimit = computed (() => obj.value.sum < 0 ? Number(obj.value.creditLimit) + Number(obj.value.sum) : obj.value.creditLimit);
const limitColor = computed (() => {
 
  console.log(avaibleLimit.value)
  if(avaibleLimit.value > 0) return "success"
  else if (avaibleLimit.value < 0) return "danger"

})
</script>
