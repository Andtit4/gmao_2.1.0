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
import generatePassword from '@/services/generatePassword.js'
import emailjs from 'emailjs-com'
const form = reactive({
  matricule: '',
  nom: '',
  prenom: '',
  telephone: '',
  email: '',
  type_utilisateur: '',
  zone: '',
  refresh: false
})

const zones = reactive({ list: [] })

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

const getAllZone = () => {
  axios({
    url: apiService.getUrl() + '/zone',
    method: 'GET'
  })
    .then((response) => {
      zones.list = response.data
    })
    .catch((e) => {
      console.log('An error occured ' + e)
    })
}

let isSubmitting = false; // Ajout d'un drapeau pour vérifier l'état de soumission

const sendEmail = async (email, mot_de_passe, type) => {
  const templateParams = {
    from_email: email,
    to_email: email,
    subject: `IDENTIFIANT CONNEXION COMPTE ${type} ENERGY EYE`,
    message: `Identifiants de connexion:\nEmail: ${email}\nMot de passe: ${mot_de_passe} \n [Lien ici](http://example.com) `,
  };

  try {
    const response = await emailjs.send('service_r93bhos', 'template_03kfmva', templateParams, 'KL8xusAZLqk9BOjrX');
    console.log("Email envoyé: ", response);
  } catch (error) {
    console.log("Erreur lors de l'envoi de l'email: ", error);
  }
};

const submit = () => {
  if (isSubmitting) return; // Si déjà en cours, sortir de la fonction
  isSubmitting = true; // Définir le drapeau à vrai

  const gen = generatePassword.generatePassword();
  // console.log(gen)
  axios({
    url: apiService.getUrl() + '/intervenant/create',
    method: 'POST',
    data: {
      matricule: form.matricule,
      nom: form.nom,
      prenom: form.prenom,
      email: form.email,
      mot_de_passe: gen,
      zone: form.zone,
      telephone: form.telephone,
      type_utilisateur: form.type_utilisateur
    }
  }).then((response) => {
    console.log('Success ' + response);
    // sendEmail(form.email, gen, form.type_utilisateur);
    setTimeout(() => {
      location.reload();
    }, 1000);

  }).finally(() => {
    isSubmitting = false; // Réinitialiser le drapeau après la soumission
  });
}

onMounted(() => {
  getAllZone()
})
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
          <FormField label="Informations Complémentaires">
            <!-- <FormControl v-model="form.zone" :options="selectOptions" /> -->
            <select v-model="form.zone" class="form-select bg-white dark:bg-slate-800">
              <option value="">Séléctionnez une zone</option>
              <option v-for="(zone, index) in zones.list" :key="index" :value="zone.nom">
                {{ zone.nom }}
              </option>
            </select>
            <select v-model="form.type_utilisateur" class="form-select bg-white dark:bg-slate-800">
              <option value="">Séléctionnez le type d'utilisateur</option>
              <option value="USER">CHEF DE ZONE</option>
              <option value="SUPERVISEUR">SUPERVISEUR</option>
              <option value="CHAUFFEUR">CHAUFFEUR</option>
              <option value="CENTRAUX">INTERVENANT CENTRAUX</option>
              <option value="SUPERVISEUR-CENTRAUX">SUPERVISEUR-CENTRAUX</option>
            </select>
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
