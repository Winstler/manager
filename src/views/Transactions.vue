<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Баланс:</ion-title>
          <ion-title slot = "end" :class = "accountsStore.totalBalance >= 0 ? 'text-green-500' : 'text-red-500'" >{{ accountsStore.totalBalance }} {{ settingsStore.settings[0].displayedCurrency }}</ion-title>
        </ion-toolbar>
      </ion-header>


      <ion-content class="ion-padding" color="light">
        <ion-item v-if="transactionsStore.error" class="text-red-400">
          {{ transactionsStore.error }}
        </ion-item>
        <ion-item v-if="infoMessage">{{ infoMessage }}</ion-item>
        <ion-list class="rounded-xl">
        <template v-for="(transactions, date) in groupedTransactions" :key="date">
          <ion-item-divider>
            <ion-label>{{ date }}</ion-label>
          </ion-item-divider>
          <ion-item
            class="flex-row"
            v-for="transaction in transactions"
            :key="transaction.id"
            button
            @click="openModalChange(transaction)"
          >
            <div class="h-10 w-10 rounded-full mr-2" :style="{ backgroundColor: transaction.color }"></div>
            <ion-label>
              <h2 class="flex">
                <div>{{ transaction.categorie }}</div>
                <div class="grow"></div>
                <div :class="transaction.sum >= 0 ? 'text-green-500' : 'text-red-500'">
                  {{ transaction.sum }} {{ settingsStore.settings[0].displayedCurrency }}
                </div>
              </h2>
              <p>
                <ion-icon :icon="card"></ion-icon> {{ transaction.accountName }}
              </p>
            </ion-label>
          </ion-item>
        </template>
      </ion-list>
        <ion-fab @click = "openSheet" class ="p-2" slot="fixed" vertical="bottom" horizontal="end">
          <ion-fab-button>
            <ion-icon :icon="add"></ion-icon>
          </ion-fab-button>
        </ion-fab>
      </ion-content>
      <ion-alert
    :is-open="isOpen"
    header="Потрібен рахунок"
    message="Схоже, що у вас ще немає рахунків. Створити новий?"
    :buttons="alertButtons"
    @didDismiss="setOpen(false)">
    </ion-alert>
    </ion-page>
</template>
  
<script setup>
  import { IonItemDivider,IonAlert, IonLabel, IonList, IonHeader, IonToolbar, IonTitle, IonContent, IonPage,  IonFab, IonFabButton, IonIcon, IonItem, modalController  } from '@ionic/vue';
  import { add, card } from 'ionicons/icons';
  import { ref, computed,  } from 'vue';
  import OpenSheetAdd  from '@/components/transactions/OpenSheetAdd.vue'

  import { generateUniqueId, unwrapData, addData, updateData, deleteObjectInArray, deleteRecordById, changeObjectInArray } from "../indexedDB"
  
  import TransactionModalChange from '@/components/transactions/TransactionModalChange.vue';
  import AccountsModalAdd from '@/components/accounts/AccountsModalAdd.vue';

  import { useTransactionsStore } from '../stores/transactionsStore'
  const transactionsStore = useTransactionsStore();
  transactionsStore.getTransactions()

  import { useAccountsStore } from '../stores/accountsStore'
  const accountsStore = useAccountsStore();
  accountsStore.getAccounts()

  import { useCategoriesStore} from "@/stores/categoriesStore"
  const categoriesStore = useCategoriesStore();
categoriesStore.getCategories()

import { useSettingsStore } from "@/stores/settingsStore"
const settingsStore = useSettingsStore();
settingsStore.getSettings()

  const infoMessage = computed(() => {
    if(transactionsStore.transactions.length == 0){
      return "У вас ще немає транзакцій"
    }
  });

  const openSheet = async () => {
    if(accountsStore.accounts.length === 0){
      isOpen.value = true;
    } 
    else{

    const modal = await modalController.create({
      component: OpenSheetAdd,
        initialBreakpoint: 0.5,
        breakpoints: [0.5, 1],
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    
    if (role === 'confirm') {
      const accountIndex = accountsStore.accounts.findIndex((item) => item.id == data.value.currentAccount.replace(/"/g, ""));
      const categorieIndex = categoriesStore.categories.findIndex((item) => item.id == data.value.categorie.replace(/"/g, ""))
      const transaction = {
        id: generateUniqueId(),
        account: data.value.currentAccount.replace(/"/g, ""),
        accountName: accountsStore.accounts[accountIndex].name, 
        sum: Number(data.value.sum),
        currency: "$",
        categorieId: data.value.categorie.replace(/"/g, ""), 
        categorie: categoriesStore.categories[categorieIndex].name,
        created: data.value.selectedDate,
        color: categoriesStore.categories[categorieIndex].color,
      };
      transactionsStore.transactions.unshift(transaction);
      
      const unwraped = unwrapData(transaction);
      addData("transactions", unwraped);

      accountsStore.accounts[accountIndex].sum = Number(accountsStore.accounts[accountIndex].sum);
      accountsStore.accounts[accountIndex].sum += Number(transaction.sum);
      accountsStore.accounts[accountIndex].sum = parseFloat(accountsStore.accounts[accountIndex].sum.toFixed(2));
      updateData("accounts", unwrapData(accountsStore.accounts[accountIndex]));
    }
  }
  };
  const openModalChange = async (t) => {
    const pastSum = t.sum;
    
    const modal = await modalController.create({
      component: TransactionModalChange,
      initialBreakpoint: 0.5,
        breakpoints: [0.5, 1],
      componentProps: {
        sum: Number(t.sum),
        transactionId: t.id,
        categorieId: t.categorieId,
        accountId: t.account,
        created: t.created
      },
    
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      const accountIndex = accountsStore.accounts.findIndex((item) => item.id == data.accountId.replace(/"/g, ""));
      accountsStore.accounts[accountIndex].sum -= Number(pastSum);
      updateData("accounts", unwrapData(accountsStore.accounts[accountIndex]));
      deleteObjectInArray(transactionsStore.transactions, data.transactionId);
      deleteRecordById("transactions", data.transactionId);


      const categorieIndex = categoriesStore.categories.findIndex((item) => item.id == data.categorieId.replace(/"/g, ""))
      const transaction = {
        id: data.transactionId,
        account: data.accountId.replace(/"/g, ""),
        accountName: accountsStore.accounts[accountIndex].name, 
        sum: Number(data.sum),
        categorieId: data.categorieId.replace(/"/g, ""), 
        categorie: categoriesStore.categories[categorieIndex].name,
        created: data.created,
        color: categoriesStore.categories[categorieIndex].color,
      };
      
      
      transactionsStore.transactions.unshift(transaction);
      
      const unwraped = unwrapData(transaction);
      addData("transactions", unwraped);

      accountsStore.accounts[accountIndex].sum = Number(accountsStore.accounts[accountIndex].sum);
      accountsStore.accounts[accountIndex].sum += Number(transaction.sum);
      accountsStore.accounts[accountIndex].sum = parseFloat(accountsStore.accounts[accountIndex].sum.toFixed(2));
      updateData("accounts", unwrapData(accountsStore.accounts[accountIndex]));    }
    if(role === "delete"){
      const accountIndex = accountsStore.accounts.findIndex((item) => item.id == data.value.accountId.replace(/"/g, ""));
      accountsStore.accounts[accountIndex].sum -= Number(data.value.sum);
      accountsStore.accounts[accountIndex].sum = parseFloat(accountsStore.accounts[accountIndex].sum.toFixed(2));
      updateData("accounts", unwrapData(accountsStore.accounts[accountIndex]));
      deleteObjectInArray(transactionsStore.transactions, data.value.id);
      deleteRecordById("transactions", data.value.transactionId);
    }
  };

  const isOpen = ref(false);
  const alertButtons = [
    {
      text: 'Назад',
    },
    {
      text: 'Далі',
      handler: async () => {
        const modal = await modalController.create({
      component: AccountsModalAdd,
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm') {
      accountsStore.accounts.push({id: data.value.id, sum: data.value.sum, name: data.value.name, currency: "$"});
      const unwraped = unwrapData(data.value);
      addData("accounts", unwraped);
      openSheet();
    }
      },
    },
  ];
  const setOpen = (state) => {
    isOpen.value = state;
  };

  const groupedTransactions = computed(() => {
  const grouped = {};

  for (const transaction of transactionsStore.transactions) {
    const date = new Date(transaction.created).toLocaleDateString();

    if (!grouped[date]) {
      grouped[date] = [];
    }

    grouped[date].push(transaction);
  }
  
  const groupedArray = Array.from(Object.entries(grouped));

  // Сортировка массива по дате (новые даты впереди)
  groupedArray.sort((dateA, dateB) => {
    const parsedDateA = new Date(dateA[0].split('.').reverse().join('-'));
    const parsedDateB = new Date(dateB[0].split('.').reverse().join('-'));
    return parsedDateB - parsedDateA; // Сортировка в обратном порядке (новые впереди)
  });

  // Преобразование отсортированного массива обратно в объект
  const sortedGrouped = Object.fromEntries(groupedArray);

  return sortedGrouped;
});
</script>
<style>
ion-item:last-child{
  --border-style: none;
}
</style>