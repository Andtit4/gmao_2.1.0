<script lang="ts" setup>
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import axios from 'axios'
import { onMounted, reactive, ref, computed } from 'vue'
import Cookies from 'js-cookie'
import apiService from '@/services/apiService'
import CardBoxModal from '@/components/CardBoxModal.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import { mdiFileExcel, mdiPencil, mdiTools } from '@mdi/js'
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
  errMessage: '',
  isAdmin: false,
  tmpZone: '',
  image: '',
  showMore: false,
  panneDesc: '',
  file: ''
})

const getTypeUser = () => {
  const type = Cookies.get('type');
  if (type == 'admin') {
    form.isAdmin = true;
    console.log('Is admin == ', form.isAdmin)
  }
}

const notificationSettingsModel = ref([])
const notificationsOutline = computed(() => notificationSettingsModel.value.indexOf('outline') > -1)
const plannifications = reactive({ list: [] })

const getUserInfo = async () => {
  form.currentEmail = localStorage.getItem('email')
  axios({
    url: apiService.getUrl() + '/intervenant/get/' + form.currentEmail,
    method: 'GET'
  }).then(async (res) => {
    form.currentZone = await res.data[0].zone;
    console.log('Zone = ', form.currentZone);
    if (form.isAdmin) {
      getPlannification()
    } else {
      getPlannificationByZone(form.currentZone)
    }
  })
}

const getPlannificationByZone = async (zone: string) => {
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

const getPlannification = async () => {
  axios({
    url: apiService.getUrl() + '/mission',
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
const moreModal = ref(false)
const sitePlannifie = reactive({ list: [] })

const show = (zone: string, date_debut: string, date_fin: string,) => {
  form.date_debut = date_debut;
  form.date_fin = date_fin;
  isModalActive.value = true
  form.tmpZone = zone;
  console.log('tmp in show ', form.tmpZone)
  axios({
    url: apiService.getUrl() + '/plannifie/zone/week?zone=' + form.tmpZone + '&date_debut=' + date_debut + '&date_fin=' + date_fin,
    method: 'GET'
  }).then((res) => {
    sitePlannifie.list = res.data
    console.log(apiService.getUrl() + '/plannifie/zone/week?zone=' + form.tmpZone + '&date_debut=' + date_debut + '&date_fin=' + date_fin)
  })
}

const showDate = (site: string, id_plannification: string) => {
  // form.showDate = true
  isModalActive.value = false
  treatModal.value = true
  form.site_selected = site
  form.id_plannification = id_plannification


}

const treat = () => {
  axios({
    url: apiService.getUrl() + '/mission/attente/web/' + form.date_traitement + '/' + form.tmpZone + '/' + form.id_plannification + '/' + form.site_selected,
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

const uploadImg = async () => {
  let img = (<HTMLInputElement>document.getElementById('file')).files[0]

  /* const head3 = {
    method: 'POST',
    body: JSON.stringify({ 'imageUrl1': bigFile, 'imageUrl2': smallFile }),
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${sessionStorage.token}` }
  } */
  console.log(img)
  const newFileName = form.site_selected + Date.now() + '.png';
  var formData = new FormData()
  formData.append('file', img, newFileName)
  console.log(formData)

  await axios.post('http://localhost:3000/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then((resp) => {
      console.log(resp)
    })
    .catch((err) => {
      console.log(err.response)
    })
}


const activeMore = (site) => {
  form.site_selected = site
  isModalActive.value = false
  moreModal.value = true
  getAddGeInformation()
}

const getAddGeInformation = () => {
  axios({
    url: apiService.getUrl() + '/ge/site/' + form.site_selected,
    method: 'GET',
  }).then((res) => {
    console.log('bllll ', res.data)
  }).catch((err) => {
    console.log('An error occured d ', err.message)
  })
}


const formatDate = (dateString) => {
  if (!dateString) {
    return 'Date invalide';
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return 'Date invalide';
  }

  const options = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'UTC'
  };
  const formatter = new Intl.DateTimeFormat('fr-FR', options);
  const formattedDate = formatter.format(date);
  const formattedDateWithHours = formattedDate.replace(',', ' à');
  return formattedDateWithHours;
}


onMounted(() => {
  getTypeUser(),
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
    <CardBoxModal v-model="moreModal">
      <form enctype="multipart/form-data">
        <p><strong>{{ form.site_selected }}</strong> </p>
        <FormField label="Informations générale du GE" help="Ses informations seront prise en compte une seule fois">
          <FormControl type="text" placeholder="Nom du GE"></FormControl>
          <FormControl type="text" placeholder="Type de Platine"></FormControl>
          <FormField label="Batteries">
            <FormControl type="text" placeholder="Nombre de battéries"></FormControl>
            <FormControl type="text" placeholder="Capacité des battéries"></FormControl>
          </FormField>
        </FormField>
        <FormField>
          <FormControl type="text" placeholder="Puissance GE"></FormControl>
        </FormField>

        <FormControl type="file" v-model="form.file" id="file" ref="file" /><br>
        <FormField>
          <FormControl type="text" placeholder="Panne/Equipement" v-model="form.panneDesc" />
          <FormControl type="text" placeholder="Description de la panne" v-model="form.panneDesc" />
        </FormField>
        <BaseButton color="info" label="Enregistrer" @click="uploadImg()" />
      </form>
    </CardBoxModal>
    <CardBoxModal v-model="treatModal">
      <p>Plannification du {{ form.date_debut ? formatDate(form.date_debut) : 'Date invalide' }} au {{
        form.date_fin }}</p>
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
      <p>Plannification du {{ form.date_debut ? formatDate(form.date_debut) : 'Date invalide' }} au {{
        form.date_fin ? formatDate(form.date_fin) : 'Date invalide'}}</p>
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
            <BaseButton color="warning" :icon="mdiTools" small @click="activeMore(site.site)" />

            <!-- <FormControl type="file" @change="uploadImg($event)" accept="image/*" /> -->
          </tr>

        </tbody>
      </table>

    </CardBoxModal>
    <table>
      <thead>
        <tr>
          <th v-if="checkable" />
          <th />
          <th>Ajouté le</th>
          <th>Equipe</th>
          <th>Début</th>
          <th>Fin</th>
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
          <td data-label="Ajouté le">
            {{ site.date_ajoute ? formatDate(site.date_ajoute) : 'Date invalide' }}
          </td>
          <td data-label="Equipe">
            {{ site.zone }}
          </td>
          <td data-label="Date de début">
            {{ site.date_debut ? formatDate(site.date_debut) : 'Date invalide'}}
          </td>
          <td data-label="Date de fin">
            {{ site.date_fin ? formatDate(site.date_fin) : 'Date invalide' }}
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
