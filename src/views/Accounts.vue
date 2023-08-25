<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title > Total balance: <span  :class = "totalSum >= 0 ? 'text-green-500' : 'text-red-500'" >{{ totalSum }}$</span></ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-item v-if="error" class="text-red-400">
          {{ error.message }}
        </ion-item>
        <h2>Your accounts</h2>
        <ion-list v-for="account in accounts" style ="p-6 max-w-sm mx-auto bg-white rounded-xl">
              <ion-item button @click = "openModalChange(account.id, account.name, account.sum)" style ="flex items-center">
                <ion-icon slot = "start" :icon = "card" ></ion-icon>
                <ion-label class="px-2"> {{account.name}} </ion-label>
                <ion-label slot="end"> <span  :class = "account.sum >= 0 ? 'text-green-500' : 'text-red-500'" > {{account.sum}} {{ account.currency }}</span></ion-label>
              </ion-item>
        </ion-list>
        <ion-fab @click = "openModalAdd"  class ="p-2" slot="fixed" vertical="bottom" horizontal="end">
          <ion-fab-button>
            <ion-icon :icon="add"></ion-icon>
          </ion-fab-button>
        </ion-fab>
        
      </ion-content>
    </ion-page>
</template>
  
<script setup >
  import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,  IonFab, IonFabButton, IonIcon, IonList, IonItem, modalController, IonThumbnail, IonLabel, IonReorder, IonReorderGroup  } from '@ionic/vue';
  import { add, card } from 'ionicons/icons';
  import { ref, reactive , computed, onMounted, onBeforeMount} from 'vue';

  import { getData, addData, unwrapData, changeObjectInArray, updateAccount} from '../indexedDB'

  import AccountsModalAdd from '../components/accounts/AccountsModalAdd.vue';
  import AccountsModalChange from '../components/accounts/AccountsModalChange.vue';
  
  const accounts = reactive([]);
  const error = ref(null);
  onMounted(async () => {
    try{
      const data = await getData("accounts");
      data.forEach(element => {
        accounts.push(element);
      });
    }
    catch(err){
      error.value = err;
    }
    }
  );
  console.log(accounts);
  const totalSum = computed(() => {
    return accounts.reduce((sum, current) => Number(sum) + Number(current.sum), 0)
  });

  const openModalAdd = async () => {
    const modal = await modalController.create({
    component: AccountsModalAdd,
    
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      accounts.push({id: Date.now(), sum: data.value.sum, name: data.value.name, currency: "$"});
      const unwraped = unwrapData(data.value);
      addData("accounts", unwraped);
    }
  };

  const openModalChange = async (id, name, sum) => {
    
    const modal = await modalController.create({
      component: AccountsModalChange,
      componentProps: {
        accountId: id,
        accountName: name,
        accountSum: Number(sum)
      },
    
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      changeObjectInArray(accounts, data.value.id, data.value);
      const unwraped = unwrapData(data.value);
      updateAccount("accounts", unwraped)
    }
  };

</script>