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
// import PlannifieList from '@/views/preventive/plannifie/plannifieList.vue'
// import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
import axios from 'axios'
import apiService from '@/services/apiService'
import moment from 'moment'
// import FormField from '@/components/FormField.vue'


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

// const router = useRouter()

// Fait
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

// fait
const getDate = (zone) => {
  console.log('Zone: ', zone)
  axios({
    url: apiService.getUrl() + '/preventive/zone?zone=' + zone,
    method: 'GET'
  }).then((response) => {
    console.log('Response: ', response.data)
    if (response.data.length == 0) {
      console.log('empty')
    } else {
      console.log('not empty')
      form.showInformation = true
      form.nnbSites = response.data[0].nombre_total_site
      form.date_debut = response.data[0].date_debut
      form.date_fin = response.data[0].date_fin
      form.quota_semaine = response.data[0].quota_semaine
      getNbWeek(form.date_debut, form.date_fin)
      sitesByZone()
    }
  })
}

const getNbWeek = (date_debut, date_fin) => {
  const debut = moment(date_debut)
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
  // console.log(semaines.list)
}
const extractDates = (text) => {
  // console.log('\nmatches[1] ', text)

  const regex = /Semaine du (\d{4}-\d{2}-\d{2}) au (\d{4}-\d{2}-\d{2})/
  const matches = text.match(regex)

  if (matches && matches.length === 3) {
    form.debut_semaine = matches[1]
    form.fin_semaine = matches[2]
    console.log('\nmatches[1] ', matches[1])
  } else {
    console.error('Format de période invalide')
  }
}

// Fait
const sitesByZone = () => {
  axios({
    url: apiService.getUrl() + '/site/zone/search?zone=' + form.zone,
    method: 'GET'
  }).then((res) => {
    sites.list = res.data
  })
}

// Fait
const submit = () => {
  axios({
    url: apiService.getUrl() + '/mission',
    method: 'POST',
    data: {
      zone: form.zone,
      quota: form.quota_semaine,
      // nom_site: form.site,
      date_ajout: new Date(),
      date_debut: form.debut_semaine,
      date_fin: form.fin_semaine
    }
  }).then((res) => {
    console.log(res)
    setTimeout(() => {
      location.reload()
    }, 500)
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
        <b>Sortie enregistrée</b>.
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
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Plannifier" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <FormField label="Informations générale">
          <select
            v-model="form.zone"
            class="form-select bg-white dark:bg-slate-800"
            @change="getDate(form.zone)"
          >
            <option value="">Séléctionnez une zone</option>
            <option v-for="(zone, index) in zones.list" :key="index" :value="zone.zone">
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
              <!-- <FormField label="Sites">
                <select
                  v-model="form.site"
                  class="form-select bg-white dark:bg-slate-800"
                  @change="extractDates(form.site)"
                >
                  <option value="">Sélectionnez le site</option>
                  <option v-for="(site, index) in sites.list" :key="index" :value="site.nom_site">
                    {{ site.nom_site }}
                  </option>
                </select>
              </FormField> -->
            </FormField>
          </div>

          <!-- <BaseButton color="info" :icon="mdiEye" small @click="showSite(site._id)" /> -->
          <BaseButton color="info" small label="Submit" @click="submit()" />
        </FormField>
        <BaseDivider />
        <template #footer>
          <!-- <BaseButtons>
            <BaseButton type="reset" color="info" outline label="Reset" />
          </BaseButtons> -->
        </template>
      </CardBox>
    </SectionMain>

    <!-- <SectionMain>
      <CardBox has-table>
        <PlannifieList />
      </CardBox>
    </SectionMain> -->
  </LayoutAuthenticated>
</template>
