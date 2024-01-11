<script setup>
import { mdiMonitorCellphone, mdiTableBorder, mdiTableOff, mdiGithub, mdiAccount } from '@mdi/js'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import { onMounted, reactive, ref, computed } from 'vue'
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import TableSampleClients from '@/components/TableSampleClients.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
// import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
// import siteList from '@/views/sites/siteList.vue'
import axios from 'axios'
import apiService from '@/services/apiService'
// import generatePassword from '@/services/generatePassword.js'

const form = reactive({
  type_equipement: '',
  numero_de_serie: '',
  intitule: '',
  total: '',
  email: '',
  ajouter_le: '',
  nombre_retire: '',
  showSucess: false,
  showError: false
})
const isModalActive = ref(false)
const isModalActiveError = ref(false)
// let notificationsOutline
const notificationSettingsModel = ref([])
const notificationSettingsModelForError = ref([])

const notificationsOutline = computed(() => notificationSettingsModel.value.indexOf('outline') > -1)
const notificationsOutlineError = computed(
  () => notificationSettingsModelForError.value.indexOf('outline') > -1
)

const equipementOptions = reactive({ list: [] })
const siteOptions = reactive({ list: [] })
const materielOptions = reactive({ list: [] })

const form1 = reactive({
  vers: '',
  motif: '',
})

// const equipements = reactive({ list: [] })
// const router = useRouter()

const getAllEquipement = () => {
  axios({
    url: apiService.getUrl() + '/equipement',
    method: 'GET'
  })
    .then((response) => {
      equipementOptions.list = response.data
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}

const getAllSite = () => {
  axios({
    url: apiService.getUrl() + '/site',
    method: 'GET'
  })
    .then((response) => {
      siteOptions.list = response.data
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}
/* const selectOptions = [
  { id: 1, label: 'GE' },
  { id: 2, label: 'PANNEAU SOLAIRE' },
  { id: 3, label: 'REGULATEUR' },
  { id: 4, label: 'UPS' },
  { id: 5, label: 'TGBT' },
  { id: 6, label: 'REDRESSEUR' },
  { id: 7, label: 'PROTECTION' },
  { id: 8, label: 'BATTERIE DEMARRAGE' },
  { id: 9, label: 'BATTERIE PS' },
  { id: 10, label: 'BATTERIE UPS' },
  { id: 11, label: 'CLIMATISATION' }
] */

/* const submit = () => {
  // console.log(gen)
  axios({
    url: apiService.getUrl() + '/equipement/create',
    method: 'POST',
    headers: {
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
      'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
      'Access-Control-Allow-Credentials': true
    },
    data: {
      type_equipement: form.type_equipement.label,
      numero_de_serie: form.numero_de_serie,
      intitule: form.intitule,
      total: form.total,
      ajouter_le: form.ajouter_le
    }
  }).then((repsonse) => {
    console.log('Success ' + repsonse)

    axios({
      url: apiService.getUrl() + '/historique/create',
      method: 'POST',
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
        'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
        'Access-Control-Allow-Credentials': true
      },
      data: {
        type_equipement: form.type_equipement.label,
        numero_de_serie: form.numero_de_serie,
        intitule: form.intitule,
        total: form.total,
        ajouter_le: form.ajouter_le,
        action: 'Entré'
      }
    }).then((res) => {
      console.log('Success ' + res)
    })

    setTimeout(() => {
      location.reload()
    }, 1000)
  })
} */
const equipements = reactive({ list: [] })
const materiels = reactive({ list: [] })

const search = () => {
  // let isModalActive = true
  // isModalActive.value = true
  if (form.type_equipement == '' || form.type_equipement == undefined) {
    isModalActiveError.value = true
  } else {
    axios({
      url: apiService.getUrl() + '/equipement/' + form.type_equipement,
      method: 'GET'
    })
      .then((response) => {
        equipements.list = response.data
        console.log('lot ', equipements.list.nom_lot)

        axios({
          url: apiService.getUrl() + '/materiel/searchLot?nom_lot=' + equipements.list.nom_lot,
          method: 'GET'
        })
          .then((response) => {
            materiels.list = response.data[0]
            // console.log('materiel ', materiels.list[0].nombre_disponible)
          })
          .catch((e) => {
            console.log('An error occured ' + e)
          })
        isModalActive.value = true
      })
      .catch((e) => {
        console.log('An error occured ' + e)
      })
  }
  console.log('Type : ', form.type_equipement)
}

const submit = () => {
  console.log('Sub')

  if (materiels.list.nombre_disponible == 0) {
    return form.showError = true
  } else {
    const nombre_disponible = materiels.list.nombre_disponible - 1
    axios({
      url: apiService.getUrl() + '/historique/create',
      method: 'POST',
      data: {
        type_equipement: equipements.list.type_equipement.label,
        numero_de_serie: equipements.list.numero_de_serie,
        intitule: equipements.list.intitule,
        ajouter_le: equipements.list.ajouter_le,
        action: 'Sortie',
        motif: form1.motif,
        vers: form1.vers
      }
    }).then((response) => {
      console.log(response)
      axios({
        url: apiService.getUrl() + '/materiel/' + materiels.list._id,
        method: 'PUT',
        data: {
          nombre_disponible: nombre_disponible
        }
      }).then((res) => {
        console.log(res)
        form.showSucess = true
        setTimeout(() => {
          location.reload()
        }, 2000)
      })
      /* axios({
        url: apiService.getUrl() + '/materiel/search?type_equipement=' + form.type_equipement,
        method: 'GET'
      }).then((res) => {
        console.log('Nombre dispo: ', res.data[0].total)
        const nombre_disponible = res.data[0].total - 1
        console.log('Nombre dispo: ', res.data[0].total - 1) */

      // Request to update nombre disponible dans la table materiel
      /*   axios({
          url: apiService.getUrl() + '/materiel/' + res.data[0]._id,
          method: 'PUT',
          data: {
            nombre_disponible: nombre_disponible
          }
        })
      }) */

      // axios({
      //   url: apiService.getUrl() + '/equipement/' + form.type_equipement,
      //   method: 'PUT',
      //   data: {
      //     total: total
      //   }
      // }).then((response) => {
      //   console.log(response)
      //   form.showSucess = true
      //   setTimeout(() => {
      //     location.reload()
      //   }, 2000)
      // })
      /* form.showSucess = true
      setTimeout(() => {
        location.reload()
      }, 2000) */
    })
  }

  if (form.nombre_retire > equipements.list.total) {
    console.log('supérieur')
    form.showError = true
  } else {
    // form.showSucess = true
    // const total = equipements.list.total - form.nombre_retire
  }
  // showNotification.value = true;
  // notificationsOutline = notificationSettingsModel.value.indexOf('outline') > -1
}

onMounted(() => {
  getAllEquipement()
  getAllSite()
})
</script>

<template>
  <CardBoxModal v-model="isModalActiveError" title="Erreur">
    <p>Veillez sélectionner un équipement</p>
    <p>avant de continuer</p>
  </CardBoxModal>
  <CardBoxModal v-model="isModalActive" form title="Equipements" @submit.prevent="submit()">
    <!-- Notification for success -->
    <div v-if="form.showSucess == true">
      <NotificationBar color="success" :icon="mdiInformation" :outline="notificationsOutline">
        <b>Sortie enregistrée</b>.
      </NotificationBar>
    </div>
    <!-- End BLoc -->

    <!-- Notification for error -->
    <div v-if="form.showError == true">
      <NotificationBar color="danger" :icon="mdiInformation" :outline="notificationsOutlineError">
        <b>Données invalides</b>.
      </NotificationBar>
    </div>
    <!-- End BLoc -->

    <FormField label="Informations générale">
      <FormControl
        v-model="equipements.list.numero_de_serie"
        placeholder="Numéro de série"
        readonly="true"
      />
      <FormControl v-model="equipements.list.intitule" placeholder="Intitulé" />
      <FormField label="Informations complémentaires">
        <!-- <FormControl v-model="equipements.list.ajouter_le" placeholder="Image" type="date" /> -->
        <FormControl v-model="form1.motif" placeholder="Motif" />
        <select v-model="form1.vers" class="form-select bg-white dark:bg-slate-800">
          <option value="">Sélectionnez la destination</option>
          <option value="MAGASIN">MAGASIN</option>
          <option
            v-for="(equipement, index) in siteOptions.list"
            :key="index"
            :value="equipement.nom_site"
          >
            {{ equipement.nom_site }}
          </option>
        </select>
      </FormField>
      <FormField label="Disponobilité">
        <p>Nombre disponible:</p>
        {{ materiels.list.nombre_disponible }}
      </FormField>
    </FormField>
    <p><BaseButton color="success" label="Valider" @click="submit()" /></p>
  </CardBoxModal>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Sorties" main>
      </SectionTitleLineWithButton>
      <CardBox>
        <FormField label="">
          <select v-model="form.type_equipement" class="form-select bg-white dark:bg-slate-800">
            <option value="">Sélectionnez un équipement</option>
            <option
              v-for="(equipement, index) in equipementOptions.list"
              :key="index"
              :value="equipement._id"
            >
              {{ equipement.nom_lot }} | {{ equipement.type_equipement }} |
              {{ equipement.numero_de_serie }}
            </option>
          </select>
          <BaseButtons>
            <BaseButton color="info" label="Rechercher" @click="search()" />
            <!-- <BaseButton  color="info" label="Rechercher" @click="isModalActive == true" /> -->
            <!-- <BaseButton type="reset" color="info" outline label="Reset" /> -->
          </BaseButtons>
        </FormField>
        <BaseDivider />

        <template #footer> </template>
      </CardBox>
    </SectionMain>

    <SectionMain>
      <!-- <CardBox has-table>
        <siteList />
      </CardBox> -->
    </SectionMain>
  </LayoutAuthenticated>
</template>
