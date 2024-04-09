<script setup>
import apiService from "@/services/apiService"
import axios from "axios"
import { onMounted, reactive } from 'vue'

const zones = reactive({ list: [] })
// const router = useRouter()

const getAllZone = () => {
  axios({
    url: apiService.getUrl() + '/zone',
    method: 'GET'
  })
    .then((response) => {
      zones.list = response.data
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}

onMounted(() => {
  getAllZone()
})
</script>
<template>
  <div class="max-h-[32rem] overflow-x-auto">
    <table>
      <thead>
        <tr>
          <th v-if="checkable" />
          <th />
          <th>Zone</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="(site, index) in zones.list" :key="index">
          <TableCheckboxCell v-if="checkable" @checked="checked($event, site)" />
          <td class="border-b-0 lg:w-6 before:hidden">
            <!-- <UserAvatar :username="site.nom_site" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" /> -->
          </td>
          <td data-label="Zone">
            {{ site.nom }}
          </td>

          <td class="before:hidden lg:w-1 whitespace-nowrap">
            <BaseButtons type="justify-start lg:justify-end" no-wrap>
              <BaseButton color="success" :icon="mdiPencil" small @click="editSite(site._id)" />
              <BaseButton color="info" :icon="mdiEye" small @click="showSite(site._id)" />
              <BaseButton color="danger" :icon="mdiTrashCan" small @click="deleteSite(site._id)" />
            </BaseButtons>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<style>

</style>
