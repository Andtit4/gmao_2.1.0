<script setup>
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import axios from 'axios'
import { onMounted, reactive, ref, computed } from 'vue'
import Cookies from 'js-cookie'
import apiService from '@/services/apiService'
import CardBoxModal from '@/components/CardBoxModal.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import { mdiFileExcel, mdiPencil, } from '@mdi/js'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import NotificationBar from '@/components/NotificationBar.vue'





const form = reactive({
  currentZone: '',
  currentEmail: '',
  date_debut: '',
  date_fin: '',
  date_traitement: '',
  site_selected: '',
  id_plannification: '',
  showDate: false,
  showPriseEncompte: false,
  showEnAttente: false,
  showSuccess: false,
  showErr: false,
  errMessage: ''
})

const notificationSettingsModel = ref([])
const notificationsOutline = computed(() => notificationSettingsModel.value.indexOf('outline') > -1)
const plannifications = reactive({ list: [] })

const getUserInfo = async () => {
  form.currentEmail = Cookies.get('email')
  axios({
    url: apiService.getUrl() + '/intervenant/get/' + form.currentEmail,
    method: 'GET'
  }).then(async (res) => {
    form.currentZone = await res.data.zone;
    console.log('Zone = ', form.currentZone);
    getPlannificationByZone(form.currentZone)
  })
}

const getPlannificationByZone = async (zone) => {
  axios({
    url: apiService.getUrl() + '/mission/zone?zone=' + zone,
    method: 'GET'
  }).then(async (res) => {
    plannifications.list = await res.data
    console.log('Response: ', res.data)
  }).catch((err) => {
    console.log('An occured while getting plannifications ', err.message)
  })
}

const isModalActive = ref(false)
const treatModal = ref(false)
const sitePlannifie = reactive({ list: [] })

const show = (zone, date_debut, date_fin,) => {
  form.date_debut = date_debut;
  form.date_fin = date_fin;
  isModalActive.value = true
  axios({
    url: apiService.getUrl() + '/plannifie/zone/week?zone=' + zone + '&date_debut=' + date_debut + '&date_fin=' + date_fin,
    method: 'GET'
  }).then((res) => {
    sitePlannifie.list = res.data
    console.log('Sites plannifies: ', res.data)
  })
}

const showDate = (site, id_plannification) => {
  // form.showDate = true
  isModalActive.value = false
  treatModal.value = true
  form.site_selected = site
  form.id_plannification = id_plannification


}

const treat = () => {
  axios({
    url: apiService.getUrl() + '/mission/attente/web/' + form.date_traitement + '/' + form.currentZone + '/' + form.id_plannification + '/' + form.site_selected,
    method: 'PUT'
  }).then((res) => {
    form.showSuccess == true
    console.log('Response: ', res.data)
    treatModal.value = false
  }).catch((err) => {
    form.showErr = true
    form.errMessage = "Une erreur est survenue " + err.message
  })
}

onMounted(() => {
  getUserInfo()
})


</script>
<template>
  <div v-if="form.showSuccess == true">
    <NotificationBar color="success" :icon="mdiInformation" :outline="notificationsOutline">
      <b>Maintenance effectuée.</b>.
    </NotificationBar>
  </div>
  <div v-if="form.showErr == true">
    <NotificationBar color="danger" :icon="mdiInformation" :outline="notificationsOutline">
      <b>{{ form.errMessage }}</b>.
    </NotificationBar>
  </div>
  <LayoutAuthenticated>
    <CardBoxModal v-model="treatModal">
      <p>Plannification du {{ form.date_debut ? new Date(form.date_debut).toISOString().split('T')[0] : '' }} au {{
        form.date_fin ? new Date(form.date_fin).toISOString().split('T')[0] : '' }}</p>
      <p>Site selectionné: <strong>{{ form.site_selected }}</strong></p>

      <p>Date de traitement:
        <br>
        <FormField lbel="">
          <FormControl v-model="form.date_traitement" type="date" />
        </FormField>
      </p>
      <br>
      <BaseButton color="info" label="Traiter" @click="treat()" />
    </CardBoxModal>
    <CardBoxModal v-model="isModalActive">
      <p>Plannification du {{ form.date_debut ? new Date(form.date_debut).toISOString().split('T')[0] : '' }} au {{
        form.date_fin ? new Date(form.date_fin).toISOString().split('T')[0] : '' }}</p>
      <br>

      <table>
        <thead>
          <tr>
            <th v-if="checkable" />
            <th />
            <th>Site</th>
            <th>Envoyé le</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(site, index) in sitePlannifie.list" :key="index">
            <TableCheckboxCell v-if="checkable" @checked="checked($event, site)" />
            <td class="border-b-0 lg:w-6 before:hidden">
            </td>
            <td data-label="Site">
              {{ site.site }}
            </td>
            <td data-label="Envoyé le">
              {{ site.date_attente }}
            </td>
            <BaseButton color="info" :icon="mdiPencil" small @click="showDate(site.site, site.id_plannification)" />
          </tr>
        </tbody>
      </table>

    </CardBoxModal>
    <table>
      <thead>
        <tr>
          <th v-if="checkable" />
          <th />
          <th>Début</th>
          <th>Fin</th>
          <th>Date ajout</th>
          <th>Quota de la semaine</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(site, index) in plannifications.list" :key="index">
          <TableCheckboxCell v-if="checkable" @checked="checked($event, site)" />
          <td class="border-b-0 lg:w-6 before:hidden">
            <!-- <UserAvatar :username="site.nom" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" /> -->
          </td>
          <td data-label="Date de début">
            {{ site.date_debut ? new Date(site.date_debut).toISOString().split('T')[0] : '' }}
          </td>
          <td data-label="Date de fin">
            {{ site.date_fin ? new Date(site.date_fin).toISOString().split('T')[0] : '' }}
          </td>
          <td data-label="Date ajout">
            {{ site.date_ajoute ? new Date(site.date_ajoute).toISOString().split('T')[0] : '' }}
          </td>
          <td data-label="Quota de la semaine">
            {{ site.quota }}
          </td>
          <td class="before:hidden lg:w-1 whitespace-nowrap">
            <BaseButtons type="justify-start lg:justify-end" no-wrap>
              <BaseButton color="info" :icon="mdiPencil" small
                @click="show(site.zone, site.date_debut, site.date_fin, site._id)" />
              <div v-if="form.showRestOfItem == true">
                <BaseButton color="success" :icon="mdiFileExcel" small @click="exportxlx(site.zone)" />
              </div>
              <div v-else>
                <div>
                  <BaseButton color="success" :icon="mdiFileExcel" small @click="exportxlx(site.zone)" />
                </div>
              </div>
              <!-- <BaseButton color="danger" :icon="mdiTrashCan" small @click="deleteSite(site._id)" /> -->
            </BaseButtons>

          </td>
        </tr>
      </tbody>
    </table>
    <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
      <BaseLevel>
        <BaseButtons>
          <BaseButton v-for="page in pagesList" :key="page" :active="page === currentPage" :label="page + 1"
            :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="currentPage = page" />
        </BaseButtons>
        <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
      </BaseLevel>
    </div>
  </LayoutAuthenticated>
</template>
