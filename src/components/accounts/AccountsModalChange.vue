<template>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel">Cancel</ion-button>
        </ion-buttons>
        <ion-title>Edit account</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="confirm" :strong="true">Confirm</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-item>
        <ion-input label-placement="stacked" label="Enter account name" v-model="obj.name" placeholder="Credit card"></ion-input>
      </ion-item>
      <ion-item>
        <ion-input label-placement="stacked" label="Enter the amount of money" v-model = "obj.sum" type="number" placeholder="0$"></ion-input>
      </ion-item>
      <ion-button id="present-alert" color = "danger" expand="full"><ion-icon slot="start" :icon="trash"></ion-icon>Delete</ion-button>
      <ion-alert
        trigger="present-alert"
        header="Are you sure?"
        :message= "`Do you realy want to delete ${obj.name} and all transactions with it?`" 
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
        accountId: Number,
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
      text: 'Cancel',
      role: 'cancel',
    },
    {
      text: 'OK',
      role: 'confirm',
      handler: () => {
        deleteEvent()
      },
    },
    ];
    
  </script>