<template>
  <div class="card mb-4">
    <div class="card-header pb-0">
      <h6>Sites Hors-service</h6>
    </div>
    <div class="card-body px-0 pt-0 pb-2">
      <div class="table-responsive p-0">
        <table class="table align-items-center mb-0">
          <thead>
            <tr>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Responsable
              </th>
              <th
                class="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7 ps-2"
              >
                Sites
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Status
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Date
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                SLA
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                %
              </th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              ></th>
              <th
                class="text-center text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Violation time left
              </th>
              <th class="text-secondary opacity-7"></th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(demande, index) in demandes" :key="index">
              <td>
                <div class="d-flex px-2 py-1">
                  <div>
                    <soft-avatar
                      :img="img1"
                      size="sm"
                      border-radius="lg"
                      class="me-3"
                      alt="user1"
                    />
                  </div>
                  <div class="d-flex flex-column justify-content-center">
                    <h6 class="mb-0 text-sm">
                      {{ demande.nom_user }} {{ demande.prenom_user }}
                    </h6>
                    <p class="text-xs text-secondary mb-0">
                      {{ demande.email_user }}
                    </p>
                  </div>
                </div>
              </td>
              <td>
                <p class="text-xs font-weight-bold mb-0">{{ demande.site }}</p>
                <p class="text-xs text-secondary mb-0">N/A</p>
              </td>
              <td class="align-middle text-center text-sm">
                <soft-badge color="danger" variant="gradient" size="sm"
                  >DR1</soft-badge
                >
              </td>
              <td class="align-middle text-center">
                <span class="text-secondary text-xs font-weight-bold"
                  >{{ demande.mounth }} {{ demande.day }}, {{ demande.year }} à
                  {{ demande.time }}</span
                >
              </td>
              <td class="align-middle text-center">
                <p class="text-xs font-weight-bold mb-0">{{ demande.sla }}</p>
              </td>
              <td class="align-middle text-center">
                <!-- <p class="text-xs font-weight-bold mb-0">{{ percent }} %</p> -->
              </td>
              <td class="align-middle text-center">
                <!-- <span class="me-2 text-xs font-weight-bold">70%</span> -->
                <soft-progress
                  color="warning"
                  variant="gradient"
                  :percentage="percent"
                />
              </td>
              <td class="align-middle text-center">
                <p class="text-xs font-weight-bold mb-0">
                  {{ hour }} : {{ minute }} : {{ second }} (restant)
                </p>
              </td>
              <td class="align-middle">
                <a
                  href="javascript:;"
                  class="text-secondary font-weight-bold text-xs"
                  data-toggle="tooltip"
                  data-original-title="Edit user"
                  >Alerter</a
                >
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script lang="js">
// import { reactive } from 'vue'
import SoftAvatar from "@/components/SoftAvatar.vue";
import SoftBadge from "@/components/SoftBadge.vue";
import SoftProgress from "@/components/SoftProgress";
// import {  } from "../../store/data";
// import { mapGetters, mapActions } from "vuex";
// import { store } from "@/store/data.js";

/* import img1 from "../../assets/img/team-2.jpg";
import img2 from "../../assets/img/team-3.jpg";
import img3 from "../../assets/img/team-4.jpg";
import img4 from "../../assets/img/team-3.jpg";
import img5 from "../../assets/img/team-2.jpg";
import img6 from "../../assets/img/team-4.jpg"; */
import axios from "axios";
// import { mapGetters } from "vuex";
// import { store } from "@/store/data.js";
// import { time } from "console";
// import { count } from "console";

export default {
  name: "authors-table",
  data() {
    return {
      // data,
      state: {
        countdown : 0
      },
/*       img1,
      img2,
      img3,
      img4,
      img5,
      img6, */
      host: "http://localhost:3000",
      demandes: [],
      // timer: 0,
      // useCount: store,
   /*    hour: state.hour,
        mimute: state.minute,
        second: state.countdown, */
      time: {

      },
    };
  },
/*   setup() {
    const state = reactive({
      countdown: 0,
      timer: null
    })

    const startCountdown = () => {
      state.countdown = 30
      state.timer = setInterval(() => {
        state.countdown--
        if (state.countdown === 0) {
          clearInterval(state.timer)
        }
      }, 1000)
    }

    return {
      countdown: state.countdown,
      startCountdown
    }
  }, */
  components: {
    SoftAvatar,
    SoftBadge,
    SoftProgress,
  },

  created() {
    // this.startCountdown()
    console.log('created');
  },
  computed: {
    // ...mapGetters(['hour', 'minute', 'second', 'percent']),
  },
  methods: {
    // ...mapActions(['startCountdown'])
    getAllDr(){
      let url = `${this.host}/api/demande/site/hs`;
      axios({
        url: url,
        method: "GET",
      }).then((response) => {
        this.demandes = response.data;
        console.log(response.data);
      }).catch((err) => {
        console.log(err);
        
      });
    }
  },

  mounted() {
    this.getAllDr()
    /* console.log("__INIT___DEMANDE__SITE__HS");
    let url = `${this.host}/api/demande/site/hs`;
    console.log('hours: ', this.hours)

    // this.onStart();
    axios({
      url: url,
      method: "GET",
    })
      .then((response) => {
        this.nb = response.data[0];
        console.log(response.data[0]);
      })
      .catch((error) => {
        console.log(error);
      });

    // GET LIST OF DEMANDES
    let url2 = `${this.host}/api/demande/site/hs`;
    axios({
      url: url2,
      method: "GET",
    })
      .then((response) => {
        this.demandes = response.data;
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      }); */
  },
};
</script>
