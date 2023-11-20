<template>
    <ion-header>
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-button color="medium" @click="cancel">Назад</ion-button>
              </ion-buttons>
              <ion-buttons slot="end">
                <ion-button @click="confirm" :strong="true">Підтвердити</ion-button>
              </ion-buttons>
            </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
            <ion-list>
                <ion-segment v-model="selectedSegment" :color = "computedColor">
                    <ion-segment-button value="default">
                      <ion-label>Витрата</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="income" >
                      <ion-label>Дохід</ion-label>
                    </ion-segment-button>
                  </ion-segment>
                <ion-item>
                  <ion-select justify="space-between" label="Виберіть рахунок" :compareWith="compareWith"  @ionChange="obj.currentAccount = JSON.stringify($event.detail.value)">
                    <ion-select-option :value="account.id" v-for = "account in accountsStore.accounts">{{account.name}}</ion-select-option>
                  </ion-select>
                  <ion-select v-if = "selectedSegment == 'default'" justify="space-between" label="Виберіть категорію" :compareWith="compareWith"  @ionChange="obj.categorie = JSON.stringify($event.detail.value)">
                    <ion-select-option :value="categorie.id" v-for = "categorie in categoriesStore.filteredExpenses">{{categorie.name}}</ion-select-option>
                  </ion-select>
                  <ion-select v-else justify="space-between" label="Виберіть категорію" :compareWith="compareWith"  @ionChange="obj.categorie = JSON.stringify($event.detail.value)">
                    <ion-select-option :value="categorie.id" v-for = "categorie in categoriesStore.filteredIncomes">{{categorie.name}}</ion-select-option>
                  </ion-select>
                </ion-item>
                <ion-item>
                    <ion-input label-placement="stacked" label="Сума операції" type="number" v-model = "obj.sum"></ion-input>

                </ion-item>
                <ion-button id="present-alert" color = "danger" expand="full"><ion-icon slot="start" :icon="trash"></ion-icon>Видалити</ion-button>
                <ion-alert
                  trigger="present-alert"
                  header="Ви впевнені?"
                  :message= "`Ви дійсно хочете видалити транзакцію?`" 
                  :buttons="alertButtons"
                ></ion-alert>
            </ion-list>
        </ion-content>
  </template>
  
  <script setup>
    import {
      IonContent,
      IonHeader,
      IonTitle,
      IonToolbar,
      IonButtons,
      IonButton,
      IonItem,
      IonInput,
      modalController,
      IonAlert,
      IonIcon,
      IonSegment,
      IonList,
      IonSegmentButton,
      IonSelect,
      IonLabel,
      IonSelectOption
    } from '@ionic/vue';
    import { trash } from 'ionicons/icons';
    import { ref, computed } from 'vue';

    import { useAccountsStore } from '@/stores/accountsStore'
  const accountsStore = useAccountsStore();
  accountsStore.getAccounts()

  import { useCategoriesStore} from "@/stores/categoriesStore"
  const categoriesStore = useCategoriesStore();
categoriesStore.getCategories()

const selectedSegment = ref('default')
const computedColor = computed(() => selectedSegment.value == "default" ? "danger" : "success");

    const props = defineProps({
        transactionId: String,
        categorieId: String,
        accountSum: Number,
        accountId: String
    })
    const obj = ref({
      name: props.accountName,
      sum: props.accountSum,
      id: props.transactionId,
      currency: "$"
    })
    
    const cancel = () => modalController.dismiss(null, 'cancel');
    const confirm = () => modalController.dismiss(null, 'confirm');
    const deleteEvent = () => modalController.dismiss(obj.value.id, 'delete');
    const alertButtons = [
    {
      text: 'Назад',
      role: 'cancel',
    },
    {
      text: 'OK',
      role: 'Підтвердити',
      handler: () => {
        console.log(obj.value.id);
        deleteEvent()
      },
    },
    ];
    
  </script>