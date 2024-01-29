<!-- eslint-disable vue/multi-word-component-names -->
<!-- eslint-disable vue/valid-v-for -->
<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Інше</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content  class="ion-padding" color="light">
        <h2>Категорії</h2>
        <ion-list class = "rounded-xl pr-4">
        <categories></categories>
        <ion-item button @click = "createCategory()"><div class = "flex items-center justify-center h-10 w-10 rounded-full mr-2 border-2 bg-slate-100" ><ion-icon class = "w-6 h-6 fill-slate-400" :icon="addCircle"></ion-icon></div>
            <ion-label>
              <h2 class = "text-xl">Створити категорію</h2>
            </ion-label>
            <ion-toast class = "-translate-y-14" :is-open="isOpen" message="Категорію створено" :duration="2500"  @didDismiss="setOpen(false)" position-anchor="footer"></ion-toast>
        </ion-item>
        </ion-list>
        <h2>Налаштування</h2>
        <ion-list class = "rounded-xl pr-4">
          <ion-select class = "pl-5" v-model="selectedCurrency" justify="space-between" label="Виберіть валюту"  @ionChange="updateCurrency">
            <ion-select-option :value="currency" v-for = "currency in settingsStore.settings[0].list"  >{{currency}}</ion-select-option>
          </ion-select>
          <ion-select class = "pl-5" v-model = "selectedAccount" label = "Рахунок за замовчуванням" justify="space-between"  @ionChange="updateAccount">
            <ion-select-option :value="account.id" v-for = "account in accountsStore.accounts" :key = "account.id">{{account.name}}</ion-select-option>
          </ion-select>
        </ion-list>
      </ion-content>
    </ion-page>
  </template>

<script setup>
import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonItem, IonLabel, modalController, IonIcon, IonList, IonToast, IonSelect, IonSelectOption } from '@ionic/vue'
import { addCircle, trash } from 'ionicons/icons'
import createCategoryModal from '@/components/more/CreateCategoryModal.vue'
import { generateUniqueId, addData } from '@/indexedDB'
import { ref, onBeforeMount } from 'vue'
import categories from '../components/more/categories.vue'

import { useCategoriesStore } from '@/stores/categoriesStore'
const categoriesStore = useCategoriesStore()
categoriesStore.getCategories()

import { useSettingsStore } from '@/stores/settingsStore'
const settingsStore = useSettingsStore()
settingsStore.getSettings();

import { useAccountsStore } from '../stores/accountsStore'
  const accountsStore = useAccountsStore();

const updateCurrency = (event) => {
  settingsStore.settings[0].displayedCurrency = event.detail.value.replace(/['"]+/g, '');
  localStorage.setItem("currency", event.detail.value.replace(/['"]+/g, ''))
}
const updateAccount = (event) => {
  settingsStore.settings[1].accountId = event.detail.value.replace(/['"]+/g, '');
  localStorage.setItem("account", event.detail.value.replace(/['"]+/g, ''))
}

const selectedCurrency = ref(settingsStore.settings[0].displayedCurrency);
const selectedAccount = ref(settingsStore.settings[1].accountId)

const isOpen = ref(false)
const setOpen = (state) => {
  isOpen.value = state
}

const isOpenDelete = ref(false)
const setOpenDelete = (state) => {
  isOpenDelete.value = state
}

const createCategory = async () => {
  const modal = await modalController.create({
    component: createCategoryModal
  })
  modal.present()
  const { data, role } = await modal.onWillDismiss()
  if (role === 'confirm') {
    const category = {
      id: generateUniqueId(),
      name: data.value.name,
      color: data.value.color,
      isExpense: data.value.isExpense
    }
    categoriesStore.categories.unshift(category)
    addData('categories', category)
    setOpen(true)
  };
}


</script>
<style>
ion-item:last-child{
  --border-style: none;
}
</style>