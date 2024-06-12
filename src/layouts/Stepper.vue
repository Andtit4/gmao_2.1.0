<template>
  <div class="stepper">
    <div class="steps">
      <div
        v-for="(step, index) in state.steps"
        :key="index"
        class="step-container"
      >
        <div
          :class="['step', { active: index === state.currentStep, completed: index < state.currentStep }]"
          @click="goToStep(index)"
        >
          {{ index + 1 }}
        </div>
        <div v-if="index < state.steps.length - 1" class="line"></div>
      </div>
    </div>
    <div class="step-content">
      <slot :name="`step-${state.currentStep}`"></slot>
    </div>
    <div class="controls">
      <button class="control-btn" @click="prevStep" :disabled="state.currentStep === 0">Préc.</button>
      <button class="control-btn" @click="nextStep" :disabled="state.currentStep === state.steps.length - 1">Suiv.</button>
    </div>
  </div>
</template>

<script>
import { reactive } from 'vue';

export default {
  name: 'Stepper',
  props: {
    steps: {
      type: Array,
      required: true
    }
  },
  setup(props) {
    const state = reactive({
      currentStep: 0,
      steps: props.steps
    });

    const goToStep = (index) => {
      if (index >= 0 && index < state.steps.length) {
        state.currentStep = index;
      }
    };

    const nextStep = () => {
      if (state.currentStep < state.steps.length - 1) {
        state.currentStep += 1;
      }
    };

    const prevStep = () => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    };

    return {
      state,
      goToStep,
      nextStep,
      prevStep
    };
  }
};
</script>

<style scoped>
.stepper {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Arial, sans-serif;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  margin: auto;
}
.steps {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  position: relative;
}
.step-container {
  display: flex;
  align-items: center;
  position: relative;
}
.step {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 10px;
  cursor: pointer;
  background-color: #e0e0e0;
  color: black;
  transition: background-color 0.3s, transform 0.3s;
  z-index: 1;
}
.step.active {
  background-color: #007bff;
  color: white;
  transform: scale(1.1);
}
.step.completed {
  background-color: #28a745;
  color: white;
}
.step:hover {
  background-color: #ccc;
}
.line {
  height: 4px;
  flex: 1;
  background-color: #ccc;
  position: absolute;
  top: 50%;
  left: 50%;
  right: -50%;
  z-index: 0;
}
.step-content {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
}
.controls {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.control-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: #007bff;
  color: white;
  font-size: 16px;
  transition: background-color 0.3s;
}
.control-btn:disabled {
  background-color: #ccc;
  color: black;
  cursor: not-allowed;
}
.control-btn:not(:disabled):hover {
  background-color: #0056b3;
}
</style>
