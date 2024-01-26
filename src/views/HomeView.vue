<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useMainStore } from '@/stores/main'
import {
  mdiAccountMultiple,
  // mdiCartOutline,
  mdiChartTimelineVariant,
  // mdiMonitorCellphone,
  mdiReload,
  // mdiGithub,
  mdiChartPie
} from '@mdi/js'
import * as chartConfig from '@/components/Charts/chart.config.js'
import LineChart from '@/components/Charts/LineChart.vue'
import SectionMain from '@/components/SectionMain.vue'
import CardBoxWidget from '@/components/CardBoxWidget.vue'
import CardBox from '@/components/CardBox.vue'
import TableSampleClients from '@/views/sites/down/siteDown.vue'
// import NotificationBar from '@/components/NotificationBar.vue'
import BaseButton from '@/components/BaseButton.vue'
// import CardBoxTransaction from '@/components/CardBoxTransaction.vue'
// import CardBoxClient from '@/components/CardBoxClient.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import axios from 'axios'
import apiService from '@/services/apiService'
import { refreshPageOnceWithDelay } from '@/services/document'
// import SectionBannerStarOnGitHub from '@/components/SectionBannerStarOnGitHub.vue'

const chartData = ref(null)

const fillChartData = () => {
  chartData.value = chartConfig.sampleChartData()
}
const form = reactive({
  nbFait: 0,
  nbEncours: 0,
  nbSitePlannifie: 0
})

const getNbFait = () => {
  axios({
    url: apiService.getUrl() + '/plannifie/done/nb',
    method: 'GET'
  }).then((res) => {
    form.nbFait = res.data[0].nb
    console.log('Nombre fait ', res.data[0].nb)
  })
}

const getNbEncours = () => {
  axios({
    url: apiService.getUrl() + '/plannifie/encours/nb',
    method: 'GET'
  }).then((res) => {
    form.nbEncours = res.data[0].nb
    console.log('Nombre fait ', res.data[0].nb)
  })
}

const getNbSitePlannifie = () => {
  axios({
    url: apiService.getUrl() + '/plannifie/nb',
    method: 'GET'
  }).then((res) => {
    form.nbSitePlannifie = res.data[0].nb
    console.log('Nombre fait ', res.data[0].nb)
  })
}

/* const getNbDone =  () => {
  console.log('Link: ', apiService.getUrl() + '/plannifie/done/nb')
  axios({
    url: apiService.getUrl() + '/plannifie/done/nb',
    method: 'GET'
  }).then((response) => {
    form.nbFait = response.data[0].nb
  })
} */

/* const getNbEncours =  () => {
  axios({
    url: apiService.getUrl() + '/plannifie/encours/nb',
    method: 'GET'
  }).then((response) => {
    form.nbEncours = response.data[0].nb
  })
} */

onMounted(() => {
  fillChartData(),
    getNbFait(),
    getNbEncours(),
    /* getNbDone(), getNbEncours() */ refreshPageOnceWithDelay(500),
    getNbSitePlannifie()
  /* setTimeout(() => {
      location.reload()
    }, 100) */
})

// const mainStore = useMainStore()

// const clientBarItems = computed(() => mainStore.clients.slice(0, 4))

// const transactionBarItems = computed(() => mainStore.history)
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiChartTimelineVariant" title="Tableau de bord" main>
        <!--  <BaseButton
          href="https://github.com/justboil/admin-one-vue-tailwind"
          target="_blank"
          :icon="mdiGithub"
          label="Star on GitHub"
          color="contrast"
          rounded-full
          small
        /> -->
      </SectionTitleLineWithButton>

      <div class="grid grid-cols-1 gap-6 lg:grid-cols-4 mb-6">
        <CardBoxWidget
          color="text-info-500"
          :icon="mdiChartTimelineVariant"
          :number="form.nbSitePlannifie"
          label="Sites prévus"
        />
        <CardBoxWidget
          color="text-emerald-500"
          :icon="mdiChartTimelineVariant"
          :number="form.nbFait"
          label="Sites faits"
        />
        <CardBoxWidget
          color="text-warning-500"
          :icon="mdiChartTimelineVariant"
          :number="form.nbEncours"
          label="Sites en cours"
        />
        <CardBoxWidget
          color="text-red-500"
          :icon="mdiChartTimelineVariant"
          :number="form.nbEncours"
          label="Sites non faits"
        />
        <!-- <CardBoxWidget
          trend="Overflow"
          trend-type="alert"
          color="text-red-500"
          :icon="mdiChartTimelineVariant"
          :number="256"
          suffix="%"
          label="Performance"
        /> -->
      </div>

      <!-- <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div class="flex flex-col justify-between">
          <CardBoxTransaction
            v-for="(transaction, index) in transactionBarItems"
            :key="index"
            :amount="transaction.amount"
            :date="transaction.date"
            :business="transaction.business"
            :type="transaction.type"
            :name="transaction.name"
            :account="transaction.account"
          />
        </div>
        <div class="flex flex-col justify-between">
          <CardBoxClient
            v-for="client in clientBarItems"
            :key="client.id"
            :name="client.name"
            :login="client.login"
            :date="client.created"
            :progress="client.progress"
          />
        </div>
      </div> -->

      <!-- <SectionBannerStarOnGitHub class="mt-6 mb-6" /> -->

      <SectionTitleLineWithButton :icon="mdiChartPie" title="Statistiques">
        <BaseButton :icon="mdiReload" color="whiteDark" @click="fillChartData" />
      </SectionTitleLineWithButton>

      <CardBox class="mb-6">
        <!-- <div v-if="chartData">
          <line-chart :data="chartData" class="h-96" />
        </div> -->
        <div class="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
          <CardBoxWidget color="text-emerald-500" :number="form.nbFait" label="Sites faits" />
          <CardBoxWidget color="text-red-500" :number="form.nbEncours" label="Sites non faits" />
        </div>
      </CardBox>

      <!-- <SectionTitleLineWithButton :icon="mdiAccountMultiple" title="Sites Non faits" /> -->

      <!--       <NotificationBar color="info" :icon="mdiMonitorCellphone">
        <b>Responsive table.</b> Collapses on mobile
      </NotificationBar> -->

      <!-- <CardBox has-table>
        <TableSampleClients />
      </CardBox> -->
    </SectionMain>
  </LayoutAuthenticated>
</template>
