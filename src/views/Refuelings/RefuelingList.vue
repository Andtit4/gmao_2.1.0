<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import CardBoxModal from '@/components/CardBoxModal.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import apiService from '@/services/apiService'
import FormControl from '@/components/FormControl.vue'
import FormField from '@/components/FormField.vue'
import SectionMain from '@/components/SectionMain.vue'


defineProps({
  checkable: Boolean
})

const sites = reactive({ list: [] })

const getAllSite = () => {
  axios({
    url: apiService.getUrl() + '/refueling/index',
    method: 'GET'
  })
    .then((response) => {
      sites.list = response.data
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}



const mainStore = useMainStore()

const items = computed(() => mainStore.clients)

const isModalActive = ref(false)

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

const oneZone = reactive({ list: [] })


onMounted(() => { })
</script>

<template>
  <CardBoxModal v-model="isModalActive" title="Détails">
    <p>Intitulé zone: <b>{{ oneZone.list.nom }}</b></p>
    <p>This is sample modal</p>
  </CardBoxModal>

  <div v-if="checkedRows.length" class="p-3 bg-gray-100/50 dark:bg-slate-800">
    <span v-for="checkedRow in checkedRows" :key="checkedRow.id"
      class="inline-block px-2 py-1 rounded-sm mr-2 text-sm bg-gray-100 dark:bg-slate-700">
      {{ checkedRow.name }}
    </span>
  </div>
  <SectionMain>
    <FormField label="Rechercher">
      <FormControl placeholder="Entrez le nom du site" />
      <FormControl placeholder="Entrez la zone" />
    </FormField>
  </SectionMain>
  <table>
    <thead>
      <tr>
        <th v-if="checkable" />
        <th />
        <th>Date de relevée</th>
        <th>Sites</th>
        <th>Zones</th>
        <th>Quantité restante</th>
        <th>Index</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(site, index) in sites.list" :key="index">
        <TableCheckboxCell v-if="checkable" @checked="checked($event, site)" />
        <td class="border-b-0 lg:w-6 before:hidden">
          <!-- <UserAvatar :username="site.nom" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" /> -->
        </td>
        <td data-label="Date relevée">
          {{ site.date_releve }}
        </td>
        <td data-label="Site">
          {{ site.site }}
        </td>
        <td data-label="Zone">
          {{ site.zone }}
        </td>
        <td data-label="Quantité restante">
          {{ site.quantite }}
        </td>
        <td data-label="Index">
          {{ site.site_index }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
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
</template>
