<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title> Total balance:</ion-title>
          <ion-title slot = "end" :class = "totalSum >= 0 ? 'text-green-500' : 'text-red-500'" >{{ totalSum }}$</ion-title>
        </ion-toolbar>
      </ion-header>


      <ion-content class="ion-padding" color="light">

        <ion-item v-if="accountsStore.error" class="text-red-400">
          {{ accountsStore.error }}
        </ion-item>

        <h2>Your accounts</h2>
        <ion-list class="rounded-xl">
          <ion-item v-if="infoMessage">{{ infoMessage }}</ion-item>
          <ion-item  class = "my-4" v-for="account in accountsStore.accounts"  button @click = "openModalChange(account.id, account.name, account.sum)" style ="flex items-center">
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
  
<script setup>
  import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,  IonFab, IonFabButton, IonIcon, IonList, IonItem, modalController, IonLabel  } from '@ionic/vue';
  import { add, card } from 'ionicons/icons';
  import { computed} from 'vue';

  import { addData, unwrapData, changeObjectInArray, updateData, deleteObjectInArray, deleteRecordById, deleteAllRecordWithConditions, generateUniqueId} from '../indexedDB'

  import AccountsModalAdd from '@/components/accounts/AccountsModalAdd.vue';
  import AccountsModalChange from '@/components/accounts/AccountsModalChange.vue';
  
  import { useAccountsStore } from '../stores/accountsStore'
  const accountsStore = useAccountsStore();
  accountsStore.getAccounts()

  import { useTransactionsStore } from '../stores/transactionsStore'
  const transactionsStore = useTransactionsStore();
  transactionsStore.getTransactions()

  const infoMessage = computed(() => {
    if(accountsStore.accounts.length == 0){
      return "You don't have any accounts yet"
    }
  });

  const totalSum = computed(() => {
    return accountsStore.accounts.reduce((sum, current) => Number(sum) + Number(current.sum), 0)
  });

  const openModalAdd = async () => {
    const modal = await modalController.create({
      component: AccountsModalAdd,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      accountsStore.accounts.push({id: data.value.id, sum: data.value.sum, name: data.value.name, currency: "$"});
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
      changeObjectInArray(accountsStore.accounts, data.value.id, data.value);
      const unwraped = unwrapData(data.value);
      updateData("accounts", unwraped)
    }
    else if(role === "delete"){
      deleteObjectInArray(accountsStore.accounts, data);
      deleteRecordById("accounts", data);
      deleteAllTransactions(data);
      deleteAllRecordWithConditions("transactions", "account", data)
    }
  };

  function deleteAllTransactions(accountId){
    const filteredArray = transactionsStore.transactions.filter((item) => item.account != accountId);
    transactionsStore.transactions = filteredArray;
  }

</script>