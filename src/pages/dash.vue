/* eslint-disable */ 

<template>
  <div class="py-4 container-fluid">
    <div class="row">
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <mini-statistics-card
          title="DR1"
          :value="nbdr1"
          :percentage="{
            value: '+3%',
            color: 'text-warning',
          }"
          :icon="{
            component: ' ni ni-world',
            background: iconBackground,
          }"
          direction-reverse
        />
      </div>
    </div>

    <div class="row">
      <div class="col-xl-3 col-sm-6 mb-xl-0 mb-4">
        <mini-statistics-card
          title="DR2"
          :value="nbdr2"
          :percentage="{
            value: 'nbdr2',
            color: 'text-danger',
          }"
          :icon="{
            component: 'ni ni-world',
            background: iconBackgroundWarning,
          }"
          direction-reverse
        />
      </div>
    </div>
    <div class="mt-4 row">
      <div class="mb-4 col-lg-8 mb-lg-0">
        <div class="p-3 card-body">
          <authors-table />
          <projects-table />
          <div class="mt-4 row">
            <div class="mb-4 col-lg-12 mb-lg-0">
              <div class="card z-index-2">
                <div class="p-3 card-body">
                  <table class="table align-items-center mb-0">
                    <thead>
                      <tr>
                        <th class="text-secondary opacity-7"></th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <div class="d-flex px-2 py-1">
                            <div class="d-flex flex-column justify-content-center">
                              <h6 class="mb-0 text-sm">Lomé</h6>
                              <p></p>
      
                              <p class="text-xs text-secondary mb-0"></p>
                              <soft-progress color="dark" :percentage="0" />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="d-flex px-2 py-1">
                            <div class="d-flex flex-column justify-content-center">
                              <h6 class="mb-0 text-sm">Maritime</h6>
                              <p></p>
                              <p class="text-xs text-secondary mb-0"></p>
                              <soft-progress color="dark" :percentage="0" />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="d-flex px-2 py-1">
                            <div class="d-flex flex-column justify-content-center">
                              <h6 class="mb-0 text-sm">Centrale</h6>
                              <p></p>
                              <p class="text-xs text-secondary mb-0"></p>
                              <soft-progress color="dark" :percentage="0" />
                            </div>
                          </div>
                        </td>
      
                        <td>
                          <div class="d-flex px-2 py-1">
                            <div class="d-flex flex-column justify-content-center">
                              <h6 class="mb-0 text-sm">Plateau</h6>
                              <p></p>
                              <p class="text-xs text-secondary mb-0"></p>
                              <soft-progress color="dark" :percentage="0" />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="d-flex px-2 py-1">
                            <div class="d-flex flex-column justify-content-center">
                              <h6 class="mb-0 text-sm">Kara</h6>
                              <p></p>
                              <p class="text-xs text-secondary mb-0"></p>
                              <soft-progress color="dark" :percentage="0" />
                            </div>
                          </div>
                        </td>
                        <td>
                          <div class="d-flex px-2 py-1">
                            <div class="d-flex flex-column justify-content-center">
                              <h6 class="mb-0 text-sm">Savane</h6>
                              <p></p>
                              <p class="text-xs text-secondary mb-0"></p>
                              <soft-progress color="dark" :percentage="0" />
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-lg-4">
        <map-component></map-component>
      </div>
    </div>
  </div>
</template>

<style></style>
<script lang="js">
import MiniStatisticsCard from "@/components/widgets/Cards/MiniStatisticsCard.vue";
import SoftProgress from "@/components/SoftProgress";
// import SoftInput from "@/components/SoftInput.vue";

// import ReportsBarChart from "@/examples/Charts/line.vue";

import AuthorsTable from "./components/AuthorsTable";
import ProjectsTable from "./components/ProjectsTable";
import axios from "axios";

// import { mapActions, mapState } from "vuex";
import MapComponent from "../pages/components/MapComponent"
// import L from 'leaflet';
// import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
import {
  /* faHandPointer,
  faUsers,
  faCreditCard,
  faScrewdriverWrench,
  faMapMarker, */
} from "@fortawesome/free-solid-svg-icons";
export default {
  name: "dashboard-default",
  data() {
    return {
      // nb: 0,
      nbdr1: 0,
      nbdr2: 0,
      iconBackground: "bg-gradient-success",
      iconBackgroundDanger: "bg-gradient-danger",
      iconBackgroundWarning: "bg-gradient-warning",
      /* nbtraiter: 0,
      faCreditCard,
      faScrewdriverWrench,
      faUsers,
      faHandPointer,
      faMapMarker, */
      // host: "https://creepy-overalls-yak.cyclic.app",
      host: "localhost:3000",

      
    };
  },
  components: {
    MiniStatisticsCard,
    AuthorsTable,
    ProjectsTable,
    SoftProgress,
    // SoftInput,
    MapComponent,

/*     LMap,
    LTileLayer,
    LMarker, */
  },
  created() {
    // this.getNbDr1();
    // this.getData();
    // this.getDr1()
    // this.fetchDr1();
  },
  computed: {
    /* ...mapGetters(["nb"]),
    count(){
      return this.nb;
    }, */
    
    // ...mapState(["DR1", "totalDr1"])
  },
  methods: {
    // ...mapActions(["fetchDr1"]),
    getDr1() {
      axios({
        url: "http://localhost:3000/api/site/nb/state?state=DR1",
        method: "GET",
      }).then((response) => {
        this.nbdr1 = response.data[0].nb;
        console.log('__get_data_dr1' + this.nbdr1)
      });
    },

    getDr2() {
      axios({
        url: "http://localhost:3000/api/site/nb/state?state=DR2",
        method: "GET",
      }).then((response) => {
        this.nbdr2 = response.data[0].nb;
        console.log('__get_data_dr2' + this.nbdr2)
      });
    }
    // ...mapActions(["getInsertionCount"]),
   /*  getData(){
      // this.$store.dispatch('getInsertionCount')
      axios({
        url: "http://localhost:3000/api/site/nb/state?state=DR1",
        method: "GET",
      }).then((response) => {
        this.nbdr1 = response.data[0].nb;
        console.log('__get_data_' + this.nbdr1)
      });

      axios({
        url: "http://localhost:3000/api/site/nb/state?state=DR2",
        method: "GET",
      }).then((response) => {
        this.nbdr2 = response.data[0].nb;
      })
    }, */

   /*  getDr1() {
      console.log('Loading dr1 function'),
      axios({
        url: this.host + "/api/demande/?state=DR1",
        method: "GET",
      }).then((response) => {
        this.nbdr2 = response.data[0].nb;
      })
    } */

  },

  mounted() {
    this.getDr1()
    this.getDr2()
    // this.getNbDr1()
    // this.getInsertionCount()
    // this.getDr1()
  },
};
</script>
