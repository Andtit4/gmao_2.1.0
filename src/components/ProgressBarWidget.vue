<template>
  <div class="progress-bar" :style="{ width: progress + '%' }">
    <div class="progress-bar-inner">
      {{ progress }}%
    </div>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Number,
      required: true
    },
    maxValue: {
      type: Number,
      default: 100
    }
  },
  computed: {
    progress() {
      return Math.min((this.value / this.maxValue) * 100, 100);
    }
  }
};
</script>

<style scoped>
.progress-bar {
  width: 100%;
  height: 30px;
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
}

.progress-bar-inner {
  height: 100%;
  line-height: 30px;
  text-align: center;
  color: white;
  background-color: #007bff;
}
</style>
