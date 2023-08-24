<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title > Total balance: <span  :class = "totalSum >= 0 ? 'text-green-500' : 'text-red-500'" >{{ totalSum }}$</span></ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <h2>Your accounts</h2>
        <ion-list v-for="account in accounts" style ="p-6 max-w-sm mx-auto bg-white rounded-xl">
          <ion-item style ="flex items-center">
            <ion-icon slot = "start" :icon = "card" ></ion-icon>
            <ion-label class="px-2"> {{account.name}} </ion-label>
            <ion-label slot="end"> <span  :class = "account.sum >= 0 ? 'text-green-500' : 'text-red-500'" > {{account.sum}} {{ account.currency }}</span></ion-label>
          </ion-item>
        </ion-list>
        <ion-fab @click = "openModal"  class ="p-2" slot="fixed" vertical="bottom" horizontal="end">
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
  import { ref, reactive , computed, onMounted, onBeforeMount} from 'vue';
  import AccountsModal from '../components/AccountsModal.vue';
  
  const accounts = reactive([])
  onMounted(async () => {
    const data = await getData("accounts");
    data.forEach(element => {
      accounts.push(element);
    });
  });
  console.log(accounts);
  const totalSum = computed(() => {
    return accounts.reduce((sum, current) => Number(sum) + Number(current.sum), 0)
  });

  const openModal = async () => {
    const modal = await modalController.create({
    component: AccountsModal,
    
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      accounts.push({id: Date.now(), sum: data.value.sum, name: data.value.name, currency: "$"});
      const unwraped = unwrapData(data.value);
      addData("accounts", unwraped);
    }
  };

</script>