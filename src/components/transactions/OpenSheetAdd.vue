<!-- eslint-disable vue/no-deprecated-slot-attribute -->
<template >
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
        <ion-content class="ion-padding" >
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
                  <ion-select v-model = "obj.currentAccount" justify="space-between" label="Виберіть рахунок" @ionChange="updateSelect($event.detail.value, obj.currentAccount)">
                    <ion-select-option :value="account.id" v-for = "account in accountsStore.accounts" :key = "account.id">{{account.name}}</ion-select-option>
                  </ion-select>
                  <ion-select v-model = "obj.categorie" v-if = "selectedSegment == 'default'" justify="space-between" label="Виберіть категорію"   @ionChange="updateSelect($event.detail.value, obj.categorie)">
                    <ion-select-option :value="categorie.id" v-for = "categorie in categoriesStore.filteredExpenses" :key = "categorie.id">{{categorie.name}}</ion-select-option>
                  </ion-select>
                  <ion-select v-model = "obj.categorie" v-else justify="space-between" label="Виберіть категорію"  @ionChange="updateSelect($event.detail.value, obj.categorie)">
                    <ion-select-option :value="categorie.id" v-for = "categorie in categoriesStore.filteredIncomes" :key = "categorie.id">{{categorie.name}}</ion-select-option>
                  </ion-select>
                </ion-item>
                <ion-item>
                    <ion-input label-placement="stacked" label="Сума операції" type="number" v-model = "obj.sum"></ion-input>
                </ion-item>
                <ion-item>
                  <ion-datetime-button datetime="datetime" v-model = "obj.selectedDate"></ion-datetime-button>
                  <ion-modal :keep-contents-mounted="true">
                    <ion-datetime id="datetime" v-model = "obj.selectedDate" display-format = "YYYY-MM-DDTHH:mm"></ion-datetime>
                  </ion-modal>
                </ion-item>
            </ion-list>
            <ion-alert
    :is-open="isOpenContinue"
    header="Видалити цю транзакцію?"
    message="Якщо ви вийдете, транзакція не збережиться."
    :buttons="alertButtonsContinue"
    @didDismiss="setOpenContinue(false)">
    </ion-alert>

    <ion-alert
        :is-open="limitError"
        header="Перевищен кредитний ліміт"
        message="Схоже, що ви неправильно ввели дані. На звичайному рахунку не може бути мінусового стану, або борг на рахунку перевищуе кредитний ліміт. Змініть дані та спробуйте знову."
        :buttons="alertButtons"
        @didDismiss="setOpen(false)"></ion-alert>
        </ion-content>
</template>
<script setup>
import { IonAlert, IonHeader, IonToolbar, IonContent, IonList, IonItem, IonModal, IonButtons, IonButton, IonSelect, IonSelectOption, modalController, IonInput, IonSegment, IonSegmentButton, IonLabel, IonDatetime, IonDatetimeButton } from '@ionic/vue'
import { ref, onMounted, computed } from 'vue'
import { useAccountsStore } from '@/stores/accountsStore'

import { useCategoriesStore } from '@/stores/categoriesStore'
const accountsStore = useAccountsStore()
const categoriesStore = useCategoriesStore()

const updateSelect = (e, smth) => {
  // Применяем replace к значению, десериализованному из JSON.stringify
  smth = e.replace(/['"]+/g, '')
}

const obj = ref({
  currentAccount: '',
  sum: 0,
  categorie: '',
  selectedDate: new Date().toISOString()
})
const setOpenContinue = (state) => {
  isOpenContinue.value = state
}
const setOpen = (state) => {
  limitError.value = state
}
onMounted(() => {
  // Выполняется после монтирования компонента
  if (accountsStore.accounts.length === 1) {
    // Если у вас только один аккаунт, установите его в качестве текущего аккаунта
    obj.value.currentAccount = accountsStore.accounts[0].id
  }
})

accountsStore.getAccounts()
const cancel = () => {

}
const checkLimit = () => {
  if (obj.value.sum === 0) {
    modalController.dismiss(null, 'dismiss')
  }
  if (obj.value.sum > 0 && selectedSegment.value === 'default') {
    obj.value.sum *= -1
  } else if (obj.value.sum < 0 && selectedSegment.value === 'income') {
    obj.value.sum *= -1
  }
  const accountIndex = accountsStore.accounts.findIndex((item) => item.id === obj.value.currentAccount)
  const accountSum = Number(accountsStore.accounts[accountIndex].sum)
  const creditLimit = Number(accountsStore.accounts[accountIndex].creditLimit)
  console.log(accountSum, creditLimit, obj.value.sum)
  if ((accountSum + creditLimit) + obj.value.sum < 0) {
    limitError.value = true
  } else confirm()
}
const confirm = () => {
  modalController.dismiss(obj, 'confirm')
}

const selectedSegment = ref('default')
const computedColor = computed(() => selectedSegment.value === 'default' ? 'danger' : 'success')
const isOpenContinue = ref(false)
const limitError = ref(false)
const alertButtonsContinue = [
  {
    text: 'Продовжити редагування'
  },
  {
    text: 'Скасувати зміни',
    handler: () => {
      modalController.dismiss(null, 'dismiss')
    },
    color: 'danger'
  }
]
const alertButtons = [
  {
    text: 'Ок',
    handler: () => {
      limitError.value = false
    }
  }
]

</script>
