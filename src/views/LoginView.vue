<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import axios from 'axios'
import apiService from '@/services/apiService'
import NotificationBar from '@/components/NotificationBar.vue'
// import CryptoJS from 'crypto-js'
import { useMainStore } from '@/stores/main.js'
// import { isEmptyArray } from '@/services/document'

const form = reactive({
  login: '',
  pass: '',
  id: '',
  nom: '',
  prenom: '',
  email: '',
  remember: true,
  err: '',
  showError: false
})

const router = useRouter()

const submit = () => {
  // const hash = CryptoJS.SHA256(form.pass)
  axios({
    url: apiService.getLocal() + `/intervenant/auth?email=${form.login}&mot_de_passe=${form.pass}`,
    method: 'GET'
  }).then((res) => {
    console.log(res.data)
    if (res.data.error) {
      form.showError = true;
      form.err = res.data.error
    } else {
      console.log(res.data)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('pass', res.data.intervenant[0]._id)
      localStorage.setItem('id', res.data.intervenant[0]._id)
      localStorage.setItem('email', res.data.intervenant[0].email)
      localStorage.setItem('nom', res.data.intervenant[0].nom)
      localStorage.setItem('prenom', res.data.intervenant[0].prenom)
      useMainStore().setUser(res.data.intervenant[0])
      switch (res.data.type_utilisateur) {
        case 'ADMIN':
          localStorage.removeItem('type')
          localStorage.setItem('type', 'admin')
          return router.push({
            name: 'Dashboard',
            params: { type: 'admin', pass: res.data.intervenant[0]._id }
          })
        case 'USER':
          // Cookies.remove('type')
          localStorage.removeItem('type')
          localStorage.setItem('type', 'chef_equipe')
          return router.push({
            name: 'Dashboard',
            params: { type: 'chef_equipe', pass: res.data.intervenant[0]._id }
          })
        case 'SUPERVISEUR':
          localStorage.removeItem('type')
          localStorage.setItem('type', 'superviseur')
          return router.push({
            name: 'Dashboard',
            params: { type: 'superviseur', pass: res.data.intervenant[0]._id }
          })
        default:
          break;
      }
    }
  }).catch((err) => {
    console.error('Error occured ', err.message)
  })
}
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <div class="col">
          <div class="col-md-4" style="display: inline-block;">
            <img src="@/assets/logo.png" alt="" width="40" style="display: inline-block;" />
            <h1 style="display: inline-block; font-size: 24px; font-weight: bold; margin-left: 20px;">Energy Eye</h1>
          </div>
        </div>
        <br />
        <div v-if="form.showError == true">
          <NotificationBar color="danger" :icon="mdiMonitorCellphone">
            {{ form.err }}
          </NotificationBar>
        </div>
        <div v-else></div>
        <br />
        <FormField label="Login" help="Please enter your login">
          <FormControl v-model="form.login" :icon="mdiAccount" name="login" autocomplete="username" />
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <FormControl v-model="form.pass" :icon="mdiAsterisk" type="password" name="password"
            autocomplete="current-password" />
        </FormField>

        <FormCheckRadio v-model="form.remember" name="remember" label="Remember" :input-value="true" />

        <template #footer>
          <BaseButtons>
            <BaseButton type="submit" color="info" label="Login" />
            <BaseButton to="/dashboard" color="info" outline label="Back" />
          </BaseButtons>
        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
