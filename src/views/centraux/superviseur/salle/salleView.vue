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
import SalleList from '@/views/centraux/superviseur/SalleList.vue'


import apiService from '@/services/apiService'
import axios from 'axios'
import LoadingButton from '@/layouts/LoadingButton.vue'
// const isLoading = ref(false)
// import axios from 'axios'
// import apiService from '@/services/apiService'


const form = reactive({
  zone: '',
  site: '',
  nom: '',
  type: 'CENTRAL',
  nbIntervention: '',
  date_debut: '',
  date_fin: '',
  errMessage: '',
  referenceEquipement: '',
  nomEquipement: '',
  typeEquipement: '',
  salleId: '',
  nomSalle: '',
  zoneSalle: '',
  dateDebut: '',
  dateFin: '',
  zoneForInterventionCentral: '',
  showSucess: false,
  showErr: false,
  showAdd: true,
  selectedTab: 'Equipement',
  showAddEquipement: false,
  showAddZone: false,
  showAddPlanifByZone: false,
  showAddPlanifByEquipement: false,
  showAddSalle: false
})

const zones = reactive({ list: [] })
const sites = reactive({ list: [] })
const oneZoneCentrale = reactive({ list: [] })
const notificationSettingsModel = ref([])
const notificationsOutline = computed(() => notificationSettingsModel.value.indexOf('outline') > -1)
const isDetailModal = ref(false)

const getSites = async () => {
  const data = await apiService.getAllSites();
  sites.list = data.data
}

const getCentralZone = async () => {
  axios({
    url: apiService.getUrl() + '/zone/central',
    method: 'GET'
  }).then((res) => {
    // console.log(res.data)
    zones.list = res.data
    // getEquipementForInterventionFunc(res.data.)
  }).catch((err) => {
    form.showErr = true;
    form.errmessage = 'An error occured ' + err.message
  })
}

const isLoading = ref(false);


const addSalle = () => {
  isLoading.value = true;
  axios({
    url: apiService.getUrl() + '/salle',
    method: 'POST',
    data: {
      salle_id: form.salleId,
      nom: form.nomSalle,
      zone: form.zoneSalle
    }
  }).then((res) => {
    console.log(res.data)
    location.reload()
    isLoading.value = false
  }).catch((err) => {
    console.error(err.message)
  })

}

onMounted(() => {
  getSites()
  getCentralZone()
})
</script>

<template>
  <div v-if="form.showSucess == true">
    <NotificationBar color="success" :icon="mdiInformation" :outline="notificationsOutline">
      <b>Plannification initialisée</b>. <i>Passez au suivant👉 </i>
    </NotificationBar>
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
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Intervention Centrale" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <FormField label="Ajout des salles">
            <FormControl v-model="form.salleId" type="text" placeholder="Salle Id" />
            <FormControl v-model="form.nomSalle" type="text" placeholder="Nom de la salle" />
            <select v-model="form.zoneSalle" class="form-select bg-white dark:bg-slate-800">
              <option value="" disabled selected>Séléctionnez une zone</option>
              <option v-for="(equipement, index) in zones.list" :key="index" :value="equipement.nom">
                {{ equipement.nom }}
              </option>
            </select>
            <LoadingButton :button-text="'Enregistrer'" :is-loading="isLoading" @click="addSalle()" />
          </FormField>
      </CardBox>
    </SectionMain>

    <SectionMain>
      <CardBox has-table>
        <SalleList />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
