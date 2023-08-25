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
    } from '@ionic/vue';
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
  </script>