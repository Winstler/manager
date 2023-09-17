<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title> Total balance:</ion-title>

        </ion-toolbar>
      </ion-header>


      <ion-content class="ion-padding" color="light">

        <ion-item v-if="transactionsStore.error" class="text-red-400">
          {{ transactionsStore.error }}
        </ion-item>
        <ion-item v-if="infoMessage">{{ infoMessage }}</ion-item>
        <ion-list class = "rounded-xl">
          <ion-item v-for = "transaction in transactionsStore.transactions">
            <ion-label>
              <h2 class = "flex"><div>{{ transaction.categorie }}</div><div class = "grow"></div><div :class = "transaction.sum <= 0 ? 'text-green-500' : 'text-red-500'"><span v-if = "transaction.sum > 0">-</span>{{ transaction.sum }}</div></h2>
              <p><ion-icon :icon="card"></ion-icon> {{ transaction.accountName }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
        <ion-fab @click = "openSheet" class ="p-2" slot="fixed" vertical="bottom" horizontal="end">
          <ion-fab-button>
            <ion-icon :icon="add"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </ion-content>
    </ion-page>
</template>
  
<script setup>
  import { IonLabel, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonPage,  IonFab, IonFabButton, IonIcon, IonItem, modalController  } from '@ionic/vue';
  import { add, card } from 'ionicons/icons';
  import { useTransactionsStore } from '../stores/transactionsStore'
  import { computed } from 'vue';
  import OpenSheetAdd  from '../components/transactions/OpenSheetAdd.vue'
  import { generateUniqueId, unwrapData, addData, updateData } from "../indexedDB"

  const transactionsStore = useTransactionsStore();
  transactionsStore.getTransactions()

  import { useAccountsStore } from '../stores/accountsStore'
  const accountsStore = useAccountsStore();
  accountsStore.getAccounts()

  const infoMessage = computed(() => {
    if(transactionsStore.transactions.length == 0){
      return "You don't have any transactions yet"
    }
  });

  const openSheet = async () => {
    const modal = await modalController.create({
      component: OpenSheetAdd,
        initialBreakpoint: 0.5,
        breakpoints: [0.5, 1]
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      const accountIndex = accountsStore.accounts.findIndex((item) => item.id == data.value.currentAccount.replace(/"/g, ""))
      const transaction = {
        id: generateUniqueId(),
        account: data.value.currentAccount.replace(/"/g, ""),
        accountName: accountsStore.accounts[accountIndex].name, 
        sum: data.value.sum,
        currency: "$",
        categorie: "test", 
        created: Date.now()
      };
      transactionsStore.transactions.unshift(transaction);
      
      const unwraped = unwrapData(transaction);
      addData("transactions", unwraped);

      accountsStore.accounts[accountIndex].sum -= transaction.sum;
      updateData("accounts", unwrapData(accountsStore.accounts[accountIndex]));
    }
  };
</script>