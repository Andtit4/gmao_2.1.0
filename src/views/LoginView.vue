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
import CryptoJS from 'crypto-js'
import Cookies from 'js-cookie'

const form = reactive({
  login: '',
  pass: '',
  remember: true
})

const router = useRouter()

const submit = () => {
  // router.push('/dashboard')
  const hash = CryptoJS.SHA256(form.pass)
  const url = apiService.getUrl() + `/admin/auth/${form.login}/${hash}`
  console.log(url)
  axios({
    url: apiService.getUrl() + `/admin/auth/${form.login}/${hash}`,
    method: 'GET'
  }).then((response) => {
    if (response.data._id == undefined) {
      console.log('User not exist')
    } else {
      const id = response.data._id
      const email = response.data.email
      const nom = response.data.nom
      const prenom = response.data.prenom
      /* Cookies.remove('id', id)
      Cookies.remove('email', email)
      Cookies.remove('nom', nom)
      Cookies.remove('prenom', prenom)
      Cookies.remove('pass', hash)
      Cookies.remove('type', 'admin') */
      Cookies.set('id', id)
      Cookies.set('email', email)
      Cookies.set('nom', nom)
      Cookies.set('prenom', prenom)
      Cookies.set('pass', hash)
      Cookies.set('type', 'admin')
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
        <img src="@/assets/logo.png" alt="" width="40px" />
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
