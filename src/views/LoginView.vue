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
import { isEmptyArray } from '@/services/document'

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
  // router.push('/dashboard')
  const hash = CryptoJS.SHA256(form.pass)


  axios({
    url: apiService.getUrl() + `/admins/auth?email=${form.login}&motdepasse=${hash}`,
    method: 'GET'
  }).then((response) => {
    console.log('\n admins ', isEmptyArray(response.data.admin))
    if (isEmptyArray(response.data.admin) == false) {
      const id = response.data.admin[0]._id
      const email = response.data.admin[0].email
      const nom = response.data.admin[0].nom
      const prenom = response.data.admin[0].prenom
      localStorage.setItem('token', response.data.token)
      Cookies.set('type', 'admin')
      Cookies.set('id', id)
      Cookies.set('email', email)
      Cookies.set('nom', nom)
      Cookies.set('prenom', prenom)
      Cookies.set('pass', hash)
      useMainStore().setUser(response.data.admin)
      router.push({
        name: 'Dashboard',
        params: { type: 'admin', pass: hash }
      })
    } else {
      axios({
        url: apiService.getUrl() + `/intervenant/auth?email=${form.login}&mot_de_passe=${form.pass}`,
        method: 'GET'
      }).then((res) => {
        console.log('\n intervenant ', res.data.intervenant)

        if (isEmptyArray(res.data.intervenant) == true) {
          form.showError = true;
          form.err = 'Email ou mot de passe incorrect'
        } else {
          const id = res.data.intervenant[0]._id
        const email = res.data.intervenant[0].email
        const nom = res.data.intervenant[0].nom
        const prenom = res.data.intervenant[0].prenom
        const type_utilisateur = res.data.intervenant[0].type_utilisateur
        localStorage.setItem('token', res.data.token)
        // console.log('\n res :', res.data.intervenant)

        Cookies.set('id', id)
        Cookies.set('email', email)
        Cookies.set('nom', nom)
        Cookies.set('prenom', prenom)
        Cookies.set('pass', hash)
        useMainStore().setUser(res.data.intervenant)

        if (type_utilisateur == 'USER') {
          Cookies.set('type', 'chef_equipe')
          router.push({
            name: 'Dashboard',
            params: { type: 'chef_equipe', pass: hash }
          })
        } else {
          console.log('Superviseur ', type_utilisateur)
          Cookies.set('type', 'superviseur')
          router.push({
            name: 'Dashboard',
            params: { type: 'superviseur', pass: hash }
          })
        }
        }
        /* const id = res.data.intervenant._id
        const email = res.data.intervenant.email
        const nom = res.data.intervenant.nom
        const prenom = res.data.intervenant.prenom
        const type_utilisateur = res.data.intervenant.type_utilisateur
        localStorage.setItem('token', res.data.token)
        // console.log('\n res :', res.data.intervenant)

        Cookies.set('id', id)
        Cookies.set('email', email)
        Cookies.set('nom', nom)
        Cookies.set('prenom', prenom)
        Cookies.set('pass', hash)
        useMainStore().setUser(res.data.intervenant)

        if (type_utilisateur == 'USER') {
          Cookies.set('type', 'chef_equipe')
          router.push({
            name: 'Dashboard',
            params: { type: 'chef_equipe', pass: hash }
          })
        } else {
          console.log('Superviseur ', type_utilisateur)
          Cookies.set('type', 'superviseur')
          router.push({
            name: 'Dashboard',
            params: { type: 'superviseur', pass: hash }
          })
        } */
      })
    }
    // console.log('id: ', response.data.admin._id)
    /* const id = response.data.admin._id
      const email = response.data.admin.email
      const nom = response.data.admin.nom
      const prenom = response.data.admin.prenom
      localStorage.setItem('token', response.data.token)
      Cookies.set('type', 'admin')
      Cookies.set('id', id)
      Cookies.set('email', email)
      Cookies.set('nom', nom)
      Cookies.set('prenom', prenom)
      Cookies.set('pass', hash)
      useMainStore().setUser(response.data.admin)
      router.push({
        name: 'Dashboard',
        params: { type: 'admin', pass: hash }
      }) */


  }).catch((err) => {
    console.log('Error admin! ', err.response.status)
    if (err.response.status == 401) {
      axios({
        url: apiService.getUrl() + `/intervenant/auth/${form.login}/${form.pass}`,
        method: 'GET'
      }).then((res) => {
        console.log('\n intervenant ', res)
        /* const id = res.data.intervenant._id
        const email = res.data.intervenant.email
        const nom = res.data.intervenant.nom
        const prenom = res.data.intervenant.prenom
        const type_utilisateur = res.data.intervenant.type_utilisateur
        localStorage.setItem('token', res.data.token)
        // console.log('\n res :', res.data.intervenant)

        Cookies.set('id', id)
        Cookies.set('email', email)
        Cookies.set('nom', nom)
        Cookies.set('prenom', prenom)
        Cookies.set('pass', hash)
        useMainStore().setUser(res.data.intervenant)

        if (type_utilisateur == 'USER') {
          Cookies.set('type', 'chef_equipe')
          router.push({
            name: 'Dashboard',
            params: { type: 'chef_equipe', pass: hash }
          })
        } else {
          console.log('Superviseur ', type_utilisateur)
          Cookies.set('type', 'superviseur')
          router.push({
            name: 'Dashboard',
            params: { type: 'superviseur', pass: hash }
          })
        } */
      })
    } else {
      form.showError = true;
      form.err = 'Identifiant ou mot de passe incorrect';
    }
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
