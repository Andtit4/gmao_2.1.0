<script setup>
import { onMounted, reactive, ref, computed, nextTick } from 'vue'
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
import BaseLevel from '@/components/BaseLevel.vue'
import Chart from 'chart.js/auto'
import { saveAs } from 'file-saver'

import * as XLSX from 'xlsx'
// État réactif
const form = reactive({
  searchSite: '',
  searchZone: '',
  searchZoneIndex: '',
  index: 0,
  quantite: 0,
  date_releve: '',
  errMessage: '',
  showError: false,
  showSuccess: false,
  successMessage: '',
  nbExist: 0,
  week: 0,
  siteByModal: '',
  siteIdByModal: ''
})

const sites = reactive({ list: [] })
const sitesIndexed = reactive({ list: [] })
const oneSite = reactive({ list: [] })
const onSiteForGraph = reactive({ list: []})
// const nonCommonIndex = reactive({ list: [] })

const isModalActive = ref(false)
const isLoading = ref(false)
const showErrNotification = ref(false)
const nonCommonSites = ref([])
const isGraphModalActive = ref(false)
const chartCanvas = ref(null)
const searchNonCommon = ref('')
let currentChart = null


const filteredNonCommonSites = computed(() => {
  if (!searchNonCommon.value) return nonCommonSites.value
  const searchTerm = searchNonCommon.value.toLowerCase()
  return nonCommonSites.value.filter(site =>
    site.nom_site.toLowerCase().includes(searchTerm) ||
    site.zone.toLowerCase().includes(searchTerm) ||
    site.site_id.toString().includes(searchTerm)
  )
})

// Ajoutez ces nouvelles variables réactives
const currentPage = ref(1)
const itemsPerPage = 10

// Ajoutez cette fonction calculée
const paginatedSites = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return sites.list.slice(start, end)
})

const totalPages = computed(() => Math.ceil(sites.list.length / itemsPerPage))

const displayedPages = computed(() => {
  const maxDisplayedPages = 10
  const pages = []

  if (totalPages.value <= maxDisplayedPages) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (currentPage.value > 4) {
      pages.push('...')
    }

    const start = Math.max(2, currentPage.value - 2)
    const end = Math.min(totalPages.value - 1, currentPage.value + 2)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPage.value < totalPages.value - 3) {
      pages.push('...')
    }
    pages.push(totalPages.value)
  }

  return pages
})

// Nouvelles variables réactives pour la pagination des sites non indexés
const currentPageNonCommon = ref(1)
const itemsPerPageNonCommon = 10

// Fonction calculée pour paginer les sites non indexés filtrés
const paginatedNonCommonSites = computed(() => {
  const start = (currentPageNonCommon.value - 1) * itemsPerPageNonCommon
  const end = start + itemsPerPageNonCommon
  return filteredNonCommonSites.value.slice(start, end)
})

// Calcul du nombre total de pages pour les sites non indexés
const totalPagesNonCommon = computed(() => Math.ceil(filteredNonCommonSites.value.length / itemsPerPageNonCommon))

// Calcul des pages à afficher pour la pagination
const displayedPagesNonCommon = computed(() => {
  const maxDisplayedPages = 10
  const pages = []

  if (totalPagesNonCommon.value <= maxDisplayedPages) {
    for (let i = 1; i <= totalPagesNonCommon.value; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (currentPageNonCommon.value > 4) {
      pages.push('...')
    }

    const start = Math.max(2, currentPageNonCommon.value - 2)
    const end = Math.min(totalPagesNonCommon.value - 1, currentPageNonCommon.value + 2)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPageNonCommon.value < totalPagesNonCommon.value - 3) {
      pages.push('...')
    }
    pages.push(totalPagesNonCommon.value)
  }

  return pages
})

// Nouvelles variables réactives pour la pagination des sites indexés
const currentPageIndexed = ref(1)
const itemsPerPageIndexed = 10

// Ajoutez ces nouvelles variables réactives
const searchSiteIndex = ref('')
const searchZoneIndex = ref('')

// Ajoutez cette fonction calculée
const filteredSitesIndexed = computed(() => {
  if (!searchSiteIndex.value && !searchZoneIndex.value) return sitesIndexed.list
  const searchSiteTerm = searchSiteIndex.value.toLowerCase()
  const searchZoneTerm = searchZoneIndex.value.toLowerCase()
  return sitesIndexed.list.filter(site =>
    (searchSiteTerm ? site.site.toLowerCase().includes(searchSiteTerm) : true) &&
    (searchZoneTerm ? site.zone.toLowerCase().includes(searchZoneTerm) : true)
  )
})

// Modifiez la fonction paginatedSitesIndexed pour utiliser filteredSitesIndexed
const paginatedSitesIndexed = computed(() => {
  const start = (currentPageIndexed.value - 1) * itemsPerPageIndexed
  const end = start + itemsPerPageIndexed
  return filteredSitesIndexed.value.slice(start, end)
})

// Modifiez totalPagesIndexed pour utiliser filteredSitesIndexed
const totalPagesIndexed = computed(() => Math.ceil(filteredSitesIndexed.value.length / itemsPerPageIndexed))

// Calcul des pages à afficher pour la pagination
const displayedPagesIndexed = computed(() => {
  const maxDisplayedPages = 10
  const pages = []

  if (totalPagesIndexed.value <= maxDisplayedPages) {
    for (let i = 1; i <= totalPagesIndexed.value; i++) {
      pages.push(i)
    }
  } else {
    pages.push(1)
    if (currentPageIndexed.value > 4) {
      pages.push('...')
    }

    const start = Math.max(2, currentPageIndexed.value - 2)
    const end = Math.min(totalPagesIndexed.value - 1, currentPageIndexed.value + 2)

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (currentPageIndexed.value < totalPagesIndexed.value - 3) {
      pages.push('...')
    }
    pages.push(totalPagesIndexed.value)
  }

  return pages
})

// Fonctions API
const fetchSites = async (url) => {
  try {
    const response = await axios.get(url)
    sites.list = response.data
  } catch (error) {
    console.error('Une erreur est survenue:', error)
  }
}

const showGraph = async (siteId, nomSite) => {
  isGraphModalActive.value = true
  form.siteIdByModal = siteId
  form.siteByModal = nomSite

  await getSiteIndexedByName(nomSite)

  // Trier les données par date
  const sortedData = onSiteForGraph.list.sort((a, b) => new Date(a.date_releve) - new Date(b.date_releve))

  const formatDate = (date) => {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  // Calculer les différences d'index deux à deux
  const differences = []
  const labels = []

  for (let i = 0; i < sortedData.length - 1; i++) {
    const difference = sortedData[i + 1].site_index - sortedData[i].site_index
    differences.push(difference)

    // Créer le label pour cette paire
    const startDate = new Date(sortedData[i].date_releve)
    const endDate = new Date(sortedData[i + 1].date_releve)
    const label = `${formatDate(startDate)} - ${formatDate(endDate)}`
    labels.push(label)
  }

  await nextTick()

  if (chartCanvas.value) {
    if (currentChart) {
      currentChart.destroy()
    }

    currentChart = new Chart(chartCanvas.value, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: `Temps d'activité GE - ${nomSite} (ID: ${siteId})`,
          data: differences,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgb(75, 192, 192)',
          borderWidth: 1
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
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y + ' h';
                }
                return label;
              },
              afterLabel: function(context) {
                const index = context.dataIndex;
                const startDate = new Date(sortedData[index].date_releve);
                const endDate = new Date(sortedData[index + 1].date_releve);
                const diffTime = Math.abs(endDate - startDate);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return `Nombre de jours : ${diffDays}`;
              }
            }
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Date'
            }
          },
          y: {
            title: {
              display: true,
              text: 'Heure de fonctionnement'
            },
            beginAtZero: true
          }
        }
      }
    })
  }
}

const search = () => fetchSites(`${apiService.getUrl()}/site/search/dyn?nom_site=${form.searchSite.toUpperCase()}`)
const searchZone = () => fetchSites(`${apiService.getUrl()}/site/zone/search/dyn?zone=${form.searchZone.toUpperCase()}`)
const getAllSite = () => fetchSites(`${apiService.getUrl()}/site`)

const getSiteIndexed = async () => {
  try {
    const response = await axios.get(`${apiService.getUrl()}/refueling/week/${form.week}`)
    sitesIndexed.list = response.data
  } catch (error) {
    console.error('Une erreur est survenue:', error)
  }
}

const getSiteIndexedByName = async (site)  => {
  try {
    const response = await axios.get(`${apiService.getUrl()}/refueling/search?site=${site}`)
    onSiteForGraph.list = response.data
  } catch (error) {
    console.error('Une erreur est survenue: ', error)
  }
}

const addData = async (id) => {
  isModalActive.value = true
  try {
    const response = await axios.get(`${apiService.getUrl()}/site/${id}`)
    oneSite.list = response.data[0]
  } catch (error) {
    console.error('Une erreur est survenue:', error)
  }
}

const getAllSiteIndex = async () => {
  const response = await axios.get(`${apiService.getUrl()}/refueling/index`)
  return response.data
}

const exportxlx = async () => {
  const apiData = await getAllSiteIndex()
  
  // Trier les données par site et date
  apiData.sort((a, b) => {
    if (a.site !== b.site) return a.site.localeCompare(b.site)
    return new Date(a.date_releve) - new Date(b.date_releve)
  })

  const data = [
    ["SITE ID", "SITE", "DATE DE RELEVE 1", "DATE DE RELEVE 2", "NOMBRE DE JOURS", "INDEX 1", "INDEX 2", "DIFFERENCE D'INDEX (HEURES)", "SEMAINE", "ZONE", "QUANTITE RESTANTE"],
  ]

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  for (let i = 0; i < apiData.length - 1; i++) {
    if (apiData[i].site === apiData[i + 1].site) {
      const date1 = new Date(apiData[i].date_releve)
      const date2 = new Date(apiData[i + 1].date_releve)
      const diffDays = Math.ceil((date2 - date1) / (1000 * 60 * 60 * 24))
      const diffIndex = apiData[i + 1].site_index - apiData[i].site_index

      data.push([
        apiData[i].site_id, // Ajout de l'ID du site
        apiData[i].site,
        formatDate(apiData[i].date_releve),
        formatDate(apiData[i + 1].date_releve),
        diffDays,
        apiData[i].site_index,
        apiData[i + 1].site_index,
        diffIndex,
        apiData[i].week,
        apiData[i].zone,
        apiData[i].quantite
      ])
    }
  }

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(data)

  // Styliser l'en-tête
  const headerRange = XLSX.utils.decode_range(ws['!ref'])
  for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
    const address = XLSX.utils.encode_col(C) + "1"
    if (!ws[address]) continue
    ws[address].s = {
      font: { bold: true, color: { rgb: "FFFFFF" } },
      fill: { patternType: "solid", fgColor: { rgb: "4F81BD" } },
      alignment: { horizontal: "center", vertical: "center" }
    }
  }

  // Ajuster la largeur des colonnes
  const colWidths = [10, 20, 15, 15, 15, 10, 10, 25, 10, 15, 20]
  ws['!cols'] = colWidths.map(w => ({ wch: w }))

  // Appliquer les styles
  ws['!rows'] = [{ hpt: 30 }] // Hauteur de la première ligne

  XLSX.utils.book_append_sheet(wb, ws, 'Feuille 1')

  // Générer le fichier Excel
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })

  // Créer un Blob à partir du fichier
  const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

  // Utiliser file-saver pour télécharger le fichier
  saveAs(blob, `REFUELING_INDEX_DETAILS_W${form.week}.xlsx`)
}

const createIndex = async () => {
  isLoading.value = true
  if (form.index === "" || form.index === " ") {
    form.showError = true
    isLoading.value = false
    form.errMessage = 'Index entré est vide'
    return
  }

  try {
    const existResponse = await axios.get(`${apiService.getUrl()}/refueling/exist/${oneSite.list.nom_site}/${form.week}`)
    form.nbExist = existResponse.data[0].nb

    if (form.nbExist == 0) {
      const createResponse = await axios.post(`${apiService.getUrl()}/refueling`, {
        site: oneSite.list.nom_site,
        site_index: form.index,
        date_releve: form.date_releve,
        date_create: Date.now(),
        quantite: form.quantite,
        week: form.week,
        zone: oneSite.list.zone
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
  } catch (error) {
    console.error('Une erreur est survenue:', error)
    form.showError = true
    form.errMessage = `Une erreur est survenue: ${error.message}`
  }
}

const resetInput = () => {
  form.index = ''
  form.date_releve = ''
  form.successMessage = false
  showErrNotification.value = false
  form.quantite = ''
}

const weekNumber = () => {
  form.week = apiService.getWeekNumber(Date.now())
}

const findNonCommonSites = () => {
  const indexedSites = sitesIndexed.list.map(item => item.site)
  nonCommonSites.value = sites.list.filter(site => !indexedSites.includes(site.nom_site))
}

const nonCommonItem = async () => {
  await getAllSite()
  await getSiteIndexed()
  findNonCommonSites()
  // console.log('Les sites non indexés:', nonCommonSites.value)
}

// Fonction d'initialisation
const initializeData = async () => {
  weekNumber()
  await Promise.all([getAllSite(), getSiteIndexed()])
  await nonCommonItem()
}

onMounted(initializeData)

</script>

<template>
  <LayoutAuthenticated>
    <CardBoxModal v-model="isGraphModalActive" title="Fonctionnement" >
      <div style="height: 300px; ">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </CardBoxModal>
    <CardBoxModal v-model="isModalActive" title="Refueling">
      <div v-if="form.showError" style="color: red;">
        <p>{{ form.errMessage }}</p>
      </div>
      <p>- Zone <strong>{{ oneSite.list.zone }}</strong></p>
      <p>- Site <strong>{{ oneSite.list.nom_site }}</strong></p>
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
      <BaseButton target="_blank" :icon="mdiPlus" label="Export" color="success" rounded-full small
        @click="exportxlx()" />
      <CardBox>
        <FormField label="Rechercher">
          <FormControl v-model="form.searchSite" placeholder="Entrez le nom du site" @input="search()" />
          <FormControl v-model="form.searchZone" placeholder="Entrez la zone" @input="searchZone()" />
        </FormField>
        <br />
        <table>
          <thead>
            <tr>
              <th>Site Id</th>
              <th>Nom Site</th>
              <th>Zone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(site, index) in paginatedSites" :key="index">
              <td data-label="Site Id">{{ site.site_id }}</td>
              <td data-label="Nom site">{{ site.nom_site }}</td>
              <td data-label="Zone">{{ site.zone }} {{ site.typologie_energie }}</td>
              <td class="before:hidden lg:w-1 whitespace-nowrap">
                <BaseButton color="" :icon="mdiPlus" small @click="addData(site._id)" />
                <BaseButton color="success" :icon="mdiChartLine" small
                  @click="showGraph(site.site_id, site.nom_site)" />

              </td>
            </tr>
          </tbody>
        </table>
        <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
          <BaseLevel>
            <BaseButtons>
              <BaseButton v-for="page in displayedPages" :key="page" :active="page === currentPage"
                :label="page === '...' ? page : page.toString()"
                :color="page === currentPage ? 'lightDark' : 'whiteDark'" small
                @click="page !== '...' ? currentPage = page : null" :disabled="page === '...'" />
            </BaseButtons>
          </BaseLevel>
        </div>
      </CardBox>
    </SectionMain>

    <SectionMain>
      <CardBox has-table>
        <SectionMain>
          <FormField label="Rechercher">
            <FormControl v-model="searchSiteIndex" placeholder="Entrez le nom du site" />
            <FormControl v-model="searchZoneIndex" placeholder="Entrez la zone" />
          </FormField>
        </SectionMain>
        <div>
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
              <tr v-for="(site, index) in paginatedSitesIndexed" :key="index">
                <td data-label="Week">Semaine {{ site.week }}</td>
                <td data-label="Date relevée">{{ site.date_releve }}</td>
                <td data-label="Site">{{ site.site }}</td>
                <td data-label="Zone">{{ site.zone }}</td>
                <td data-label="Quantité restante">{{ site.quantite }}</td>
                <td data-label="Index">{{ site.site_index }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
          <BaseLevel>
            <BaseButtons>
              <BaseButton v-for="page in displayedPagesIndexed" :key="page" :active="page === currentPageIndexed"
                :label="page === '...' ? page : page.toString()"
                :color="page === currentPageIndexed ? 'lightDark' : 'whiteDark'" small
                @click="page !== '...' ? currentPageIndexed = page : null" :disabled="page === '...'" />
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
              <BaseButton v-for="page in displayedPagesNonCommon" :key="page" :active="page === currentPageNonCommon"
                :label="page === '...' ? page : page.toString()"
                :color="page === currentPageNonCommon ? 'lightDark' : 'whiteDark'" small
                @click="page !== '...' ? currentPageNonCommon = page : null" :disabled="page === '...'" />
            </BaseButtons>
          </BaseLevel>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>