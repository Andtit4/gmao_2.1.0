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
// import siteList from '@/views/sites/siteList.vue'
import axios from 'axios'
import apiService from '@/services/apiService'
import generatePassword from '@/services/generatePassword.js'

const form = reactive({
  type_equipement: '',
  numero_de_serie: '',
  intitule: '',
  total: '',
  email: '',
  ajouter_le: ''
})

const selectOptions = [
  { id: 1, label: 'GE' },
  { id: 2, label: 'PANNEAU SOLAIRE' },
  { id: 3, label: 'REGULATEUR' },
  { id: 4, label: 'UPS' },
  { id: 5, label: 'TGBT' },
  { id: 6, label: 'REDRESSEUR' },
  { id: 7, label: 'PROTECTION' },
  { id: 8, label: 'BATTERIE DEMARRAGE' },
  { id: 9, label: 'BATTERIE PS' },
  { id: 10, label: 'BATTERIE UPS' },
  { id: 11, label: 'CLIMATISATION' }
]

const submit = () => {
  // console.log(gen)
  axios({
    url: apiService.getUrl() + '/equipement/create',
    method: 'POST',
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
      'Access-Control-Allow-Credentials': true
    },
    data: {
      type_equipement: form.type_equipement.label,
      numero_de_serie: form.numero_de_serie,
      intitule: form.intitule,
      total: form.total,
      ajouter_le: form.ajouter_le
    }
  }).then((repsonse) => {
    console.log('Success ' + repsonse)

    axios({
      url: apiService.getUrl() + '/historique/create',
      method: 'POST',
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
        'Access-Control-Allow-Credentials': true
      },
      data: {
        type_equipement: form.type_equipement.label,
        numero_de_serie: form.numero_de_serie,
        intitule: form.intitule,
        total: form.total,
        ajouter_le: form.ajouter_le,
        action: 'Entré'
      }
    }).then((res) => {
      console.log('Success ' + res)
    })

    setTimeout(() => {
      location.reload()
    }, 1000)
  })
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Equipements" main>
      </SectionTitleLineWithButton>
      <CardBox form @submit.prevent="submit()">
        <FormField label="Informations générale">
          <FormControl v-model="form.numero_de_serie" placeholder="Numéro de série" />
          <FormControl v-model="form.intitule" placeholder="Intitulé" />
          <FormField label="Informations complémentaires">
            <FormControl v-model="form.ajouter_le" placeholder="Image" type="date" />
            <FormControl v-model="form.total" placeholder="total" type="number" />
            <FormControl v-model="form.type_equipement" :options="selectOptions" />
          </FormField>
        </FormField>
        <BaseDivider />

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Submit" @click="submit()" />
            <BaseButton type="reset" color="info" outline label="Reset" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>

    <SectionMain>
      <!-- <CardBox has-table>
        <siteList />
      </CardBox> -->
    </SectionMain>
  </LayoutAuthenticated>
</template>
