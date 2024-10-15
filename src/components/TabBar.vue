<template>
    <div class="tab-bar">
      <div
        v-for="(tab, index) in tabs"
        :key="index"
        class="tab"
        :class="{ active: selectedTab === tab }"
        @click="selectTab(tab)"
      >
        {{ tab }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, ref } from 'vue';
  
  const props = defineProps({
    tabs: {
      type: Array,
      required: true
    },
    modelValue: {
      type: String,
      required: true
    }
  });
  
  const selectedTab = ref(props.modelValue);
  
  const emit = defineEmits(['update:modelValue']);
  const selectTab = (tab) => {
    selectedTab.value = tab;
    emit('update:modelValue', tab); // Émet l'événement pour mettre à jour le modèle
  };
  </script>
  
  <style scoped>
  .tab-bar {
    display: flex;
  }
  
  .tab {
    padding: 10px 20px;
    cursor: pointer;
  }
  
  .tab.active {
    font-weight: bold;
    border-bottom: 2px solid #ccc; /* Couleur de l'onglet actif */
  }
  </style>