<template>
  <div style="font-size: 10px;"></div>
        {{ progress }}%
  <div class="progress-bar" :style="{ width: 100 + '%' }" style="display: inline-block; background-color: #e56b6f; ">
    <div class="progress-bar-inner" :style="{ width: progress + '%' }">
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
      return Math.ceil((this.value / this.maxValue) * 100, 100);
    }
  }
};
</script>

<style scoped>
.progress-bar {
  width: 100px;
  height: 5px;
  background-color: #f0f0f0;
  border-radius: 5px;
  overflow: hidden;
  background-color: #74b7ff
}

.progress-bar-inner {
  height: 100%;
  line-height: 5px;
  text-align: center;
  color: white;
  background-color: #57cc99;
}
</style>
