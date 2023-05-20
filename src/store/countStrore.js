/* import { defineStore } from "pinia";

export const countDecrement = defineStore("counter", {
  state: () => ({ count: 0 }),
  getters: {
    double: (state) => state.count * 2,
  },
  actions: {
    increment() {
      this.count++;
    },
  },
});
 */

import Vuex from "vuex";
// import Vue from "vue";

// Vue.use(Vuex);
export default new Vuex.Store({
  state: {
    minute: 0,
    seconde: 0,
    heure: 0,
  },
  getters: {
    start(state) {
        console.log("rere")
      return `${state.minute}`;
    },
  },
  /*   getters: {
    start: (state) => {
      console.log("_data_load");
      setInterval(function () {
        // this.seconde == this.seconde + 1;
        state.seconde == 0;
        state.minute == 30;
        state.heure == 1;
        //   console.log(this.seconde)
      }, 1000);
      return `${state.heure}:${state.minute}:${state.seconde}`;
    },
  }, */
});
