<template>
    <ion-page>
      <ion-tabs>
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar  class = "rounded-t-xl" slot="bottom">
          <ion-tab-button tab="accounts" href="/accounts">
            <ion-icon :icon="card" />
            <ion-label>Рахунки</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="transactions" href="/transactions">
            <ion-icon :icon="receipt" />
            <ion-label>Транзакції</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="analytics" href="/analytics">
            <ion-icon :icon="pieChart" />
            <ion-label>Аналітика</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="more" href="/more">
            <ion-icon :icon="menu" />
            <ion-label>Інше</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-page>
  </template>
  
  <script>
    import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon, IonItem, IonList } from '@ionic/vue';
  
    import { card, receipt, home, pieChart, menu } from 'ionicons/icons';
  
    export default {
      components: { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon, IonItem, IonList },
      data() {
        return {
          card,
          receipt,
          home,
          pieChart,
          menu,
        };
      },
    };
  </script>