import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import apiService from '@/services/apiService'


export const useMainStore = defineStore('main', () => {
  let userName = ref([])
  const userEmail = ref([])
  const userZone = ref([])
  const userType = ref([])
  const input = ref([])
  const inputview = ref([])
  const idUser = ref([])



  let name = localStorage.getItem('nom')
  let firstname = localStorage.getItem('prenom')
  let email = localStorage.getItem('email')
  let zone = localStorage.getItem('zone')
  let typeUtilisateur = localStorage.getItem('type_utilisateur')
  let id = localStorage.getItem('id')



  userName.value = name + ' ' + firstname
  userEmail.value = email
  userZone.value = zone
  userType.value = typeUtilisateur
  idUser.value = id;



  const userAvatar = computed(
    () =>
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail.value.replace(
        /[^a-z0-9]+/gi,
        '-'
      )}`
  )

  const generateIdPrefix = () => {
    const shortenedInput = input.value.substring(0, 3);
    inputview.value = `${shortenedInput}-STOCK-`;
  }

  const isFieldFocusRegistered = ref(false)

  const clients = ref([])
  const history = ref([])
  const sites = ref([])

  function setUser(payload) {
    if (payload.nom) {
      userName.value = payload.nom + ' ' + payload.prenom
    }
    if (payload.email) {
      userEmail.value = payload.email
    }
  }

  function fetchSampleClients() {
    axios
      .get(`data-sources/clients.json?v=3`)
      .then((result) => {
        clients.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }
  function fetchSites() {
    axios({
      url: apiService.getUrl() + '/site',
      method: 'GET'
    })
      .then((response) => {
        sites.value = response.data
      })
      .catch((e) => {
        console.log('An error occured ' + e)
      })
  }

  function fetchSampleHistory() {
    axios
      .get(`data-sources/history.json`)
      .then((result) => {
        history.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  return {
    userName,
    userEmail,
    userZone,
    userType,
    idUser,
    input,
    inputview,
    userAvatar,
    isFieldFocusRegistered,
    clients,
    sites,
    history,
    setUser,
    fetchSampleClients,
    fetchSampleHistory,
    fetchSites,
    generateIdPrefix
  }
})
