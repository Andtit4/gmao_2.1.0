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
const zoneCentralPlanned = reactive({ list: [] })

const fetchData = async (url) => {
  try {
    const response = await axios.get(apiService.getUrl() + url);
    return response.data;
  } catch (err) {
    form.showErr = true;
    form.errmessage = 'An error occurred: ' + err.message;
    return [];
  }
}

const getCentralZone = async () => {
  zoneCentrale.list = await fetchData('/zone/central');
}

const getCentralZonePlanned = async () => {
  zoneCentralPlanned.list = await fetchData('/zone/plannifie/central');
}

const getEquipementCentralList = async () => {
  equipementCentralList.list = await fetchData('/salle');
}

const editZone = async (_id) => {
  const res = await fetchData('/zone/' + _id);
  if (res.length) {
    oneZoneCentrale.list = res[0];
    form.id_zone = _id;
    form.ajouter_par = `${localStorage.getItem('nom')} ${localStorage.getItem('prenom')}`;
    isModalActive.value = true;
  }
}

const addEquipement = async () => {
  try {
    await axios.post(apiService.getUrl() + '/equipement/central', {
      nom: form.nom_equipement,
      immatriculation: form.frequence,
      type: form.type,
      zone: oneZoneCentrale.list.nom,
      ajouter_par: form.ajouter_par
    });
    form.showAdd = false;
    form.nom_equipement = '';
    form.frequence = '';
    await getEquipementCentralList();
  } catch (err) {
    form.showErr = true;
    form.errmessage = 'An error occurred: ' + err.message;
  }
}

const addIntervention = async () => { // Changement de la fonction pour être asynchrone
  try {
    await axios({
      url: apiService.getUrl() + '/intervention/central',
      method: 'POST',
      data: {
        equipement: form.equipement,
        zone_central: form.id_zone
      }
    });
    isModalActive.value = false;
  } catch (err) {
    console.log('err ', err.message); // Ajout de la gestion des erreurs
  }
}

const equipementAddForIntervention = reactive({ list: [] })

const getEquipementForIntervention = () => {
  axios({
    url: apiService.getUrl() + '/equipement/central/intervention/' + form.id_zone,
    method: 'GET',
  }).then((res) => {
    equipementAddForIntervention.list = res.data
    console.log(res.data)
  }).catch((err) => {
    console.log('err ', err.message)
  })
}


const mainStore = useMainStore()

const items = computed(() => mainStore.clients)

const isModalActive = ref(false)
const isShowDetailActive = ref(false)

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

const showDetails = (nom) => {
  isShowDetailActive.value = true
  form.zone_name = nom
  form.id_zone = nom
  getEquipementForIntervention()
}

const showModalForDelete = ref(false)

// const equipementSelect = reactive({ list: []});

const addPlannif = (nom) => {
  showModalForDelete.value = true
  form.idEquipementSelect = nom._id
  form.nomEquipementSelect = nom.nom
  // getEquipementCentralList()
}


const deleteSalle = (_id) => {
  axios({
    url: apiService.getUrl() + '/salle/' + _id,
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
  <p style="padding: 10px">{{ equipementCentralList.list.length }} Salles</p>
  <CardBoxModal v-model="showModalForDelete" title="Suppression">
    <p>Veuillez confirmer la suppression de <strong> {{ form.nomEquipementSelect }} </strong></p>
    <br>
    <p>
      <BaseButtons>
        <BaseButton color="danger" label="Confirmer" small @click="deleteSalle(form.idEquipementSelect)" />
        <BaseButton color="transparent" label="Annuler" small @click="showModalForDelete = false" />
      </BaseButtons>
    </p>
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
          <th>Salle Id</th>
          <th>Intitulé</th>
          <th>Zone</th>
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
          <td data-label="Salle Id">
            {{ equipement.salle_id }}
          </td>
          <td data-label="Intitulé">
            {{ equipement.nom }}
          </td>
          <td data-label="Zone">
            {{ equipement.zone }}
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
