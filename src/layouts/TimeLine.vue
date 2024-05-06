<!-- Timeline.vue -->
<template>
  <div class="timeline">
    <div v-for="event in events" :key="event.date" class="timeline-event">
      <div class="event-date">{{ formatDate(event.ajouter_le) }}</div>
      <div class="event-description"> {{  event.motif }} de {{ event.description  }}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeLine',
  props: {
    events: {
      type: Array,
      required: true
    }
  },
  methods: {
    formatDate(dateString) {
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return new Date(dateString).toLocaleDateString('fr-FR', options);
    }
  }
};
</script>

<style scoped>
.timeline {
  overflow-y: auto;
  max-height: 400px;
}

.timeline-event {
  padding: 20px;
  border-left: 2px solid #3f51b5; /* Couleur de la ligne de temps */
  position: relative;
  margin-left: 20px;
}

.timeline-event:first-child {
  margin-top: 10px;
}

.event-date {
  font-size: 14px;
  font-weight: bold;
  color: #3f51b5; /* Couleur de la date */
}

.event-description {
  margin-top: 5px;
  font-size: 16px;
}

/* Style pour le point à côté de la date */
.event-date::before {
  content: " ";
  display: inline-block;
  height: 12px;
  width: 12px;
  background-color: #3f51b5; /* Couleur du point */
  border-radius: 50%;
  position: absolute;
  left: -18px;
  top: 50%;
  transform: translateY(-50%);
}
</style>
