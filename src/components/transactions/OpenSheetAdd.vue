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
                <ion-segment v-model="selectedSegment">
                    <ion-segment-button value="default">
                      <ion-label>Витрати</ion-label>
                    </ion-segment-button>
                    <ion-segment-button value="income">
                      <ion-label>Доходи</ion-label>
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
            </ion-list>
        </ion-content>
</template>
<script setup>
  import { IonHeader, IonToolbar, IonContent, IonList, IonItem, IonModal, IonButtons, IonButton, IonSelect, IonSelectOption, IonIcon, modalController, IonInput, IonSegment, IonSegmentButton, IonLabel } from '@ionic/vue';
  import { card } from 'ionicons/icons';
  import { ref, onMounted  } from 'vue';
  import { useAccountsStore } from '@/stores/accountsStore'
  const accountsStore = useAccountsStore();
  import { useCategoriesStore} from "@/stores/categoriesStore"
  const categoriesStore = useCategoriesStore();

  function compareWith(o1, o2) {
        return o1 && o2 ? o1.id === o2.id : o1 === o2;
  }

  const obj = ref({
    currentAccount: "",
    sum: 0,
    categorie: "",
  })
  accountsStore.getAccounts()
  const cancel = () => modalController.dismiss(null, 'cancel');
  const confirm = () => {
    modalController.dismiss(obj, 'confirm')
  };

  const selectedSegment = ref("default");
</script>