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
import EquipementCentralList from '@/views/centraux/superviseur/EquipementCentralList.vue'
import SalleList from '@/views/centraux/superviseur/SalleList.vue'
import PlannificationList from '@/views/centraux/superviseur/PlannificationList.vue'


import apiService from '@/services/apiService'
import axios from 'axios'
import Stepper from '@/layouts/Stepper.vue'
import TabBar from '@/components/TabBar.vue'
import { mdiRefresh, mdiArrowUp } from '@mdi/js'
import LoadingButton from '@/layouts/LoadingButton.vue'
// const isLoading = ref(false)
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
const equipementCentralList = reactive({ list: [] })
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

/* const loadData = () => {
      isLoading.value = true;
      // Simulate an API call
      setTimeout(() => {
        isLoading.value = false;
        // alert('Data loaded!');
      }, 2000);
    }; */

const addZone = () => {
  form.type = 'CENTRAL'
  isLoading.value = true;
  axios({
    url: apiService.getUrl() + '/zone',
    method: 'POST',
    data: {
      nom: form.zone,
      type: form.type
    }
  }).then((res) => {
    form.showSucess = true;
    isLoading.value = false;
    location.reload()
    // editZone(res.data.insertId)
    console.log('\n---', res.data)


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
/* const equipements = reactive({
  list: ['Atelier', 'Onduleur', 'Coffret AC', 'Coffret Ondulé', 'Coffret DC', 'Armoire TGBT', 'Climatiseurs', 'Système VRV', 'Splits cassettes', 'Monoblocs', 'Bancs de battéries', 'Sécurité incendie', 'Inverseurs', 'GE', 'Citernes', 'Eclairage']
}) */

const equipements = [
  { id: 1, label: 'Atelier' },
  { id: 2, label: 'Onduleur' },
  { id: 3, label: 'Coffret AC' },
  { id: 4, label: 'Coffret Ondulé' },
  { id: 5, label: 'Coffret DC' },
  { id: 6, label: 'Armoire TGBT' },
  { id: 7, label: 'Climatiseurs' },
  { id: 8, label: 'Système VRV' },
  { id: 9, label: 'Splits cassettes' },
  { id: 10, label: 'Monoblocs' },
  { id: 11, label: 'Bancs de battéries' },
  { id: 12, label: 'Sécurité incendie' },
  { id: 13, label: 'Inverseurs' },
  { id: 14, label: 'GE' },
  { id: 15, label: 'Citernes' },
  { id: 16, label: 'Eclairage' }


]
// steps: ['Step 1', 'Step 2', 'Step 3']
const addEquipement = () => {
  form.ajouter_par = localStorage.getItem('nom') + ' ' + localStorage.getItem('prenom')
  axios({
    url: apiService.getUrl() + '/equipement/central/',
    method: 'POST',
    data: {
      reference: form.referenceEquipement,
      nom: form.nomEquipement,
      type: form.typeEquipement,
      ajouter_par: form.ajouter_par
    }
  }).then((res) => {
    console.log(res.insertId)
    location.reload()
  }).catch((err) => {
    console.error(err.message)
  })
}

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

const addInterventionByZone = () => {
  isLoading.value = true;
  form.ajouter_par = localStorage.getItem('nom') + ' ' + localStorage.getItem('prenom')
  axios({
    url: apiService.getUrl() + '/plannif/central',
    method: 'POST',
    data: {
      zone: form.zoneForInterventionCentral,
      date_debut: form.dateDebut,
      date_fin: form.dateFin,
      equipement: '',
      ajouter_par: form.ajouter_par
    }
  }).then((res) => {
    console.log(res.data)
    location.reload()
    isLoading.value = false
  }).catch((err) => {
    console.error(err.message)
  })
}

const addInterventionByEquipement = () => {
  isLoading.value = true;
  form.ajouter_par = localStorage.getItem('nom') + ' ' + localStorage.getItem('prenom')
  axios({
    url: apiService.getUrl() + '/plannif/central',
    method: 'POST',
    data: {
      zone: form.zoneForInterventionCentral,
      date_debut: form.dateDebut,
      date_fin: form.dateFin,
      equipement: form.typeEquipement,
      ajouter_par: form.ajouter_par
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
      <b>Plannification initialisée</b>. <i>Passez au suivant👉​</i>
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
        <TabBar v-model="form.selectedTab" :tabs="['Equipement', 'Zone', 'Planification', 'Salle']" />
        {{ edit_1 }}
        <div v-if="form.selectedTab === 'Equipement'">
          <br>
          <h2>Équipements</h2>
          <br>
          <BaseButton color="info" title="Actualiser" label="Ajouter"
            @click="form.showAddEquipement = !form.showAddEquipement" />
          <div v-if="form.showAddEquipement == true">
            <FormField label="Informations générale">
              <FormControl v-model="form.referenceEquipement" placeholder="Référence de l'équipement" />
              <FormControl v-model="form.nomEquipement" placeholder="Nom de l'équipement" />
              <select v-model="form.typeEquipement" class="form-select bg-white dark:bg-slate-800">
                <option value="" disabled selected>Séléctionnez un équipement</option>
                <option v-for="(equipement, index) in equipements" :key="index" :value="equipement.label">
                  {{ equipement.label }}
                </option>
              </select>
              <BaseButton color="info" label="Enregistrer" @click="addEquipement()" />
            </FormField>
          </div>
          <!-- Ajoutez ici le contenu pour la vue Équipement -->
        </div>
        {{ edit_2 }}
        <div v-if="form.selectedTab === 'Zone'">
          <br>
          <h2>Zones</h2>
          <br>
          <BaseButton color="info" title="Actualiser" label="Ajouter" @click="form.showAddZone = !form.showAddZone" />
          <div v-if="form.showAddZone == true">
            <FormField label="Zone Centrale">
              <FormControl v-model="form.zone" placeholder="Entrez le nom de la zone" />
              <BaseButton color="info" label="Enregistrer" @click="addZone()" />
            </FormField>
          </div>
          <!-- Ajoutez ici le contenu pour la vue Zone -->
        </div>
        {{ edit_3 }}
        <div v-if="form.selectedTab === 'Planification'">
          <h2>Planification par zone</h2>
          <BaseButton color="info" title="Actualiser" label="Ajouter"
            @click="form.showAddPlanifByZone = !form.showAddPlanifByZone" />
          <div v-if="form.showAddPlanifByZone == true">
            <FormField label="Intervention par zone">
              <select v-model="form.zoneForInterventionCentral" class="form-select bg-white dark:bg-slate-800">
                <option value="" disabled selected>Séléctionnez une zone</option>
                <option v-for="(equipement, index) in zones.list" :key="index" :value="equipement.nom">
                  {{ equipement.nom }}
                </option>
              </select>
              <FormField label="Date de Planification">
                <FormControl v-model="form.dateDebut" type="date" />
                <FormControl v-model="form.dateFin" type="date" />
              </FormField>
              <LoadingButton :button-text="'Enregistrer'" :is-loading="isLoading" @click="addInterventionByZone()" />
            </FormField>
          </div>
          <br>
          <br>
          <h2>Planification par équipement</h2>
          <BaseButton color="info" title="Actualiser" label="Ajouter"
            @click="form.showAddPlanifByEquipement = !form.showAddPlanifByEquipement" />
          <br>
          <div v-if="form.showAddPlanifByEquipement == true">
            <FormField label="Intervention par Equipement">
              <select v-model="form.zoneForInterventionCentral" class="form-select bg-white dark:bg-slate-800">
                <option value="" disabled selected>Séléctionnez une zone</option>
                <option v-for="(equipement, index) in zones.list" :key="index" :value="equipement.nom">
                  {{ equipement.nom }}
                </option>
              </select>
              <select v-model="form.typeEquipement" class="form-select bg-white dark:bg-slate-800">
                <option value="" disabled selected>Séléctionnez un équipement</option>
                <option v-for="(equipement, index) in equipements" :key="index" :value="equipement.label">
                  {{ equipement.label }}
                </option>
              </select>
              <FormField label="Date de Planification">
                <FormControl v-model="form.dateDebut" type="date" />
                <FormControl v-model="form.dateFin" type="date" />
              </FormField>
              <BaseButton color="info" label="Enregistrer" @click="addInterventionByEquipement()" />
            </FormField>
          </div>
          <!-- Ajoutez ici le contenu pour la vue Intervention -->
        </div>
        {{ edit_4 }}
        <div v-if="form.selectedTab === 'Salle'">
          <!-- Ajoutez ici le contenu pour la vue Intervention -->
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
        </div>
      </CardBox>



    </SectionMain>

    <SectionMain>
      <CardBox has-table>
        <div v-if="form.selectedTab === 'Equipement'">
          <EquipementCentralList />
        </div>
        <div v-if="form.selectedTab === 'Zone'">
          <zoneList />
        </div>
        <div v-if="form.selectedTab === 'Planification'">
          <PlannificationList />
        </div>
        <div v-if="form.selectedTab === 'Salle'">
          <SalleList />
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
