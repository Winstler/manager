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
                  <ion-select placeholder = "Виберіть рахунок" v-model = "obj.accountId" justify="space-between" @ionChange="updateSelect($event.detail.value, obj.accountId)">
                    <ion-select-option :value="account.id" v-for = "account in accountsStore.accounts" :key = "account.id">{{account.name}}</ion-select-option>
                  </ion-select>
                  <ion-select placeholder = "Виберіть категорію" v-model = "obj.categorieId" v-if = "selectedSegment == 'default'" justify="space-between"    @ionChange="updateSelect($event.detail.value, obj.categorieId)">
                    <ion-select-option :value="categorie.id" v-for = "categorie in categoriesStore.filteredExpenses" :key = "categorie.id">{{categorie.name}}</ion-select-option>
                  </ion-select>
                  <ion-select placeholder = "Виберіть категорію" v-model = "obj.categorieId" v-else justify="space-between"  @ionChange="updateSelect($event.detail.value, obj.categorieId)">
                    <ion-select-option :value="categorie.id" v-for = "categorie in categoriesStore.filteredIncomes" :key = "categorie.id">{{categorie.name}}</ion-select-option>
                  </ion-select>
                </ion-item>
                <ion-item>
                    <ion-input label-placement="stacked" label="Сума операції" type="number" v-model = "obj.sum"></ion-input>
                </ion-item>
                <ion-item>
                  <ion-datetime-button datetime="datetime" v-model = "obj.date"></ion-datetime-button>
                  <ion-modal :keep-contents-mounted="true">
                    <ion-datetime id="datetime" v-model = "obj.created" display-format = "YYYY-MM-DDTHH:mm"></ion-datetime>
                  </ion-modal>
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
      IonDatetime,
      IonDatetimeButton,
      IonModal,
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

const updateSelect = (e, smth) => {
  // Применяем replace к значению, десериализованному из JSON.stringify
  smth = e.replace(/['"]+/g, '')
}

    const props = defineProps({
      sum: Number,
      transactionId: String,
      categorieId: String,
      accountId: String,
      created: Date
    })

    const obj = ref({
      sum: props.sum,
      transactionId: props.transactionId,
      categorieId: props.categorieId,
      accountId: props.accountId,
      created: props.created,
    })
    
    const cancel = () => modalController.dismiss(null, 'cancel');
    const confirm = () => {
      obj.value.sum = Number(obj.value.sum).toFixed(2)
      modalController.dismiss(obj.value, 'confirm')
    };
    const deleteEvent = () => modalController.dismiss(obj, 'delete');
    const alertButtons = [
    {
      text: 'Назад',
      role: 'cancel',
    },
    {
      text: 'OK',
      role: 'Підтвердити',
      handler: () => {
        console.log(obj.value.transactionId);
        deleteEvent()
      },
    },
    ];
    
  </script>