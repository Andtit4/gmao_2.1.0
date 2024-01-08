import { createStore } from "vuex";
// import bootstrap from "bootstrap/dist/js/bootstrap.min.js";
// import store from "./data";
import axios from "axios";

export default createStore({
  modules: {
    // store,
  },
  state: {
    totalDr1:0,
    DR1: [],
    countdown: 5400, // 1h30 en secondes
    hour: 1,
    minute: 29,
    second: 60,
    percent: 0,
    count: 0,
    maxcount: 5400,
    // host: "https://creepy-overalls-yak.cyclic.app",
    host: "https://burgundy-deer-gear.cyclic.app",
    nb: 0,
  },
  mutations: {
    SET_DR1(state, DR1) {
      state.DR1 = DR1,
      state.totalDr1 = DR1.length
    },
    decrementCountdown(state) {
      state.countdown--;
      state.count++;
      state.percent = (state.count / state.maxcount) * 100;
    },

    //DYNAMIC INSERTIONS
    /* getDemandes(state) {
      let url2 = `${state.host}/api/demande/site/hs`;
      axios({
        url: url2,
        method: "GET",
      })
        .then((response) => {
          state.demandes = response.data[0];
          console.log('demandes: ', response.data[0]);
        })
        .catch((error) => {
          console.log(error);
        });
    }, */

    

/*     toggleConfigurator(state) {
      state.showConfig = !state.showConfig;
    }, */
/*     navbarMinimize(state) {
      const sidenav_show = document.querySelector(".g-sidenav-show");
      if (sidenav_show.classList.contains("g-sidenav-hidden")) {
        sidenav_show.classList.remove("g-sidenav-hidden");
        sidenav_show.classList.add("g-sidenav-pinned");
        state.isPinned = true;
      } else {
        sidenav_show.classList.add("g-sidenav-hidden");
        sidenav_show.classList.remove("g-sidenav-pinned");
        state.isPinned = false;
      }
    },
    sidebarType(state, payload) {
      state.isTransparent = payload;
    },
    cardBackground(state, payload) {
      state.color = payload;
    }, */
/*     navbarFixed(state) {
      if (state.isNavFixed === false) {
        state.isNavFixed = true;
      } else {
        state.isNavFixed = false;
      }
    },
    toggleEveryDisplay(state) {
      state.showNavbar = !state.showNavbar;
      state.showSidenav = !state.showSidenav;
      state.showFooter = !state.showFooter;
    },
    toggleHideConfig(state) {
      state.hideConfigButton = !state.hideConfigButton;
    }, */
  },
  actions: {
    fetchDr1({ commit }) {
      // Effectuer une requête pour obtenir la liste des étudiants depuis l'API
      axios.get(`${this.state.host}/api/demande/?state=DR1s`)
        .then(response => {
          commit('SET_DR1', response.data);
        })
        .catch(error => {
          console.error(error);
        });
    },
    startCountdown({ commit }) {
      setInterval(() => {
        commit("decrementCountdown");
      }, 1000);
    },
    getInsertionCount: async ({ commit }) => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/demande/site/nb/hs`
        );
        commit("setSiteHsCount", response.data[0].nb);
        console.log('Get_success', response.data[0].nb)
      } catch (e) {
        console.log(e);
      }
    },
    /* toggleSidebarColor({ commit }, payload) {
      commit("sidebarType", payload);
    },
    setCardBackground({ commit }, payload) {
      commit("cardBackground", payload);
    },

    getNbDr1({ commit }, payload) {
      commit("getNbDr1", payload);
    }, */
  },
  getters: {
    /* hour: state => state.hour,
    minute: state => state.minute,
    second: state => state.second, */

    hour(state) {
      return Math.floor(state.countdown / 3600);
    },
    minute(state) {
      return Math.floor((state.countdown % 3600) / 60);
    },
    second(state) {
      return state.countdown % 60;
    },
    percent: (state) => state.percent,
    // demandes: (state) => state.demandes,
    nb: (state) => state.nb,
  },
});
