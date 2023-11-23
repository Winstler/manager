<template>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel">Назад</ion-button>
        </ion-buttons>
        <ion-title>Редагувати рахунок</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="confirm" :strong="true">Підтвердити</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding" color="light">
      <ion-list class = "rounded-xl">
      <ion-item>
        <ion-input label-placement="stacked" label="Введіть ім'я рахунку" v-model="obj.name" placeholder="Кредитна картка"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input label-placement="stacked" label="Введіть стан рахунку" v-model = "obj.sum" type="number" placeholder="0$"></ion-input>
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
        :buttons="alertButtons"
      ></ion-alert>
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
      IonLabel
    } from '@ionic/vue';
    import { trash } from 'ionicons/icons';
    import { ref } from 'vue';
    import { add, card } from 'ionicons/icons';
    import { useTransactionsStore } from '@/stores/transactionsStore'
  const transactionsStore = useTransactionsStore();
  transactionsStore.getTransactions()

  import { useSettingsStore} from "@/stores/settingsStore"
const settingsStore = useSettingsStore()

    const props = defineProps({
        accountId: String,
        accountName: String,
        accountSum: Number
    })
    const obj = ref({
      name: props.accountName,
      sum: props.accountSum,
      id: props.accountId,
      currency: "$"
    })
    
    const cancel = () => modalController.dismiss(null, 'cancel');
    const confirm = () => modalController.dismiss(obj, 'confirm');
    const deleteEvent = () => modalController.dismiss(obj.value.id, 'delete');
    const alertButtons = [
    {
      text: 'Назад',
      role: 'cancel',
    },
    {
      text: 'OK',
      role: 'Підтвердити',
      handler: () => {
        deleteEvent()
      },
    },
    ];
    
  </script>