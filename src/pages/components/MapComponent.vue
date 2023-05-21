<template>
  <div class="map-container" id="map"></div>
</template>

<script>
import L from "leaflet";

export default {
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
        console.log('Init Map')
      // Coordonnées du centre de la carte
      const center = [8.6195, 0.8248];

      // Créer une instance de carte
      const map = L.map("map").setView(center, 7.4);

      // Ajouter une couche de tuile OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Ajouter un marqueur pour le Togo
      L.marker(center).addTo(map).bindPopup("<b>Togo</b>").openPopup();
    },
  },
};
</script>


<style>
.map-container {
    position: relative;
    top: -40%;
    width: 400px;
    height: 600px;
}
</style>