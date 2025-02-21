<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { mdiAccount, mdiAsterisk, mdiMonitorCellphone } from '@mdi/js'
import SectionFullScreen from '@/components/SectionFullScreen.vue'
import CardBox from '@/components/CardBox.vue'
import FormCheckRadio from '@/components/FormCheckRadio.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import axios from 'axios'
import apiService from '@/services/apiService'
import NotificationBar from '@/components/NotificationBar.vue'
// import CryptoJS from 'crypto-js'
import { useMainStore } from '@/stores/main.js'
// import { isEmptyArray } from '@/services/document'
import LoadingButton from '@/layouts/LoadingButton.vue'
const isLoading = ref(false)
const form = reactive({
  login: '',
  pass: '',
  remember: true,
  err: '',
  showError: false
})

const router = useRouter()
const mainStore = useMainStore()

const submit = async () => {
  isLoading.value = true
  form.showError = false
  form.err = ''

  try {
    const response = await axios.get(
      `${apiService.getUrl()}/intervenant/auth?email=${form.login}&mot_de_passe=${form.pass}`,
      // { params: { email: form.login, mot_de_passe: form.pass } }
    )

    const { data } = response

    if (data.error) {
      form.showError = true
      form.err = data.error
    } else {
      const { token, intervenant, type_utilisateur } = data
      const user = intervenant[0]

      localStorage.setItem('token', token)
      localStorage.setItem('pass', user._id)
      localStorage.setItem('id', user._id)
      localStorage.setItem('email', user.email)
      localStorage.setItem('nom', user.nom)
      localStorage.setItem('prenom', user.prenom)
      localStorage.setItem('zone', user.zone)
      localStorage.setItem('type_utilisateur', user.type_utilisateur)

      mainStore.setUser(user)

      const routeMap = {
        ADMIN: { type: 'admin', name: 'Dashboard' },
        USER: { type: 'chef_equipe', name: 'Dashboard', setZone: true },
        SUPERVISEUR: { type: 'superviseur', name: 'Dashboard' },
        CENTRAUX: {type: 'centraux', name: 'InterventionCentral', setZone: true}
      }

      const route = routeMap[type_utilisateur]
      if (route) {
        localStorage.setItem('type', route.type)
        if (route.setZone) {
          localStorage.setItem('zone', user.zone)
        }
        router.push({
          name: route.name,
          params: { type: route.type, pass: user._id }
        })
      }
    }
  } catch (err) {
    console.error('Erreur survenue', err.message)
    form.showError = true
    form.err = "Une erreur s'est produite lors de la connexion"
  } finally {
    isLoading.value = false
  }
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
          <LoadingButton :button-text="'Login'" :is-loading="isLoading" @click="submit()" />

        </template>
      </CardBox>
    </SectionFullScreen>
  </LayoutGuest>
</template>
