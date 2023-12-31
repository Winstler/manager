<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Баланс:</ion-title>
          <ion-title slot = "end" :class = "accountsStore.totalBalance >= 0 ? 'text-green-500' : 'text-red-500'" >{{ accountsStore.totalBalance }} {{ settingsStore.settings[0].displayedCurrency }}</ion-title>
        </ion-toolbar>
      </ion-header>


      <ion-content class="ion-padding" color="light">

        <ion-item v-if="accountsStore.error" class="text-red-400">
          {{ accountsStore.error }}
        </ion-item>

        <h2>Ваші рахунки</h2>
        <ion-list class="rounded-xl">
          <ion-item v-if="infoMessage">{{ infoMessage }}</ion-item>
          <ion-item  class = "my-4" v-for="account in accountsStore.accounts"  button @click = "openModalChange(account.id, account.name, account.sum, account.type, account.creditLimit)" style ="flex items-center">
            <ion-icon slot = "start" :icon = "account.type == 'credit' ? card : wallet" ></ion-icon>
            <ion-label class="px-2"> {{account.name}} </ion-label>
            <ion-label slot="end" class = "flex flex-col"> <div  :class = "account.sum >= 0 ? 'text-green-500' : 'text-red-500'" > {{account.sum}} {{ settingsStore.settings[0].displayedCurrency }}</div>
              <div  v-if = "account.creditLimit"  class = "text-green-500 italic"> {{account.sum < 0 ? account.creditLimit + account.sum : account.creditLimit}} {{ settingsStore.settings[0].displayedCurrency }}</div>
            </ion-label>
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
  import { add, card, wallet, cash} from 'ionicons/icons';
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

  import { useSettingsStore} from "@/stores/settingsStore"
const settingsStore = useSettingsStore();

  const infoMessage = computed(() => {
    if(accountsStore.accounts.length == 0){
      return "У вас ще немає рахунків."
    }
  });


  const openModalAdd = async () => {
    const modal = await modalController.create({
      component: AccountsModalAdd,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      accountsStore.accounts.push(data.value);
      const unwraped = unwrapData(data.value);
      addData("accounts", unwraped);
    }
  };

  const openModalChange = async (id, name, sum, type, creditLimit) => {
    
    const modal = await modalController.create({
      component: AccountsModalChange,
      componentProps: {
        accountId: id,
        accountName: name,
        accountSum: Number(sum),
        accountType: type,
        creditLimit: creditLimit
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