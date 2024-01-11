<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiEye, mdiTrashCan } from '@mdi/js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import UserAvatar from '@/components/UserAvatar.vue'
import axios from 'axios'
// import { useRouter } from 'vue-router'
import apiService from '@/services/apiService'

defineProps({
  checkable: Boolean
})

const equipements = reactive({ list: [] })
// const router = useRouter()

const getAllEquipement = () => {
  axios({
    url: apiService.getUrl() + '/materiel',
    method: 'GET'
  })
    .then((response) => {
      equipements.list = response.data
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}

const deleteEquipement = (_id) => {
  axios({
    url: apiService.getUrl() + '/materiel/'  + _id,
    method: "DELETE",
  })
    .then((response) => {
      console.log(response);
      setTimeout(() => {
        location.reload();
      }, 1000);
    })
    .catch((e) => {
      console.log("An error occured " + e);
    });
};




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
  getAllEquipement()
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

const result = reactive({ list: []})
const search = (_id) => {
  axios({
    url: apiService.getUrl() + '/materiel/' + _id,
    method: "GET"
  }).then((response) => {
    result.list = response.data
    isModalActive.value = true
  })
}

onMounted(() => {})
</script>

<template>
  <CardBoxModal v-model="isModalActive" title="Détails">
    <p><b>Type d'équipement: </b>{{ result.list.type_equipement }} </p>
    <p><b>Nombre total: </b>{{ result.list.total }} </p>
    <p><b>Nombre disponible: </b>{{ result.list.nombre_disponible }} </p>
    <p><b>Ajouté le: </b>{{ result.list.ajouter_le }} </p>
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

  <table>
    <thead>
      <tr>
        <th v-if="checkable" />
        <th />
        <th>Lot</th>
        <th>Type d'équipement</th>
        <th>Total</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(equipement, index) in equipements.list" :key="index">
        <TableCheckboxCell v-if="checkable" @checked="checked($event, equipement)" />
        <td class="border-b-0 lg:w-6 before:hidden">
          <UserAvatar :username="equipement.type_equipement" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" />
        </td>
        <td data-label="Lot">
          {{ equipement.nom_lot }}
        </td>
        <td data-label="Type d'équipement">
          {{ equipement.type_equipement }}
        </td>
        <td data-label="Total">
          {{ equipement.total }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton color="info" :icon="mdiEye" small @click="search(equipement._id)" />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="deleteEquipement(equipement._id)"
            />
          </BaseButtons>
        </td>
      </tr>
    </tbody>
  </table>
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
