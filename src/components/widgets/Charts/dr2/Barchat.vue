<template>
  <div class="">
    <Bar id="my-chart-id" :options="chartOptions" :data="chartData" />
  </div>
</template>

<script>
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

export default {
  name: "BarChart",
  components: { Bar },
  data() {
    return {
      chartData: {
        labels: [
          "Jan.",
          "Fév.",
          "Mars",
          "Avr.",
          "Mai",
          "Juin",
          "Juil.",
          "Aout",
          "Sept.",
          "Oct.",
          "Nov.",
          "Déc.",
        ],
        datasets: [
          {
            label: "DR2",
            backgroundColor: "#d90429",
            data: [40, 20, 12],
          },
        ],
      },
      chartOptions: {
        responsive: true,
      },
    };
  },
};
</script>

<style></style>
