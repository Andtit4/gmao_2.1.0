<script setup>
import { ref, onMounted, reactive } from 'vue'
import { mdiChartTimelineVariant, mdiReload, mdiChartPie, mdiFileExcel } from '@mdi/js'
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
import TogoMap from '@/layouts/TogoMapComponent.vue'
import * as XLSX from 'xlsx'

const chartData = ref(null)

const initDate = () => {
  const result = getStartAndEndOfWeek()
  form.formattedStartOfWeek = result.dateDebut
  form.formattedEndOfWeek = result.dateFin
}

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData()
}
const form = reactive({
  nbFait: 0,
  nbTotalFait: 0,
  nbEncours: 0,
  nbSitePlannifie: 0,
  nbSiteNonFait: 0,
  nbSiteTotalNonFait: 0,
  nbAllSite: 0,
  sitesRestants: '',
  progession: '',
  
  formattedEndOfWeek: '',
  formattedStartOfWeek: ''
})

const countAllSite = () => {
  axios({
    url: apiService.getUrl() + '/site/all/nb',
    method: 'GET'
  }).then(async (res) => {
    form.nbAllSite = res.data[0].nb
    axios({
      url: apiService.getUrl() + '/plannifie/done/nb',
      method: 'GET',
      headers: {
        'Access-Control-Allow-Origin': '*'
      }
    }).then(async (res) => {
      form.nbTotalFait = await res.data[0].nb
      form.sitesRestants = parseInt(form.nbAllSite - form.nbTotalFait)
      form.progession = Math.ceil(parseFloat(parseInt(form.nbTotalFait) * 100 / parseInt(form.nbAllSite)))
      // form.progession = `${Math.ceil(parseFloat(parseInt(form.nbTotalFait) * 100 / parseInt(form.nbAllSite)))} %`

      console.log('Sites restants   ', form.sitesRestants)
    })
  })
}

const getNbFait = async () => {
  axios({
    url: apiService.getUrl() + '/plannifie/done/nb',
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }).then(async (res) => {
    form.nbTotalFait = await res.data[0].nb
  })
}

const getNbNonFait = async () => {
  axios({
    url: apiService.getUrl() + '/plannifie/nonfait/nb',
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }).then(async (res) => {
    form.nbSiteTotalNonFait = await res.data[0].nb
  })
}

const getNbFaitSemaine = async () => {
  axios({
    url:
      apiService.getUrl() +
      '/plannifie/done/week/nb/' +
      form.formattedStartOfWeek +
      '/' +
      form.formattedEndOfWeek,
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }).then(async (res) => {
    form.nbFait = await res.data[0].nb
  })
}

const getNbEncours = async () => {
  axios({
    url: apiService.getUrl() + '/plannifie/encours/week/nb/' +
      form.formattedStartOfWeek +
      '/' +
      form.formattedEndOfWeek,
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }).then(async (res) => {
    form.nbEncours = await res.data[0].nb
  })
}

const getNbSitePlannifie = async () => {
  axios({
    url:
      apiService.getUrl() +
      '/plannifie/week/nb/' +
      form.formattedStartOfWeek +
      '/' +
      form.formattedEndOfWeek,
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
    .then(async (res) => {
      form.nbSitePlannifie = await res.data[0].nb
      console.log('Site prévus à la semaine: ', form.nbSitePlannifie)
    })
    .catch((err) => {
      console.log('Erreur sites prévus à la semaine: ', err.message)
    })
}

const sitesWeeklyPlan = reactive({ list: [] })

const getSiteWeeklyPlan = async () => {
  axios({
    url:
      apiService.getUrl() +
      '/plannifie/week/' +
      form.formattedStartOfWeek +
      '/' +
      form.formattedEndOfWeek,
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
    .then(async (res) => {
      sitesWeeklyPlan.list = res.data
      // console.log('Site prévus à la semaine: ', form.nbSitePlannifie)

    })
    .catch((err) => {
      console.log('Erreur sites prévus à la semaine: ', err.message)
    })
}

const getSiteWeeklyPlanForXlx = async (zone) => {
  const response = await axios.get(apiService.getUrl() +
    '/plannifie/week/' +
    form.formattedStartOfWeek +
    '/' +
    form.formattedEndOfWeek,)
  return response.data
}

const getNbSiteNonfait = async () => {
  axios({
    url:
      apiService.getUrl() +
      '/plannifie/nonfait/week/nb/' +
      form.formattedStartOfWeek +
      '/' +
      form.formattedEndOfWeek,
    method: 'GET',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  }).then(async (res) => {
    form.nbSiteNonFait = await res.data[0].nb
  })
}

const exportxlx = async () => {
  console.log('Export init')
  const apiData = await getSiteWeeklyPlanForXlx();
  const data = [
    [
      'EQUIPE',
      'SITE ID',
      'SITE',
      'SEMAINE',
      'STATUT',
    ],
    ...apiData.map((item) => [
      item.zone,
      item.site_id,
      item.site,
      `SEMAINE DU ${item.date_debut ? new Date(item.date_debut).toISOString().split('T')[0] : ''} AU ${item.date_fin ? new Date(item.date_fin).toISOString().split('T')[0] : ''}`,
      item.date_attente == '' ? 'NON FAIT' : item.date_prise_en_compte == '' ? 'NON PRIS EN COMPTE' : 'FAIT'
    ])
  ]
  // Créez un objet workbook
  const wb = XLSX.utils.book_new()

  // Créez une feuille avec vos données
  const ws = XLSX.utils.aoa_to_sheet(data)

  // Ajoutez la feuille au workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Feuille 1')

  // Générez le fichier Excel et téléchargez-le
  XLSX.writeFile(wb, 'PLANNIFICATION DE LA SEMAINE.xlsx')
}

onMounted(() => {
  initDate(),
    fillChartData(),
    // getNbFait(),
    getNbEncours(),
    refreshPageOnceWithDelay(500),
    getNbSitePlannifie(),
    getNbSiteNonfait(),
    getNbNonFait(),
    getNbFaitSemaine(),
    getSiteWeeklyPlan(),
    countAllSite()
})
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiChartTimelineVariant" title="Tableau de bord" main>
        <BaseButton :icon="mdiFileExcel" color="success" label="Export" @click="exportxlx()" />
      </SectionTitleLineWithButton>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-4 mb-6">
        <CardBoxWidget color="text-info-500" :icon="mdiChartTimelineVariant" :number="form.nbSitePlannifie"
          label="Sites prévus" />
        <CardBoxWidget color="text-emerald-500" :icon="mdiChartTimelineVariant" :number="form.nbFait"
          label="Sites faits" />
        <CardBoxWidget color="text-warning-500" :icon="mdiChartTimelineVariant" :number="form.nbEncours"
          label="Sites en cours" />
        <CardBoxWidget color="text-red-500" :icon="mdiChartTimelineVariant" :number="form.nbSiteNonFait"
          label="Sites non faits" />
      </div>

      <SectionTitleLineWithButton :icon="mdiChartPie" title="Statistiques">
        <BaseButton :icon="mdiReload" color="whiteDark" @click="fillChartData" />
      </SectionTitleLineWithButton>

      <CardBox class="mb-6">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-4 mb-6">
          <CardBoxWidget color="text-emerald-500" :number="form.nbTotalFait" label="Sites faits" />
          <CardBoxWidget color="text-red-500" :number="form.nbSiteTotalNonFait" label="Plannifiés non faits" />
          <CardBoxWidget color="text-red-500" :number="form.sitesRestants" label="Sites Restants" />
          <CardBoxWidget color="text-red-500" :number="form.progession" suffix='%' label="Progression" />
        </div>
      </CardBox>
      <CardBox class="mb-6">
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
          <TogoMap></TogoMap>
        </div>
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
