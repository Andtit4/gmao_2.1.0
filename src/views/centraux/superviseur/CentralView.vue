<script setup>
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import { onMounted, reactive, ref, computed } from 'vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import zoneList from '@/views/centraux/superviseur/CentralList.vue'
import apiService from '@/services/apiService'
import axios from 'axios'
// import axios from 'axios'
// import apiService from '@/services/apiService'

const isModalActive = ref(false)

const form = reactive({
  zone: '',
  site: '',
  nom: '',
  type: 'CENTRAL',
  nbIntervention: '',
  date_debut: '',
  date_fin: '',
  errMessage: '',
  showSucess: false,
  showErr: false
})

const zones = reactive({ list: [] })
const sites = reactive({ list: [] })
const notificationSettingsModel = ref([])
const notificationsOutline = computed(() => notificationSettingsModel.value.indexOf('outline') > -1)

const getSites = async () => {
  const data = await apiService.getAllSites();
  sites.list = data.data
}

const createZone = () => {
  axios({
    url: apiService.getUrl() + '/zone',
    method: 'POST',
    data: {
      nom: form.nom,
      type: form.type
    }
  }).then((res) => {
    form.showSucess = true;

    setTimeout(() => {
      location.reload()
    }, 1000)

  }).catch((err) => {
    form.showErr = true
    form.errMessage = 'Une erreur est surevenue ' + err.message
  })
}

onMounted(() => {
  getSites()
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
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Zone" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <FormField label="Informations générale">
          <select v-model="form.nom" class="form-select bg-white dark:bg-slate-800">
            <option value="">Séléctionnez une zone</option>
            <option v-for="(site, index) in sites.list" :key="index" :value="site.nom_site">
              {{ site.nom_site }}
            </option>
          </select>
          <BaseButton color="info" small label="Submit" @click="createZone()" />
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
