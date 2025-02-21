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
import * as XLSX from 'xlsx'

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
  quota: 0,
  showAddPiece: false,
  intitule: '',
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
  try {
    const res = await axios({
      url: apiService.getUrl() + '/equipement/central/',
      method: 'GET'
    });
    console.log('Equipement GET', form.zone_name);
    equipementCentralList.list = res.data;
  } catch (err) {
    form.showErr = true;
    form.errmessage = 'An error occurred: ' + err.message; // Correction du message d'erreur
  }
}


const pieces = reactive({ list: [] })

const getPieceOfEquipement = async () => {
  try {
    const res = await axios({
      url: apiService.getUrl() + '/equipement/central/all/piece',
      method: 'GET'
    });
    console.log('Equipement GET', form.zone_name);
    pieces.list = res.data;
  } catch (err) {
    form.showErr = true;
    form.errmessage = 'An error occurred: ' + err.message; // Correction du message d'erreur
  }
}



const exportToExcel = () => {
  // Créer un nouveau classeur Excel
  const workbook = XLSX.utils.book_new();

  // Récupérer les données des équipements et des pièces
  Promise.all([
    axios({
      url: apiService.getUrl() + '/equipement/central/',
      method: 'GET'
    }),
    axios({
      url: apiService.getUrl() + '/equipement/central/all/piece', 
      method: 'GET'
    })
  ])
  .then(([equipementsRes, piecesRes]) => {
    // Créer la feuille des équipements
    const equipementsData = equipementsRes.data.map(item => ({
      Reference: item.reference,
      Intitule: item.nom,
      Type: item.type,
      Site: item.site,
      Zone: item.zone,
      'Ajouté par': item.ajouter_par
    }));
    const equipementsSheet = XLSX.utils.json_to_sheet(equipementsData);
    XLSX.utils.book_append_sheet(workbook, equipementsSheet, "Equipements");

    // Créer la feuille des pièces
    const piecesData = piecesRes.data.map(item => ({
      'Référence equipement': item.referenceEquipement || '',
      'Nom Equipement': item.nomEquipement || '',
      'Type Equipement': item.typeEquipement || '',
      Site: item.site || '',
      Zone : item.zone || '',
      'Pièce': item.piece || ''
    }));
    const piecesSheet = XLSX.utils.json_to_sheet(piecesData);
    XLSX.utils.book_append_sheet(workbook, piecesSheet, "Pieces");

    // Générer et télécharger le fichier Excel
    XLSX.writeFile(workbook, "equipements_et_pieces.xlsx");
  })
  .catch(err => {
    form.showErr = true;
    form.errmessage = 'Une erreur est survenue lors de l\'export: ' + err.message;
  });

}
/* 
const getEquipementForInterventionFunc = async (_id) => {
  axios({
    url: apiService.getUrl() + '/intervention/central/intervention/' + _id,
    method: 'GET'
  }).then((res) => {
    equipementCentralForIntervention.list = res.data
  })
}
 */
const editZone = async (equipement) => { // Changement de la fonction pour être asynchrone
  form.showAddPiece = true;
  form.id_equipement = equipement._id;
  /* try {
    const res = await axios({
      url: apiService.getUrl() + '/zone/' + _id,
      method: 'GET'
    });
    await getEquipementCentralList();
    form.ajouter_par = localStorage.getItem('nom') + ' ' + localStorage.getItem('prenom');
    oneZoneCentrale.list = res.data[0];
    form.id_zone = _id;
    isModalActive.value = true;
  } catch (err) {
    form.showErr = true;
    form.errmessage = 'An error occurred: ' + err.message; // Ajout de la gestion des erreurs
  } */
}

const addPiece = async () => {
  try {
    await axios({
      url: apiService.getUrl() + '/piece',
      method: 'POST',
      data: {
        id_equipement: form.id_equipement,
        intitule: form.intitule,
      }
    });
    form.showAdd = false;
    form.nom_equipement = '';
    form.frequence = '';
    await getEquipementCentralList(); // Ajout de await pour s'assurer que la liste est mise à jour
    location.reload()
  } catch (err) {
    form.showErr = true;
    form.errmessage = 'An error occurred: ' + err.message; // Ajout de la gestion des erreurs
  }
}

const addEquipement = async () => { // Changement de la fonction pour être asynchrone
  try {
    await axios({
      url: apiService.getUrl() + '/equipement/central',
      method: 'POST',
      data: {
        nom: form.nom_equipement,
        immatriculation: form.frequence,
        type: form.type,
        zone: oneZoneCentrale.list.nom,
        ajouter_par: form.ajouter_par
      }
    });
    form.showAdd = false;
    form.nom_equipement = '';
    form.frequence = '';
    await getEquipementCentralList(); // Ajout de await pour s'assurer que la liste est mise à jour
  } catch (err) {
    form.showErr = true;
    form.errmessage = 'An error occurred: ' + err.message; // Ajout de la gestion des erreurs
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

const openDeleteConfirmBox = (nom) => {
  showModalForDelete.value = true
  form.idEquipementSelect = nom._id
  form.nomEquipementSelect = nom.nom
  // getEquipementCentralList()
}


const deleteEquipement = (_id) => {
  axios({
    url: apiService.getUrl() + '/equipement/central/' + _id,
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
  <p style="padding: 10px">{{ equipementCentralList.list.length }} Equipements</p>

  <!-- Ajouter une piece -->
  <CardBoxModal v-model="form.showAddPiece" title="Ajouter une pièce">
    <FormField label="Information générale"> 
      <FormControl v-model="form.intitule" placeholder="Intitulé" />
    </FormField>
    <p>
      <BaseButtons>
        <BaseButton color="info" label="Valider" small @click="addPiece()" />
      </BaseButtons>
    </p>
  </CardBoxModal>

  
  <CardBoxModal v-model="showModalForDelete" title="Suppression">
    <p>Veuillez confirmer la suppression de <strong> {{ form.nomEquipementSelect }} </strong></p>
    <br>
    <p>
      <BaseButtons>
        <BaseButton color="danger" label="Confirmer" small @click="deleteEquipement(form.idEquipementSelect)" />
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
    <BaseButton color="success" label="Export" @click="exportToExcel()" />

    <table>
      <thead>
        <tr>
          <th v-if="checkable" />
          <th />
          <th>Référence</th>
          <th>Intitulé</th>
          <th>Type</th>
          <th>Site</th>
          <th>Zone</th>
          <th>Ajouté par</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(equipement, index) in equipementCentralList.list" :key="index">
          <TableCheckboxCell v-if="checkable" @checked="checked($event, zone)" />
          <td class="border-b-0 lg:w-6 before:hidden">
            <!-- <UserAvatar :username="zone._id" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" /> -->
          </td>
          <td data-label="Référence">
            {{ equipement.reference }}
          </td>
          <td data-label="Intitulé">
            {{ equipement.nom }}
          </td>
          <td data-label="Type">
            {{ equipement.type }}
          </td>
          <td data-label="Site">
            {{ equipement.site }}
          </td>
          <td data-label="Zone">
            {{ equipement.zone }}
          </td>
          <td data-label="Ajouté par">
            {{ equipement.ajouter_par }}
          </td>
          <td class="before:hidden lg:w-1 whitespace-nowrap">
            <BaseButtons type="justify-start lg:justify-end" no-wrap>
              <BaseButton color="success" :icon="mdiTools" small @click="editZone(equipement)" />
<!--               <BaseButton color="info" :icon="mdiEye" small @click="showDetails(equipement.nom)" />
              <BaseButton color="" :icon="mdiHome" small @click="addSalle()" /> -->
              <BaseButton color="danger" :icon="mdiTrashCan" small @click="openDeleteConfirmBox(equipement)" />
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
