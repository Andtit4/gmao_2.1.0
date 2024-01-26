<script setup>
import { mdiMonitorCellphone, mdiTableBorder, mdiTableOff, mdiGithub, mdiAccount } from '@mdi/js'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import { onMounted, reactive } from 'vue'
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import TableSampleClients from '@/components/TableSampleClients.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
import siteList from '@/views/sites/siteList.vue'
import axios from 'axios'
import apiService from '@/services/apiService'
import * as XLSX from 'xlsx'

const getAllsite = async () => {
  const response = await axios.get(apiService.getUrl() + '/site')
  return response.data
}
const form = reactive({
  nbAllSite: 0,
})

const exportxlx = async () => {
  // Votre logique pour récupérer les données à exporter
  const apiData = await getAllsite()

  const data = [
    [
      'Site Id',
      'Nom Site',
      'Longitude',
      'Latitude',
      'Zone',
      'Config du Site',
      'Technologie',
      'Nombre de dépendance',
      'Classe',
      'Typologie Energie',
      'GE',
      'Type de batterie',
      'Nombre',
      'Puissance batterie'
    ],
    ...apiData.map((item) => [
      item.site_id,
      item.nom_site,
      item.longitude,
      item.latitude,
      item.zone,
      item.config_du_site,
      item.technologie,
      item.nombre_de_dependance,
      item.classe_technique,
      item.typologie_energie,
      item.ge,
      item.type_batterie,
      item.nombre,
      item.puissance_batteries
    ])
    // ... Ajoutez vos données ici
  ]

  // Créez un objet workbook
  const wb = XLSX.utils.book_new()

  // Créez une feuille avec vos données
  const ws = XLSX.utils.aoa_to_sheet(data)

  // Ajoutez la feuille au workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Feuille 1')

  // Générez le fichier Excel et téléchargez-le
  XLSX.writeFile(wb, 'site.xlsx')
}

const countAllSite = () => {
  axios({
    url: apiService.getUrl() + '/site/all/nb',
    method: 'GET'
  }).then((res) => {
    form.nbAllSite = res.data[0].nb
    console.log('Sites   ',form.nbAllSite )

  })
}

onMounted(() => {
  countAllSite()
})
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      {{ form.nbAllSite }} Sites
      <BaseButton
        target="_blank"
        :icon="midExcel"
        label="Export"
        color="success"
        rounded-full
        small
        @click="exportxlx()"
      />
      <br />
      <CardBox has-table>
        <siteList />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
