<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Home</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <div class="example-content">Home content</div>
      </ion-content>
    </ion-page>
  </template>
  
  <script>
    import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage } from '@ionic/vue';
  
    export default {
      components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
    };
  </script>