<template>
  <div id="app">
    
    <router-view></router-view>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  /* components: {
    HelloWorld
  } */
}
</script>

<style>
#app {
  font-family: 'Poppins', sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
label, button, p, h5 {
  font-family: 'Poppins', sans-serif;
}
</style>


 /* eslint-disable */ 
<!-- <template>
  <div>

    <sidenav
      :custom_class="this.$store.state.mcolor"
      :class="[
        this.$store.state.isTransparent,
        this.$store.state.isRTL ? 'fixed-end' : 'fixed-start',
      ]"
      v-if="this.$store.state.showSidenav"
    />
    <main
      class="main-content position-relative max-height-vh-100 h-100 border-radius-lg"
      :style="this.$store.state.isRTL ? 'overflow-x: hidden' : ''"
    >
      <navbar
        :class="[navClasses]"
        :textWhite="this.$store.state.isAbsolute ? 'text-white opacity-8' : ''"
        :minNav="navbarMinimize"
        v-if="this.$store.state.showNavbar"
      />
      <router-view />
      <app-footer v-show="this.$store.state.showFooter" />
      <configurator
        :toggle="toggleConfigurator"
        :class="[
          this.$store.state.showConfig ? 'show' : '',
          this.$store.state.hideConfigButton ? 'd-none' : '',
        ]"
      />
    </main>
  </div>
</template>
<style></style>
<script>
import Sidenav from "@/components/widgets/Sidenav";
import Configurator from "@/components/widgets/Configurator.vue";
import Navbar from "@/components/widgets/Navbars/Navbar.vue";
// import AppFooter from "@/examples/Footer.vue";
import { mapMutations, mapGetters } from "vuex";
export default {
  name: "App",
  components: {
    Sidenav,
    Configurator,
    Navbar,
    // AppFooter,
  },
  methods: {
    ...mapMutations(["toggleConfigurator", "navbarMinimize"]),
  },
  computed: {
    ...mapGetters(['hours', 'minutes', 'seconds']),

    navClasses() {
      return {
        "position-sticky blur shadow-blur mt-4 left-auto top-1 z-index-sticky": this
          .$store.state.isNavFixed,
        "position-absolute px-4 mx-0 w-100 z-index-2": this.$store.state
          .isAbsolute,
        "px-0 mx-4 mt-4": !this.$store.state.isAbsolute,
      };
    },
  },
  beforeMount() {
    // this.$store.mapGetters(['hours', 'minutes', 'seconds'])
    this.$store.state.isTransparent = "bg-transparent";
  },
};
</script> -->
