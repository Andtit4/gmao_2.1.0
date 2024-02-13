<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiPencil /* mdiTrashCan */, mdiFileExcel } from '@mdi/js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import FormField from '@/components/FormField.vue'
import * as XLSX from 'xlsx'
// import UserAvatar from '@/components/UserAvatar.vue'
import axios from 'axios'
// import { useRouter } from 'vue-router'
import apiService from '@/services/apiService'

defineProps({
  checkable: Boolean
})

const form = reactive({
  site: '',
  id_plannification: '',
  siteAddNb: '',
  showRestOfItem: true
})

const sites = reactive({ list: [] })
// const router = useRouter()

const getAllSite = () => {
  axios({
    url: apiService.getUrl() + '/mission',
    method: 'GET'
  })
    .then((response) => {
      sites.list = response.data
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}

/* const deleteSite = (_id) => {
  axios({
    url: apiService.getUrl() + '/zone/' + _id,
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
} */

const mainStore = useMainStore()

const items = computed(() => mainStore.clients)

const isModalActive = ref(false)

// const isModalDangerActive = ref(false)

const perPage = ref(5)

const currentPage = ref(0)

const checkedRows = ref([])

/* const itemsPaginated = computed(() =>
  items.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
) */

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

const getCountNbSitePlannifier = (id) => {
  console.log('id === ', id)
  axios({
    url: apiService.getUrl() + '/plannifie/count/' + id,
    method: 'GET'
  })
    .then((res) => {
      console.log('Nb ==== ', res)
      form.siteAddNb = res.data[0].nb
    })
    .catch((err) => {
      console.error('An error === ', err)
    })
}

const oneZone = reactive({ list: [] })
const siteDropDown = reactive({ list: [] })

// const sites = reactive({ list: [] })

const showZone = (id) => {
  isModalActive.value = true
  form.id_plannification = id
  getCountNbSitePlannifier(form.id_plannification)
  axios({
    url: apiService.getUrl() + '/mission/' + id,
    method: 'GET'
  }).then((response) => {
    oneZone.list = response.data
    sitesByZone(oneZone.list.zone)
    controlNb(oneZone.list.quota, form.siteAddNb)
  })
}

const sitesByZone = (zone) => {
  axios({
    url: apiService.getUrl() + '/site/zone/search?zone=' + zone,
    method: 'GET'
  }).then((res) => {
    siteDropDown.list = res.data
  })
}

const controlNb = (nbPrevu, nbAjout) => {
  if (nbPrevu == nbAjout) {
    form.showRestOfItem = false
  }
  console.log('Showed === ', form.showRestOfItem)
}

const save = () => {
  axios({
    url: apiService.getUrl() + '/plannifie',
    method: 'POST',
    data: {
      zone: oneZone.list.zone,
      id_plannification: form.id_plannification,
      date_ajoute: new Date(),
      date_debut: oneZone.list.date_debut,
      date_fin: oneZone.list.date_fin,
      site: form.site
    }
  }).then((res) => {
    console.log(res)
    setTimeout(() => {
      location.reload()
    }, 500)
  })
}

const getAllDone = async (zone) => {
  const response = await axios.get(apiService.getUrl() + '/plannifie/zone/done?zone=' + zone)
  return response.data
}

const exportxlx = async (zone) => {
  const apiData = await getAllDone(zone)

  const data = [
    [
      'ZONE',
      'SITE',
      'DATE EN ATTENTE',
      'DATE DE PRISE EN COMPTE',
      'DATE AJOUT PAR LE SUPERVISEUR',
      'DATE DE DEBUT PREVUE',
      'DATE DE FIN PREVUE'
    ],
    ...apiData.map((item) => [
      item.zone,
      item.site,
      item.date_attente,
      item.date_prise_en_compte,
      item.date_ajoute,
      item.date_debut,
      item.date_fin,
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

onMounted(() => {
  // sitesByZone()
})
</script>

<template>
  <CardBoxModal v-model="isModalActive" title="Détails">
    <p>
      Zone: <b>{{ oneZone.list.zone }}</b>
    </p>
    <p>
      Sites à maintenir : <b>{{ oneZone.list.quota }}</b>
    </p>
    <p>
      Début :
      <b>{{
        oneZone.list.date_debut ? new Date(oneZone.list.date_debut).toISOString().split('T')[0] : ''
      }}</b>
    </p>
    <p>
      Fin :
      <b>{{
        oneZone.list.date_fin ? new Date(oneZone.list.date_fin).toISOString().split('T')[0] : ''
      }}</b>
    </p>
    <p>
      Site(s) ajouté(s) à la plannification : <b>{{ form.siteAddNb }}</b>
    </p>
    <div v-if="form.showRestOfItem == true">
      <FormField label="">
        <select v-model="form.site" class="form-select bg-white dark:bg-slate-800" @change="extractDates(form.site)">
          <option value="">Sélectionnez le site</option>
          <option v-for="(site, index) in siteDropDown.list" :key="index" :value="site.nom_site">
            {{ site.nom_site }}
          </option>
        </select>
        <br /><br />
        <BaseButton color="info" small label="Valider" @click="save()" />
      </FormField>
    </div>
    <div v-else></div>
  </CardBoxModal>

  <div v-if="checkedRows.length" class="p-3 bg-gray-100/50 dark:bg-slate-800">
    <span v-for="checkedRow in checkedRows" :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-slate-700">
      {{ checkedRow.name }}
    </span>
  </div>
  <div class="max-h-[32rem] overflow-x-auto">
    <table>
      <thead>
        <tr>
          <th v-if="checkable" />
          <th />
          <th>Date de plannification</th>
          <th>Equipe</th>
          <th>Début</th>
          <th>Fin</th>
          <th>Fin</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(site, index) in sites.list" :key="index">
          <TableCheckboxCell v-if="checkable" @checked="checked($event, site)" />
          <td class="border-b-0 lg:w-6 before:hidden">
            <!-- <UserAvatar :username="site.nom" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" /> -->
          </td>
          <td data-label="Date de plannification">
            {{ site.date_ajoute ? new Date(site.date_ajoute).toISOString().split('T')[0] : '' }}
          </td>
          <td data-label="Equipe">
            {{ site.zone }}
          </td>
          <td data-label="Date de début">
            {{ site.date_debut ? new Date(site.date_debut).toISOString().split('T')[0] : '' }}
          </td>
          <td data-label="Date de fin">
            {{ site.date_fin ? new Date(site.date_fin).toISOString().split('T')[0] : '' }}
          </td>
          <td class="before:hidden lg:w-1 whitespace-nowrap">
            <BaseButtons type="justify-start lg:justify-end" no-wrap>
              <BaseButton color="info" :icon="mdiPencil" small @click="showZone(site._id)" />
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
  </div>

  <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
    <BaseLevel>
      <BaseButtons>
        <BaseButton v-for="page in pagesList" :key="page" :active="page === currentPage" :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="currentPage = page" />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>
