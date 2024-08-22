<script setup>
import { computed, onMounted, reactive, ref, nextTick } from 'vue'
import { mdiPlus, mdiChartLine } from '@mdi/js'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import apiService from '@/services/apiService'
import axios from 'axios'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import LoadingButton from '@/layouts/LoadingButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import Chart from 'chart.js/auto'

// État réactif
const form = reactive({
  searchSite: '',
  searchZone: '',
  index: 0,
  quantite: 0,
  date_releve: '',
  errMessage: '',
  showError: false,
  showSuccess: false,
  successMessage: '',
  nbExist: 0,
  week: 0,
  zoneConnected: '',
  searchSiteIndex: '',
  siteByModal: '',
  siteIdByModal: ''
})

const sites = ref([])
const sitesIndexed = ref([])
const oneSite = ref(null)
const nonCommonSites = ref([])
const searchNonCommon = ref('')

const isModalActive = ref(false)
const isLoading = ref(false)
const isGraphModalActive = ref(false)
const chartCanvas = ref(null)

let currentChart = null

// Pagination
const currentPage = ref(0)
const pageSize = 10
const pagesList = computed(() => {
  const pageCount = Math.ceil(sitesIndexed.value.length / pageSize)
  return Array.from({ length: pageCount }, (_, i) => i)
})

// Ajoutez ces nouvelles variables réactives
const currentSitesPage = ref(0)
const sitePageSize = 10
const currentNonCommonPage = ref(0)
const nonCommonPageSize = 10

// Ajoutez cette propriété calculée
const paginatedSites = computed(() => {
  const start = currentSitesPage.value * sitePageSize
  const end = start + sitePageSize
  return sites.value.slice(start, end)
})

const sitesPagesList = computed(() => {
  const pageCount = Math.ceil(sites.value.length / sitePageSize)
  return Array.from({ length: pageCount }, (_, i) => i)
})

const paginatedNonCommonSites = computed(() => {
  const start = currentNonCommonPage.value * nonCommonPageSize
  const end = start + nonCommonPageSize
  return filteredNonCommonSites.value.slice(start, end)
})

const nonCommonPagesList = computed(() => {
  const pageCount = Math.ceil(filteredNonCommonSites.value.length / nonCommonPageSize)
  return Array.from({ length: pageCount }, (_, i) => i)
})

// Propriétés calculées
const filteredNonCommonSites = computed(() => {
  if (!searchNonCommon.value) return nonCommonSites.value
  const searchTerm = searchNonCommon.value.toLowerCase()
  return nonCommonSites.value.filter(site => 
    site.nom_site.toLowerCase().includes(searchTerm) ||
    site.zone.toLowerCase().includes(searchTerm) ||
    site.site_id.toString().includes(searchTerm)
  )
})

const showGraph = async (siteId, nomSite) => {
  isGraphModalActive.value = true
  form.siteIdByModal = siteId
  form.siteByModal = nomSite

  // Données statiques pour le graphique
  const staticData = {
    labels: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'],
    data: [12, 19, 3, 5, 2, 3]
  }

  await nextTick()

  if (chartCanvas.value) {
    // Détruire le graphique existant s'il y en a un
    if (currentChart) {
      currentChart.destroy()
    }

    // Créer un nouveau graphique avec les données statiques
    currentChart = new Chart(chartCanvas.value, {
      type: 'line',
      data: {
        labels: staticData.labels,
        datasets: [{
          label: `Consommation mensuelle - ${nomSite} (ID: ${siteId})`,
          data: staticData.data,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: `Site : ${nomSite} (ID: ${siteId})`,
            font: {
              size: 16
            }
          }
        }
      }
    })
  }
}

const paginatedSitesIndexed = computed(() => {
  const start = currentPage.value * pageSize
  const end = start + pageSize
  return sitesIndexed.value.slice(start, end)
})

// Méthodes
const search = async () => {
  try {
    const response = await axios.get(`${apiService.getUrl()}/site/search/dyn?nom_site=${form.searchSite.toUpperCase()}`)
    sites.value = response.data
  } catch (e) {
    console.error('Une erreur est survenue lors de la recherche', e)
  }
}

const getZoneConnected = () => {
  form.zoneConnected = localStorage.getItem('zone')
}

const searchZone = async () => {
  try {
    const response = await axios.get(`${apiService.getUrl()}/site/zone/search?zone=${form.zoneConnected.toUpperCase()}`)
    sites.value = response.data
  } catch (e) {
    console.error('Une erreur est survenue lors de la recherche par zone', e)
  }
}

const getSiteIndexed = async () => {
  try {
    const response = await axios.get(`${apiService.getUrl()}/refueling/zone/${form.zoneConnected}/${form.week}`)
    sitesIndexed.value = response.data
  } catch (e) {
    console.error('Une erreur est survenue lors de la récupération des sites indexés', e)
  }
}

const addData = async (id) => {
  isModalActive.value = true
  try {
    const response = await axios.get(`${apiService.getUrl()}/site/${id}`)
    oneSite.value = response.data[0]
  } catch (e) {
    console.error('Une erreur est survenue lors de la récupération du site', e)
  }
}

const createIndex = async () => {
  isLoading.value = true
  if (!form.index.toString().trim()) {
    form.showError = true
    isLoading.value = false
    form.errMessage = 'L\'index entré est vide'
    return
  }

  try {
    const existResponse = await axios.get(`${apiService.getUrl()}/refueling/exist/${oneSite.value.nom_site}/${form.week}`)
    form.nbExist = existResponse.data[0].nb

    if (form.nbExist === 0) {
      const createResponse = await axios.post(`${apiService.getUrl()}/refueling`, {
        site: oneSite.value.nom_site,
        site_index: form.index,
        date_releve: form.date_releve,
        date_create: Date.now(),
        quantite: form.quantite,
        week: form.week,
        zone: oneSite.value.zone
      })

      isLoading.value = false
      isModalActive.value = false
      form.showSuccess = true
      form.successMessage = createResponse.data
      resetInput()
      await getSiteIndexed()
    } else {
      form.showError = true
      isLoading.value = false
      form.errMessage = 'Index déjà enregistré pour ce site'
    }
  } catch (err) {
    console.error('Une erreur est survenue', err)
    form.showError = true
    form.errMessage = `Une erreur est survenue: ${err.message}`
  }
}

const resetInput = () => {
  form.index = 0
  form.date_releve = ''
  form.successMessage = ''
  form.showError = false
  form.quantite = 0
}

const weekNumber = () => {
  form.week = apiService.getWeekNumber(Date.now())
}

const searchIndexBySite = async () => {
  try {
    const response = await axios.get(`${apiService.getUrl()}/refueling/search/site/${form.searchSiteIndex}/${form.zoneConnected}/${form.week}`)
    sitesIndexed.value = response.data

    if (!form.searchSiteIndex) {
      await getSiteIndexed()
    }
  } catch (err) {
    console.error('Une erreur est survenue lors de la recherche par site', err)
  }
}

const findNonCommonSites = () => {
  const indexedSites = sitesIndexed.value.map(item => item.site)
  nonCommonSites.value = sites.value.filter(site => !indexedSites.includes(site.nom_site))
}

const initializeData = async () => {
  weekNumber()
  getZoneConnected()
  await searchZone()
  await getSiteIndexed()
  findNonCommonSites()
}

// Cycle de vie
onMounted(initializeData)

</script>

<template>
  <LayoutAuthenticated>
    <CardBoxModal v-model="isGraphModalActive" title="Fonctionnement">
      <div style="height: 300px; width: 100%;">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </CardBoxModal>
    <CardBoxModal v-model="isModalActive" title="Refueling">
      <div v-if="form.showError" class="text-red-500 mb-4">
        {{ form.errMessage }}
      </div>
      <p>- Zone <strong>{{ oneSite?.zone }}</strong></p>
      <p>- Site <strong>{{ oneSite?.nom_site }}</strong></p>
      <FormField label="Données refueling">
        <FormControl v-model="form.index" placeholder="Index" type="number" />
        <FormControl v-model="form.quantite" placeholder="Quantité restante" type="number" />
      </FormField>
      <FormField label="Date de relevé">
        <FormControl v-model="form.date_releve" placeholder="Date de relevé" type="date" />
      </FormField>
      <LoadingButton :button-text="'Enregistrer'" :is-loading="isLoading" @click="createIndex()" />
    </CardBoxModal>

    <SectionMain>
      <CardBox>
        <FormField label="Rechercher">
          <FormControl v-model="form.searchSite" placeholder="Entrez le nom du site" @input="search()" />
          <FormControl v-model="form.searchZone" placeholder="Entrez la zone" @input="searchZone()" />
        </FormField>
        <div class="mt-4">
          <table>
            <thead>
              <tr>
                <th>Site Id</th>
                <th>Nom Site</th>
                <th>Zone</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="site in paginatedSites" :key="site._id">
                <td>{{ site.site_id }}</td>
                <td>{{ site.nom_site }}</td>
                <td>{{ site.zone }} {{ site.typologie_energie }}</td>
                <td>
                  <BaseButton color="info" :icon="mdiPlus" small @click="addData(site._id)" />
                  <BaseButton color="success" :icon="mdiChartLine" small @click="showGraph(site._id, site.nom_site)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
          <BaseLevel>
            <BaseButtons>
              <BaseButton 
                v-for="page in sitesPagesList" 
                :key="page" 
                :active="page === currentSitesPage" 
                :label="page + 1"
                :color="page === currentSitesPage ? 'lightDark' : 'whiteDark'" 
                small 
                @click="currentSitesPage = page" 
              />
            </BaseButtons>
          </BaseLevel>
        </div>
      </CardBox>
    </SectionMain>

    <SectionMain>
      <CardBox has-table>
        <SectionMain>
          <FormField label="Rechercher">
            <FormControl v-model="form.searchSiteIndex" placeholder="Entrez le nom du site" @input="searchIndexBySite()" />
          </FormField>
        </SectionMain>
        <table>
          <thead>
            <tr>
              <th>Week</th>
              <th>Date de relevée</th>
              <th>Sites</th>
              <th>Zones</th>
              <th>Quantité restante</th>
              <th>Index</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="site in paginatedSitesIndexed" :key="site._id">
              <td>Semaine {{ site.week }}</td>
              <td>{{ site.date_releve }}</td>
              <td>{{ site.site }}</td>
              <td>{{ site.zone }}</td>
              <td>{{ site.quantite }}</td>
              <td>{{ site.site_index }}</td>
            </tr>
          </tbody>
        </table>
        <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
          <BaseLevel>
            <BaseButtons>
              <BaseButton v-for="page in pagesList" :key="page" :active="page === currentPage" :label="page + 1"
                :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="currentPage = page" />
            </BaseButtons>
          </BaseLevel>
        </div>
      </CardBox>
    </SectionMain>

    <SectionMain v-if="nonCommonSites.length > 0">
      <CardBox>
        <h3 class="font-bold mb-4">Sites non indexés</h3>
        <FormField label="Rechercher un site non indexé">
          <FormControl v-model="searchNonCommon" placeholder="Rechercher par nom, zone ou ID" />
        </FormField>
        <div class="mt-4">
          <table>
            <thead>
              <tr>
                <th>Site Id</th>
                <th>Nom Site</th>
                <th>Zone</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="site in paginatedNonCommonSites" :key="site._id">
                <td>{{ site.site_id }}</td>
                <td>{{ site.nom_site }}</td>
                <td>{{ site.zone }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
          <BaseLevel>
            <BaseButtons>
              <BaseButton 
                v-for="page in nonCommonPagesList" 
                :key="page" 
                :active="page === currentNonCommonPage" 
                :label="page + 1"
                :color="page === currentNonCommonPage ? 'lightDark' : 'whiteDark'" 
                small 
                @click="currentNonCommonPage = page" 
              />
            </BaseButtons>
          </BaseLevel>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>