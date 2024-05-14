<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiEye, /* mdiTrashCan */ } from '@mdi/js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
// import UserAvatar from '@/components/UserAvatar.vue'
import axios from 'axios'
// import { useRouter } from 'vue-router'
import apiService from '@/services/apiService'

defineProps({
  checkable: Boolean
})

const sites = reactive({ list: [] })
// const router = useRouter()

// Fait
const getAllSite = () => {
  axios({
    url: apiService.getUrl() + '/preventive',
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

const oneZone = reactive({ list: [] })

const showZone = (id) => {
  isModalActive.value = true
  axios({
    url: apiService.getUrl() + '/preventive/' + id,
    method: 'GET'
  }).then((response) => {
    oneZone.list = response.data
  })
}

onMounted(() => { })
</script>

<template>
  <CardBoxModal v-model="isModalActive" title="Détails">
    <p>
      Zone: <b>{{ oneZone.list.zone }}</b>
    </p>
    <p>Nombre Total de Site: <b>{{ oneZone.list.nombre_total_site }}</b></p>
    <p>Quotas par semaine : <b>{{ oneZone.list.quota_semaine }}</b></p>
    <p>Nombre effectué cette semaine : <b>{{ oneZone.list.quota_semaine }}</b></p>
    <p>Site(s) fait(s) : <b>0</b></p>
    <p>Site(s) restant(s) : <b>0</b></p>
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
          <th>Zone</th>
          <th>Nombre de sites</th>
          <th>Quota par semaine</th>
          <th>Début</th>
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
          <td data-label="Zone">
            {{ site.zone }}
          </td>
          <td data-label="Nombre de site">
            {{ site.nombre_total_site }}
          </td>
          <td data-label="Quota par semaine">
            {{ site.quota_semaine }}
          </td>
          <td data-label="Date début">
            {{ site.date_debut ? new Date(site.date_debut).toISOString().split('T')[0] : '' }}
          </td>
          <td data-label="Date fin">
            {{ site.date_fin ? new Date(site.date_fin).toISOString().split('T')[0] : '' }}
          </td>
          <td class="before:hidden lg:w-1 whitespace-nowrap">
            <BaseButtons type="justify-start lg:justify-end" no-wrap>
              <BaseButton color="info" :icon="mdiEye" small @click="showZone(site._id)" />
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
