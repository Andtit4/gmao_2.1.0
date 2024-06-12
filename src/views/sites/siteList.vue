<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiEye, mdiTrashCan, mdiPencil, mdiOil } from '@mdi/js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import apiService from '@/services/apiService'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'

defineProps({
  checkable: Boolean
})

const form = reactive({
  _id: '',
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
  searchSite: '',
  searchZone: ''
})

const geOptions = [
  { id: 3, label: 'ADIYO' },
  { id: 4, label: 'CAT' },
  { id: 5, label: 'COELMO' },
  { id: 3, label: 'CUMMINS' },
  { id: 4, label: 'GENELEC' },
  { id: 5, label: 'OLYMPIAN' }
]

const classeOptions = [
  { id: 1, label: 'BRONZE' },
  { id: 2, label: 'GOLD' },
  { id: 3, label: 'PLATINUM' },
  { id: 4, label: 'BRONZE' },
  { id: 5, label: 'SILVER' }
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

const sites = reactive({ list: [] })
const router = useRouter()

const getAllSite = () => {
  axios({
    url: apiService.getUrl() + '/site',
    method: 'GET'
  })
    .then((response) => {
      sites.list = response.data
      localStorage.setItem('nbSites', sites.list.length)
      // console.log('\n site all ', sites.list.length)
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}

const deleteSite = (_id) => {
  axios({
    url: apiService.getUrl() + '/site/' + _id,
    method: 'DELETE'
  })
    .then((response) => {
      console.log(response)
      setTimeout(() => {
        location.reload()
      }, 1000)
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}

const mainStore = useMainStore()

const items = computed(() => mainStore.clients)

const isModalActive = ref(false)
const isModalEdit = ref(false)

const isModalDangerActive = ref(false)

const perPage = ref(5)

const currentPage = ref(0)

const checkedRows = ref([])

const itemsPaginated = computed(() =>
  items.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
)

const numPages = computed(() => Math.ceil(items.value.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []
  getAllSite()
  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})

const remove = (arr, cb) => {
  const newArr = []

  arr.forEach((item) => {
    if (!cb(item)) {
      newArr.push(item)
    }
  })

  return newArr
}

const checked = (isChecked, client) => {
  if (isChecked) {
    checkedRows.value.push(client)
  } else {
    checkedRows.value = remove(checkedRows.value, (row) => row.id === client.id)
  }
}

const oneSite = reactive({ list: [] })
const showSite = (id) => {
  isModalActive.value = true
  axios({
    url: apiService.getUrl() + '/site/' + id,
    method: 'GET'
  }).then((res) => {
    console.log('site selected: ', res.data)
    oneSite.list = res.data
  })
}

const siteSelected = reactive({ list: [] })
const editSite = (id) => {
  ;(isModalEdit.value = true),
    axios({
      url: apiService.getUrl() + '/site/' + id,
      method: 'GET'
    }).then((res) => {
      siteSelected.list = res.data
      ;(form.site_id = res.data.site_id),
        (form._id = res.data._id),
        (form.nom_site = res.data.nom_site),
        (form.longitude = res.data.longitude),
        (form.latitude = res.data.latitude),
        (form.zone = res.data.zone),
        (form.config_du_site = res.data.config_du_site),
        (form.technologie = res.data.technologie),
        (form.nombre_de_dependance = res.data.nombre_de_dependance),
        (form.classe_technique = res.data.classe_technique),
        (form.typologie_energie = res.data.typologie_energie),
        (form.ge = res.data.ge),
        (form.type_batterie = res.data.type_batterie),
        (form.nombre = res.data.nombre),
        (form.puissance_batteries = res.data.puissance_batteries)

      /* axios({
        url: apiService.getUrl() + '/site/' + id,
        method: 'PUT'
      }).then((res) => {
        console.log('site selected: ', res.data)
      }) */
    })
}

const editSave = (id) => {
  axios({
    url: apiService.getUrl() + '/site/' + id,
    method: 'PUT',
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
  }).then((res) => {
    console.log('site selected: ', res.data)
    setTimeout(() => {
      location.reload()
    }, 1000)
  })
}

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

const search = () => {
  axios({
    url: apiService.getUrl() + '/site/search/dyn?nom_site=' + form.searchSite.toUpperCase(),
    method: 'GET'
  })
    .then((response) => {
      sites.list = response.data
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}

const searchZone = () => {
  axios({
    url: apiService.getUrl() + '/site/zone/search/dyn?zone=' + form.searchZone.toUpperCase(),
    method: 'GET'
  })
    .then((response) => {
      sites.list = response.data
    })
    .catch((e) => {
      console.log('An  ' + e)
    })
}

onMounted(() => {
  getAllZone()
})
</script>

<template>
  <CardBoxModal v-model="isModalEdit" title="Modifier">
    <FormField label="Informations générale">
      <FormControl v-model="form.site_id" :value="siteSelected.site_id" placeholder="Site id" />
      <FormControl v-model="form.nom_site" placeholder="Nom site" />
      <!-- <FormControl v-model="form.technologie" :options="technologieOptions" /> -->

      <FormField label="Coordonnées">
        <FormControl v-model="form.longitude" placeholder="Longitude" />
        <FormControl v-model="form.latitude" placeholder="Latitude" />
      </FormField>

      <FormField label="Zone">
        <select v-model="form.zone" class="form-select bg-white dark:bg-slate-800">
          <option value="">Séléctionnez une zone</option>
          <option v-for="(zone, index) in zones.list" :key="index" :value="zone.nom">
            {{ zone.nom }}
          </option>
        </select>
        <!-- <select v-model="form.config_du_site" class="form-select bg-white dark:bg-slate-800">
          <option value="">Séléctionnez la config du site</option>
          <option v-for="(zone, index) in configOptions" :key="index" :value="configOptions">
            {{ zone.label }}
          </option>
        </select> -->
        <FormControl v-model="form.config_du_site" :options="configOptions.label" />
      </FormField>

      <FormField label="">
        <FormControl
          v-model="form.classe_technique"
          placeholder="Classe Technique"
          :options="classeOptions"
        />
        <FormControl
          v-model="form.typologie_energie"
          placeholder="Typologie"
          :options="typologieOptions"
        />
      </FormField>

      <FormField label="autres">
        <FormControl v-model="form.ge" placeholder="Option Ge" :options="geOptions" />
        <FormControl v-model="form.type_batterie" placeholder="Type de batteries" />
      </FormField>
      <FormField label="">
        <FormControl v-model="form.nombre" placeholder="Nombre" />
        <FormControl v-model="form.puissance_batteries" placeholder="Puissance de batterie" />
      </FormField>
    </FormField>
    <BaseButton color="info" label="Modifier" :icon="mdiPencil" @click="editSave(form._id)" />
  </CardBoxModal>
  <CardBoxModal v-model="isModalActive" title="Détails">
    <p>
      Site Id : <b>{{ oneSite.list.site_id }}</b>
    </p>
    <p>
      Nom : <b>{{ oneSite.list.nom_site }}</b>
    </p>
    <p>
      Zone : <b>{{ oneSite.list.zone }}</b>
    </p>
    <p>
      Configuration : <b>{{ oneSite.list.config_du_site }}</b>
    </p>
    <p>
      Technologie : <b>{{ oneSite.list.technologie }}</b>
    </p>
    <p>
      Nombre de dépendance : <b>{{ oneSite.list.nombre_de_dependance }}</b>
    </p>
    <p>
      Classe : <b>{{ oneSite.list.classe_technique }}</b>
    </p>
    <p>
      GE : <b>{{ oneSite.list.ge }}</b>
    </p>
    <p>
      Type de batterie : <b>{{ oneSite.list.type_batterie }}</b>
    </p>
    <p>
      Nombre de batteries : <b>{{ oneSite.list.nombre }}</b>
    </p>
    <p>
      Puissance des batteries : <b>{{ oneSite.list.puissance_batteries }}</b>
    </p>
  </CardBoxModal>

  <div v-if="checkedRows.length" class="p-3 bg-gray-100/50 dark:bg-slate-800">
    <span
      v-for="checkedRow in checkedRows"
      :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-slate-700"
    >
      {{ checkedRow.name }}
    </span>
  </div>
  <br />
  <FormField label="Rechercher">
    <FormControl v-model="form.searchSite" placeholder="Entrez le nom du site" @input="search()" />
    <FormControl v-model="form.searchZone" placeholder="Entrez la zone" @input="searchZone()" />
  </FormField>
  <br />
  <div class="max-h-[32rem] overflow-x-auto">
    <table>
      <thead>
        <tr>
          <th v-if="checkable" />
          <th />
          <th>Site Id</th>
          <th>Nom Site</th>
          <th>Zone</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(site, index) in sites.list" :key="index">
          <TableCheckboxCell v-if="checkable" @checked="checked($event, site)" />
          <td class="border-b-0 lg:w-6 before:hidden">
            <!-- <UserAvatar :username="site.nom_site" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" /> -->
          </td>
          <td data-label="Site Id">
            {{ site.site_id }}
          </td>
          <td data-label="Nom site">
            {{ site.nom_site }}
          </td>
          <td data-label="Zone">
            {{ site.zone }} {{ site.typologie_energie }}
          </td>
          <td class="before:hidden lg:w-1 whitespace-nowrap">
            <BaseButtons type="justify-start lg:justify-end" no-wrap>
              <BaseButton color="success" :icon="mdiPencil" small @click="editSite(site._id)" />
              <BaseButton color="info" :icon="mdiEye" small @click="showSite(site._id)" />

              <BaseButton color="danger" :icon="mdiTrashCan" small @click="deleteSite(site._id)" />
            </BaseButtons>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton
          v-for="page in pagesList"
          :key="page"
          :active="page === currentPage"
          :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'"
          small
          @click="currentPage = page"
        />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>
