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
import CryptoJS from 'crypto-js'
import Cookies from 'js-cookie'
import { useMainStore } from '@/stores/main.js'


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

const submit = async () => {
  // router.push('/dashboard')
  const hash = CryptoJS.SHA256(form.pass)

  const url = apiService.getUrl() + `/admin/auth/${form.login}/${hash}`
  console.log(hash)
  axios({
    url: apiService.getUrl() + `/admin/auth/${form.login}/${hash}`,
    method: 'GET'
  }).then(async (response) => {
    if (response.data._id == undefined) {
      console.log('User not exist')
      /* form.showError = true
      form.err = "Utilisateur recherché n'existe pas" */
      axios({
        url: apiService.getUrl() + `/intervenant/auth/${form.login}/${form.pass}`,
        method: 'GET'
      })
        .then(async (res) => {
          if (res.data._id == undefined) {
            form.showError = true
            form.err = "Utilisateur recherché n'existe pas"
            console.log('Supervisor not exist')
          } else {
            form.id = response.data._id
            form.email = response.data.email
            form.nom = response.data.nom
            form.prenom = response.data.prenom

            /* await Cookies.remove('id', { path: '' })
            await Cookies.remove('email', { path: '' })
            await Cookies.remove('nom', { path: '' })
            await Cookies.remove('prenom', { path: '' })
            await Cookies.remove('type', { path: '' })
            await Cookies.remove('pass', { path: '' }) */
            await Cookies.set('type', 'superviseur')
            await Cookies.set('id', form.id)
            await Cookies.set('email', form.email)
            await Cookies.set('nom', form.nom)
            await Cookies.set('prenom', form.prenom)
            await Cookies.set('pass', hash)
            useMainStore().userName = form.nom + ' ' + form.prenom
            router.push({
              name: 'Dashboard',
              params: { type: 'superviseur', pass: hash }
            })
          }
        })
        .catch((err) => {
          form.err = 'An error occured ' + err.message
          form.showError = true
          console.log('An error occured', err.message)
        })
    } else {
      const id = response.data._id
      const email = response.data.email
      const nom = response.data.nom
      const prenom = response.data.prenom
      /* await Cookies.remove('type', { path: '' })
      await Cookies.remove('id', { path: '' })
      await Cookies.remove('email', { path: '' })
      await Cookies.remove('nom', { path: '' })
      await Cookies.remove('prenom', { path: '' })
      await Cookies.remove('pass', { path: '' }) */
      await Cookies.set('type', 'admin')
      await Cookies.set('id', id)
      await Cookies.set('email', email)
      await Cookies.set('nom', nom)
      await Cookies.set('prenom', prenom)
      await Cookies.set('pass', hash)
      router.push({
        // path: "/partner/dashboard/",
        name: 'Dashboard',
        params: { type: 'admin', pass: hash }
      })
    }
  })
}
</script>

<template>
  <LayoutGuest>
    <SectionFullScreen v-slot="{ cardClass }" bg="purplePink">
      <CardBox :class="cardClass" is-form @submit.prevent="submit">
        <div class="row">
          <div class="col-md-4">
            <img src="@/assets/logo.png" alt="" width="40" />
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
          <FormControl
            v-model="form.login"
            :icon="mdiAccount"
            name="login"
            autocomplete="username"
          />
        </FormField>

        <FormField label="Password" help="Please enter your password">
          <FormControl
            v-model="form.pass"
            :icon="mdiAsterisk"
            type="password"
            name="password"
            autocomplete="current-password"
          />
        </FormField>

        <FormCheckRadio
          v-model="form.remember"
          name="remember"
          label="Remember"
          :input-value="true"
        />

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
