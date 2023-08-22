<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Accounts</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <h2>Your accounts</h2>
        <ion-list>
            <ion-item>
                {{message}}
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
  import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,  IonFab, IonFabButton, IonIcon, IonList, IonItem, modalController } from '@ionic/vue';
  import { add } from 'ionicons/icons';
  import { ref } from 'vue';

  import AccountsModal from '../components/AccountsModal.vue';

  const message = ref('This modal example uses the modalController to present and dismiss modals.');

  const openModal = async () => {
    const modal = await modalController.create({
    component: AccountsModal,
    
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      message.value = `Hello, ${data}!`;
    }
  };
</script>