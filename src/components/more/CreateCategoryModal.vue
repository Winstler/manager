<template>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button color="medium" @click="cancel">Назад</ion-button>
        </ion-buttons>
        <ion-title>Нова категорія</ion-title>
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
        <input class = "mr-2" type="color" data-coloris :value = "obj.color">
        <ion-input label-placement="stacked" label="Введіть ім'я категорії" v-model="obj.name" placeholder="Нова категорія"></ion-input>
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
      IonSegment,
      IonSegmentButton,
      IonLabel
    } from '@ionic/vue';
    import { ref, onMounted, computed  } from 'vue';
import { generateUniqueId , generateRandomColor} from '../../indexedDB';
   
    const obj = ref({
      name: "",
      color: generateRandomColor(),
      isExpense: computed(() => selectedSegment === 'default' ? false : true)
    })
    const cancel = () => modalController.dismiss(null, 'cancel');
    const confirm = () => {
      if (!obj.value.name){
        obj.value.name = "Нова категорія";
      }
      modalController.dismiss(obj, 'confirm');
    };
 
    const selectedSegment = ref('default')
const computedColor = computed(() => selectedSegment.value == "default" ? "danger" : "success");

  </script>