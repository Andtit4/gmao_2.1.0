<script setup>
import { onMounted, reactive, ref } from 'vue'
import { mdiPlus } from '@mdi/js'
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
  week: 0
})

const sites = reactive({ list: [] })
const sitesIndexed = reactive({ list: [] })
const oneSite = reactive({ list: [] })
// const nonCommonIndex = reactive({ list: [] })

const isModalActive = ref(false)
const isLoading = ref(false)
const showErrNotification = ref(false)
const nonCommonSites = ref([])


// Fonctions API
const fetchSites = async (url) => {
  try {
    const response = await axios.get(url)
    sites.list = response.data
  } catch (error) {
    console.error('Une erreur est survenue:', error)
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
  const data = [
    ["Semaine", "Date de relevé", "Zone", "Site", "Quantité restante", "Index"],
    ...apiData.map((item) => [
      item.week,
      item.date_releve,
      item.zone,
      item.site,
      item.quantite,
      item.site_index
    ])
  ]

  const wb = XLSX.utils.book_new()
  const ws = XLSX.utils.aoa_to_sheet(data)
  XLSX.utils.book_append_sheet(wb, ws, 'Feuille 1')
  XLSX.writeFile(wb, `REFUELING_INDEX_W${form.week}.xlsx`)
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

const searchIndexByZone = async () => {
  try {
    const response = await axios.get(`${apiService.getUrl()}/refueling/search/zone/${form.searchZoneIndex}`)
    sitesIndexed.list = response.data
  } catch (error) {
    console.error('Une erreur est survenue:', error)
  }
}
const findNonCommonSites = () => {
  const indexedSites = sitesIndexed.list.map(item => item.site)
  nonCommonSites.value = sites.list.filter(site => !indexedSites.includes(site.nom_site))
}

const nonCommonItem = async () => {
  await getAllSite()
  await getSiteIndexed()
  findNonCommonSites()
  console.log('Les sites non indexés:', nonCommonSites.value)
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
        <div class="max-h-[32rem] overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Site Id</th>
                <th>Nom Site</th>
                <th>Zone</th>
                <th>Etat</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(site, index) in sites.list" :key="index">
                <td data-label="Site Id">{{ site.site_id }}</td>
                <td data-label="Nom site">{{ site.nom_site }}</td>
                <td data-label="Zone">{{ site.zone }} {{ site.typologie_energie }}</td>
                <td data-label="Etat"></td>
                <td class="before:hidden lg:w-1 whitespace-nowrap">
                  <BaseButton color="" :icon="mdiPlus" small @click="addData(site._id)" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBox>
    </SectionMain>

    <SectionMain>
      <CardBox has-table>
        <SectionMain>
          <FormField label="Rechercher">
            <FormControl placeholder="Entrez le nom du site" />
            <FormControl v-model="form.searchZoneIndex" placeholder="Entrez la zone" @input="searchIndexByZone()" />
          </FormField>
        </SectionMain>
        <div class="max-h-[32rem] overflow-x-auto">
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
              <tr v-for="(site, index) in sitesIndexed.list" :key="index">
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
      </CardBox>
    </SectionMain>

    <SectionMain v-if="nonCommonSites.length > 0">
      <CardBox>
        <h3 class="font-bold mb-4">Sites non indexés</h3>
        <div class="max-h-[32rem] overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th>Site Id</th>
                <th>Nom Site</th>
                <th>Zone</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="site in nonCommonSites" :key="site._id">
                <td>{{ site.site_id }}</td>
                <td>{{ site.nom_site }}</td>
                <td>{{ site.zone }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>