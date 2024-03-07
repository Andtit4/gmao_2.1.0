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
  showSuccess: false,
  successMessage: '',
  errMessage: '',
  materiel: '',
  numberShare: '',
  motif: '',
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

const startShare = async () => {
  console.log('Share click')
  console.log(form.depart)
  console.log(form.to)

  if (form.depart == form.to) {
    form.showError = true;
    form.errMessage = 'Vous ne pouvez pas transférer ' + form.depart + ' vers ' + form.to;
  } else {
    try {

      if ((OneArticleToShare.stock_physique - form.numberShare) >= 0) {
        const res = await apiService.createShare(OneArticleToShare.article, OneArticleToShare.description, form.numberShare, form.depart, form.to, form.motif)
        if (res) {
          // Modification du nombre de materiel disponible
          try {
            const nombre_restant = OneArticleToShare.stock_physique - form.numberShare;
            const res = await apiService.updateArticleNombreDisponible(nombre_restant, OneArticleToShare._id);
            if (res) {
              form.showSuccess = true;
              form.successMessage = 'Transfère enregistré';
              setTimeout(() => {
                location.reload()
              }, 1000)
            }
          } catch (err) {
            form.showError = true;
            form.errMessage = 'Erreur modification de matériel disponible ' + err;
          }
        }
      } else {
        form.showError = true;
        form.errMessage = 'Vous ne pouvez pas valider ce transfère';
      }

    } catch (err) {
      form.showError = true;
      form.errMessage = 'Une erreur est survenue au transfert des équipements' + err;
    }
  }
}

const OneArticleToShare = reactive({ stock_physique: "0", critical_low: "0", article: "", description: "", _id: "" })
const getNombre = async () => {
  try {
    const res = await apiService.getOneArticleByStock(form.depart, form.materiel)
    OneArticleToShare._id = res.data[0]._id;
    OneArticleToShare.article = res.data[0].article;
    OneArticleToShare.description = res.data[0].description;
    OneArticleToShare.stock_physique = res.data[0].nombre_disponible;
    OneArticleToShare.critical_low = res.data[0].critical_low;
    console.log('nber === ', res.data[0].stock_physique)
  } catch (error) {
    form.showError = true
    form.errMessage = 'Une erreur est survenue des matériels du stock ' + error;
  }
}

const compare = () => {
  if (form.numberShare > OneArticleToShare.stock_physique) {
    form.showError = true;
    form.errMessage = 'Vous demandez un nombre supérieur d\'équipement à transférer';
  } else {
    if (form.showError == true) {
      form.showError = false;
    }
  }
}

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
            <b>{{ form.successMessage }}</b>.
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
                  <select v-model="form.depart" class="form-select bg-white dark:bg-slate-800"
                    @change="searchArticle()">
                    <option value="">Séléctionnez le stock de départ</option>
                    <option v-for="(zone, index) in stocks.list" :key="index" :value="zone.id_entrepot">
                      {{ zone.id_entrepot }}
                    </option>
                  </select>
                  <select v-model="form.to" class="form-select bg-white dark:bg-slate-800">
                    <option value="">Séléctionnez le stock d'arrivé</option>
                    <option v-for="(zone, index) in stocks.list" :key="index" :value="zone.id_entrepot">
                      {{ zone.id_entrepot }}
                    </option>
                  </select>
                  <FormField label="">
                    <select v-model="form.materiel" class="form-select bg-white dark:bg-slate-800"
                      @change="getNombre()">
                      <option value="">Séléctionnez le matériel</option>
                      <option v-for="(zone, index) in articleFetch.list" :key="index" :value="zone._id">
                        {{ zone.description }} || Nombre disponible : {{ zone.stock_physique }}
                      </option>
                    </select>
                    <FormControl type="text" v-model="form.motif" placeholder="Motif du transfert" />
                  </FormField>
                  <FormField label="Nombre">
                    <FormControl type="text" v-model="OneArticleToShare.stock_physique"
                      placeholder="Nombre disponible" />
                    <FormControl type="number" v-model="form.numberShare" placeholder="Nombre à transférer"
                      @input="compare()" />
                  </FormField>
                </FormField>
              </FormField>
              <BaseDivider />
              <BaseButton label="Transférer" color="info" @click="startShare()" />
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
