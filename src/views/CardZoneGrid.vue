<script setup>
import ProgressBarWidgetVue from "@/components/ProgressBarWidget.vue"
import apiService from "@/services/apiService"
import axios from "axios"
import { onMounted, reactive, computed } from 'vue'

const zones = reactive({ list: [] })
const zoneData = reactive(new Map())

const getAllZone = async () => {
  try {
    const response = await axios.get(apiService.getUrl() + '/preventive')
    zones.list = response.data
    await getZoneData()
  } catch (e) {
    console.error('Une erreur est survenue:', e)
  }
}

const getZoneData = async () => {
  const promises = zones.list.map(async (zone) => {
    try {
      const response = await axios.get(apiService.getUrl() + `/plannifie/zone/done/nb?zone=${encodeURIComponent(zone.zone)}`)
      zoneData.set(zone.zone, response.data[0].nb)
    } catch (err) {
      console.error(`Erreur pour la zone ${zone.zone}:`, err.message)
      zoneData.set(zone.zone, 0)
    }
  })
  await Promise.all(promises)
}

const getProgressValue = computed(() => (zone) => {
  const doneCount = zoneData.get(zone.zone) || 0
  return Math.ceil((parseInt(doneCount) * 100) / parseInt(zone.nombre_total_site))
})

onMounted(getAllZone)
</script>

<template>
  <div v-for="(site, index) in zones.list" :key="index" class="grid-item">
    <span style="display: inline-block;">
      {{ site.zone }}
    </span>
    <div style="display: inline-block;">
      ( {{ zoneData.get(site.zone) || 0 }} / {{ site.nombre_total_site }})
    </div>
    <div style="color: #007bff">
      <ProgressBarWidgetVue :value="getProgressValue(site)" :maxValue="100" />
    </div>
  </div>
</template>

<style scoped>
.grid-item {
  display: inline-block;
  width: calc(50% - 10px);
  font-size: 10px;
  padding: 5px;
}
</style>
