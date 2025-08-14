<template>
  <div class="map-container">
    <div class="svg-container" ref="mapContainer">
      <svg :width="svgWidth" :height="svgHeight" ref="svgMap"></svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import * as d3 from 'd3';
import axios from 'axios';
import apiService from '@/services/apiService';

const mapContainer = ref(null);
const svgMap = ref(null);
const svgWidth = ref(800);
const svgHeight = ref(600);
const geojsonData = ref(null);
const selectedFeature = ref(null);
const showInfo = ref(true);

const cardSiteList = ref([]);
const cardSiteDoneList = ref([]);
const cardWaitingList = ref([]);
const searchQuery = ref('');

const togoCoordinates = { latitude: 8.619543, longitude: 0.824782 };

const legendItems = ref([
  /* { color: '#dc3545', label: 'Sites à visiter' },
  { color: '#28a745', label: 'Sites visités' },
  { color: '#ffc107', label: 'Sites en cours' } */
]);

const fetchSites = async (url) => {
  try {
    const response = await axios.get(apiService.getUrl() + url);
    return response.data;
  } catch (error) {
    console.error(`Erreur lors de la récupération des données: ${error.message}`);
    return [];
  }
};

const loadSitesData = async () => {
  try {
    [cardSiteList.value, cardSiteDoneList.value, cardWaitingList.value] = await Promise.all([
      fetchSites('/plannifie/nonfait/for-map'),
      fetchSites('/plannifie/all/done/for-map'),
      fetchSites('/plannifie/encours/for-map')
    ]);

    console.log("Données récupérées:", {
      cardSiteList: cardSiteList.value,
      cardSiteDoneList: cardSiteDoneList.value,
      cardWaitingList: cardWaitingList.value
    });

    renderMap();
  } catch (error) {
    console.error("Erreur lors du chargement des données des sites:", error);
  }
};


const loadGeoJSON = async () => {
  try {
    const response = await axios.get('./data.geojson');
    geojsonData.value = response.data;
  } catch (error) {
    console.warn('GeoJSON non trouvé, création de données par défaut');
    geojsonData.value = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: { name: "Togo", type: "country" },
          geometry: {
            type: "Polygon",
            coordinates: [[
              [0.0, 6.0], [1.8, 6.0], [1.8, 11.1], [0.0, 11.1], [0.0, 6.0]
            ]]
          }
        }
      ]
    };
  }
};

const getSiteColor = (siteType) => {
  switch (siteType) {
    case 'afaire': return '#dc3545';
    case 'termine': return '#28a745';
    case 'encours': return '#ffc107';
    default: return '#3388ff';
  }
};

const filteredSites = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return [...cardSiteList.value, ...cardSiteDoneList.value, ...cardWaitingList.value]
    .filter(site => site.nom_site.toLowerCase().includes(query));
});

const renderMap = () => {
  if (!svgMap.value) return;

  d3.select(svgMap.value).selectAll("*").remove();

  const svg = d3.select(svgMap.value);

  const projection = d3.geoMercator()
    .center([togoCoordinates.longitude, togoCoordinates.latitude])
    .translate([svgWidth.value / 2, svgHeight.value / 2])
    .scale(5700);

  const path = d3.geoPath().projection(projection);

  if (geojsonData.value) {
    svg.selectAll("path")
      .data(geojsonData.value.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "rgba(54, 136, 255, 0.3)")
      .attr("stroke", "#3388ff")
      .attr("stroke-width", 2)
      .attr("opacity", 0.7);
  }

  svg.selectAll(".marker-afaire")
    .data(cardSiteList.value)
    .enter()
    .append("circle")
    .attr("class", "marker-afaire")
    .attr("cx", d => projection([d.longitude, d.latitude])[0])
    .attr("cy", d => projection([d.longitude, d.latitude])[1])
    .attr("r", 6)
    .attr("fill", getSiteColor('afaire'))
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .attr("opacity", 0.8)
    .style("cursor", "pointer")
    .on("mouseover", function(event, d) {
      d3.select(this)
        .attr("r", 8)
        .attr("opacity", 1);

      const tooltip = svg.append("g")
        .attr("class", "tooltip")
        .attr("transform", `translate(${projection([d.longitude, d.latitude])[0]}, ${projection([d.longitude, d.latitude])[1] - 20})`);

      const rect = tooltip.append("rect")
        .attr("x", -50)
        .attr("y", -30)
        .attr("width", 100)
        .attr("height", 25)
        .attr("fill", "rgba(0, 0, 0, 0.8)")
        .attr("rx", 3);

      tooltip.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -10)
        .attr("fill", "white")
        .attr("font-size", "12px")
        .text(d.nom_site);
    })
    .on("mouseout", function(event, d) {
      d3.select(this)
        .attr("r", 6)
        .attr("opacity", 0.8);

      svg.select(".tooltip").remove();
    })
    .on("click", (event, d) => {
      selectedFeature.value = {
        properties: {
          name: d.nom_site,
          type: 'Site à visiter',
          statut: d.statut,
          date_prevue: d.date_prevue
        }
      };
    });

  svg.selectAll(".marker-termine")
    .data(cardSiteDoneList.value)
    .enter()
    .append("circle")
    .attr("class", "marker-termine")
    .attr("cx", d => projection([d.longitude, d.latitude])[0])
    .attr("cy", d => projection([d.longitude, d.latitude])[1])
    .attr("r", 6)
    .attr("fill", getSiteColor('termine'))
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .attr("opacity", 0.8)
    .style("cursor", "pointer")
    .on("mouseover", function(event, d) {
      d3.select(this)
        .attr("r", 8)
        .attr("opacity", 1);

      const tooltip = svg.append("g")
        .attr("class", "tooltip")
        .attr("transform", `translate(${projection([d.longitude, d.latitude])[0]}, ${projection([d.longitude, d.latitude])[1] - 20})`);

      tooltip.append("rect")
        .attr("x", -50)
        .attr("y", -30)
        .attr("width", 100)
        .attr("height", 25)
        .attr("fill", "rgba(0, 0, 0, 0.8)")
        .attr("rx", 3);

      tooltip.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -10)
        .attr("fill", "white")
        .attr("font-size", "12px")
        .text(d.nom_site);
    })
    .on("mouseout", function(event, d) {
      d3.select(this)
        .attr("r", 6)
        .attr("opacity", 0.8);

      svg.select(".tooltip").remove();
    })
    .on("click", (event, d) => {
      selectedFeature.value = {
        properties: {
          name: d.nom_site,
          type: 'Site visité',
          statut: d.statut,
          date_prevue: d.date_prevue
        }
      };
    });

  // Dessiner les marqueurs des sites en cours (orange)
  svg.selectAll(".marker-encours")
    .data(cardWaitingList.value)
    .enter()
    .append("circle")
    .attr("class", "marker-encours")
    .attr("cx", d => projection([d.longitude, d.latitude])[0])
    .attr("cy", d => projection([d.longitude, d.latitude])[1])
    .attr("r", 8)
    .attr("fill", getSiteColor('encours'))
    .attr("stroke", "#fff")
    .attr("stroke-width", 2)
    .attr("opacity", 0.8)
    .style("cursor", "pointer")
    .on("mouseover", function(event, d) {
      d3.select(this)
        .attr("r", 10)
        .attr("opacity", 1);

      const tooltip = svg.append("g")
        .attr("class", "tooltip")
        .attr("transform", `translate(${projection([d.longitude, d.latitude])[0]}, ${projection([d.longitude, d.latitude])[1] - 20})`);

      tooltip.append("rect")
        .attr("x", -50)
        .attr("y", -30)
        .attr("width", 100)
        .attr("height", 25)
        .attr("fill", "rgba(0, 0, 0, 0.8)")
        .attr("rx", 3);

      tooltip.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -10)
        .attr("fill", "white")
        .attr("font-size", "12px")
        .text(d.nom_site);
    })
    .on("mouseout", function(event, d) {
      d3.select(this)
        .attr("r", 8)
        .attr("opacity", 0.8);

      svg.select(".tooltip").remove();
    })
    .on("click", (event, d) => {
      selectedFeature.value = {
        properties: {
          name: d.nom_site,
          type: 'Site en cours',
          statut: d.statut,
          date_prevue: d.date_prevue
        }
      };
    });

  // Ajouter la légende
  // addLegend(svg);
};

// Ajouter la légende à la carte
/* const addLegend = (svg) => {
  const legend = svg.append("g")
    .attr("class", "legend")
    .attr("transform", `translate(20, ${svgHeight.value - 120})`);

  legend.append("rect")
    .attr("width", 180)
    .attr("height", 100)
    .attr("fill", "rgba(255, 255, 255, 0.9)")
    .attr("stroke", "#ccc")
    .attr("rx", 5);

  legendItems.value.forEach((item, index) => {
    const legendItem = legend.append("g")
      .attr("transform", `translate(10, ${20 + index * 25})`);

    legendItem.append("circle")
      .attr("cx", 8)
      .attr("cy", 0)
      .attr("r", 6)
      .attr("fill", item.color);

    legendItem.append("text")
      .attr("x", 20)
      .attr("y", 4)
      .attr("font-size", "12px")
      .attr("fill", "#333")
      .text(item.label);
  });
}; */

// Gestion du redimensionnement
const handleResize = () => {
  if (mapContainer.value) {
    svgWidth.value = mapContainer.value.clientWidth;
    svgHeight.value = Math.max(500, window.innerHeight * 0.7);
    renderMap();
  }
};

onMounted(async () => {
  // Configurer le redimensionnement
  window.addEventListener('resize', handleResize);

  // Initialiser les dimensions
  if (mapContainer.value) {
    svgWidth.value = mapContainer.value.clientWidth;
    svgHeight.value = Math.max(500, window.innerHeight * 0.7);
  }

  // Charger les données
  await loadGeoJSON();
  await loadSitesData();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* .svg-container {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  overflow: hidden;
} */

svg {
  display: block;
  width: 100%;
  height: 100%;
}

.marker-afaire,
.marker-termine,
.marker-encours {
  transition: all 0.2s ease;
}

.legend {
  pointer-events: none;
}

@media (max-width: 768px) {
  .map-container {
    padding: 10px;
  }

  .legend {
    transform: translate(10px, calc(100% - 120px)) !important;
  }
}
</style>
