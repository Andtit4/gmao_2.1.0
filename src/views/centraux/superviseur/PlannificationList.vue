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
import LoadingButton from '@/layouts/LoadingButton.vue'


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
    id_plannification: 0,
    zone: '',
    equipement: '',
    date_debut: '',
    date_fin: '',
    intervenant: '',

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

const intervenants = reactive({ list: [] })
const getIntervenant = async () => {
    axios({
        url: apiService.getUrl() + '/intervenant/one/CENTRAUX',
        method: 'GET'
    }).then((res) => {
        intervenants.list = res.data
    }).catch((err) => {
        form.showErr = true
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

        // const data = response.data;
        const data = response.data;
        console.log("data ", data);

        /* if (Array.isArray(response.data)) {
            
        } else {
            console.error('Unexpected response format:', response.data);
            form.showErr = true;
            form.errmessage = 'Unexpected response format';
        } */
    } catch (err) {
        form.showErr = true;
        form.errmessage = 'An error occurred: ' + err.message;
    }
}


const getEquipementCentralList = async () => {
    try {
        const res = await axios({
            url: apiService.getUrl() + '/plannif/central',
            method: 'GET'
        });
        console.log('Equipement GET', form.zone_name);
        equipementCentralList.list = res.data;
    } catch (err) {
        form.showErr = true;
        form.errmessage = 'An error occurred: ' + err.message; // Correction du message d'erreur
    }
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
const editZone = async (_id) => { // Changement de la fonction pour être asynchrone
    try {
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

const isLoading = ref(false)
const showModalForConfirmPlanif = ref(false)
const initPlan = (plan) => {
    showModalForConfirmPlanif.value = true
    form.id_plannification = plan._id;
    form.zone = plan.zone;
    form.equipement = plan.equipement
    form.date_debut = plan.date_debut
    form.date_fin = plan.date_fin
    getPlannificationItems();
}

const equipementsList = reactive({ list: [] })
const getEquipementByZone = async (zone) => {
    await axios({
        url: apiService.getUrl() + '/equipement/central/' + zone,
        method: 'GET',
    }).then((res) => {
        equipementsList.list = res.data
        console.log("equi ", equipementsList.list.length)
        if (equipementsList.list.length == 0) {
            console.log("error showing")
            form.showErr == true
            form.errmessage = "Veuillez ajouter un equipement à cette zone"
            isLoading.value == false
        }
    }).catch((err) => {
        console.error('an error occured  equi list')
        isLoading.value = false;
    })
}

const getEquipementByTypeZone = async (type, zone) => {
    await axios({
        url: apiService.getUrl() + '/equipement/central/search/' + type + '/' + zone,
        method: 'GET',
    }).then((res) => {
        equipementsList.list = res.data
        // console.log("equi ", equipementsList.list.length)
    }).catch((err) => {
        console.error('an error occured  equi list')
        isLoading.value = false;
    })
}

const addEquipementToTable = (equipement) => {
    axios({
        url: apiService.getUrl() + '/equipement/plannif/central',
        method: 'POST',
        data: {
            zone: form.zone,
            date_debut: form.date_debut,
            date_fin: form.date_fin,
            equipement: equipement,
            id_planification: form.id_plannification,
            assigner: form.intervenant
        }
    }).then((res) => {
        console.log(res.data)
        location.reload()
        isLoading.value = false
    }).catch((err) => {
        console.error(err.message)
    })
}

const getPlannificationItemsList = reactive({ list: [] })
const getPlannificationItems = () => {
    axios({
        url: apiService.getUrl() + '/equipement/plannif/central/' + form.id_plannification,
        method: 'GET'
    }).then((res) => {
        getPlannificationItemsList.list = res.data;
        console.log('plannif item ', getPlannificationItemsList.list.length)
        
    }).catch((err) => {
        console.error(err.message)
    })
}

const addPlannification = async () => {
    if (form.equipement == '') {
        isLoading.value = true;
        console.log('true')
        await getEquipementByZone(form.zone);
        // console.log(getEquipementByZone(form.zone))
        if (equipementsList.list && equipementsList.list.length > 0) {
            equipementsList.list.forEach(equipement => {
                addEquipementToTable(equipement._id)
            })
            isLoading.value = false
            // location.reload()
        }
    } else {
        isLoading.value = true;
        await getEquipementByTypeZone(form.equipement, form.zone);
        if (equipementsList.list && equipementsList.list.length > 0) {
            equipementsList.list.forEach(equipement => {
                addEquipementToTable(equipement._id)
            })
            isLoading.value = false
            // location.reload()
        }
    }
}



onMounted(() => {
    getCentralZone()
    getCentralZonePlanned()
    getEquipementCentralList()
    getIntervenant()
})
</script>

<template>
    <CardBoxModal v-model="showModalForConfirmPlanif" title="Confirmer la Plannification">
        <div v-if="getPlannificationItemsList.list.length == 0">
            <p>Plannification N°{{ form.id_plannification }}
            </p>
            <div v-if="equipementsList.list.length == 0">
                {{ form.errmessage }}
            </div>
            Zone <strong>{{ form.zone }}</strong>
            <br>
            <br>
            <FormField label="Assigner cette planification">
                <select v-model="form.intervenant" class="form-select bg-white dark:bg-slate-800">
                    <option value="" disabled selected>Séléctionnez un intervenant</option>
                    <option v-for="(intervenant, index) in intervenants.list" :key="index" :value="intervenant._id">
                        {{ intervenant.nom }} {{ intervenant.prenom }} -- {{ intervenant.zone }}
                    </option>
                </select>

            </FormField>
            <p>
                <BaseButtons>
                    <LoadingButton :button-text="'Confirmer'" :is-loading="isLoading" @click="addPlannification()" />
                    <!-- <BaseButton color="success" label="Confirmer" small @click="deleteSalle(form.idEquipementSelect)" /> -->
                    <BaseButton color="transparent" label="Annuler" small @click="showModalForDelete = false" />
                </BaseButtons>
            </p>
        </div>
        <div v-else>
            <p> Plannification déjà initialisée</p>
            <BaseButton color="transparent" label="Retour" small @click="showModalForDelete = false" />
        </div>

    </CardBoxModal>

    <p style="padding: 10px">{{ equipementCentralList.list.length }} Plannifications</p>
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
                            <BaseButton color="info" :icon="mdiPlus" small @click="initPlan(equipement)" />
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
