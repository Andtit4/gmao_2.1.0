<template>
  <button class="loading-button" @click="handleClick" :disabled="isLoading">
    <span v-if="!isLoading">{{ buttonText }}</span>
    <span v-else class="loader"></span>
  </button>
</template>

<script>
export default {
  name: 'LoadingButton',
  props: {
    buttonText: {
      type: String,
      default: 'Submit'
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleClick() {
      this.$emit('click');
    }
  }
};
</script>

<style scoped>
.loading-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
}
.loading-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
.loading-button .loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
