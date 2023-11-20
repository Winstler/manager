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
        </ion-item>
        </ion-list>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
    import { IonHeader, IonToolbar, IonTitle, IonContent, IonPage, IonItem, IonLabel, modalController, IonIcon, IonList} from '@ionic/vue';
    import { addCircle } from 'ionicons/icons';
    import createCategoryModal from "@/components/more/CreateCategoryModal.vue"
    import { generateUniqueId , generateRandomColor} from '@/indexedDB';

    import { useCategoriesStore} from "@/stores/categoriesStore"
  const categoriesStore = useCategoriesStore();
categoriesStore.getCategories()

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
    };
     
    
  };
  </script>