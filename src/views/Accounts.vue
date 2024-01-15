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
        <ion-list class="rounded-xl py-4">
          <ion-item v-if="infoMessage">{{ infoMessage }}</ion-item>
          <ion-item  class =  "mx-2 py-1" v-for="account in accountsStore.accounts"  button @click = "openModalChange(account.id, account.name, account.sum, account.type, account.creditLimit)" style ="flex items-center">
            <ion-icon slot = "start" :icon = "account.type == 'credit' ? card : wallet" ></ion-icon>
            <ion-label class="px-2"> {{account.name}} </ion-label>
            <ion-label slot="end" class = "flex flex-col"> <div  :class = "account.sum >= 0 ? 'text-green-500' : 'text-red-500'" > {{account.sum}} {{ settingsStore.settings[0].displayedCurrency }}</div>
              <div  v-if = "account.creditLimit && isFinite(account.creditLimit)"  class = "text-green-500 italic"> {{account.sum < 0 ? (Number(account.creditLimit) + Number(account.sum)).toFixed(2) : account.creditLimit}} {{ settingsStore.settings[0].displayedCurrency }}</div>
            </ion-label>
          </ion-item>
          <ion-item class = "noBorder py-1" button @click = "openModalAdd"><div class = " flex items-center justify-center h-10 w-10 rounded-full mr-5 border-2 bg-slate-100" ><ion-icon class = "w-6 h-6 fill-slate-400 " :icon="addCircle"></ion-icon></div>
            <ion-label>
              <h2 class = "text-xl">Створити рахунок</h2>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
      <ion-toast class = "-translate-y-14" :is-open="isOpen" :message="msg" :duration="3500"  @didDismiss="setOpen(false)" position-anchor="footer"></ion-toast>
    </ion-page>
</template>

<script setup>
import { IonToast, IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonFab, IonFabButton, IonIcon, IonList, IonItem, modalController, IonLabel } from '@ionic/vue'
import { add, card, wallet, cash, addCircle} from 'ionicons/icons'
import { computed , ref} from 'vue'

import { addData, unwrapData, changeObjectInArray, updateData, deleteObjectInArray, deleteRecordById, deleteAllRecordWithConditions, generateUniqueId } from '../indexedDB'

import AccountsModalAdd from '@/components/accounts/AccountsModalAdd.vue'
import AccountsModalChange from '@/components/accounts/AccountsModalChange.vue'

import { useAccountsStore } from '../stores/accountsStore'

import { useTransactionsStore } from '../stores/transactionsStore'

import { useSettingsStore } from '@/stores/settingsStore'
const accountsStore = useAccountsStore()
accountsStore.getAccounts()
const transactionsStore = useTransactionsStore()
transactionsStore.getTransactions()
const settingsStore = useSettingsStore()

const msg = ref("");
const isOpen = ref(false)
const setOpen = (state) => {
  isOpen.value = state
}

const infoMessage = computed(() => {
  if (accountsStore.accounts.length == 0) {
    return 'У вас ще немає рахунків.'
  }
})

const openModalAdd = async () => {
  const modal = await modalController.create({
    component: AccountsModalAdd
  })
  modal.present()
  const { data, role } = await modal.onWillDismiss()
  if (role === 'confirm') {
    console.log(data.value.creditLimit)
    accountsStore.accounts.push(data.value)
    let unwraped = unwrapData(data.value)
    if(unwraped.creditLimit === null) unwraped.creditLimit = Infinity
    console.log(unwraped)
    addData('accounts', unwraped)
  }
}

const openModalChange = async (id, name, sum, type, creditLimit) => {
  const modal = await modalController.create({
    component: AccountsModalChange,
    componentProps: {
      accountId: id,
      accountName: name,
      accountSum: Number(sum),
      accountType: type,
      creditLimit
    }

  })
  modal.present()
  const { data, role } = await modal.onWillDismiss()
  if (role === 'confirm') {
    changeObjectInArray(accountsStore.accounts, data.value.id, data.value)
    const correction = Number(data.value.sum) - Number(data.value.initialSum)
    if(correction){
      const category = correction < 0 ? "correctionExpense" : "correctionIncome";

      const transaction = {
        id: generateUniqueId(),
        account: data.value.id.replace(/"/g, ""),
        accountName: data.value.name, 
        sum: correction,
        categorieId: category, 
        categorie: "Корекція",
        created: Date.now(),
        color: "#495473",
      };
      transactionsStore.transactions.unshift(transaction);
      
      const unwraped = unwrapData(transaction);
      addData("transactions", unwraped);
      msg.value = `Створено автоматично корекцію на суму ${correction} ${settingsStore.settings[0].displayedCurrency}`;
      setOpen(true)
      
    }

    const unwraped = unwrapData(data.value)
    updateData('accounts', unwraped)
  } else if (role === 'delete') {
    deleteObjectInArray(accountsStore.accounts, data)
    deleteRecordById('accounts', data)
    deleteAllTransactions(data)
    deleteAllRecordWithConditions('transactions', 'account', data)
  }
}

function deleteAllTransactions (accountId) {
  const filteredArray = transactionsStore.transactions.filter((item) => item.account != accountId)
  transactionsStore.transactions = filteredArray
}

</script>
<style>
.noBorder{
  --border-style: none;
}
</style>