<script setup>
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import { onMounted, reactive, ref, computed } from 'vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import zoneList from '@/views/centraux/superviseur/CentralList.vue'
import apiService from '@/services/apiService'
import axios from 'axios'
import Stepper from '@/layouts/Stepper.vue'
import { mdiRefresh, mdiArrowUp } from '@mdi/js'
import LoadingButton from '@/layouts/LoadingButton.vue'
// import axios from 'axios'
// import apiService from '@/services/apiService'

const isModalActive = ref(false)

const form = reactive({
  zone: '',
  site: '',
  nom: '',
  type: 'CENTRAL',
  nbIntervention: '',
  date_debut: '',
  date_fin: '',
  errMessage: '',
  showSucess: false,
  showErr: false,
  showAdd: true,
})

const zones = reactive({ list: [] })
const sites = reactive({ list: [] })
const oneZoneCentrale = reactive({ list: [] })
const equipementCentralList = reactive({ list: [] })
const notificationSettingsModel = ref([])
const notificationsOutline = computed(() => notificationSettingsModel.value.indexOf('outline') > -1)
const isDetailModal = ref(false)

const getSites = async () => {
  const data = await apiService.getAllSites();
  sites.list = data.data
}

const isLoading = ref(false);

/* const loadData = () => {
      isLoading.value = true;
      // Simulate an API call
      setTimeout(() => {
        isLoading.value = false;
        // alert('Data loaded!');
      }, 2000);
    }; */

const createZone = () => {
  isLoading.value = true;
  axios({
    url: apiService.getUrl() + '/zone',
    method: 'POST',
    data: {
      nom: form.nom,
      type: form.type
    }
  }).then((res) => {
    form.showSucess = true;
    isLoading.value = false;
    // editZone(res.data.insertId)
    // console.log('\n---', res.data)
    axios({
      url: apiService.getUrl() + '/zone/' + res.data.insertId,
      method: 'GET'
    }).then(async (res) => {
      isDetailModal.value = true
      await getEquipementCentralList()
      form.ajouter_par = localStorage.getItem('nom') + ' ' + localStorage.getItem('prenom')
      console.log()
      form.id_zone = res.data.insertId;
      // isModalActive.value = true;
    })

  }).catch((err) => {
    form.showErr = true
    form.errMessage = 'Une erreur est surevenue ' + err.message
  })
}




const getEquipementCentralList = async () => {
  axios({
    url: apiService.getUrl() + '/equipement/central/' + oneZoneCentrale.list.nom,
    method: 'GET'
  }).then((res) => {
    console.log('res.data', res.data)
    equipementCentralList.list = res.data
  }).catch((err) => {
    form.showErr = true;
    form.errmessage = 'An error occured ' + err.message
  })
}

const state = reactive({
  steps: ['Step 1', 'Step 2', 'Step 3']
});
// steps: ['Step 1', 'Step 2', 'Step 3']

onMounted(() => {
  getSites()
})
</script>

<template>
  <div v-if="form.showSucess == true">

  </div>
  /* <CardBoxModal v-model="isDetailModal" title="Initialisation">
    <p>Zone : <strong>{{ oneZoneCentrale.list.nom }}</strong> </p>
    <div v-if="form.showAdd == true">
      <FormField label="Informations générale">
        <FormControl v-model="form.nom_equipement" placeholder="Nom de l'équipement" />
        <FormControl v-model="form.frequence" placeholder="Fréquence de maintenance" />
        <BaseButton color="info" label="Enregistrer" @click="addEquipement()" />
      </FormField>
    </div>
    <p>Utilisateur : {{ form.ajouter_par }}</p>
    <BaseButton color="info" title="Actualiser" label="Ajouter" @click="addIntervention()" />
  </CardBoxModal> */

  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Zone" main>
      </SectionTitleLineWithButton>
      <Stepper :steps="state.steps">
        <template v-slot:step-0>
          <div>
            <CardBox>
              <NotificationBar color="success" :icon="mdiInformation" :outline="notificationsOutline">
                <b>Plannification initialisée</b>. <i>Passez au suivant👉​</i>
              </NotificationBar>
              <FormField label="Informations générale">
                <select v-model="form.nom" class="form-select bg-white dark:bg-slate-800">
                  <option value="">Séléctionnez une zone</option>
                  <option v-for="(site, index) in sites.list" :key="index" :value="site.nom_site">
                    {{ site.nom_site }}
                  </option>
                </select>
                <LoadingButton :buttonText="'Plannifer'" :isLoading="isLoading" @click="createZone()" />
              </FormField>
              <BaseDivider />
            </CardBox>
          </div>
        </template>
        <template v-slot:step-1>
          <p>Zone : <strong>{{ oneZoneCentrale.list.nom }}</strong> </p>
          <br />
          <hr />
          <br />
          <div v-if="form.showAdd == true">
            <BaseButton color="info" title="Actualiser" :icon="mdiRefresh" small @click="getEquipementCentralList()" />
            <BaseButton color="info" title="Ajouter un équipement" :icon="mdiArrowUp" small
              @click="form.showAdd = !form.showAdd" />
            <select v-model="form.equipement" class="form-select bg-white dark:bg-slate-800">
              <option value="">Séléctionnez une Equipement</option>
              <option v-for="(equipement, index) in equipementCentralList.list" :key="index" :value="equipement._id">
                {{ equipement.nom }}
              </option>
            </select>
          </div>

          <div v-else>
            <BaseButton color="info" title="Actualiser" :icon="mdiRefresh" small @click="getEquipementCentralList()" />
            <BaseButton color="info" title="Ajouter un équipement" :icon="mdiPlus" small
              @click="form.showAdd = !form.showAdd" />
            <select v-model="form.equipement" class="form-select bg-white dark:bg-slate-800">
              <option value="">Séléctionnez une Equipement</option>
              <option v-for="(equipement, index) in equipementCentralList.list" :key="index" :value="equipement._id">
                {{ equipement._id }} | {{ equipement.nom }} | {{ equipement.zone }}
              </option>
            </select>
          </div>

          <div v-if="form.showAdd == true">
            <FormField label="Informations générale">
              <FormControl v-model="form.nom_equipement" placeholder="Nom de l'équipement" />
              <FormControl v-model="form.frequence" placeholder="Fréquence de maintenance" />
              <BaseButton color="info" label="Enregistrer l'équipement" @click="addEquipement()" />
            </FormField>
          </div>
          <p>Utilisateur : {{ form.ajouter_par }}</p>
          <BaseButton color="info" title="Actualiser" label="Enregistrer l'intervention" @click="addIntervention()" />
        </template>
        <template v-slot:step-2>
          <div>Content for Step 3</div>
        </template>
      </Stepper>
      <CardBox>
      </CardBox>
    </SectionMain>

    <SectionMain>
      <CardBox has-table>
        <zoneList />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
