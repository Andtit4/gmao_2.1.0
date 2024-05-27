<script setup>
import apiService from "@/services/apiService";
import axios from "axios";
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import BaseButton from "@/components/BaseButton.vue";
import { mdiPencil, mdiTrashCan } from "@mdi/js"
import { onMounted, reactive } from "vue";
import ListPlannificationEnAttente from "./list/ListPlannificationEnAttente.vue";
const missions = reactive({
  list: []
})

const getAllMission = () => {
  axios({
    url: apiService.getUrl() + '/mission',
    method: 'GET'
  }).then((res) => {
    missions.list = res.data
  })
}

onMounted(() => {
  getAllMission()
})

</script>

<template>
  <LayoutAuthenticated>
    <div class="max-h-[32rem] overflow-x-auto">
      <table>
        <thead>
          <tr>
            <th v-if="checkable" />
            <th />
            <th>Equipe</th>
            <th>Nombre de site / semaine</th>
            <th>Date d'ajout</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="(mission, index) in missions.list" :key="index">
            <TableCheckboxCell v-if="checkable" @checked="checked($event, mission)" />
            <td class="border-b-0 lg:w-6 before:hidden">
              <UserAvatar :username="mission.nom" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" />
            </td>
            <td data-label="Equipe">
              {{ mission.zone }}
            </td>
            <td data-label="Nombre de site / semaine ">
              {{ mission.quota }}
            </td>
            <td data-label="Date d'ajout">
              {{ mission.date_ajoute  }}
            </td>
            <td data-label="Date de début">
              {{ mission.date_debut  }}
            </td>
            <td data-label="Date de fin">
              {{ mission.date_fin  }}
            </td>
            <td class="before:hidden lg:w-1 whitespace-nowrap">
              <BaseButtons type="justify-start lg:justify-end" no-wrap>
                <BaseButton color="info" :icon="mdiPencil" small @click="isModalActive = true" />
              </BaseButtons>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

  </LayoutAuthenticated>
</template>
