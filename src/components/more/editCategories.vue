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
    <ion-content class="ion-padding">
        <ion-segment v-model="selectedSegment" :color = "computedColor">
            <ion-segment-button value="default">
              <ion-label>Для витрат</ion-label>
            </ion-segment-button>
            <ion-segment-button value="income" >
              <ion-label>Для доходів</ion-label>
            </ion-segment-button>
        </ion-segment>
      <ion-item class = "flex-row">
        <input class = "mr-2" type="color" data-coloris v-model = "obj.color">
        <ion-input label-placement="stacked" label="Введіть ім'я категорії" v-model="obj.name" placeholder="Нова категорія"></ion-input>
      </ion-item>
      <ion-button shape = "round" class = "mt-3" id="present-alert" color = "danger" expand="full"><ion-icon slot="start" :icon="trash"></ion-icon>Видалити</ion-button>
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
  IonLabel
} from '@ionic/vue'
import { ref, computed } from 'vue'
import { generateRandomColor } from '../../indexedDB'
import { trash } from 'ionicons/icons'

const props = defineProps({
    id: String,
    name: String,
    color: String,
    isExpense: Boolean
})

const color = generateRandomColor()
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
</script>
