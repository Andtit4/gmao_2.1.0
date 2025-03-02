<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { mdiFileExcel } from '@mdi/js'
// import FormField from '@/components/FormField.vue'
// import FormControl from '@/components/FormControl.vue'
// import { onMounted, reactive } from 'vue'
import SectionMain from '@/components/SectionMain.vue'
// import NotificationBar from '@/components/NotificationBar.vue'
// import TableSampleClients from '@/components/TableSampleClients.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import BaseButton from '@/components/BaseButton.vue'
import PlannifieList from '@/views/preventive/plannifie/plannifieList.vue'
import axios from 'axios'
import apiService from '@/services/apiService'
import * as XLSX from 'xlsx'
import Cookies from 'js-cookie'
import ListPlannificationEnAttente from '@/views/chef_equipe/list/ListPlannificationEnAttente.vue'

let type = Cookies.get('type')

// Fait
const getAllsite = async () => {
  const response = await axios.get(apiService.getUrl() + '/plannifie/all/done')
  return response.data
}
// Fait
const getAllPlannif = async () => {
  const response = await axios.get(apiService.getUrl() + '/plannifie/all')
  return response.data
}

const getEncoursPlannif = async () => {
  const response = await axios.get(apiService.getUrl() + '/plannifie/encours')
  return response.data
}

const exportxlx = async () => {
  // Votre logique pour récupérer les données à exporter
  const apiData = await getAllsite()

  const data = [
    [
      {
        v: 'NUMERO DE TICKET',
        s: { fill: { fgColor: { rgb: '000080' } }, font: { color: { rgb: 'FFFFFF' } } }
      },
      {
        v: 'ZONE',
        s: { fill: { fgColor: { rgb: '000080' } }, font: { color: { rgb: 'FFFFFF' } } }
      },
      {
        v: 'SITE',
        s: { fill: { fgColor: { rgb: '000080' } }, font: { color: { rgb: 'FFFFFF' } } }
      },
      {
        v: 'DATE EN REALISATION',
        s: { fill: { fgColor: { rgb: '000080' } }, font: { color: { rgb: 'FFFFFF' } } }
      },
      {
        v: 'DATE DE PRISE EN COMPTE',
        s: { fill: { fgColor: { rgb: '000080' } }, font: { color: { rgb: 'FFFFFF' } } }
      },
      'SEMAINE',
      'STATUT'
    ],
    ...apiData.map((item) => [
      item.numero_ticket,
      item.zone,
      item.site,
      item.date_attente,
      item.date_prise_en_compte,
      `SEMAINE DU ${item.date_debut ? new Date(item.date_debut).toISOString().split('T')[0] : ''} AU ${item.date_fin ? new Date(item.date_fin).toISOString().split('T')[0] : ''}` ,
      item.date_attente == '' ? 'NON FAIT' : item.date_prise_en_compte == '' ? 'NON PRIS EN COMPTE' : 'FAIT'
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
  XLSX.writeFile(wb, 'PLANNIFICATION.xlsx')
}

const exportAll = async () => {
  // Votre logique pour récupérer les données à exporter
  const apiData = await getAllPlannif()

  const data = [
    [
      {
        v: 'NUMERO DE TICKET',
        s: { fill: { fgColor: { rgb: '000080' } }, font: { color: { rgb: 'FFFFFF' } } }
      },
      {
        v: 'ZONE',
        s: { fill: { fgColor: { rgb: '000080' } }, font: { color: { rgb: 'FFFFFF' } } }
      },
      {
        v: 'SITE',
        s: { fill: { fgColor: { rgb: '000080' } }, font: { color: { rgb: 'FFFFFF' } } }
      },
      {
        v: 'DATE EN ATTENTE',
        s: { fill: { fgColor: { rgb: '000080' } }, font: { color: { rgb: 'FFFFFF' } } }
      },
      {
        v: 'DATE DE PRISE EN COMPTE',
        s: { fill: { fgColor: { rgb: '000080' } }, font: { color: { rgb: 'FFFFFF' } } }
      },
      'SEMAINE',
      'STATUT'
    ],
    ...apiData.map((item) => [
      item.numero_ticket,
      item.zone,
      item.site,
      item.date_attente,
      item.date_prise_en_compte,
      `SEMAINE DU ${item.date_debut ? new Date(item.date_debut).toISOString().split('T')[0] : ''} AU ${item.date_fin ? new Date(item.date_fin).toISOString().split('T')[0] : ''}` ,
      item.date_attente == '' ? 'NON FAIT' : item.date_prise_en_compte == '' ? 'NON PRIS EN COMPTE' : 'FAIT'
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
  XLSX.writeFile(wb, 'PLANNIFICATION.xlsx')
}

const exportEncours = async () => {
  // Votre logique pour récupérer les données à exporter
  const apiData = await getEncoursPlannif()

  const data = [
    [
      {
        v: 'NUMERO DE TICKET',
        s: { fill: { fgColor: { rgb: '000080' } }, font: { color: { rgb: 'FFFFFF' } } }
      },
      {
        v: 'ZONE',
        s: { fill: { fgColor: { rgb: '000080' } }, font: { color: { rgb: 'FFFFFF' } } }
      },
      {
        v: 'SITE',
        s: { fill: { fgColor: { rgb: '000080' } }, font: { color: { rgb: 'FFFFFF' } } }
      },
      {
        v: 'DATE EN ATTENTE',
        s: { fill: { fgColor: { rgb: '000080' } }, font: { color: { rgb: 'FFFFFF' } } }
      },
      {
        v: 'DATE DE PRISE EN COMPTE',
        s: { fill: { fgColor: { rgb: '000080' } }, font: { color: { rgb: 'FFFFFF' } } }
      },
      'SEMAINE',
      'STATUT'
    ],
    ...apiData.map((item) => [
      item.numero_ticket,
      item.zone,
      item.site,
      item.date_attente,
      item.date_prise_en_compte,
      `SEMAINE DU ${item.date_debut ? new Date(item.date_debut).toISOString().split('T')[0] : ''} AU ${item.date_fin ? new Date(item.date_fin).toISOString().split('T')[0] : ''}` ,
      item.date_attente == '' ? 'NON FAIT' : item.date_prise_en_compte == '' ? 'NON PRIS EN COMPTE' : 'FAIT'
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
  XLSX.writeFile(wb, 'PLANNIFICATION.xlsx')
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <div v-if="type == 'superviseur'">
        <div></div>
      </div>
      <div v-else>
        <BaseButton target="_blank" :icon="mdiFileExcel" label="Tout" color="info" rounded-full small
          @click="exportAll()" />

        <BaseButton target="_blank" :icon="mdiFileExcel" label="En cours" color="warning" rounded-full small
          @click="exportEncours()" />
        <BaseButton target="_blank" :icon="mdiFileExcel" label="Fait" color="success" rounded-full small
          @click="exportxlx()" />
      </div>

      <br />
      <CardBox has-table>
        <PlannifieList />
      </CardBox>
    </SectionMain>

    <SectionMain>
      <br />
      <CardBox has-table>
        <ListPlannificationEnAttente />

      </CardBox>
    </SectionMain>

  </LayoutAuthenticated>
</template>
