<script setup>
// import { mdiMonitorCellphone, mdiTableBorder, mdiTableOff, mdiGithub, mdiAccount } from '@mdi/js'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import { onMounted, reactive } from 'vue'
import SectionMain from '@/components/SectionMain.vue'
// import NotificationBar from '@/components/NotificationBar.vue'
// import TableSampleClients from '@/components/TableSampleClients.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseButton from '@/components/BaseButton.vue'
// import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
import zoneList from '@/views/sites/zone/zoneList.vue'
import axios from 'axios'
import apiService from '@/services/apiService'

const form = reactive({
  zone: '',
})


const submit = () => {
  axios({
    url: apiService.getUrl() + '/zone',
    method: 'POST',
    data: {
      nom: form.zone
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
      <SectionTitleLineWithButton :icon="mdiBallotOutline" title="Planif. Préventive / Classique" main>
      </SectionTitleLineWithButton>
      <CardBox form @submit.prevent="submit()">
        <FormField label="Informations générale">
          <FormControl v-model="form.zone" placeholder="Nom de la zone" />
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
       <CardBox has-table>
        <zoneList />
      </CardBox>
    </SectionMain>
  </LayoutAuthenticated>
</template>
