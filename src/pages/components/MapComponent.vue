<template>
  <div class="map-container" id="map"></div>
</template>

<script>
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import customMarker from "@/assets/marker_.png";

export default {
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      console.log("Init Map");
      // Coordonnées du centre de la carte
      const center = [8.6195, 0.8248];
      const lome = [6.4267 , 1.2136];
      const atakpame = [7.5350, 1.1263];
      const kara = [9.5510, 1.1861];

      const iconDefault = L.icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
      });

      const iconActive = L.icon({
        iconUrl: customMarker,
        iconSize: [25, 25],
      });

      // Créer une instance de carte
      const map = L.map("map").setView(center, 7.4);

      // Ajouter une couche de tuile OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Ajouter un marqueur pour le Togo
      L.marker(center, { icon: iconDefault })
        .addTo(map)
        .bindPopup("<b>Togo</b>")
        .openPopup();

        L.marker(lome, { icon: iconActive })
        .addTo(map)
        .bindPopup("<b>Tsévié</b>")
        .openPopup();

        L.marker(atakpame, { icon: iconActive })
        .addTo(map)
        .bindPopup("<b>Atakpamé</b>")
        .openPopup();

        L.marker(kara, { icon: iconActive })
        .addTo(map)
        .bindPopup("<b>Kara</b>")
        .openPopup();
    },
  },
};
</script>


<style>
.map-container {
  position: relative;
  top: -40%;
  width: 400px;
  height: 700px;
}
</style>