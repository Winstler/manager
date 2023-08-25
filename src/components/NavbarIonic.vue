<template>
    <ion-page>
      <ion-tabs>
        <ion-router-outlet></ion-router-outlet>
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="accounts" href="/accounts">
            <ion-icon :icon="card" />
            <ion-label>Accounts</ion-label>
          </ion-tab-button>

          <ion-tab-button tab="transactions" href="/transactions">
            <ion-icon :icon="receipt" />
            <ion-label>Transactions</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="analytics" href="/analytics">
            <ion-icon :icon="pieChart" />
            <ion-label>Analytics</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="more" href="/more">
            <ion-icon :icon="menu" />
            <ion-label>More</ion-label>
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