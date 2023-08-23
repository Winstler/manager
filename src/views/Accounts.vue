<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Accounts</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <h2>Your accounts</h2>
        <ion-list v-for="account in accounts" style ="p-6 max-w-sm mx-auto bg-white rounded-xl">
          <ion-item style ="flex items-center">
            <ion-icon slot = "start" :icon = "card" ></ion-icon>
            <ion-label class="px-2"> {{account.name}} </ion-label>
            <ion-label slot="end" :class = "account.sum > 0 ? 'text-green-500' : 'text-green-500'"> {{account.sum}} {{ account.currency }}</ion-label>
          </ion-item>
        </ion-list>
        <ion-fab @click = "openModal"   slot="fixed" vertical="bottom" horizontal="end">
          <ion-fab-button>
            <ion-icon :icon="add"></ion-icon>
          </ion-fab-button>
        </ion-fab>
        
      </ion-content>
    </ion-page>
</template>
  
<script setup >
  import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,  IonFab, IonFabButton, IonIcon, IonList, IonItem, modalController, IonThumbnail, IonLabel } from '@ionic/vue';
  import { add, card } from 'ionicons/icons';
  import { ref, reactive } from 'vue';
  import AccountsModal from '../components/AccountsModal.vue';

  const message = ref('This modal example uses the modalController to present and dismiss modals.');

  const accounts = reactive([
    {id: Date.now(), type: "default", sum: 100, currency: "$", name: "Credit card", icon: "card", color: "blue"},
    {id: Date.now(), type: "default", sum: 200, currency: "$", name: "Card 2", icon: "card", color: "blue"}
  ])
  const openModal = async () => {
    const modal = await modalController.create({
    component: AccountsModal,
    
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      accounts.push({id: Date.now(), sum: data.value.sum, name: data.value.name, currency: "$"})
    }
  };

</script>