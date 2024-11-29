<script setup>
import { reactive } from 'vue'
import { useMainStore } from '@/stores/main'
import { mdiAccount, mdiMail, mdiAsterisk, mdiFormTextboxPassword, mdiGithub } from '@mdi/js'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import BaseDivider from '@/components/BaseDivider.vue'
import FormField from '@/components/FormField.vue'
import FormControl from '@/components/FormControl.vue'
import FormFilePicker from '@/components/FormFilePicker.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import UserCard from '@/components/UserCard.vue'
import LayoutAuthenticated from '@/layouts/LayoutAuthenticated.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import NotificationBar from '@/components/NotificationBar.vue'
import apiService from '@/services/apiService'
import axios from 'axios'

const mainStore = useMainStore()

const profileForm = reactive({
  name: mainStore.userName,
  email: mainStore.userEmail,
  id: mainStore.idUser,
})

const passwordForm = reactive({
  password_current: '',
  password: '',
  password_confirmation: ''
})

const form = reactive({
  showError: false,
  showSuccess: false,
  success: '',
  err: '',
  globalErr: false,
  globalErrMessage: ''

})

const submitProfile = () => {
  mainStore.setUser(profileForm)
}

const resetPasswordForm = () => {
  passwordForm.password_current = ''
  passwordForm.password = ''
  passwordForm.password_confirmation = ''
  // form.showError = false
}

const submitPass = async () => {
  if (passwordForm.password == '' || passwordForm.password == '' || passwordForm.password_confirmation == '') {
    form.globalErr = true
    form.globalErrMessage = 'Veuillez remplir tous les champs'
  } else {
    try {
      const response = await axios.get(`${apiService.getUrl()}/intervenant/${profileForm.id}`,)
      const { data } = response
      // console.info(data[0])
      if (passwordForm.password_current == data[0].mot_de_passe) {
        if (passwordForm.password == passwordForm.password_confirmation) {
          //
          try {
            const modified = await axios.put(`${apiService.getUrl()}/intervenant/reset_password/${profileForm.id}/${passwordForm.password}`)
            const { isModified } = modified
            console.info(isModified)
            form.showSuccess = true
            form.success = 'Mot de passe modifié avec succès'
            resetPasswordForm()
          } catch (err) {
            form.showError = true
            form.err = err.message
            resetPasswordForm()
          }
        } else {
          form.showError = true
          form.err = 'Les nouveaux mot de passe ne concordent pas'
          resetPasswordForm()
        }
      } else {
        form.showError = true
        form.err = 'Votre mot de passe courrant est incorrect'
        resetPasswordForm()
      }
      if (data.error) {
        form.showError = true
        form.err = data.error
        resetPasswordForm()
      }
    } catch (err) {
      form.showError = true
      form.err = err.message
      resetPasswordForm()
    }
  }

}
</script>

<template>
  <LayoutAuthenticated>
    <SectionMain>
      <SectionTitleLineWithButton :icon="mdiAccount" title="Profile" main>
        <!-- <BaseButton
          href="https://github.com/justboil/admin-one-vue-tailwind"
          target="_blank"
          :icon="mdiGithub"
          label="Star on GitHub"
          color="contrast"
          rounded-full
          small
        /> -->
      </SectionTitleLineWithButton>
      <div v-if="form.globalErr == true">
        <NotificationBar color="danger" :icon="mdiMonitorCellphone">
          {{ form.globalErrMessage }}
        </NotificationBar>
      </div>

      <UserCard class="mb-6" />

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CardBox is-form @submit.prevent="submitProfile">
          <FormField label="Avatar" help="Max 500kb">
            <FormFilePicker label="Upload" />
          </FormField>

          <FormField label="Name" help="Required. Your name">
            <FormControl v-model="profileForm.name" :icon="mdiAccount" name="username" required
              autocomplete="username" />
          </FormField>
          <FormField label="E-mail" help="Required. Your e-mail">
            <FormControl v-model="profileForm.email" :icon="mdiMail" type="email" name="email" required
              autocomplete="email" />
          </FormField>

          <template #footer>
            <BaseButtons>
              <BaseButton color="info" type="submit" label="Submit" />
            </BaseButtons>
          </template>
        </CardBox>

        <CardBox is-form @submit.prevent="submitPass">
          <div v-if="form.showError == true">
            <NotificationBar color="danger" :icon="mdiMonitorCellphone">
              {{ form.err }}
            </NotificationBar>
          </div>
          <div v-if="form.showSuccess == true">
            <NotificationBar color="success" :icon="mdiMonitorCellphone">
              {{ form.success }}
            </NotificationBar>
          </div>
          <FormField label="Mot de passe">
            <FormControl v-model="passwordForm.password_current" :icon="mdiAsterisk" name="password_current"
              type="password" required autocomplete="current-password" />
          </FormField>

          <BaseDivider />

          <FormField label="Nouveau mot de passe">
            <FormControl v-model="passwordForm.password" :icon="mdiFormTextboxPassword" name="password" type="password"
              required autocomplete="new-password" />
          </FormField>

          <FormField label="Confirmez le mot de passe">
            <FormControl v-model="passwordForm.password_confirmation" :icon="mdiFormTextboxPassword"
              name="password_confirmation" type="password" required autocomplete="new-password" />
          </FormField>

          <template #footer>
            <BaseButtons>
              <BaseButton type="submit" color="info" label="Submit" />
            </BaseButtons>
          </template>
        </CardBox>
      </div>
    </SectionMain>
  </LayoutAuthenticated>
</template>
