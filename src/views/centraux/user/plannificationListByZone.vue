<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiEye, mdiPencil, mdiTrashCan, mdiPlus, mdiArrowUp, mdiRefresh, mdiCalendar, mdiTools, mdiHome } from '@mdi/js'
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
  idEquipementSelect: '',
  nomEquipementSelect: '',
  zone_name: '',
  ajouter_par: '',
  frequence: '',
  id_zone: '',
  date_debut: '',
  date_fin: '',
  type: '',
  type_equipement: '',
  quota: 0
})

const zoneCentrale = reactive({ list: [] })
const oneZoneCentrale = reactive({ list: [] })
const equipementCentralList = reactive({ list: [] })
const equipementCentralForIntervention = reactive({ list: [] })


const getCentralZone = async () => {
  axios({
    url: apiService.getUrl() + '/zone/central',
    method: 'GET'
  }).then((res) => {
    // console.log(res.data)
    zoneCentrale.list = res.data
    // getEquipementForInterventionFunc(res.data.)
  }).catch((err) => {
    form.showErr = true;
    form.errmessage = 'An error occured ' + err.message
  })
}

const zoneCentralPlanned = reactive({ list: [] })
const getCentralZonePlanned = async () => {
  /* axios({
    url: apiService.getUrl() + '/zone/plannifie/central',
    method: 'GET'
  }).then(async (res) => {
    zoneCentralPlanned.list = await res.data
    console.log(zoneCentralPlanned.list)
    // getEquipementForInterventionFunc(res.data.)
  }).catch((err) => {
    form.showErr = true;
    form.errmessage = 'An error occured ' + err.message
  }) */

  try {
    const response = await axios({
      url: apiService.getUrl() + '/zone/plannifie/central',
      method: 'GET'
    });

    if (Array.isArray(response.data)) {
      zoneCentralPlanned.list = response.data;
      // console.log(zoneCentralPlanned.list);
    } else {
      console.error('Unexpected response format:', response.data);
      form.showErr = true;
      form.errmessage = 'Unexpected response format';
    }
  } catch (err) {
    form.showErr = true;
    form.errmessage = 'An error occurred: ' + err.message;
  }
}


const getEquipementCentralList = async () => {
  // console.info(mainStore.userZone)
  try {
    const res = await axios({
      url: apiService.getUrl() + '/plannif/central/' +  mainStore.userZone,
      method: 'GET'
    });
    console.log('Equipement GET', form.zone_name);
    equipementCentralList.list = res.data;
  } catch (err) {
    form.showErr = true;
    form.errmessage = 'An error occurred: ' + err.message;
  }
}


const mainStore = useMainStore()

const items = computed(() => mainStore.clients)

const isModalActive = ref(false)

// const isModalDangerActive = ref(false)

const perPage = ref(5)

const currentPage = ref(0)

const checkedRows = ref([])

const numPages = computed(() => Math.ceil(equipementCentralList.list.length / perPage.value))

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



const showModalForDelete = ref(false)

// const equipementSelect = reactive({ list: []});


const addPlannif = (nom) => {
  showModalForDelete.value = true
  form.idEquipementSelect = nom._id
  form.nomEquipementSelect = nom.zone
  // getEquipementCentralList()
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

const deleteSalle = (_id) => {
  axios({
    url: apiService.getUrl() + '/plannif/central/' + _id,
    method: 'DELETE'
  }).then((res) => {
    console.log(res.data)
    location.reload()
  }).catch((err) => {
    console.error(err.message)
  })

}



onMounted(() => {
  getCentralZone()
  getCentralZonePlanned()
  getEquipementCentralList()
})
</script>

<template>
  <p style="padding: 10px">{{ equipementCentralList.list.length }} Plannification(s)</p>

  <div v-if="checkedRows.length" class="p-3 bg-gray-100/50 dark:bg-slate-800">
    <!-- Plannifications  -->
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
          <th>Début</th>
          <th>Fin</th>
          <th>Equipements</th>
          <th>Action</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(equipement, index) in equipementCentralList.list" :key="index">
          <TableCheckboxCell v-if="checkable" @checked="checked($event, zone)" />
          <td class="border-b-0 lg:w-6 before:hidden">
            <!-- <UserAvatar :username="zone._id" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" /> -->
          </td>
          <td data-label="Zone">
            {{ equipement.zone }}
          </td>
          <td data-label="Date début">
            {{ equipement.date_debut ? formatDate(equipement.date_debut) : 'Date invalide' }}
          </td>
          <td data-label="Date fin">
            {{ equipement.date_fin ? formatDate(equipement.date_fin) : 'Date invalide' }}
          </td>
          <td data-label="Equipement">
            {{ equipement.equipement == '' ? 'Tous les équipements' : equipement.equipement }}
          </td>
          <td class="before:hidden lg:w-1 whitespace-nowrap">
            <BaseButtons type="justify-start lg:justify-end" no-wrap>
              <BaseButton color="danger" :icon="mdiTrashCan" small @click="addPlannif(equipement)" />
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
