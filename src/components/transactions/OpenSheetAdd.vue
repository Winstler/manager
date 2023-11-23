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
                    <ion-select-option :value="account.id" v-for = "account in accountsStore.accounts" :key = "account.id">{{account.name}}</ion-select-option>
                  </ion-select>
                  <ion-select v-if = "selectedSegment == 'default'" justify="space-between" label="Виберіть категорію" :compareWith="compareWith"  @ionChange="obj.categorie = JSON.stringify($event.detail.value)">
                    <ion-select-option :value="categorie.id" v-for = "categorie in categoriesStore.filteredExpenses" :key = "categorie.id">{{categorie.name}}</ion-select-option>
                  </ion-select>
                  <ion-select v-else justify="space-between" label="Виберіть категорію" :compareWith="compareWith"  @ionChange="obj.categorie = JSON.stringify($event.detail.value)">
                    <ion-select-option :value="categorie.id" v-for = "categorie in categoriesStore.filteredIncomes" key = "categorie.id">{{categorie.name}}</ion-select-option>
                  </ion-select>
                </ion-item>
                <ion-item>
                    <ion-input label-placement="stacked" label="Сума операції" type="number" v-model = "obj.sum"></ion-input>
                </ion-item>
                <ion-item>
                  <ion-datetime-button datetime="datetime" v-model = "obj.selectedDate"></ion-datetime-button>
                  <ion-modal :keep-contents-mounted="true">
                    <ion-datetime id="datetime" display-format = "YYYY-MM-DDTHH:mm"></ion-datetime>
                  </ion-modal>
                </ion-item>
            </ion-list>
        </ion-content>
</template>
<script setup>
  import { IonHeader, IonToolbar, IonContent, IonList, IonItem, IonModal, IonButtons, IonButton, IonSelect, IonSelectOption, IonIcon, modalController, IonInput, IonSegment, IonSegmentButton, IonLabel, IonDatetime, IonDatetimeButton } from '@ionic/vue';
  import { card } from 'ionicons/icons';
  import { ref, onMounted, computed  } from 'vue';
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
    selectedDate: new Date().toISOString(),
  })
  accountsStore.getAccounts()
  const cancel = () => modalController.dismiss(null, 'cancel');
  const confirm = () => {
    if(obj.value.sum === 0){
      modalController.dismiss(null, 'dismiss')
    }
    if(obj.value.sum > 0 && selectedSegment.value === "default"){
      obj.value.sum *= -1 
    }
    else if(obj.value.sum < 0 && selectedSegment.value === "income"){
      obj.value.sum *= -1 
    }
    modalController.dismiss(obj, 'confirm')
  };

  const selectedSegment = ref("default");
  const computedColor = computed(() => selectedSegment.value == "default" ? "danger" : "success");

</script>