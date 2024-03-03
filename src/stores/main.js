import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'
import apiService from '@/services/apiService'
import Cookies from 'js-cookie'


export const useMainStore = defineStore('main', () => {
  let userName = ref([])
  const userEmail = ref([])
  const input = ref([])
  const inputview = ref([])



  let name = Cookies.get('nom')
  let firstname = Cookies.get('prenom')
  let email = Cookies.get('email')


  userName.value = name + ' ' + firstname
  userEmail.value = email


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
