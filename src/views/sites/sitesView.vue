<script setup>
import { mdiMonitorCellphone, mdiTableBorder, mdiTableOff, mdiGithub, mdiAccount } from '@mdi/js'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import { onMounted, reactive, computed } from 'vue'
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

const form = reactive({
  site_id: '',
  nom_site: '',
  longitude: '',
  latitude: '',
  zone: '',
  config_du_site: '',
  technologie: '',
  nombre_de_dependance: '',
  classe_technique: '',
  typologie_energie: '',
  ge: '',
  type_batterie: '',
  nombre: '',
  puissance_batteries: '',
  showError: false,
  err: ''
})

const notificationsOutline = computed(() => notificationSettingsModel.value.indexOf('outline') > -1)

const classeOptions = [
  { id: 1, label: 'BRONZE' },
  { id: 2, label: 'GOLD' },
  { id: 3, label: 'PLATINUM' },
  { id: 4, label: 'BRONZE' },
  { id: 5, label: 'SILVER' }
]

const geOptions = [
  { id: 3, label: 'ADIYO' },
  { id: 4, label: 'CAT' },
  { id: 5, label: 'COELMO' },
  { id: 3, label: 'CUMMINS' },
  { id: 4, label: 'GENELEC' },
  { id: 5, label: 'OLYMPIAN' }
]

const typologieOptions = [
  { id: 1, label: 'GE' },
  { id: 2, label: 'GRID' },
  { id: 3, label: 'GRID MOOV+GE' },
  { id: 4, label: 'GRID+GE' },
  { id: 6, label: 'GRID+2GE' },
  { id: 1, label: 'SOLAIRE+GRID' },
  { id: 2, label: 'PRIMAIRE/ETAT-MAJOR + GE' },
  { id: 3, label: 'PRIMAIRE/FUSEC' },
  { id: 4, label: 'PRIMAIRE/MOOV' },
  { id: 5, label: 'PRIMAIRE GTA' },
  { id: 3, label: 'PRIMAIRE SIEGE' },
  { id: 4, label: 'PRIMAIRE/AEROGARE' },
  { id: 5, label: 'PRIMAIRE/LONATO' },
  { id: 3, label: 'PRIMAIRE/PAL' },
  { id: 4, label: 'PRIMAIRE/PALAIS CONGRES + GE' },
  { id: 5, label: 'PRIMAIRE/PRESIDENCE' },
  { id: 3, label: 'PRIMAIRE/T-OIL' },
  { id: 4, label: 'PRIMAIRE/UTB' },
  { id: 5, label: 'PRIMAIRE + GE' },
  { id: 3, label: 'SOLAIRE' },
  { id: 4, label: 'SOLAIRE+GE' },
  { id: 5, label: 'SOLAIRE+GE+GRID' }
]

const configOptions = [
  {
    id: 1,
    label: 'Config 1'
  },
  {
    id: 2,
    label: 'Config 2'
  },
  {
    id: 3,
    label: 'Config 3'
  },
  {
    id: 4,
    label: 'Config 4'
  },
  {
    id: 5,
    label: 'Config 5'
  },
  {
    id: 6,
    label: 'Config 7'
  },
  {
    id: 7,
    label: 'IBS Config Type 1'
  },
  {
    id: 8,
    label: 'IBS Config Type 2'
  },
  {
    id: 9,
    label: 'IBS Config Type 5'
  },
  {
    id: 10,
    label: 'IBS-G1800'
  },
  {
    id: 7,
    label: 'sSmall Cell U2100'
  }
]

const technologieOptions = [
  { id: 1, label: '2G' },
  { id: 2, label: '3G' },
  { id: 3, label: '4G' },
  { id: 4, label: '2G/3G' },
  { id: 1, label: '2G/3G/4G' }
]

const zones = reactive({ list: [] })
// const router = useRouter()

const getAllZone = () => {
  axios({
    url: apiService.getUrl() + '/zone',
    method: 'GET'
  })
    .then((response) => {
      zones.list = response.data
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}

const submit = () => {
  if (form.site_id == '') {
    form.showError = true
    form.err = 'Veillez remplir le site Id'
  } else {
    axios({
      url: apiService.getUrl() + '/site',
      method: 'POST',
      data: {
        site_id: form.site_id,
        nom_site: form.nom_site,
        longitude: form.longitude,
        latitude: form.latitude,
        zone: form.zone,
        config_du_site: form.config_du_site.label,
        technologie: form.technologie.label,
        nombre_de_dependance: form.nombre_de_dependance,
        classe_technique: form.classe_technique.label,
        typologie_energie: form.typologie_energie.label,
        ge: form.ge.label,
        type_batterie: form.type_batterie,
        nombre: form.nombre,
        puissance_batteries: form.puissance_batteries
      }
    }).then((repsonse) => {
      console.log('Success ' + repsonse)
      setTimeout(() => {
        location.reload()
      }, 1000)
    })
  }
}

onMounted(() => {
  getAllZone()
})
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Sites" main>
      </SectionTitleLineWithButton>
      <div v-if="form.showError == true">
        <NotificationBar color="danger" :icon="mdiMonitorCellphone">
          {{ form.err }}
        </NotificationBar>
      </div>
      <CardBox form @submit.prevent="submit()">
        <FormField label="Informations générale">
          <FormControl v-model="form.site_id" placeholder="Site id" />
          <FormControl v-model="form.nom_site" placeholder="Nom site" />
          <FormControl v-model="form.longitude" placeholder="Longitude" />
          <FormControl v-model="form.latitude" placeholder="Latitude" />
          <FormField label="Zone">
            <select v-model="form.zone" class="form-select bg-white dark:bg-slate-800">
              <option value="">Séléctionnez une zone</option>
              <option v-for="(zone, index) in zones.list" :key="index" :value="zone.nom">
                {{ zone.nom }}
              </option>
            </select>
            <FormControl v-model="form.config_du_site" :options="configOptions" />
          </FormField>
          <FormField label="Technologie">
            <FormControl v-model="form.technologie" :options="technologieOptions" />
            <FormControl v-model="form.nombre_de_dependance" placeholder="Nombre de dépendance" />
            <FormControl v-model="form.classe_technique" :options="classeOptions" />
            <FormControl v-model="form.typologie_energie" :options="typologieOptions" />
            <FormControl v-model="form.ge" :options="geOptions" />
            <FormControl v-model="form.type_batterie" placeholder="Type de batteries" />
            <FormControl v-model="form.nombre" placeholder="Nombre" />
            <FormControl v-model="form.puissance_batteries" placeholder="Puissance de batterie" />
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
      <!--  <CardBox has-table>
        <siteList />
      </CardBox> -->
    </SectionMain>
  </LayoutAuthenticated>
</template>
