<script setup>
import {  onMounted, reactive, ref } from 'vue'
import { mdiPlus,  } from '@mdi/js'
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
  week: 0
})
const sites = reactive({ list: [] })
const isModalActive = ref(false)
const isLoading = ref(false)
const showErrNotification = ref(false)

const search = () => {
  axios({
    url: apiService.getUrl() + '/site/search/dyn?nom_site=' + form.searchSite.toUpperCase(),
    method: 'GET'
  })
    .then((response) => {
      sites.list = response.data
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}

const searchZone = () => {
  axios({
    url: apiService.getUrl() + '/site/zone/search/dyn?zone=' + form.searchZone.toUpperCase(),
    method: 'GET'
  })
    .then((response) => {
      sites.list = response.data
    })
    .catch((e) => {
      console.log('An  ' + e)
    })
}

const getAllSite = () => {
  axios({
    url: apiService.getUrl() + '/site',
    method: 'GET'
  })
    .then((response) => {
      sites.list = response.data
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}

const sitesIndexed = reactive({ list: [] })

const getSiteIndexed = () => {
  axios({
    url: apiService.getUrl() + '/refueling/week/' + form.week,
    method: 'GET'
  })
    .then((response) => {
      sitesIndexed.list = response.data
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}

// const getSiteIndexed = () => { }

const oneSite = reactive({ list: [] })
const addData = (id) => {
  isModalActive.value = true
  axios({
    url: apiService.getUrl() + '/site/' + id,
    method: 'GET'
  }).then((res) => {
    // console.log('site selected: ', res.data)
    oneSite.list = res.data[0]
  })
}

const getAllSiteIndex = async () => {
  const response = await axios.get(apiService.getUrl() + '/refueling/index')
  return response.data
}

const exportxlx =  async () => {
  const apiData = await getAllSiteIndex()
  const data = [
    [
      "Semaine",
      "Date de relevé",
      "Zone",
      "Site",
      "Quantité restante",
      "Index"
    ],
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

  // Créez une feuille avec vos données
  const ws = XLSX.utils.aoa_to_sheet(data)

  // Ajoutez la feuille au workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Feuille 1')

  // Générez le fichier Excel et téléchargez-le
  XLSX.writeFile(wb, `REFUELING_INDEX_W${form.week}.xlsx`)
}


const createIndex = () => {
  isLoading.value = true
  axios({
    url: apiService.getUrl() + '/refueling/exist/' + oneSite.list.nom_site,
    method: 'GET',

  }).then((res) => {
    form.nbExist = res.data[0].nb
    console.log('exist ', form.nbExist)

    if (form.nbExist == 0) {
      axios({
        url: apiService.getUrl() + '/refueling',
        method: 'POST',
        data: {
          site: oneSite.list.nom_site,
          site_index: form.index,
          date_releve: form.date_releve,
          date_create: Date.now(),
          quantite: form.quantite,
          week: form.week,
          zone: oneSite.list.zone
        }
      }).then((res) => {
        isLoading.value = false
        isModalActive.value = false
        form.showSuccess = true
        form.successMessage = res.data
        resetInput()
        getSiteIndexed()
      }).catch((err) => {
        console.log('An error occured ', err.message)
        form.showError = true,
          form.errMessage = 'An error occured ' + err.message
      })
    } else {
      form.showError = true
      isLoading.value = false
      form.errMessage = 'Index déjà enregistré pour ce site'
    }
  })
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
  // console.log(form.week)
}

onMounted(() => {
  weekNumber()
  getAllSite()
  getSiteIndexed()
})

</script>

<template>
  <LayoutAuthenticated>
    <CardBoxModal v-model="isModalActive" title="Refueling">
      <div v-if="form.showError == true">
        <p style="color: red;"> {{ form.errMessage }} </p>
      </div>
      <p>- Zone <strong>{{ oneSite.list.zone }}</strong> </p>
      <p>- Site <strong>{{ oneSite.list.nom_site }}</strong></p>
      <FormField label="Données refueling">
        <FormControl v-model="form.index" placeholder="Index" type="number" />
        <FormControl v-model="form.quantite" placeholder="Quantité restante" type="number" />
      </FormField>
      <FormField label="Date de relevé">
        <FormControl v-model="form.date_releve" placeholder="Date de relevé" type="date" />
      </FormField>
      <LoadingButton :button-text="'Enregister'" :is-loading="isLoading" @click="createIndex()" />
    </CardBoxModal>
    <SectionMain>
    <BaseButton
        target="_blank"
        :icon="midExcel"
        label="Export"
        color="success"
        rounded-full
        small
        @click="exportxlx()"
      />
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
                <th v-if="checkable" />
                <th />
                <th>Site Id</th>
                <th>Nom Site</th>
                <th>Zone</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="(site, index) in sites.list" :key="index">
                <TableCheckboxCell v-if="checkable" @checked="checked($event, site)" />
                <td class="border-b-0 lg:w-6 before:hidden">
                  <!-- <UserAvatar :username="site.nom_site" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" /> -->
                </td>
                <td data-label="Site Id">
                  {{ site.site_id }}
                </td>
                <td data-label="Nom site">
                  {{ site.nom_site }}
                </td>
                <td data-label="Zone">
                  {{ site.zone }} {{ site.typologie_energie }}
                </td>
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
            <FormControl placeholder="Entrez la zone" />
          </FormField>
        </SectionMain>
        <table>
          <thead>
            <tr>
              <th v-if="checkable" />
              <th />
              <th>Week</th>
              <th>Date de relevée</th>
              <th>Sites</th>
              <th>Zones</th>
              <th>Quantité restante</th>
              <th>Index</th>
              <th />
            </tr>
          </thead>
          <tbody>
            <tr v-for="(site, index) in sitesIndexed.list" :key="index">
              <TableCheckboxCell v-if="checkable" @checked="checked($event, site)" />
              <td class="border-b-0 lg:w-6 before:hidden">
                <!-- <UserAvatar :username="site.nom" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" /> -->
              </td>
              <td data-label="Week">
                 Semaine {{ site.week }}
                </td>
              <td data-label="Date relevée">
                {{ site.date_releve  }}
              </td>
              <td data-label="Site">
                {{ site.site }}
              </td>
              <td data-label="Zone">
                {{ site.zone }}
              </td>
              <td data-label="Quantité restante">
                {{ site.quantite }}
              </td>
              <td data-label="Index">
                {{ site.site_index }}
              </td>
              <td class="before:hidden lg:w-1 whitespace-nowrap">
                <BaseButtons type="justify-start lg:justify-end" no-wrap>
                </BaseButtons>
              </td>
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
  </LayoutAuthenticated>
</template>
