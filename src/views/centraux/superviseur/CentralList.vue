<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiEye, mdiPencil, mdiTrashCan, mdiPlus, mdiArrowUp, mdiRefresh } from '@mdi/js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import FormControl from '@/components/FormControl.vue'
import FormField from '@/components/FormField.vue'

// import UserAvatar from '@/components/UserAvatar.vue'
import axios from 'axios'
// import { useRouter } from 'vue-router'
import apiService from '@/services/apiService'

defineProps({
  checkable: Boolean
})
const form = reactive({
  showErr: false,
  showAdd: false,
  errmessage: '',
  equipement: '',
  nom_equipement: '',
  zone_name: '',
  ajouter_par: '',
  frequence: ''
})

const zoneCentrale = reactive({ list: [] })
const oneZoneCentrale = reactive({ list: [] })
const equipementCentralList = reactive({ list: [] })

const getCentralZone = async () => {
  axios({
    url: apiService.getUrl() + '/zone/central',
    method: 'GET'
  }).then((res) => {
    // console.log(res.data)
    zoneCentrale.list = res.data
  }).catch((err) => {
    form.showErr = true;
    form.errmessage = 'An error occured ' + err.message
  })
}

const getEquipementCentralList = async () => {
  axios({
    url: apiService.getUrl() + '/equipement/central/' + oneZoneCentrale.list.nom,
    method: 'GET'
  }).then((res) => {
    console.log('res.data',res.data)
    equipementCentralList.list = res.data
  }).catch((err) => {
    form.showErr = true;
    form.errmessage = 'An error occured ' + err.message
  })
}

const editZone = (_id) => {
  axios({
    url: apiService.getUrl() + '/zone/' + _id,
    method: 'GET'
  }).then(async (res) => {
    await getEquipementCentralList()
    form.ajouter_par = localStorage.getItem('nom') + ' ' + localStorage.getItem('prenom')
    oneZoneCentrale.list = res.data[0]
    isModalActive.value = true;
  })
}

const addEquipement = () => {
  axios({
    url: apiService.getUrl() + '/equipement/central',
    method: 'POST',
    data: {
      nom: form.nom_equipement,
      frequence: form.frequence,
      zone: oneZoneCentrale.list.nom,
      ajouter_par: form.ajouter_par
    }
  }).then((res) => {
    form.showAdd = false;
    form.nom_equipement = ''
    form.frequence = ''
    getEquipementCentralList()
  })
}



const mainStore = useMainStore()

const items = computed(() => mainStore.clients)

const isModalActive = ref(false)

// const isModalDangerActive = ref(false)

const perPage = ref(5)

const currentPage = ref(0)

const checkedRows = ref([])

const numPages = computed(() => Math.ceil(items.value.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []
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



onMounted(() => {
  getCentralZone()
})
</script>

<template>
  <p style="padding: 10px">{{ zoneCentrale.list.length }} Plannifications</p>
  <CardBoxModal v-model="isModalActive" title="Détails">
    <p>Zone : <strong>{{ oneZoneCentrale.list.nom }}</strong> </p>
    <div v-if="form.showAdd == true">
      <BaseButton color="info" title="Actualiser" :icon="mdiRefresh" small
        @click="getEquipementCentralList()" />
      <BaseButton color="info" title="Ajouter un équipement" :icon="mdiArrowUp" small
        @click="form.showAdd = !form.showAdd" />
        <select v-model="form.equipement" class="form-select bg-white dark:bg-slate-800">
      <option value="">Séléctionnez une Equipement</option>
      <option v-for="(equipement, index) in equipementCentralList.list" :key="index" :value="equipement._id">
        {{ equipement.nom }}
      </option>
    </select>
    </div>

    <div v-else>
      <BaseButton color="info" title="Actualiser" :icon="mdiRefresh" small
        @click="getEquipementCentralList()" />
      <BaseButton color="info" title="Ajouter un équipement" :icon="mdiPlus" small
        @click="form.showAdd = !form.showAdd" />
        <select v-model="form.equipement" class="form-select bg-white dark:bg-slate-800">
      <option value="">Séléctionnez une Equipement</option>
      <option v-for="(equipement, index) in equipementCentralList.list" :key="index" :value="equipement._id">
       {{ equipement._id }} | {{ equipement.nom }} |  {{  equipement.zone }}
      </option>
    </select>
    </div>

    <div v-if="form.showAdd == true">
      <FormField label="Informations générale">
        <FormControl v-model="form.nom_equipement" placeholder="Nom de l'équipement" />
        <FormControl v-model="form.frequence" placeholder="Fréquence de maintenance" />
        <BaseButton color="info" label="Enregistrer"  @click="addEquipement()" />
      </FormField>
    </div>
    <p>Utilisateur : {{ form.ajouter_par }}</p>

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
          <th>Nombre d'équipements</th>
          <th>Quota par semaine</th>
          <th>Début</th>
          <th>Fin</th>
          <th>Action</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(zone, index) in zoneCentrale.list" :key="index">
          <TableCheckboxCell v-if="checkable" @checked="checked($event, zone)" />
          <td class="border-b-0 lg:w-6 before:hidden">
            <!-- <UserAvatar :username="zone._id" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" /> -->
          </td>
          <td data-label="Zone">
            {{ zone.nom }}
          </td>
          <td data-label="Nombre d'équipements">
          </td>
          <td data-label="Date début">
          </td>
          <td data-label="Date fin">
          </td>
          <td data-label="Date fin">
          </td>
          <td class="before:hidden lg:w-1 whitespace-nowrap">
            <BaseButtons type="justify-start lg:justify-end" no-wrap>
              <BaseButton color="success" :icon="mdiPencil" small @click="editZone(zone._id)" />
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
        <BaseButton v-for="page in pagesList" :key="page" :active="page === currentPage" :label="page + 1"
          :color="page === currentPage ? 'lightDark' : 'whiteDark'" small @click="currentPage = page" />
      </BaseButtons>
      <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
    </BaseLevel>
  </div>
</template>
