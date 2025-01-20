<!-- src/components/Modal.vue -->
<template>
    <div class="modal-overlay" @click.self="close">
      <div class="modal-content">
        <header class="modal-header">
          <slot name="header">
            <h3>Modal Title</h3>
          </slot>
          <button class="close-button" @click="close">&times;</button>
        </header>
        <section class="modal-body">
          <slot name="body">
            <p>Modal Body</p>
          </slot>
        </section>
        <footer class="modal-footer">
          <slot name="footer">
            <button @click="close">Close</button>
          </slot>
        </footer>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    show: Boolean
  })
  
  const emit = defineEmits(['close'])
  
  const close = () => {
    emit('close')
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }
  
  .modal-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  
  .modal-header,
  .modal-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .close-button {
    background: none;
    border: none;
    font-size: 1.5rem;
    cursor: pointer;
  }
  </style>