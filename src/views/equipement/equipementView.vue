<script setup>
// import { mdiMonitorCellphone, mdiTableBorder, mdiTableOff, mdiGithub, mdiAccount } from '@mdi/js'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import { /* onMounted */ reactive, computed, ref, onMounted } from 'vue'
import SectionMain from '@/components/SectionMain.vue'
import NotificationBar from '@/components/NotificationBar.vue'
// import TableSampleClients from '@/components/TableSampleClients.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
import { mdiEye, mdiTrashCan } from '@mdi/js'
// import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
// import siteList from '@/views/sites/siteList.vue'
import axios from 'axios'
import apiService from '@/services/apiService'
// import generatePassword from '@/services/generatePassword.js'
import CardBoxModal from '@/components/CardBoxModal.vue'
import { useMainStore } from '@/stores/main'



const form = reactive({
  article: '',
  description: '',
  stock_physique: '',
  showSucess: false,
  showError: false,
  errMessage: '',
  critical_low: '',
  stock: ''
})

const edit = reactive({
  article: '',
  description: '',
  stock_physique: '',
  showSucess: false,
  showError: false,
  errMessage: '',
  critical_low: ''
})

const equipements = reactive({ list: [] })

const getAllEquipement = () => {
  axios({
    url: apiService.getUrl() + '/stock',
    method: 'GET'
  })
    .then((response) => {
      equipements.list = response.data
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}
const notificationSettingsModel = ref([])
const notificationsOutline = computed(() => notificationSettingsModel.value.indexOf('outline') > -1)
const isModalActive = ref(false)


const entrepots = reactive({ list: [] })

const getAllEntrepot = async () => {
  try {
    const res = await apiService.getEntrepot();
    entrepots.list = res.data;
  } catch (error) {
    form.showError = true;
    form.errMessage = 'Une erreur liée à la capture des stocks ' + error;
  }
}

const submit = () => {
  // console.log(gen)

  axios({
    url: apiService.getUrl() + '/stock',
    method: 'POST',
    data: {
      article: form.article,
      description: form.description,
      stock_physique: form.stock_physique,
      nombre_disponible: form.stock_physique,
      critical_low: form.critical_low
    }
  }).then((response) => {
    console.log(response)
    form.showSucess = true
    setTimeout(() => {
      location.reload()
    }, 1000)
  }).catch((err) => {
    form.errMessage = err.message
    form.showError = true
  })

}

const deleteEquipement = (id) => {
  axios({
    url: apiService.getUrl() + '/stock/' + id,
    method: 'DELETE'
  }).then((res) => {
    console.log(res)
    setTimeout(() => {
      location.reload()
    }, 1000)
  })
}

const show = (id) => {
  isModalActive.value = true;
  axios({
    url: apiService.getUrl() + '/stock/' + id,
    method: 'GET'
  }).then((res) => {
    edit.article = res.data.article,
      edit.description = res.data.description,
      edit.stock_physique = res.data.stock_physique,
      edit.critical_low = res.data.critical_low
  })
}
const mainStore = useMainStore()

const updateEnter = async (stock, article) => {
  await apiService.updateStock(stock, article);
  setTimeout(() => {
    location.reload()
  }, 1000)
}

onMounted(() => {
  getAllEquipement()
  getAllEntrepot()
})

</script>

<template>
  <LayoutAuthenticated>
    <CardBoxModal v-model="isModalActive" title="Détails">
      <FormField label="Informations générale">
        <FormControl v-model="edit.article" />
        <FormControl v-model="edit.description" />
        <FormField label="">
          <FormControl v-model="edit.stock_physique" />
          <FormControl v-model="edit.critical_low" />
        </FormField>
        <FormField label="Equipe / Stock">
          <select v-model="form.stock" class="form-select bg-white dark:bg-slate-800">
            <option value="">Séléctionnez la zone affectée</option>
            <option v-for="(zone, index) in entrepots.list" :key="index" :value="zone.id_entrepot">
              {{ zone.id_entrepot }} | {{ zone.zone }}
            </option>
          </select>
        </FormField>
      </FormField>
      <BaseButton type="submit" color="info" label="Valider" @click="updateEnter(form.stock, edit.article)" />

    </CardBoxModal>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Matériels" main>
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
        <FormField label="">
          <FormField label="Informations générale">
            <FormControl v-model="form.article" placeholder="Id Article" />
            <FormControl v-model="form.description" placeholder="Description" />
            <FormField label="Paramètres">
              <FormControl v-model="form.stock_physique" placeholder="Nombre disponible" type="number" />
              <FormControl v-model="form.critical_low" placeholder="Critical Low" type="number" />
            </FormField>
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
      <CardBox hasTable>
        <div class="max-h-[32rem] overflow-x-auto">
          <table>
            <thead>
              <tr>
                <th v-if="checkable" />
                <th />
                <th>Article Id</th>
                <th>Stock</th>
                <th>Description</th>
                <th>Nombre Enregistré</th>
                <th></th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="(equipement, index) in equipements.list" :key="index">
                <TableCheckboxCell v-if="checkable" @checked="checked($event, equipement)" />
                <td class="border-b-0 lg:w-6 before:hidden">
                  <UserAvatar :username="equipement.type_equipement" class="w-24 h-24 mx-auto lg:w-6 lg:h-6" />
                </td>
                <td data-label="Article Id">
                  {{ equipement.article }}
                </td>
                <div v-if="equipement.stock == ''">
                  <td data-label="Stock">
                    <span style="color: red;">Non attribué à un stock</span>
                  </td>
                </div>
                <div v-else>
                  <td data-label="Stock">
                    {{ equipement.stock }}
                  </td>
                </div>
                <td data-label="Description">
                  {{ equipement.description }}
                </td>
                <td data-label="Nombre enregistré">
                  {{ equipement.stock_physique }}
                </td>
                <td class="before:hidden lg:w-1 whitespace-nowrap">
                  <BaseButtons type="justify-start lg:justify-end" no-wrap>
                    <BaseButton color="info" :icon="mdiEye" small @click="show(equipement._id)" />
                    <BaseButton color="danger" :icon="mdiTrashCan" small @click="deleteEquipement(equipement._id)" />
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
