<script setup>
import { ref, onMounted, reactive } from 'vue'
import { mdiChartTimelineVariant, mdiReload, mdiChartPie, mdiFileExcel, mdiSitemap } from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import SectionMain from '@/components/SectionMain.vue'
import CardBoxWidget from '@/components/CardBoxWidget.vue'
import CardBox from '@/components/CardBox.vue'
import BaseButton from '@/components/BaseButton.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import axios from 'axios'
import apiService from '@/services/apiService'
import { refreshPageOnceWithDelay, getStartAndEndOfWeek } from '@/services/document'
// import TogoMap from '@/layouts/TogoMapComponent.vue'
import * as XLSX from 'xlsx'
/* import CardZoneGrid from '@/views/CardZoneGrid.vue'
import TimeLine from '@/layouts/TimeLine.vue' */


const chartData = ref(null)
// const events = ref([])
const sitesWeeklyPlan = ref([])

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
    console.log('Début de fetchData')
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

const formatDate = (date) => date ? new Date(date).toISOString().split('T')[0] : ''
const getStatus = (item) => item.date_attente === '' ? 'NON FAIT' : item.date_prise_en_compte === '' ? 'NON PRIS EN COMPTE' : 'FAIT'

onMounted(async () => {
  console.log('Composant monté')
  initDate()
  fillChartData()
  weekNumber()
  await fetchData()
  refreshPageOnceWithDelay(500)
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
      <!-- <CardBox class="mb-6">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
          <CardBox class="mb-6" title="Map">
            <TogoMap></TogoMap>
          </CardBox>
          <CardBox class="mb-6">
            <CardZoneGrid></CardZoneGrid>
          </CardBox>
        </div>
      </CardBox>
      <SectionTitleLineWithButton :icon="mdiTools" title="Statistiques (Stocks)">
        <BaseButton :icon="mdiReload" color="whiteDark" @click="fetchData" />
      </SectionTitleLineWithButton>
      <CardBox class="mb-6" title="Historique transaction">
        <TimeLine :events="events" />
      </CardBox>
      <SectionTitleLineWithButton :icon="mdiOil" title="Refueling">
        <BaseButton :icon="mdiReload" color="whiteDark" @click="fetchData" />
      </SectionTitleLineWithButton>
      <CardBox class="mb-6">
        <center>Indisponible pour le moment...</center>
      </CardBox> -->
    </SectionMain>
  </LayoutAuthenticated>
</template>
