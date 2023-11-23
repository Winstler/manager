<template>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel">Назад</ion-button>
        </ion-buttons>
        <ion-title>Новий рахунок</ion-title>
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
        <ion-input  label-placement="stacked" label="Введіть стан рахунку" v-model = "obj.sum" type="number" placeholder="0 грн."></ion-input>
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
      useBackButton ,
    } from '@ionic/vue';
    import { ref, onMounted  } from 'vue';
import { generateUniqueId } from '../../indexedDB';
   
    const obj = ref({
      name: "",
      sum: null,
      id: generateUniqueId(),
    })
    const cancel = () => modalController.dismiss(null, 'cancel');
    const confirm = () => {
      obj.value.sum = Number(obj.value.sum);
      if (!obj.value.name){
        obj.value.name = "New account";
      }
      if(isNaN(obj.value.sum) || obj.value.sum === null){
        obj.value.sum = 0;
      }
      modalController.dismiss(obj, 'confirm')
    };
 
  </script>