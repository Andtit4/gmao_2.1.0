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

const submit = () => {
  // router.push('/dashboard')
  const hash = CryptoJS.SHA256(form.pass)


  axios({
    url: apiService.getUrl() + `/admin/auth/${form.login}/${hash}`,
    method: 'GET'
  }).then((response) => {
    // console.log('id: ', response.data.admin._id)
    const id = response.data.admin._id
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
      })

    /* if (response.data.admin._id == undefined) {
      axios({
        url: apiService.getUrl() + `/intervenant/auth/${form.login}/${form.pass}`,
        method: 'GET'
      })
        .then((res) => {
          if (res.data._id == undefined) {
            form.showError = true
            form.err = 'Email ou mot de passe incorrect'
            console.log('Supervisor not exist')
          } else {
            const id = res.data.intervenant._id
            const email = res.data.intervenant.email
            const nom = res.data.intervenant.nom
            const prenom = res.data.intervenant.prenom
            const type_utilisateur = res.data.intervenant.type_utilisateur
            localStorage.setItem('token', response.data.token)
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
        })
        .catch((err) => {
          form.err = 'An error occured ' + err.message
          form.showError = true
          console.log('An error occured', err.message)
        })
    } else {
      // console.log(response.data.token)
      const id = response.data.admin._id
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
      })
    } */
  }).catch((err) => {
    console.log('Error admin! ', err.response.status)
    if (err.response.status == 401) {
      axios({
        url: apiService.getUrl() + `/intervenant/auth/${form.login}/${form.pass}`,
        method: 'GET'
      }).then((res) => {
        const id = res.data.intervenant._id
        const email = res.data.intervenant.email
        const nom = res.data.intervenant.nom
        const prenom = res.data.intervenant.prenom
        const type_utilisateur = res.data.intervenant.type_utilisateur
        localStorage.setItem('token', res.data.token)
        // console.log('\n res :', res.data.intervenant)

        //todo ameliore cookies managing
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
