<script setup>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { onMounted, reactive } from 'vue'
import axios from 'axios'
import apiService from '@/services/apiService'

const togoCoordinates = reactive({
  latitude: 8,
  longitude: 1
})

// Icône de marqueur rouge
const redMarkerIcon = new L.Icon({
  iconUrl:
    'https://cdn2.iconfinder.com/data/icons/color-svg-vector-icons-2/512/map_marker_base-512.png',
  iconSize: [20, 20],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})


const greenMarkerIcon = new L.Icon({
  iconUrl:
    'https://play-lh.googleusercontent.com/5WifOWRs00-sCNxCvFNJ22d4xg_NQkAODjmOKuCQqe57SjmDw8S6VOSLkqo6fs4zqis',
  iconSize: [20, 20],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
})

const cardSiteList = reactive({ list: [] })
const cardSiteDoneList = reactive({ list: [] })

const siteNonFait = async () => {
  axios({
    url: apiService.getUrl() + '/plannifie/nonfait/for-map',
    method: 'GET'
  })
    .then(async (res) => {
      cardSiteList.list = await res.data
      console.log('Res: ', cardSiteList.list)

      axios({
        url: apiService.getUrl() + '/plannifie/all/done/for-map',
        method: 'GET'
      })
        .then((r) => {
          cardSiteDoneList.list = r.data
          createCard()
        })
        .catch((err) => {
          console.log("Error lors de l'affichage des site fait sur la carte", err.message)
        })
    })
    .catch((err) => {
      console.log("Error lors de l'affichage des site sur la carte", err.message)
    })
}

const createCard = () => {
  const map = L.map('map', {
    center: [togoCoordinates.latitude, togoCoordinates.longitude],
    zoom: 7
  }) /* .setView(togoCoordinates.latitude, togoCoordinates.longitude, 8) */

  // Ajout d'une couche de carte OpenStreetMap
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '©'
  }).addTo(map)

  // Définir les limites pour afficher uniquement le Togo
  const southWest = L.latLng(6.1, -0.25) // Coordonnées sud-ouest du Togo
  const northEast = L.latLng(11.5, 1.8) // Coordonnées nord-est du Togo
  const bounds = L.latLngBounds(southWest, northEast)

  cardSiteList.list.forEach((data) => {
    const marker = L.marker([data.latitude, data.longitude], { icon: redMarkerIcon }).addTo(map)
    marker.bindPopup(data.zone) // Utiliser la zone ou d'autres informations pertinentes pour la popup
  })

  cardSiteDoneList.list.forEach((data) => {
    const marker = L.marker([data.latitude, data.longitude], { icon: greenMarkerIcon }).addTo(map)
    marker.bindPopup(data.zone) // Utiliser la zone ou d'autres informations pertinentes pour la popup
  })

  /* for (let data = 0; data <= cardSiteList.list.length; data++) {
    console.log('mapping : ', cardSiteList.list[data])
    L.marker([cardSiteList.list[data].latitude, cardSiteList.list[data].longitude], {
      icon: redMarkerIcon
    })
      .bindPopup(cardSiteList.list[data].zone)
      .addTo(map)
  } */

  /* for (let data = 0; data <= cardSiteDoneList.list.length; data++) {
    console.log('mapping done : ', cardSiteDoneList.list[data])
    L.marker([cardSiteDoneList.list[data].latitude, cardSiteDoneList.list[data].longitude], {
      icon: greenMarkerIcon
    })
      .bindPopup(cardSiteDoneList.list[data].zone)
      .addTo(map)
  } */
  // Limiter la carte aux frontières du Togo
  map.setMaxBounds(bounds)
  map.on('drag', () => {
    map.panInsideBounds(bounds, { animate: true })
  })
}

onMounted(() => {
  siteNonFait()
})
</script>

<template>
  <div id="map"></div>
</template>

<style scoped>
#map {
  height: 500px;
}
</style>
