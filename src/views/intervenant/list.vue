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

const intervenants = reactive({ list: [] })
// const router = useRouter()

const getAllIntervenant = () => {
  axios({
    url: apiService.getUrl() + '/intervenant',
    method: 'GET'
  })
    .then((response) => {
      intervenants.list = response.data
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}

const deleteIntervenant = (_id) => {
  axios({
    url: apiService.getUrl() + '/intervenant/'  + _id,
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

const perPage = ref(5)

const currentPage = ref(0)

const checkedRows = ref([])

const numPages = computed(() => Math.ceil(items.value.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []
  getAllIntervenant()
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

onMounted(() => {})
</script>

<template>
  <CardBoxModal v-model="isModalActive" title="Sample modal">
    <p>Lorem ipsum dolor sit amet <b>adipiscing elit</b></p>
    <p>This is sample modal</p>
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
        <th>Zone</th>
        <th>Nom</th>
        <th>Prénom</th>
        <th>Email</th>
        <th>Type utilisateur</th>
        <th>Mot de passe</th>
        <th />
      </tr>
    </thead>
    <tbody>
      <tr v-for="(intervenant, index) in intervenants.list" :key="index">
        <TableCheckboxCell v-if="checkable" @checked="checked($event, intervenant)" />
        <td class="border-b-0 lg:w-6 before:hidden">
          <UserAvatar :username="intervenant.nom" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" />
        </td>
        <td data-label="Zone">
          {{ intervenant.zone }}
        </td>
        <td data-label="Nom ">
          {{ intervenant.nom }}
        </td>
        <td data-label="Prénom">
          {{ intervenant.prenom }}
        </td>
        <td data-label="Email">
          {{ intervenant.email }}
        </td>
        <td data-label="Type utilisateur">
          {{ intervenant.type_utilisateur }}
        </td>
        <td data-label="Mot de passe">
          {{ intervenant.mot_de_passe }}
        </td>
        <td class="before:hidden lg:w-1 whitespace-nowrap">
          <BaseButtons type="justify-start lg:justify-end" no-wrap>
            <BaseButton color="info" :icon="mdiEye" small @click="isModalActive = true" />
            <BaseButton
              color="danger"
              :icon="mdiTrashCan"
              small
              @click="deleteIntervenant(intervenant._id)"
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
