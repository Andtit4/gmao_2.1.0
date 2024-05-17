<script setup>
// import { mdiMonitorCellphone, mdiTableBorder, mdiTableOff, mdiGithub, mdiAccount } from '@mdi/js'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import { onMounted, reactive, ref, computed } from 'vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
// import TableSampleClients from '@/components/TableSampleClients.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
// import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
import zoneList from '@/views/preventive/classique/ClassiqueList.vue'
import axios from 'axios'
import apiService from '@/services/apiService'

const isModalActive = ref(false)

const form = reactive({
  zone: '',
  nbIntervention: '',
  date_debut: '',
  date_fin: '',
  showSucess: false
})
const zones = reactive({ list: [] })
const sites = reactive({ list: [] })
const notificationSettingsModel = ref([])
const notificationsOutline = computed(() => notificationSettingsModel.value.indexOf('outline') > -1)

// const router = useRouter()
// Fait
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

// Fait
const submit = (zone) => {
  isModalActive.value = true
  axios({
    url: apiService.getUrl() + '/site/nb?zone=' + zone,
    method: 'GET'
  }).then((response) => {
    sites.list = response.data[0].nb
    console.log('nb sites ', sites.list)
    form.nbIntervention = Math.ceil(sites.list / 12)
  })
}

const ajouteDate = () => {
  if (form.date_debut) {
    // Convertir la date saisie en objet Date
    const dateSaisie = new Date(form.date_debut)

    // Ajouter 3 mois à la date
    dateSaisie.setMonth(dateSaisie.getMonth() + 3)

    // Mettre à jour la propriété pour afficher le résultat
    form.date_fin = dateSaisie.toISOString().split('T')[0]
  } else {
    form.date_fin = '' // Réinitialiser si aucune date n'est saisie
  }
}

// Fait
const planif = () => {
  // form.showSucess = true
  axios({
    url: apiService.getUrl() + '/preventive',
    method: 'POST',
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    data: {
      zone: form.zone,
      nombre_total_site: sites.list,
      date_debut: form.date_debut,
      date_fin: form.date_fin,
      quota_semaine: form.nbIntervention
    }
  }).then((res) => {
    console.log('Response ', res.data)
    form.showSucess = true
    setTimeout(() => {
      location.reload()
    }, 1000)
  })
}

onMounted(() => {
  getAllZone()
})
</script>

<template>
  <CardBoxModal v-model="isModalActive" title="Détails">
    <!-- Notification for success -->
    <div v-if="form.showSucess == true">
      <NotificationBar color="success" :icon="mdiInformation" :outline="notificationsOutline">
        <b>Plannification initialisée</b>.
      </NotificationBar>
    </div>
    <!-- End BLoc -->
    <p>
      Zone : <b>{{ form.zone }}</b>
    </p>
    <p>
      Nombre total de sites : <b>{{ sites.list }}</b>
    </p>
    <p>
      Quota : <b>{{ form.nbIntervention }} </b> Site(s) par Semaine
    </p>
    <p>
      <FormField label="Début / Fin">
        <FormControl v-model="form.date_debut" type="date" @change="ajouteDate()" />
        <div v-if="form.date_debut != undefined || form.date_debut != ''">
          <p>
            Date fin: <b>{{ form.date_fin }}</b>
          </p>
        </div>
      </FormField>
    </p>
    <BaseButton color="success" label="Plannifier" @click="planif()" />
  </CardBoxModal>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton
        :icon="mdiBallotOutline"
        title="Planif. Préventive / Classique"
        main
      >
      </SectionTitleLineWithButton>
      <CardBox>
        <FormField label="Informations générale">
          <select v-model="form.zone" class="form-select bg-white dark:bg-slate-800">
            <option value="">Séléctionnez une zone</option>
            <option v-for="(zone, index) in zones.list" :key="index" :value="zone.nom">
              {{ zone.nom }}
            </option>
          </select>
          <!-- <BaseButton color="info" :icon="mdiEye" small @click="showSite(site._id)" /> -->
          <BaseButton color="info" small label="Submit" @click="submit(form.zone)" />
        </FormField>
        <BaseDivider />
        <template #footer>
          <!-- <BaseButtons>
            <BaseButton type="reset" color="info" outline label="Reset" />
          </BaseButtons> -->
        </template>
      </CardBox>
    </SectionMain>

    <SectionMain>
      <CardBox has-table>
        <zoneList />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
