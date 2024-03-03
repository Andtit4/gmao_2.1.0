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

const tabs = reactive([
  { name: 'Tranfert', content: 'Contenu de l\'onglet 1' },
  { name: 'Utilisation', content: 'Contenu de l\'onglet 2' }
]);

const state = reactive({
  activeTab: 0,
  hoverTab: null
});

const form = reactive({
  depart: '',
  to: '',
  showError: false,
  errMessage: ''
})

const stocks = reactive({ list: [] })

const getStocks = async () => {
  try {
    const res = await apiService.getEntrepot()
    stocks.list = await res.data;
  } catch (error) {
    form.showError = true
    form.errMessage = 'Erreur entrepôt ' + error;
  }
}

const articleFetch = reactive({ list: [] })

const searchArticle = async () => {
  console.log(form.depart)
  try {
    const res = await apiService.getArticleByStock(form.depart)
    articleFetch.list = await res.data
  } catch (error) {
    form.showError = true
    form.errMessage = 'Une erreur est survenue des matériels du stock ' + error;
  }
}

const selectTab = (index) => {
  state.activeTab = index;
};

onMounted(() => {
  getStocks()
})
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Mouvements" main>
      </SectionTitleLineWithButton>
      <CardBox form @submit.prevent="submit()">
        <div v-if="form.showSucess == true">
          <NotificationBar color="success" :icon="mdiInformation" :outline="notificationsOutline">
            <b>Matériel ajouté avec succès</b>.
          </NotificationBar>
        </div>
        <div v-if="form.showError == true">
          <NotificationBar color="danger" :icon="mdiInformation" :outline="notificationsOutline">
            <b>Une erreur est survenue {{ form.errMessage }}</b>.
          </NotificationBar>
        </div>
        <div class="tab-bar">
          <div v-for="(tab, index) in tabs" :key="index"
            :class="{ 'active': state.activeTab === index, 'hover': state.hoverTab === index }"
            @click="selectTab(index)">
            {{ tab.name }}
          </div>
        </div>
        <br>
        <div class="tab-content">
          <div v-for="(tab, index) in tabs" v-show="state.activeTab === index" :key="index">
            <div v-if="index === 0">
              <FormField label="">
                <FormField label="Informations générale">
                  <select v-model="form.depart" class="form-select bg-white dark:bg-slate-800" @change="searchArticle()">
                    <option value="">Séléctionnez le stock de départ</option>
                    <option v-for="(zone, index) in stocks.list" :key="index" :value="zone.id_entrepot">
                      {{ zone.id_entrepot }}
                    </option>
                  </select>
                  <select v-model="form.to" class="form-select bg-white dark:bg-slate-800">
                    <option value="">Séléctionnez le stock d'arrivé</option>
                    <option v-for="(zone, index) in stocks.list" :key="index" :value="zone._id">
                      {{ zone.id_entrepot }}
                    </option>
                  </select>
                  <FormField label="">
                    <select v-model="form.to" class="form-select bg-white dark:bg-slate-800">
                    <option value="">Séléctionnez le matériel</option>
                    <option v-for="(zone, index) in articleFetch.list" :key="index" :value="zone.nom">
                      {{ zone.description }}
                    </option>
                  </select>
                  </FormField>
                </FormField>
              </FormField>
            </div>
            <div v-else>
              Utilisation
            </div>
          </div>
        </div>
      </CardBox>
    </SectionMain>

    <SectionMain>
      <!-- <CardBox has-table>
        <siteList />
      </CardBox> -->
    </SectionMain>
  </LayoutAuthenticated>
</template>


<style scoped>
.tab-bar {
  display: flex;
}

.tab-bar div {
  padding: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tab-bar div.active {
  background-color: #3498db;
  border-radius: 15px;
  color: #fff;
}

.tab-bar div.hover:hover {
  background-color: #f1f1f1;
}

.tab-content div {
  display: none;
}

.tab-content div {
  display: block;
}
</style>
