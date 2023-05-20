import { createStore } from "vuex";
import bootstrap from "bootstrap/dist/js/bootstrap.min.js";
import store from "./data";
import axios from "axios";

export default createStore({
  modules: {
    store,
  },
  state: {
    hideConfigButton: false,
    isPinned: true,
    showConfig: false,
    isTransparent: "",
    isRTL: false,
    color: "",
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,
    navbarFixed:
      "position-sticky blur shadow-blur left-auto top-1 z-index-sticky px-0 mx-4",
    absolute: "position-absolute px-4 mx-0 w-100 z-index-2",
    bootstrap,
    countdown: 5400, // 1h30 en secondes
    hour: 1,
    minute: 29,
    second: 60,
    percent: 0,
    count: 0,
    maxcount: 5400,
    host: "https://creepy-overalls-yak.cyclic.app",
    nb: 0,
  },
  mutations: {
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

    getNbOffline(state) {
      console.log("__INIT___DEMANDE__SITE__HS");
      let url = `${state.host}/api/demande/site/nb/hs`;
      console.log("hours: ", this.hours);

      // this.onStart();
      axios({
        url: url,
        method: "GET",
      })
        .then((response) => {
          state.nb = response.data[0].nb;
          if (state.nb == state.nb) {
            state.nb = response.data[0].nb;
            console.log("this.nb.refresh", response.data[0].nb);
          }
          console.log("this.nb", response.data[0].nb);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    setSiteHsCount(state, countSites) {
      state.nb = countSites;
    },

    toggleConfigurator(state) {
      state.showConfig = !state.showConfig;
    },
    navbarMinimize(state) {
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
    },
    navbarFixed(state) {
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
    },
  },
  actions: {
    startCountdown({ commit }) {
      setInterval(() => {
        commit("decrementCountdown");
      }, 1000);
    },
    getInsertionCount: async ({ commit }) => {
      try {
        const response = await axios.get(
          `https://creepy-overalls-yak.cyclic.app/api/demande/site/nb/hs`
        );
        commit("setSiteHsCount", response.data[0].nb);
        console.log('Get_success', response.data[0].nb)
      } catch (e) {
        console.log(e);
      }
    },
    toggleSidebarColor({ commit }, payload) {
      commit("sidebarType", payload);
    },
    setCardBackground({ commit }, payload) {
      commit("cardBackground", payload);
    },
/*     getDemandes({ commit }, payload) {
      commit("getDemandes", payload);
    }, */
    getNbOffline({ commit }, payload) {
      commit("getNbOffline", payload);
    },
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
