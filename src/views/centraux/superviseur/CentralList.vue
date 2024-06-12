<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiEye, mdiPencil, mdiTrashCan, mdiPlus, mdiArrowUp, mdiRefresh, mdiCalendar } from '@mdi/js'
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
  quota: 0
})

const zoneCentrale = reactive({ list: [] })
const oneZoneCentrale = reactive({ list: [] })
const equipementCentralList = reactive({ list: [] })
const equipementCentralForIntervention= reactive({ list: [] })


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

const zoneCentralPlanned = reactive({ list: []})
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
    console.log('res.data',res.data)
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

const equipementAddForIntervention = reactive({ list: []})

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

const showDetails = ( nom) => {
  isShowDetailActive.value = true
  form.zone_name = nom
  form.id_zone = nom
  getEquipementForIntervention()
}

const isShowPlannifModal = ref(false)

const addPlannif = (nom) => {
  isShowPlannifModal.value = true
  form.zone_name = nom
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



onMounted(() => {
  getCentralZone()
  getCentralZonePlanned()
})
</script>

<template>
  <p style="padding: 10px">{{ zoneCentrale.list.length }} Plannifications</p>
  <CardBoxModal v-model="isShowPlannifModal" title="Plannifier">
      - Zone {{ form.zone_name }}
      <p>- Quota {{ form.quota }}</p>
      <FormField label="Date de plannification">
        <FormControl v-model="form.date_debut" placeholder="Début" type="date"/>
        <FormControl v-model="form.date_fin" placeholder="Fin" type="date" />
        <BaseButton color="info" label="Enregistrer"  @click="createPlannif()" />
      </FormField>
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
  <CardBoxModal v-model="isModalActive" title="Initialisation">
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
    <BaseButton color="info" title="Actualiser"  label="Ajouter"
        @click="addIntervention()" />
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
          <th>Quota par semaine</th>
          <th>Début</th>
          <th>Fin</th>
          <th>Action</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(zone, index) in zoneCentralPlanned.list" :key="index">
          <TableCheckboxCell v-if="checkable" @checked="checked($event, zone)" />
          <td class="border-b-0 lg:w-6 before:hidden">
            <!-- <UserAvatar :username="zone._id" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" /> -->
          </td>
          <td data-label="Zone">
            <div v-if="zoneCentralPlanned.list.nom == zone.nom">
              {{ zone.zone }}
            </div>
            <div v-else>
              <span style="color: yellow">
                {{ zone.nom }}
                </span>
            </div>
          </td>
          <td data-label="Quota">
            0/{{ zone.quota }}
          </td>
          <td data-label="Date début">
            {{ zone.date_debut }}
          </td>
          <td data-label="Date fin">
            {{ zone.date_fin }}
          </td>
          <td class="before:hidden lg:w-1 whitespace-nowrap">
            <BaseButtons type="justify-start lg:justify-end" no-wrap>
              <BaseButton color="success" :icon="mdiPencil" small @click="editZone(zone._id)" />
              <BaseButton color="info" :icon="mdiEye" small @click="showDetails( zone.nom)" />
              <BaseButton color="warning" :icon="mdiCalendar" small @click="addPlannif(zone.nom)" />
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
