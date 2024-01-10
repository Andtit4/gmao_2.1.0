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
import siteList from '@/views/intervenant/list.vue'
import axios from 'axios'
import apiService from '@/services/apiService'
import * as XLSX from 'xlsx'

const getAllIntervenant = async () => {
  const response = await axios.get(apiService.getUrl() + '/intervenant')
  return response.data
}

const exportxlx = async () => {
  // Votre logique pour récupérer les données à exporter
  const apiData = await getAllIntervenant()

  const data = [
    ['Matricule', 'Nom', 'Prénom', 'Email', 'Zone'],
    ...apiData.map((item) => [item.matricule, item.nom, item.prenom, item.email, item.zone])
    // ... Ajoutez vos données ici
  ]

  // Créez un objet workbook
  const wb = XLSX.utils.book_new()

  // Créez une feuille avec vos données
  const ws = XLSX.utils.aoa_to_sheet(data)

  // Ajoutez la feuille au workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Feuille 1')

  // Générez le fichier Excel et téléchargez-le
  XLSX.writeFile(wb, 'intervenant.xlsx')
}
</script>

<template>
  <LayoutAuthenticated>
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
      <CardBox has-table>
        <siteList />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
