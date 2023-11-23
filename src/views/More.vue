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
        <ion-item button @click = "createCategory()"><div class = "flex items-center justify-center h-10 w-10 rounded-full mr-2 border-dashed border-2 bg-slate-100" ><ion-icon class = "w-6 h-6 fill-slate-400" :icon="addCircle"></ion-icon></div>
            <ion-label>
              <h2 class = "text-xl">Створити категорію</h2>
            </ion-label>
            <ion-toast class = "-translate-y-14" :is-open="isOpen" message="Категорію створено." :duration="2500"  @didDismiss="setOpen(false)" position-anchor="footer"></ion-toast>
        </ion-item>
        </ion-list>
        <h2>Налаштування</h2>
        <ion-list class = "rounded-xl pr-4">
          <ion-select class = "pl-5" v-model="selectedCurrency" justify="space-between" label="Виберіть валюту"  @ionChange="updateCurrency">
              <ion-select-option :value="currency" v-for = "currency in settingsStore.settings[0].list">{{currency}}</ion-select-option>
          </ion-select>
        </ion-list>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
    import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonItem, IonLabel, modalController, IonIcon, IonList, IonToast, IonSelect, IonSelectOption} from '@ionic/vue';
    import { addCircle } from 'ionicons/icons';
    import createCategoryModal from "@/components/more/CreateCategoryModal.vue"
    import { generateUniqueId , generateRandomColor} from '@/indexedDB';
    import { ref } from "vue"

    import { useCategoriesStore} from "@/stores/categoriesStore"
  const categoriesStore = useCategoriesStore();
categoriesStore.getCategories()

import { useSettingsStore} from "@/stores/settingsStore"
import { updateData } from '../indexedDB';
const settingsStore = useSettingsStore();

const updateCurrency = (event) => {
  // Применяем replace к значению, десериализованному из JSON.stringify
  settingsStore.settings[0].displayedCurrency = event.detail.value.replace(/['"]+/g, '');
};

const selectedCurrency = ref(settingsStore.settings[0].displayedCurrency);

const isOpen = ref(false);
const setOpen = (state) => {
  isOpen.value = state;
};

function compareWith(o1, o2) {
        return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  const createCategory = async () => {
  const modal = await modalController.create({
    component: createCategoryModal,
  });
  modal.present();
  const { data, role } = await modal.onWillDismiss();
  if (role === 'confirm') {
    const category = {
      id: generateUniqueId(),
      name: data.value.name,
      color: data.value.color,
      isExpense: data.value.isExpense,
    };
    categoriesStore.categories.unshift(category);
    setOpen(true);
  };
   
  
};


  </script>