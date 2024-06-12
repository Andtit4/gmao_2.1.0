<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import apiService from '@/services/apiService'
import axios from 'axios'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'


const form = reactive({
  searchSite: '',
  searchZone: ''
})
const sites = reactive({ list: [] })
const search = () => {
  axios({
    url: apiService.getUrl() + '/site/search/dyn?nom_site=' + form.searchSite.toUpperCase(),
    method: 'GET'
  })
    .then((response) => {
      sites.list = response.data
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}

const searchZone = () => {
  axios({
    url: apiService.getUrl() + '/site/zone/search/dyn?zone=' + form.searchZone.toUpperCase(),
    method: 'GET'
  })
    .then((response) => {
      sites.list = response.data
    })
    .catch((e) => {
      console.log('An  ' + e)
    })
}

const getAllSite = () => {
  axios({
    url: apiService.getUrl() + '/site',
    method: 'GET'
  })
    .then((response) => {
      sites.list = response.data
      localStorage.setItem('nbSites', sites.list.length)
      // console.log('\n site all ', sites.list.length)
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}

onMounted(() => {
  getAllSite()
})

</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <CardBox>
        <FormField label="Rechercher">
          <FormControl v-model="form.searchSite" placeholder="Entrez le nom du site" @input="search()" />
          <FormControl v-model="form.searchZone" placeholder="Entrez la zone" @input="searchZone()" />
        </FormField>
        <br />
        <div class="max-h-[32rem] overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th v-if="checkable" />
                <th />
                <th>Site Id</th>
                <th>Nom Site</th>
                <th>Zone</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="(site, index) in sites.list" :key="index">
                <TableCheckboxCell v-if="checkable" @checked="checked($event, site)" />
                <td class="border-b-0 lg:w-6 before:hidden">
                  <!-- <UserAvatar :username="site.nom_site" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" /> -->
                </td>
                <td data-label="Site Id">
                  {{ site.site_id }}
                </td>
                <td data-label="Nom site">
                  {{ site.nom_site }}
                </td>
                <td data-label="Zone">
                  {{ site.zone }} {{ site.typologie_energie }}
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

      </CardBox>
    </SectionMain>

  </LayoutAuthenticated>
</template>
