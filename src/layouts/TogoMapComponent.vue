<script setup>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { onMounted, ref, computed } from 'vue'
import axios from 'axios'
import apiService from '@/services/apiService'

const map = ref(null)
const cardSiteList = ref([])
const cardSiteDoneList = ref([])
const cardWaitingList = ref([])
const searchQuery = ref('')

const togoCoordinates = { latitude: 8.619543, longitude: 0.824782 }

const createMarkerIcon = (url, size) => L.icon({
  iconUrl: url,
  iconSize: size,
  iconAnchor: [size[0] / 2, size[1]],
  popupAnchor: [0, -size[1]]
})

const redMarkerIcon = createMarkerIcon('https://cdn2.iconfinder.com/data/icons/color-svg-vector-icons-2/512/map_marker_base-512.png', [12, 12])
const greenMarkerIcon = createMarkerIcon('https://www.clipartmax.com/png/full/117-1179307_filemap-pin-icon-green-map-marker-png-green.png', [12, 12])
const warningMarkerIcon = createMarkerIcon('https://www.pngall.com/wp-content/uploads/2017/05/Map-Marker-Free-Download-PNG.png', [16, 16])

const fetchSites = async (url) => {
  try {
    const response = await axios.get(apiService.getUrl() + url)
    return response.data
  } catch (error) {
    console.error(`Erreur lors de la récupération des données: ${error.message}`)
    return []
  }
}

const sitesAFaire = ref(null)
const sitesTermines = ref(null)
const sitesEnCours = ref(null)

const initMap = async () => {
  // console.log("Initialisation de la carte...")

  try {
    [cardSiteList.value, cardSiteDoneList.value, cardWaitingList.value] = await Promise.all([
      fetchSites('/plannifie/nonfait/for-map'),
      fetchSites('/plannifie/all/done/for-map'),
      fetchSites('/plannifie/encours/for-map')
    ])

    console.log("Données récupérées:", { cardSiteList: cardSiteList.value, cardSiteDoneList: cardSiteDoneList.value, cardWaitingList: cardWaitingList.value })

    map.value = L.map('map', {
      center: [togoCoordinates.latitude, togoCoordinates.longitude],
      zoom: 7,
      minZoom: 7,
      maxZoom: 10,
      maxBounds: L.latLngBounds(L.latLng(5.5, -0.5), L.latLng(11.5, 2)),
      maxBoundsViscosity: 1.0
    }).setView([togoCoordinates.latitude, togoCoordinates.longitude], 7)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19
    }).addTo(map.value)

    console.log("Carte créée et couche de fond ajoutée")

    sitesAFaire.value = L.layerGroup().addTo(map.value)
    sitesTermines.value = L.layerGroup().addTo(map.value)
    sitesEnCours.value = L.layerGroup().addTo(map.value)

    addMarkers(cardSiteList.value, redMarkerIcon, sitesAFaire.value)
    addMarkers(cardSiteDoneList.value, greenMarkerIcon, sitesTermines.value)
    addMarkers(cardWaitingList.value, warningMarkerIcon, sitesEnCours.value)

    const overlayMaps = {
      "Sites à visiter": sitesAFaire.value,
      "Sites visités": sitesTermines.value,
      "Sites en cours": sitesEnCours.value
    }

    L.control.layers(null, overlayMaps).addTo(map.value)

    console.log("Marqueurs ajoutés")
  } catch (error) {
    console.error("Erreur lors de l'initialisation de la carte:", error)
  }
}

const addMarkers = (list, icon, layerGroup) => {
  list.forEach(data => {
    L.marker([data.latitude, data.longitude], { icon })
      .bindPopup(`
        <strong>${data.nom_site}</strong><br>
        Statut: ${data.statut || 'Non défini'}<br>
        Date prévue: ${data.date_prevue || 'Non définie'}
      `)
      .addTo(layerGroup)
  })
  layerGroup.addTo(map.value)
}

const zoomToMarkers = () => {
  const allLayers = [...sitesAFaire.value.getLayers(), ...sitesTermines.value.getLayers(), ...sitesEnCours.value.getLayers()]
  const group = new L.featureGroup(allLayers)
  map.value.fitBounds(group.getBounds().pad(0.1))
}

const filteredSites = computed(() => {
  const query = searchQuery.value.toLowerCase()
  return [...cardSiteList.value, ...cardSiteDoneList.value, ...cardWaitingList.value]
    .filter(site => site.nom_site.toLowerCase().includes(query))
})

const searchSites = () => {
  sitesAFaire.value.clearLayers()
  sitesTermines.value.clearLayers()
  sitesEnCours.value.clearLayers()

  filteredSites.value.forEach(site => {
    let icon, layerGroup
    if (cardSiteList.value.includes(site)) {
      icon = redMarkerIcon
      layerGroup = sitesAFaire.value
    } else if (cardSiteDoneList.value.includes(site)) {
      icon = greenMarkerIcon
      layerGroup = sitesTermines.value
    } else {
      icon = warningMarkerIcon
      layerGroup = sitesEnCours.value
    }

    L.marker([site.latitude, site.longitude], { icon })
      .bindPopup(`
        <strong>${site.nom_site}</strong><br>
        Statut: ${site.statut || 'Non défini'}<br>
        Date prévue: ${site.date_prevue || 'Non définie'}
      `)
      .addTo(layerGroup)
  })

  if (filteredSites.value.length > 0) {
    zoomToMarkers()
  }
}

onMounted(() => {
  console.log("Composant monté")
  initMap().then(() => {
    zoomToMarkers()
  })
})
</script>

<template>
  <div>
    <div id="map"></div>
  </div>
</template>

<style scoped>
#map {
  height: 600px;
  width: 100%;
}
</style>

