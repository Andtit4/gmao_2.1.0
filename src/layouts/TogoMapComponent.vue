<!-- <template>
  <div id="map"></div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

export default class TogoMap extends Vue {
  mounted() {
    // Coordonnées approximatives du centre du Togo
    const togoCoordinates: [number, number] = [8, 1];

    // Création de la carte
    const map = L.map('map').setView(togoCoordinates, 8); // Ajustez le niveau de zoom selon vos préférences

    // Ajout d'une couche de carte OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Définir les limites pour afficher uniquement le Togo
    const southWest = L.latLng(6.1, -0.25); // Coordonnées sud-ouest du Togo
    const northEast = L.latLng(11.5, 1.8); // Coordonnées nord-est du Togo
    const bounds = L.latLngBounds(southWest, northEast);

    // Limiter la carte aux frontières du Togo
    map.setMaxBounds(bounds);
    map.on('drag', () => {
      map.panInsideBounds(bounds, { animate: false });
    });
  }
}
</script>

<style scoped>
#map {
  height: 500px;
}
</style>
 -->

 <script setup>
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { onMounted, reactive } from 'vue'
const togoCoordinates = reactive({
  latitude: 8,
  longitude: 1
})
const createCard = () => {
  // Coordonnées approximatives du centre du Togo
  // const togoCoordinates: [number, number] = [8, 1];
  // const togoCoordinates: [latitude: number, longitude: number] = [8, 1];

  // Création de la carte
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

  // Limiter la carte aux frontières du Togo
  map.setMaxBounds(bounds)
  map.on('drag', () => {
    map.panInsideBounds(bounds, { animate: true })
  })
}

onMounted(() => {
  createCard()
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
