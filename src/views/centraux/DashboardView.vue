<script setup>
import { ref, onMounted, reactive } from 'vue'
import { mdiChartTimelineVariant, mdiReload, mdiChartPie, mdiFileExcel, mdiSitemap } from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import SectionMain from '@/components/SectionMain.vue'
import CardBoxWidget from '@/components/CardBoxWidget.vue'
import CardBox from '@/components/CardBox.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import BaseButton from '@/components/BaseButton.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import axios from 'axios'
import apiService from '@/services/apiService'
import { refreshPageOnceWithDelay, getStartAndEndOfWeek } from '@/services/document'
import BaseButtons from '@/components/BaseButtons.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import Modal from '@/components/Modal.vue'

// import BaseButton from '@/components/BaseButton.vue'
// import TogoMap from '@/layouts/TogoMapComponent.vue'
import * as XLSX from 'xlsx'
import PlannificationList from '@/views/centraux/intervention/plannificationList.vue'

/* import CardZoneGrid from '@/views/CardZoneGrid.vue'
import TimeLine from '@/layouts/TimeLine.vue' */


const chartData = ref(null)
// const events = ref([])
const sitesWeeklyPlan = ref([])
const showModal = ref(false)
const selectedEquipement = ref({})
const activeTab = ref('details')

const openModal = (equipement) => {
  selectedEquipement.value = equipement
  showModal.value = true
   activeTab.value = 'details'
}
const form = ref({
  nbFait: 0,
  nbTotalFait: 0,
  nbEncours: 0,
  nbSitePlannifie: 0,
  nbSiteNonFait: 0,
  nbSiteTotalNonFait: 0,
  nbAllSite: 0,
  sitesRestants: 0,
  progession: 0,
  week: '',
  formattedEndOfWeek: '',
  formattedStartOfWeek: '',

  nbZone: 0,
  nbEquipementsCentraux: 0,
  nbSalle: 0,
  nbPlanification: 0
})

const initDate = () => {
  const { dateDebut, dateFin } = getStartAndEndOfWeek()
  form.value.formattedStartOfWeek = dateDebut
  form.value.formattedEndOfWeek = dateFin
}

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData()
}

const weekNumber = () => {
  form.value.week = 'Semaine W' + apiService.getWeekNumber(Date.now())
}
const zones = reactive({ list: [] })
const equipementCentraux = reactive({ list: [] })
const salleList = reactive({ list: [] })
const plannificationList = reactive({ list: [] })

const fetchData = async () => {
  try {
    // console.log('Début de fetchData')
    const urls = [
      '/zone/central',
      '/equipement/central',
      '/salle',
      '/plannif/central'
    ];

    const [zonesRes, equipementsRes, sallesRes, planificationsRes] = await Promise.all(
      urls.map(url => axios.get(apiService.getUrl() + url))
    );

    // Assignation des données
    zones.list = zonesRes.data
    equipementCentraux.list = equipementsRes.data
    salleList.list = sallesRes.data
    plannificationList.list = planificationsRes.data

    // Mise à jour des compteurs
    form.value.nbZone = zones.list.length
    form.value.nbEquipementsCentraux = equipementCentraux.list.length
    form.value.nbSalle = salleList.list.length
    form.value.nbPlanification = plannificationList.list.length
  } catch (err) {
    console.error('Erreur lors de la récupération des données:', err.message)
  }
}

const exportxlx = async () => {
  try {
    const apiData = sitesWeeklyPlan.value
    const data = [
      ['EQUIPE', 'SITE ID', 'SITE', 'SEMAINE', 'STATUT'],
      ...apiData.map((item) => [
        item.zone,
        item.site_id,
        item.site,
        `SEMAINE DU ${formatDate(item.date_debut)} AU ${formatDate(item.date_fin)}`,
        getStatus(item)
      ])
    ]

    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, 'Feuille 1')
    XLSX.writeFile(wb, 'PLANNIFICATION DE LA SEMAINE.xlsx')
  } catch (error) {
    console.error('Erreur lors de l\'export Excel:', error)
  }
}


const equipementCentralList = reactive({ list: [] })
const getEquipementCentralList = async () => {
  try {
    const res = await axios({
      url: apiService.getUrl() + '/plannif/central',
      method: 'GET'
    });
    console.log('Equipement GET', form.zone_name);
    equipementCentralList.list = res.data;
  } catch (err) {
    form.showErr = true;
    form.errmessage = 'An error occurred: ' + err.message; // Correction du message d'erreur
  }
}

const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : ''
const getStatus = (item) => item.date_attente === '' ? 'NON FAIT' : item.date_prise_en_compte === '' ? 'NON PRIS EN COMPTE' : 'FAIT'

onMounted(async () => {
  initDate()
  fillChartData()
  weekNumber()
  await fetchData()
  refreshPageOnceWithDelay(500),
    getEquipementCentralList()
})
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiChartTimelineVariant" :title="form.week" main>
        <BaseButton :icon="mdiFileExcel" color="success" label="Export" @click="exportxlx" />
      </SectionTitleLineWithButton>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-4 mb-6">
        <CardBoxWidget color="text-info-500" :icon="mdiChartTimelineVariant" :number="form.nbZone"
          label="Zone(s) totale(s)" />
        <CardBoxWidget color="text-emerald-500" :icon="mdiChartTimelineVariant" :number="form.nbEquipementsCentraux"
          label="Equipements" />
        <CardBoxWidget color="text-warning-500" :icon="mdiChartTimelineVariant" :number="form.nbSalle" label="Salles" />
        <CardBoxWidget color="text-red-500" :icon="mdiChartTimelineVariant" :number="form.nbPlanification"
          label="Planification(s)" />
      </div>
      <CardBox has-table>
        <div class="max-h-[32rem] overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th v-if="checkable" />
                <th />
                <th>Zone</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Equipements</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="(equipement, index) in equipementCentralList.list" :key="index" @click="openModal(equipement)">
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
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Modal component -->
        <CardBoxModal v-model="showModal" title="Détails">
          <div class="tabbar">
            <button :class="{ active: activeTab === 'details' }" @click="activeTab = 'details'">Détails</button>
            <button :class="{ active: activeTab === 'actions' }" @click="activeTab = 'actions'">Actions</button>
          </div>

          <div v-if="activeTab === 'details'">
            <p>Zone: <strong>{{ selectedEquipement.zone }}</strong></p>
            <p>Du: {{ formatDate(selectedEquipement.date_debut) }} au {{ formatDate(selectedEquipement.date_fin) }}</p>
            <p>Equipement: {{ selectedEquipement.equipement == '' ? 'Tous les équipements' :
              selectedEquipement.equipement }}</p>
          </div>

          <div v-if="activeTab === 'actions'">
            <BaseButtons>
            </BaseButtons>
          </div>
          <BaseButton color="transparent" label="Fermer" small @click="showModal = false" />
        </CardBoxModal>

        <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
          <BaseLevel>
            <BaseButtons>
              <BaseButton v-for="page in pagesList" :key="page" :active="page === currentPage" :label="page + 1"
                :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="currentPage = page" />
            </BaseButtons>
            <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
          </BaseLevel>
        </div>
      </CardBox>



      <SectionTitleLineWithButton :icon="mdiChartPie" title="Planification par Zone">
        <BaseButton :icon="mdiReload" color="whiteDark" @click="fetchData" />
      </SectionTitleLineWithButton>

      <CardBox class="mb-6">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-4 mb-6">
          <CardBoxWidget color="text-emerald-500" :number="form.nbTotalFait" label="Sites faits" :icon="mdiSitemap" />
          <CardBoxWidget color="text-yellow-500" :number="form.nbSiteTotalNonFait" label="Plannifiés non faits"
            :icon="mdiSitemap" />
          <CardBoxWidget color="text-red-500" :number="form.sitesRestants" label="Sites Restants" :icon="mdiSitemap" />
          <CardBoxWidget color="text-blue-500" :number="form.progession" suffix='%' label="Progression"
            :icon="mdiChartPie" />
        </div>
      </CardBox>

      <SectionTitleLineWithButton :icon="mdiChartPie" title="Planification par Equipement">
        <BaseButton :icon="mdiReload" color="whiteDark" @click="fetchData" />
      </SectionTitleLineWithButton>

    </SectionMain>
  </LayoutAuthenticated>
</template>

<style scoped>
.tabbar {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

.tabbar button {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  font-weight: bold;
}

.tabbar button.active {
  border-bottom: 2px solid #007bff;
  color: #007bff;
}
</style>
