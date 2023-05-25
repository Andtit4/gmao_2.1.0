<template>
  <div class="map-container" id="map"></div>
</template>

<script lang="js">
import L from "leaflet";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import customMarker from "@/assets/marker__2.png";
import MarkerDr1 from "@/assets/marker__.png";
import MarkerDr2 from "@/assets/marker__1.png";
import axios from "axios";

export default {
  data() {
    return {
      nb: 0,
      nbdr1: 0,
      nbdr2: 0,
    };
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      // Coordonnées du centre de la carte
      const center = [8.6195, 0.8248];

      const iconDefault = L.icon({
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
      });

      // Customized markers
      const iconActive = L.icon({
        iconUrl: customMarker,
        iconSize: [20, 20],
      });
      const iconDri = L.icon({
        iconUrl: MarkerDr1,
        iconSize: [25, 25],
      });
      const iconDr2 = L.icon({
        iconUrl: MarkerDr2,
        iconSize: [30, 30],
      });

      // Créer une instance de carte
      const map = L.map("map").setView(center, 7.4);

      // Ajouter une couche de tuile OpenStreetMap
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '',
      }).addTo(map);

      axios({
        url: "http://localhost:3000/api/site/nb/state?state=DR1",
        method: "GET",
      }).then((response) => {
        this.nbdr1 = response.data[0].nb;
      });

      axios({
        url: "http://localhost:3000/api/site/nb/state?state=DR2",
        method: "GET",
      }).then((response) => {
        this.nbdr2 = response.data[0].nb;
      });

      axios({
        url: "http://localhost:3000/api/site/nb",
        method: "GET",
      }).then((response) => {
        this.nb = response.data[0].nb;
      });

      axios({
        url: "http://localhost:3000/api/site",
        method: "GET",
      })
        .then((response) => {
          /* console.log("__the_response", response.data[1].nom_site);
          console.log("__nb_site_:" + this.nb);
          console.log("__nb_dr1:" + this.nbdr1);
          console.log("__nb_dr2:" + this.nbdr2); */

          for (var i = 0; i < this.nb; i++) {
            const site = [
              response.data[i].latitude,
              response.data[i].longitude,
            ];
            L.marker(site, { icon: iconActive })
              .addTo(map)
              .bindPopup("<b>" + response.data[i].nom_site + "</b>")
              .openPopup();
          }
        })
        .catch((e) => {
          console.log("__the_error", e);
        });

      // DR1
      axios({
        url: "http://localhost:3000/api/site/state?state=DR1",
        method: "GET",
      })
        .then((response) => {
          console.log("__the_response", response.data[1].nom_site);
          for (var i = 0; i < this.nbdr1; i++) {
            const site = [
              response.data[i].latitude,
              response.data[i].longitude,
            ];
            L.marker(site, { icon: iconDri })
              .addTo(map)
              .bindPopup("<b>" + response.data[i].nom_site + "</b>")
              .openPopup();
          }
        })
        .catch((e) => {
          console.log("__the_error", e);
        });

      // DR2
      axios({
        url: "http://localhost:3000/api/site/state?state=DR2",
        method: "GET",
      })
        .then((response) => {
          console.log("__the_response", response.data[1].nom_site);
          for (var i = 0; i < this.nbdr2; i++) {
            const site = [
              response.data[i].latitude,
              response.data[i].longitude,
            ];
            L.marker(site, { icon: iconDr2 })
              .addTo(map)
              .bindPopup("<b>" + response.data[i].nom_site + "</b>")
              .openPopup();
          }
        })
        .catch((e) => {
          console.log("__the_error", e);
        });
      console.log("Init");

      // Ajouter un marqueur pour le Togo
      L.marker(center, { icon: iconDefault })
        .addTo(map)
        .bindPopup("<b>Togo</b>")
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