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
  
          <ion-tab-button tab="radio" href="/radio">
            <ion-icon :icon="radio" />
            <ion-label>Radio</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="library" href="/library">
            <ion-icon :icon="library" />
            <ion-label>Library</ion-label>
          </ion-tab-button>
  
          <ion-tab-button tab="search" href="/search">
            <ion-icon :icon="search" />
            <ion-label>Search</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-page>
  </template>
  
  <script>
    import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon, IonItem, IonList } from '@ionic/vue';
  
    import { card, receipt, radio, library, search } from 'ionicons/icons';
  
    export default {
      components: { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon, IonItem, IonList },
      data() {
        return {
          card,
          receipt,
          radio,
          library,
          search,
        };
      },
    };
  </script>