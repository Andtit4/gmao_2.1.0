<script setup>
import { mdiMonitorCellphone, mdiTableBorder, mdiTableOff, mdiGithub, mdiAccount } from '@mdi/js'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import { onMounted, reactive } from 'vue'
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import TableSampleClients from '@/components/TableSampleClients.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
// import siteList from '@/views/sites/siteList.vue'
import axios from 'axios'
import apiService from '@/services/apiService'
import generatePassword from '@/services/generatePassword.js'

const form = reactive({
  type_equipement: '',
  numero_de_serie: '',
  intitule: '',
  email: '',
  ajouter_le: '',
  nom_lot: ''
})

const selectOptions = [
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
]

const equipementOptions = reactive({ list: [] })

const getAllEquipement = () => {
  axios({
    url: apiService.getUrl() + '/materiel',
    method: 'GET'
  })
    .then((response) => {
      equipementOptions.list = response.data
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}

const searchResult = reactive({ list: [] })
const submit = () => {
  axios({
    url: apiService.getUrl() + '/materiel/search?type_equipement=' + form.type_equipement,
    method: 'GET'
  })
    .then((res) => {
      console.log('Nombre dispo: ', res.data[0].total)

      // Request to update nombre disponible dans la table materiel
      axios({
        url: apiService.getUrl() + '/historique/create',
        method: 'POST',
        headers: {
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
          'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
          'Access-Control-Allow-Credentials': true
        },
        data: {
          type_equipement: form.type_equipement,
          numero_de_serie: form.numero_de_serie,
          intitule: form.intitule,
          ajouter_le: form.ajouter_le,
          nom_lot: form.nom_lot,
          nombre: '1',
          action: 'Entrée',
          nombre_disponible: res.data[0].nombre_disponible,
          motif: 'AJOUT DE MATERIEL DANS LE MAGASIN',
          vers: 'MAGASIN'
        }
      }).then((res) => {
        console.log('Success ' + res)
      })
      /* axios({
          url: apiService.getUrl() + '/materiel/' + res.data[0]._id,
          method: 'PUT',
          data: {
            nombre_disponible: nombre_disponible
          }
        }).then((res) => {
          console.log('modified ' + res.data)

        }) */

      axios({
        url: apiService.getUrl() + '/equipement/create',
        method: 'POST',
        headers: {
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS, PUT, PATCH, DELETE',
          'Access-Control-Allow-Headers': 'X-Requested-With,content-type',
          'Access-Control-Allow-Credentials': true
        },
        data: {
          type_equipement: form.type_equipement,
          numero_de_serie: form.numero_de_serie,
          intitule: form.intitule,
          action: 'Entrée',
          nom_lot: form.nom_lot,
          ajouter_le: form.ajouter_le,
          nombre_disponible: res.data[0].nombre_disponible
        }
      }).then((repsonse) => {
        console.log('Success ' + repsonse)

        // Request for search type equipement for materiel

        setTimeout(() => {
          location.reload()
        }, 3000)
      })
    })
    .catch((err) => {
      console.log('An error occured while getting search equipement ', err)
    })
}

onMounted(() => {
  getAllEquipement()
})
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Equipements" main>
      </SectionTitleLineWithButton>
      <CardBox form @submit.prevent="submit()">
        <FormField label="">
          <FormField label="Informations générale">
            <FormField>
              <FormControl v-model="form.numero_de_serie" placeholder="Numero de référence" />
              <FormControl v-model="form.intitule" placeholder="Intitulé" />
            </FormField>
            <FormField label="Equipements">
              <select v-model="form.nom_lot" class="form-select bg-white dark:bg-slate-800">
                <option value="">Sélectionnez le lot</option>
                <option
                  v-for="(equipement, index) in equipementOptions.list"
                  :key="index"
                  :value="equipement.nom_lot"
                >
                  {{ equipement.nom_lot }}
                </option>
              </select>
              <select v-model="form.type_equipement" class="form-select bg-white dark:bg-slate-800">
                <option value="">Le Type d'équipement</option>
                <option
                  v-for="(equipement, index) in equipementOptions.list"
                  :key="index"
                  :value="equipement.type_equipement"
                >
                  {{ equipement.type_equipement }}
                </option>
              </select>
            </FormField>

            <FormControl v-model="form.ajouter_le" type="date" />
          </FormField>
        </FormField>
        <BaseDivider />

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Submit" @click="submit()" />
            <BaseButton type="reset" color="info" outline label="Reset" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionMain>

    <SectionMain>
      <!-- <CardBox has-table>
        <siteList />
      </CardBox> -->
    </SectionMain>
  </LayoutAuthenticated>
</template>
