<script setup>
import { onMounted, reactive, ref, computed } from 'vue'
import axios from 'axios'
import moment from 'moment'
import { mdiInformation, mdiBallotOutline } from '@mdi/js'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import apiService from '@/services/apiService'

const isModalActive = ref(false)

const form = reactive({
  zone: '',
  nbIntervention: '',
  date_debut: '',
  date_fin: '',
  quota_semaine: '',
  showSucess: false,
  showInformation: false,
  nnbSites: '',
  debut_semaine: '',
  fin_semaine: '',
  weeks: '',
  site: ''
})

const semaines = reactive({ list: [] })
const zones = reactive({ list: [] })
const sites = reactive({ list: [] })
const notificationSettingsModel = ref([])
const notificationsOutline = computed(() => notificationSettingsModel.value.indexOf('outline') > -1)

const getAllZone = () => {
  axios({
    url: apiService.getUrl() + '/preventive',
    method: 'GET'
  })
    .then((response) => {
      zones.list = response.data
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}

const ajouteDate = () => {
  if (form.date_debut) {
    const dateSaisie = new Date(form.date_debut)
    dateSaisie.setMonth(dateSaisie.getMonth() + 3)
    form.date_fin = dateSaisie.toISOString().split('T')[0]
  } else {
    form.date_fin = ''
  }
}

const getDate = (zone) => {
  if (!zone) return
  
  axios({
    url: `${apiService.getUrl()}/preventive/zone?zone=${encodeURIComponent(zone)}`,
    method: 'GET'
  }).then((response) => {
    const data = response.data[0]
    if (data) {
      form.showInformation = true
      form.nnbSites = data.nombre_total_site
      form.date_debut = data.date_debut
      form.date_fin = data.date_fin
      form.quota_semaine = data.quota_semaine
      getNbWeek(form.date_debut, form.date_fin)
      sitesByZone()
    } else {
      form.showInformation = false
      form.nnbSites = ''
      form.date_debut = ''
      form.date_fin = ''
      form.quota_semaine = ''
      semaines.list = []
      sites.list = []
    }
  }).catch((error) => {
    console.error('Erreur lors de la récupération des données:', error)
    // Gérer l'erreur (par exemple, afficher un message à l'utilisateur)
  })
}

const getNbWeek = (date_debut, date_fin) => {
  const debut = moment(date_debut).day(4)
  const fin = moment(date_fin)

  semaines.list = []

  let currentWeekStart = debut.clone()
  while (currentWeekStart.isBefore(fin)) {
    const currentWeekEnd = currentWeekStart.clone().add(6, 'days')
    semaines.list.push(
      `Semaine du ${currentWeekStart.format('YYYY-MM-DD')} au ${currentWeekEnd.format(
        'YYYY-MM-DD'
      )}`
    )
    currentWeekStart.add(7, 'days')
  }
}

const extractDates = (text) => {
  const regex = /Semaine du (\d{4}-\d{2}-\d{2}) au (\d{4}-\d{2}-\d{2})/
  const matches = text.match(regex)

  if (matches && matches.length === 3) {
    form.debut_semaine = matches[1]
    form.fin_semaine = matches[2]
  } else {
    console.error('Format de période invalide')
  }
}

const sitesByZone = () => {
  axios({
    url: apiService.getUrl() + '/site/zone/search?zone=' + form.zone,
    method: 'GET'
  }).then((res) => {
    sites.list = res.data
  })
}

const submit = () => {
  if (!form.zone || !form.quota_semaine || !form.debut_semaine || !form.fin_semaine) {
    // Afficher un message d'erreur à l'utilisateur
    return
  }

  axios({
    url: apiService.getUrl() + '/mission',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin':'*'
    },
    data: {
      zone: form.zone,
      quota: form.quota_semaine,
      date_ajoute: new Date().toISOString(),
      date_debut: form.debut_semaine,
      date_fin: form.fin_semaine
    }
  }).then((res) => {
    console.log(res)
    form.showSucess = true
    setTimeout(() => {
      form.showSucess = false
      // Réinitialiser le formulaire ou recharger les données
    }, 3000)
  }).catch((error) => {
    console.error('Erreur lors de la soumission:', error)
    // Afficher un message d'erreur à l'utilisateur
  })
}

onMounted(() => {
  getAllZone()
})
</script>

<template>
  <CardBoxModal v-model="isModalActive" title="Détails">
    <div v-if="form.showSucess == true">
      <NotificationBar color="success" :icon="mdiInformation" :outline="notificationsOutline">
        <b>Sortie enregistrée</b>.
      </NotificationBar>
    </div>
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
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Plannifier" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <FormField label="Informations générales">
          <select
            v-model="form.zone"
            class="form-select bg-white dark:bg-slate-800"
            @change="getDate(form.zone)"
          >
            <option value="">Sélectionnez une zone</option>
            <option v-for="zone in zones.list" :key="zone.id" :value="zone.zone">
              {{ zone.zone }}
            </option>
          </select>
          <div v-if="form.showInformation == true">
            <FormField label="Information de la maintenance">
              <p>
                Nombre de sites : <b>{{ form.nnbSites }}</b>
              </p>
              <p>
                Quota générale : <b>{{ form.quota_semaine }}</b>
              </p>
              <p>
                prévu du :
                <b>{{
                  form.date_debut ? new Date(form.date_debut).toISOString().split('T')[0] : ''
                }}</b>
                au
                <b>
                  {{ form.date_fin ? new Date(form.date_fin).toISOString().split('T')[0] : '' }}
                </b>
              </p>
              <select
                v-model="form.weeks"
                class="form-select bg-white dark:bg-slate-800"
                @change="extractDates(form.weeks)"
              >
                <option value="">Semaine de plannification</option>
                <option v-for="(zone, index) in semaines.list" :key="index" :value="zone">
                  {{ zone }}
                </option>
              </select>
              <FormField label="Dates prévues">
                <FormControl v-model="form.debut_semaine" type="date" />
                <FormControl v-model="form.fin_semaine" type="date" />
              </FormField>
            </FormField>
          </div>

          <BaseButton color="info" small label="Soumettre" @click="submit()" :disabled="!form.zone || !form.weeks" />
        </FormField>
        <BaseDivider />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
