<template>
  <div class="card mb-4">
    <div class="card-header pb-0">
      <h6>Alert DDR2</h6>
      <div id="card">0</div>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center justify-content-center mb-0">
          <hr>
          <tbody>
            <!-- <tr>
              <td>
                <div class="d-flex px-2">
                  <div>
                  </div>
                  <div class="my-auto">
                    <h6 class="mb-0 text-sm">LOME-CENTRE</h6>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-sm font-weight-bold mb-0"  style="color: red">10h00</p>
              </td>
              <td class="align-middle text-center">
                <div class="d-flex align-items-center justify-content-center">
                  <div class="text-sm font-weight-bold mb-0" style="color: green">
                    12h30
                    
                  </div>
                </div>
              </td>
              <td class="align-middle">
              </td>
            </tr> -->
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// import SoftProgress from "@/components/SoftProgress";
// import MiniStatisticsCard from "@/examples/Cards/MiniStatisticsCard.vue";



export default {
  name: "projects-table",
  components: {
    // SoftProgress,
    // MiniStatisticsCard
  },
};
</script>

<style scoped>
#card {
  position: relative;
  left: 20vw;
  bottom: 5vh;
  width: 4vw;
  height: 6vh;
  background-color: rgb(202, 79, 104);
  border-radius: 25px;
  text-align: center;
  color: white;
  padding: 15px;
}
</style>

