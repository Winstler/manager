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
    <ion-content class="ion-padding">
      <ion-item>
        <ion-input label-placement="stacked" label="Введіть ім'я рахунку" v-model="obj.name" placeholder="Кредитна картка"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input label-placement="stacked" label="Введіть стан рахунку" v-model = "obj.sum" type="number" placeholder="0$"></ion-input>
      </ion-item>
      <ion-button id="present-alert" color = "danger" expand="full"><ion-icon slot="start" :icon="trash"></ion-icon>Видалити</ion-button>
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
    } from '@ionic/vue';
    import { trash } from 'ionicons/icons';
    import { ref } from 'vue';
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