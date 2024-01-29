<template>
    <ion-header>
            <ion-toolbar>
              <ion-buttons slot="start">
                <ion-button color="medium" @click="cancel">Назад</ion-button>
              </ion-buttons>
              <ion-buttons slot="end">
                <ion-button @click="checkLimit" :strong="true">Підтвердити</ion-button>
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
                  <ion-datetime-button datetime="datetime" v-model = "obj.created"></ion-datetime-button>
                  <ion-modal :keep-contents-mounted="true">
                    <ion-datetime id="datetime" v-model = "obj.created"></ion-datetime>
                  </ion-modal>
                </ion-item>
                <ion-button id="present-alert" color = "danger" shape = "round" expand="full"><ion-icon slot="start" :icon="trash"></ion-icon>Видалити</ion-button>
                <ion-alert
                  trigger="present-alert"
                  header="Ви впевнені?"
                  :message= "`Ви дійсно хочете видалити транзакцію?`" 
                  :buttons="alertButtons"
                ></ion-alert>
                <ion-alert
        :is-open="limitError"
        header="Недостатньо коштів"
        message="Схоже, що ви неправильно ввели дані. На звичайному рахунку не може бути мінусового стану, або борг на рахунку перевищуе ліміт. Змініть дані та спробуйте знову."
        :buttons="alertButtonsErrors"
        @didDismiss="setOpen(false)">
      </ion-alert>
      <ion-alert
      :is-open="zeroError"
      header="Введіть суму"
      message="Будь ласка, введіть суму відмінну від нуля."
      :buttons="alertButtonsErrors"
      @didDismiss="setOpenZeroError(false)">
    </ion-alert>
                
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
    import { format, parseISO } from 'date-fns';
    import { useAccountsStore } from '@/stores/accountsStore'
  const accountsStore = useAccountsStore();
  accountsStore.getAccounts()

  import { useCategoriesStore} from "@/stores/categoriesStore"
  const categoriesStore = useCategoriesStore();
categoriesStore.getCategories()

const checkSum =  props.sum < 0 ? "default" : "income"
const selectedSegment = ref(checkSum)
const computedColor = computed(() => selectedSegment.value == "default" ? "danger" : "success");

const updateSelect = (e, smth) => {
  smth = e.replace(/['"]+/g, '')
}
function toIsoString(date) {
  var tzo = -date.getTimezoneOffset(),
      dif = tzo >= 0 ? '+' : '-',
      pad = function(num) {
          return (num < 10 ? '0' : '') + num;
      };

  return date.getFullYear() +
      '-' + pad(date.getMonth() + 1) +
      '-' + pad(date.getDate()) +
      'T' + pad(date.getHours()) +
      ':' + pad(date.getMinutes()) +
      ':' + pad(date.getSeconds()) +
      dif + pad(Math.floor(Math.abs(tzo) / 60)) +
      ':' + pad(Math.abs(tzo) % 60);
}

    const props = defineProps({
      sum: Number,
      transactionId: String,
      categorieId: String,
      accountId: String,
      created: String
    })

    const obj = ref({
      sum: props.sum,
      transactionId: props.transactionId,
      categorieId: props.categorieId,
      accountId: props.accountId,
      created: toIsoString(new Date(props.created)),
    })
    const defaultCategory = computed(() => obj.value.sum < 0 ? "defaultExpense" : "defaultIncome")
const checkLimit = () => {
  obj.value.sum = Number(obj.value.sum).toFixed(2)
  if (obj.value.sum > 0 && selectedSegment.value === 'default') {
    obj.value.sum *= -1
  } else if (obj.value.sum < 0 && selectedSegment.value === 'income') {
    obj.value.sum *= -1
  }
  if(obj.value.categorieId === '') {obj.value.categorieId = defaultCategory.value;} 
  if(obj.value.selectedDate === null) obj.value.selectedDate = new Date()
  const accountIndex = accountsStore.accounts.findIndex((item) => item.id === obj.value.accountId)
  const accountSum = Number(accountsStore.accounts[accountIndex].sum)
  const creditLimit = Number(accountsStore.accounts[accountIndex].creditLimit)
  obj.value.sum = Number(obj.value.sum)
  if (obj.value.sum === 0) {
    zeroError.value = true
    obj.value.sum = null
  }
  else if ((accountSum + creditLimit - props.sum) + obj.value.sum < 0) {
    limitError.value = true
  }  
  else confirm()
}

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
        deleteEvent()
      },
    },
    ];
    const alertButtonsErrors = [
  {
    text: 'Ок',
    handler: () => {
      limitError.value = false
      zeroError.value = false
    }
  }
]

const zeroError = ref(false)

const setOpenZeroError = (state) => {
  zeroError.value = state
}

const limitError = ref(false)
const setOpen = (state) => {
  limitError.value = state
}
  </script>