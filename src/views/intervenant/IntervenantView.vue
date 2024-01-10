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
import generatePassword from '@/services/generatePassword.js';



const form = reactive({
  matricule: '',
  nom: '',
  prenom: '',
  telephone: '',
  email: '',
  zone: ''
})

const selectOptions = [
  { id: 1, label: 'LOME-EST' },
  { id: 2, label: 'LOME-OUEST' },
  { id: 3, label: 'LOME-SUD' },
  { id: 4, label: 'LOME-NORD' },
  { id: 5, label: 'LOME-VIP' },
  { id: 6, label: 'ANEHO' },
  { id: 7, label: 'TSEVIE' },
  { id: 8, label: 'NOTSE' },
  { id: 9, label: 'BADOU' },
  { id: 10, label: 'KPALIME' },
  { id: 11, label: 'ATAKPAME' },
  { id: 12, label: 'BLITTA' },
  { id: 13, label: 'SOKODE' },
  { id: 14, label: 'TCHAMBA' },
  { id: 15, label: 'KARA-OUEST' },
  { id: 16, label: 'KARA-EST' },
  { id: 17, label: 'BASSAR' },
  { id: 18, label: 'KANTE' },
  { id: 19, label: 'MANGO' },
  { id: 20, label: 'DAPAONG' }
]

const submit = () => {
  const gen = generatePassword.generatePassword();
  // console.log(gen)
  axios({
    url: apiService.getLocal() + '/intervenant/create',
    method: 'POST',
    data: {
      matricule: form.matricule,
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      mot_de_passe: gen,
      zone: form.zone.label
    }
  }).then((repsonse) => {
    console.log('Success ' + repsonse)
    setTimeout(() => {
      location.reload()
    }, 1000)
  })
}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Intervenants" main>
      </SectionTitleLineWithButton>
      <CardBox form @submit.prevent="submit()">
        <FormField label="Informations générale">
          <FormControl v-model="form.matricule" placeholder="Matricule" />
          <FormControl v-model="form.nom" placeholder="Nom" />
          <FormControl v-model="form.prenom" placeholder="Prénoms" />
          <FormControl v-model="form.telephone" placeholder="Téléphone" />
          <FormControl v-model="form.email" placeholder="Email" />
          <FormField label="Zone">
            <FormControl v-model="form.zone" :options="selectOptions" />
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
