<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiPencil /* mdiTrashCan */, mdiLock, mdiCheck } from '@mdi/js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import TableCheckboxCell from '@/components/TableCheckboxCell.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import FormField from '@/components/FormField.vue'
import axios from 'axios'
import apiService from '@/services/apiService'
import FormControl from '@/components/FormControl.vue'

defineProps({
  checkable: Boolean
})

const form = reactive({
  site: '',
  id_plannification: '',
  zone: '',
  siteAddNb: '',
  showRestOfItem: true,
  searchSite: '',
  searchEquipe: '',
  date_attente: '',
  date_prise_en_compte: '',
  numero_ticket: ''
})

const sitesPlannifies = reactive({
  list: []
})



// Fait
const getAllSitePlannifie = () => {
  axios({
    url: apiService.getUrl() + '/plannifie',
    method: 'GET'
  }).then((res) => {
    sitesPlannifies.list = res.data
  })
}

// Fait
const search = () => {
  axios({
    url: apiService.getUrl() + '/plannifie/search/site/dyn?site=' + form.searchSite,
    method: 'GET'
  }).then((res) => {
    sitesPlannifies.list = res.data
  })
}

// Fait
const searchEquipe = () => {
  axios({
    url: apiService.getUrl() + '/plannifie/search/zone/dyn?zone=' + form.searchEquipe,
    method: 'GET'
  }).then((res) => {
    sitesPlannifies.list = res.data
  })
}
//  const isModalActive = ref(false)

const showTreateModal = ref(false)
const showCompleteModal = ref(false)

const showTreatStart = (zone, id_plannification, site) => {
  showTreateModal.value = true;
  form.zone = zone;
  form.id_plannification = id_plannification;
  form.site = site;
}

const showComplete = (zone, id_plannification, site) => {
  showCompleteModal.value = true;
  form.zone = zone;
  form.id_plannification = id_plannification;
  form.site = site;
}


const priseEnCompte = () => {
  axios({
    url: apiService.getUrl() + '/mission/attente/web/' + form.date_attente + '/' + form.zone + '/' + form.id_plannification + '/' + form.site,
    method: 'PUT'
  }).then((res) => {
    console.log(res.data)
    setTimeout(() => {
      location.reload()
    }, 1000)
  }).catch((err) => {
    console.error('An error occured while modifying ', err.message)
  })
}

const priseEnCompteC = () => {
  axios({
    url: apiService.getUrl() + '/mission/prise_en_compte/web/' + form.date_prise_en_compte + '/' + form.zone + '/' + form.id_plannification + '/' + form.site  + '/' + form.numero_ticket,
    method: 'PUT'
  }).then((res) => {
    console.log(res.data)
    setTimeout(() => {
      location.reload()
    }, 1000)
  }).catch((err) => {
    console.error('An error occured while modifying ', err.message)
  })
}

onMounted(() => {
  getAllSitePlannifie()
})

</script>

<template>
  <CardBoxModal v-model="showTreateModal" title="Traitement">
    <p>Date de visite par le Technicien</p>
    <FormControl v-model="form.date_attente" type="date" />
    <BaseButton label="Valider" color="success" @click="priseEnCompte()" />
  </CardBoxModal>

  <LayoutAuthenticated>
    <CardBoxModal v-model="showCompleteModal" title="Complèter">
    <p>Clôturer l'intervention</p>
    <FormControl v-model="form.date_prise_en_compte" type="date" />
    <BaseButton label="Clôturer" color="success" @click="priseEnCompteC()" />
  </CardBoxModal>
    <div class="mx-4">
      <FormField label="Rechercher">
        <FormControl v-model="form.searchSite" placeholder="Entrez le nom du site" @input="search()" />
        <FormControl v-model="form.searchEquipe" placeholder="Entrez l'équipe" @input="searchEquipe()" />
      </FormField>
    </div>
    <div class="max-h-[32rem] overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th v-if="checkable" />
            <th />
            <th>Equipe</th>
            <th>Site</th>
            <th>Semaine de plannification</th>
            <th>Status</th>
            <th>Action</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mission, index) in sitesPlannifies.list" :key="index">
            <TableCheckboxCell v-if="checkable" @checked="checked($event, mission)" />
            <td class="border-b-0 lg:w-6 before:hidden">
              <UserAvatar :username="mission.nom" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" />
            </td>
            <td data-label="Equipe">
              {{ mission.zone }}
            </td>
            <td data-label="Site">
              {{ mission.site }}
            </td>
            <td data-label="Semaine de plannification">
              du {{ mission.date_debut ? new Date(mission.date_debut).toISOString().split('T')[0] : '' }} au {{
                mission.date_fin ? new Date(mission.date_fin).toISOString().split('T')[0] : '' }}
            </td>
            <td data-label="Status">
              <div v-if="mission.date_attente == ''">
                <span style="color: red;">
                  En attente d'action du Chef de zone
                </span>
              </div>
              <div v-else>
                <div v-if="mission.date_prise_en_compte == ''">
                  <span style="color: orange;">
                    En attente de confirmation par le superviseur
                  </span>
                </div>
                <div v-else>
                  <span style="color: green;">
                    {{ mission.date_prise_en_compte ? new Date(mission.date_prise_en_compte).toISOString().split('T')[0] :
                      '' }}
                  </span>
                  <div v-if="mission.numero_ticket == ''">
                    <span style="color: red;">
                      Numéro de ticket manquant
                    </span>
                  </div>
                  <div v-else>
                    <span style="color: green;">
                      Ticket: {{ mission.numero_ticket }}
                    </span>
                  </div>
                </div>

              </div>
            </td>
            <td data-label="Action">
              <div v-if="mission.date_attente == ''">
                <span style="color: red;">
                  <BaseButton color="info" :icon="mdiPencil"
                    @click="showTreatStart(mission.zone, mission.id_plannification, mission.site)" />
                </span>
              </div>
              <div v-else>
                <div v-if="mission.date_prise_en_compte == ''">
                  <span style="color: orange;">
                    <BaseButton color="orange" :icon="mdiCheck"
                    @click="showComplete(mission.zone, mission.id_plannification, mission.site)" />
                  </span>
                </div>
                <div v-else>
                  <span style="color: white; font-size: 12px;">
                    {{ mission.date_prise_en_compte ? new Date(mission.date_prise_en_compte).toISOString().split('T')[0] :
                      '' }}
                  </span>
                  <div v-if="mission.numero_ticket == ''">
                    <span style="color: red;">
                      Numéro de ticket manquant
                    </span>
                  </div>
                  <div v-else>
                    <BaseButton color="#dad7cd" outline :icon="mdiLock" />

                  </div>
                </div>

              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </LayoutAuthenticated>
</template>
