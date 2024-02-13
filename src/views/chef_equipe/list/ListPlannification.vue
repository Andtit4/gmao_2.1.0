<script setup>
import apiService from "@/services/apiService";
import axios from "axios";
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import BaseButton from "@/components/BaseButton.vue";
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import { mdiPencil, mdiTrashCan } from "@mdi/js"
import { onMounted, reactive } from "vue";

const sitesPlannifies = reactive({
  list: []
})

const form = reactive({
  searchSite: '',
  searchEquipe: ''
})

const getAllSitePlannifie = () => {
  axios({
    url: apiService.getUrl() + '/plannifie',
    method: 'GET'
  }).then((res) => {
    sitesPlannifies.list = res.data
  })
}

const search = () => {
  axios({
    url: apiService.getUrl() + '/plannifie/search/site/dyn?site=' + form.searchSite,
    method: 'GET'
  }).then((res) => {
    sitesPlannifies.list = res.data
  })
 }
const searchEquipe = () => {
  axios({
    url: apiService.getUrl() + '/plannifie/search/zone/dyn?zone=' + form.searchEquipe,
    method: 'GET'
  }).then((res) => {
    sitesPlannifies.list = res.data
  })
 }

onMounted(() => {
  getAllSitePlannifie()
})

</script>

<template>
  <LayoutAuthenticated>
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

          </tr>
        </tbody>
      </table>
    </div>

  </LayoutAuthenticated>
</template>
