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
import PlannificationList from '@/views/centraux/user/plannificationListByZone.vue'
import apiService from '@/services/apiService'
import axios from 'axios'
import { useMainStore } from '@/stores/main'
import { mdiPencil, mdiTools } from "@mdi/js"
import { icon } from 'leaflet'
import BaseButtons from '@/components/BaseButtons.vue'
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css';


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
  showAddSalle: false,
  id_plannification: 0,
  showDatePicker: false,
  date_fait: '',
  remarque: '',
  panne: '',
  selectedPlannif: ''
})

const zones = reactive({ list: [] })
const sites = reactive({ list: [] })
const oneZoneCentrale = reactive({ list: [] })
const equipementCentralList = reactive({ list: [] })
const notificationSettingsModel = ref([])
const notificationsOutline = computed(() => notificationSettingsModel.value.indexOf('outline') > -1)
const isDetailModal = ref(false)
const selectedDate = ref(null)

const getSites = async () => {
  const data = await apiService.getAllSites();
  sites.list = data.data
}

const getCentralZone = async () => {
  axios({
    url: apiService.getUrl() + '/zone/central',
    method: 'GET'
  }).then((res) => {
    zones.list = res.data
  }).catch((err) => {
    form.showErr = true;
    form.errmessage = 'An error occured ' + err.message
  })
}

const getEquipementCentralList = async () => {
  // console.info(mainStore.userZone)
  try {
    const res = await axios({
      url: apiService.getUrl() + '/plannif/central/zone/' + mainStore.userZone,
      method: 'GET'
    });
    // console.log('Equipement GET', form.zone_name);
    equipementCentralList.list = res.data;
  } catch (err) {
    form.showErr = true;
    form.errmessage = 'An error occurred: ' + err.message;
  }
}

const formatDate = (dateString) => {
  if (!dateString) {
    return 'Date invalide';
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Date invalide';
  }

  const options = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  };
  const formatter = new Intl.DateTimeFormat('fr-FR', options);
  const formattedDate = formatter.format(date);
  const formattedDateWithHours = formattedDate.replace(',', ' à');
  return formattedDateWithHours;
}

const isLoading = ref(false);

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

const getPlannificationItemsList = reactive({ list: [] })
const getPlannificationItems = () => {
  axios({
    url: apiService.getUrl() + '/equipement/plannif/central/' + form.id_plannification,
    method: 'GET'
  }).then((res) => {
    getPlannificationItemsList.list = res.data;
  }).catch((err) => {
    console.error(err.message)
  })
}

const showModalForPlanif = ref(false)
const showPlanifItems = (equipement) => {
  showModalForPlanif.value = true
  form.id_plannification = equipement._id;
  form.nomEquipement = equipement.nom ? equipement.nom : 'Tous les équipements'
  form.date_debut = equipement.date_debut
  form.date_fin = equipement.date_fin
  form.nbIntervention = equipement.nombre_equipement

  getPlannificationItems()
}

const finishIntervention = () => {
  axios({
    url: apiService.getUrl() + '/equipement/plannif/central/' ,
    method: 'PUT',
    data: {
      _id: form.selectedPlannif,
      date_fait: form.date_fait,
      remarque: form.remarque,
      panne: form.panne,
    }
  }).then((res) => {
    // getPlannificationItemsList.list = res.data;
    getPlannificationItems()
    form.showDatePicker  = false
  }).catch((err) => {
    console.error(err.message)
  })
}

const mainStore = useMainStore()

const items = computed(() => mainStore.clients)

const handleDateSelect = (date) => {
  selectedDate.value = date
  showDatePicker.value = false
}

onMounted(() => {
  getSites()
  getCentralZone()
  getEquipementCentralList()
})
</script>

<template>
  <div v-if="form.showSucess == true">
    <NotificationBar color="success" :icon="mdiInformation" :outline="notificationsOutline">
      <b>Plannification initialisée</b>. <i>Passez au suivant👉 </i>
    </NotificationBar>
  </div>




  <LayoutAuthenticated>


    <!-- Modals -->
    <CardBoxModal v-model="showModalForPlanif" title="Planifications">
      <p>Equipement: {{ form.nomEquipement }}</p>
      <p>Du {{ form.date_debut ? formatDate(form.date_debut) : 'Date invalide' }} au {{ form.date_fin ?
        formatDate(form.date_fin) : 'Date invalide' }} </p>
      <br>
      <table>
        <thead>
          <tr>
            <th v-if="checkable" />
            <th />

            <th>Equipements</th>
            <th>Etat</th>
            <th>Action</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(plannif, index) in getPlannificationItemsList.list" :key="index">
            <TableCheckboxCell v-if="checkable" @checked="checked($event, zone)" />
            <td class="border-b-0 lg:w-6 before:hidden">
              <!-- <UserAvatar :username="zone._id" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" /> -->
            </td>

            <!-- <td data-label="Date début">
              {{ plannif.date_debut ? formatDate(plannif.date_debut) : 'Date invalide' }}
            </td>
            <td data-label="Date fin">
              {{ plannif.date_fin ? formatDate(plannif.date_fin) : 'Date invalide' }}
            </td> -->
            <td data-label="Equipement">
              {{ plannif.equipement == '' ? 'Tous les équipements' : plannif.equipement }}
            </td>
            <td data-label="Date Fait">
              {{ plannif.date_fait == '0000-00-00 00:00:00' ? 'En attente de validation' : plannif.date_fait ? formatDate(plannif.date_fait) : 'Date invalide' }}
            </td>
            <td class="before:hidden lg:w-1 whitespace-nowrap">
              <BaseButtons type="justify-start lg:justify-end" no-wrap>
                <BaseButton color="info" :icon="mdiPencil" small @click="() => {
                  form.showDatePicker = true;
                  form.selectedPlannif = plannif._id;
                }" />
                <!-- <BaseButton color="danger" :icon="mdiTools" small @click="addPlannif(equipement)" /> -->
              </BaseButtons>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        <BaseButtons>
          <BaseButton color="info" label="Confirmer" small @click="" />
          <BaseButton color="transparent" label="Fermer" small @click="showModalForPlanif = false" />
        </BaseButtons>
      </p>

      <CardBoxModal v-model="form.showDatePicker" title="Clôturer le ticket">
        <FormField label="Informations complémentaires">
          <FormControl v-model="form.date_fait" type="date" />
          <FormControl v-model="form.remarque" placeholder="Remarque" />
          <FormControl v-model="form.panne" placeholder="Panne ?" />

          <BaseButton color="info" label="Enregistrer" @click="finishIntervention()" />
        </FormField>
      </CardBoxModal>
    </CardBoxModal>

    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Intervention Centrale" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <table>
          <thead>
            <tr>
              <th v-if="checkable" />
              <th />
              <th>Zone</th>
              <th>Début</th>
              <th>Fin</th>
              <th>Equipements</th>
              <th>Action</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(equipement, index) in equipementCentralList.list" :key="index">
              <TableCheckboxCell v-if="checkable" @checked="checked($event, zone)" />
              <td class="border-b-0 lg:w-6 before:hidden">
                <!-- <UserAvatar :username="zone._id" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" /> -->
              </td>
              <td data-label="Zone">
                {{ equipement.zone }}
              </td>
              <td data-label="Date début">
                {{ equipement.date_debut ? formatDate(equipement.date_debut) : 'Date invalide' }}
              </td>
              <td data-label="Date fin">
                {{ equipement.date_fin ? formatDate(equipement.date_fin) : 'Date invalide' }}
              </td>
              <td data-label="Equipement">
                {{ equipement.equipement == '' ? 'Tous les équipements' : equipement.equipement }}
              </td>
              <td class="before:hidden lg:w-1 whitespace-nowrap">
                <BaseButtons type="justify-start lg:justify-end" no-wrap>
                  <BaseButton color="success" :icon="mdiPencil" small @click="showPlanifItems(equipement)" />
                </BaseButtons>
              </td>
            </tr>
          </tbody>
        </table>

      </CardBox>
    </SectionMain>
    <SectionMain>

    </SectionMain>
  </LayoutAuthenticated>
</template>
