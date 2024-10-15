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
  try {
    const response = await axios({
      url: apiService.getUrl() + '/zone/plannifie/central',
      method: 'GET'
    });

    if (Array.isArray(response.data)) {
      zoneCentralPlanned.list = response.data;
      console.log(zoneCentralPlanned.list);
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
  axios({
    url: apiService.getUrl() + '/equipement/central/' + oneZoneCentrale.list.nom,
    method: 'GET'
  }).then((res) => {
    console.log('Equipement GET', /* res.data */ form.zone_name)
    equipementCentralList.list = res.data
  }).catch((err) => {
    form.showErr = true;
    form.errmessage = 'An error occured ' + err.message
  })
}

const getEquipementForInterventionFunc = async (_id) => {
  axios({
    url: apiService.getUrl() + '/intervention/central/intervention/' + _id,
    method: 'GET'
  }).then((res) => {
    equipementCentralForIntervention.list = res.data
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
    form.id_zone = _id;
    isModalActive.value = true;
  })
}

const addEquipement = () => {
  axios({
    url: apiService.getUrl() + '/equipement/central',
    method: 'POST',
    data: {
      nom: form.nom_equipement,
      immatriculation: form.frequence,
      type: form.type,
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

const addIntervention = () => {
  axios({
    url: apiService.getUrl() + '/intervention/central',
    method: 'POST',
    data: {
      equipement: form.equipement,
      zone_central: form.id_zone
    }
  }).then((res) => {
    isModalActive.value = false
  }).catch((err) => {
    console.log('err ', err.message)
  })
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

const showDetails = (nom) => {
  isShowDetailActive.value = true
  form.zone_name = nom
  form.id_zone = nom
  getEquipementForIntervention()
}

const isShowPlannifModal = ref(false)

const addPlannif = (nom) => {
  isShowPlannifModal.value = true
  form.zone_name = nom
  getEquipementCentralList()
}

const createPlannif = () => {
  axios({
    url: apiService.getUrl() + '/plannif/central',
    method: 'POST',
    data: {
      zone: form.zone_name,
      date_debut: form.date_debut,
      date_fin: form.date_fin,
      quota: form.quota
    }
  }).then((res) => {
    isShowPlannifModal.value = false
  })
}

const equipementByTyupe = reactive({ list: [] })
const searchEquipementByType = () => {
  // console.log(apiService.getUrl() + '/equipement/central/' + form.type_equipement)
  axios({
    url: apiService.getUrl() + '/equipement/central/search/' + form.type_equipement + '/' + form.zone_name,
    method: 'GET'
  }).then((res) => {
    console.log('Search get ', res.data)
    equipementByTyupe.list = res.data
  }).catch((err) => {
    console.log('An error occured ', err.message)

  })
}

const deleteZone = (_id) => {
  axios({
    url: apiService.getUrl() + '/zone/' + _id,
    method: 'DELETE',
   
  }).then((res) => {
    isShowPlannifModal.value = false
    console.log(res.data)
    location.reload()
  }).catch((err) => {
    console.error(err.message)
  } )
}



onMounted(() => {
  getCentralZone()
  getCentralZonePlanned()
})
</script>

<template>
  <p style="padding: 10px">{{ zoneCentrale.list.length }} Zones</p>
  <CardBoxModal v-model="isShowPlannifModal" title="Supprimer">
    <!-- <BaseButton color="info" title="Actualiser" :icon="mdiRefresh" small @click="searchEquipementByType()" /> -->
    - Zone {{ form.zone_name }}
    <br>
    <p>Veillez confirmez la suppression</p>
    <br>
    <p>
      <BaseButtons>
        <BaseButton color="danger" label="Confirmer" small @click="deleteZone(form.zone_name)" />
        <BaseButton color="transparent" label="Annuler" small @click="isShowPlannifModal = false" />
      </BaseButtons>
    </p>
  </CardBoxModal>
  <CardBoxModal v-model="isShowDetailActive" title="Détails">
    <p>{{ form.zone_name }}</p>
    <p>Equipement(s) de la zone</p>
    <div class="max-h-[32rem] overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th v-if="checkable" />
            <th />
            <th>Equipement</th>
            <th>Zone</th>
            <th>0/0</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(equipement, index) in equipementAddForIntervention.list" :key="index">
            <TableCheckboxCell v-if="checkable" @checked="checked($event, zone)" />

            <td data-label="id">
              {{ equipement._id }}
            </td>
            <td data-label="Equipement">
              {{ equipement.nom }}
            </td>
            <td data-label="Date fin">
              {{ equipement.zone }}
            </td>
            <td class="before:hidden lg:w-1 whitespace-nowrap">
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </CardBoxModal>
  <CardBoxModal v-model="isModalActive" title="Equipements">

    <p>Zone : <strong>{{ oneZoneCentrale.list.nom }}</strong> </p>
    <table>
      <thead>
        <th />
        <th>Immatriculation</th>
        <th>Nom</th>
        <th>Type</th>
        <th />
      </thead>
      <tbody>
        <tr v-for="(equipement, index) in equipementCentralList.list" :key="index">
          <td class="border-b-0 lg:w-6 before:hidden">
            <!-- <UserAvatar :username="zone._id" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" /> -->
          </td>
          <td data-label="Immatriculation">
            {{ equipement.immatriculation }}
          </td>
          <td data-label="Nom">
            {{ equipement.nom }}
          </td>
          <td data-label="Type">
            {{ equipement.type }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="form.showAdd == true">
      <FormField label="Informations générale">
        <FormControl v-model="form.nom_equipement" placeholder="Nom de l'équipement" />
        <FormControl v-model="form.frequence" placeholder="Immatriculation" />
        <FormControl v-model="form.type" placeholder="Type d'équipement" />
        <BaseButton color="info" label="Enregistrer" @click="addEquipement()" />
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
          <th>Type</th>
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
          <td data-label="Type">
            - {{ zone.type }}
          </td>

          <td class="before:hidden lg:w-1 whitespace-nowrap">
            <BaseButtons type="justify-start lg:justify-end" no-wrap>
<!--               <BaseButton color="success" :icon="mdiTools" small @click="editZone(zone._id)" />
              <BaseButton color="info" :icon="mdiEye" small @click="showDetails(zone.nom)" />
              <BaseButton color="" :icon="mdiHome" small @click="addSalle()" /> -->
              <BaseButton color="danger" :icon="mdiTrashCan" small @click="addPlannif(zone._id)" />
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

