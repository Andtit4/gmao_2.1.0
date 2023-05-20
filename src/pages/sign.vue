<template>
  <!--  <div class="container top-0 position-sticky z-index-sticky">
    <div class="row">
      <div class="col-12">
        <navbar
          is-blur="blur blur-rounded my-3 py-2 start-0 end-0 mx-4 shadow"
          btn-background="bg-gradient-success"
          :dark-mode="true"
        />
      </div>
    </div>
  </div> -->
  <section>
    <div class="page-header min-vh-75">
      <div class="container">
        <div class="row">
          <div class="mx-auto col-xl-4 col-lg-5 col-md-6 d-flex flex-column">
            <div class="mt-8 card card-plain">
              <div class="pb-0 card-header text-start">
                <h3 class="font-weight-bolder text-success text-gradient">
                  Energy eye
                </h3>
                <p class="mb-0">
                  Entrer votre adresse email et votre mot de passe
                </p>
                <div id="alert">
                  <div style="">Adresse mail ou mot de passe incorrect</div>
                </div>
              </div>
              <div class="card-body">
                <form
                  role="form"
                  class="text-start"
                  method="get"
                  @submit.prevent="auth"
                >
                  <label>Email</label>
                  <soft-input
                    id="email"
                    type="email"
                    placeholder="Email"
                    name="email"
                    :value="email"
                    @input="(event) => (email = event.target.value)"
                  />
                  <label>Mot de passe</label>
                  <soft-input
                    id="password"
                    type="password"
                    placeholder="Password"
                    :value="pass"
                    @input="(event) => (pass = event.target.value)"
                  />
                  <soft-switch id="rememberMe" name="rememberMe" checked>
                    Se rappeler de moi
                  </soft-switch>
                  <div class="text-center">
                    <soft-button
                      class="my-4 mb-2"
                      variant="gradient"
                      color="success"
                      full-width
                      >Sign in
                    </soft-button>
                  </div>
                </form>
              </div>
              <!-- <div class="px-1 pt-0 text-center card-footer px-lg-2">
                <p class="mx-auto mb-4 text-sm">
                  Don't have an account?
                  <router-link
                    :to="{ name: 'Sign Up' }"
                    class="text-success text-gradient font-weight-bold"
                    >Sign up</router-link
                  >
                </p>
              </div> -->
            </div>
          </div>
          <div class="col-md-6">
            <div
              class="top-0 oblique position-absolute h-100 d-md-block d-none me-n8"
            >
              <div
                class="bg-cover oblique-image position-absolute fixed-top ms-auto h-100 z-index-0 ms-n6"
                :style="{
                  backgroundImage:
                    'url(' + require('@/assets/img/img.jpg') + ')',
                }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <!-- <main class="mt-0 main-content main-content-bg">
    <section>
      <h3 class="font-weight-bolder text-success text-gradient">Energy eye</h3>

      <div
        class="d-flex justify-content-center align-items-center"
        style="width: 50%"
      >
        <div class="mt-8 card card-plain">
          <div class="pb-0 card-header text-start">
            <p class="mb-0">Entrer votre adresse email et votre mot de passe</p>
            <div id="alert">
              <div style="">Adresse mail ou mot de passe incorrect</div>
            </div>
          </div>
          <div class="card-body">
            <form
              role="form"
              class="text-start"
              method="get"
              @submit.prevent="auth"
            >
              <label>Email</label>
              <soft-input
                id="email"
                type="email"
                placeholder="Email"
                name="email"
                :value="email"
                @input="(event) => (email = event.target.value)"
              />
              <label>Mot de passe</label>
              <soft-input
                id="password"
                type="password"
                placeholder="Password"
                :value="pass"
                @input="(event) => (pass = event.target.value)"
              />
              <soft-switch id="rememberMe" name="rememberMe" checked>
                Se rappeler de moi
              </soft-switch>
              <div class="text-center">
                <soft-button class="my-4 mb-2" variant="outline" full-width
                  >Sign in
                </soft-button>
              </div>
            </form>
          </div>
        
        </div>
      </div>
      <div class="col-md-6">
        <div
          class="top-0 oblique position-absolute h-100 d-md-block d-none me-n8"
        >
      *
        </div>
      </div>
    </section>
  </main> -->
  <!-- <app-footer /> -->
</template>
<style scoped>
#alert {
  display: none;
  padding: 1vw;
  width: 100%;
  height: 80px;
  background-color: red;
  color: white;
  text-align: center;
  padding-top: 15px;
  margin-top: 15px;
}
</style>
<script>
// import Navbar from "@/examples/PageLayout/Navbar.vue";
// import AppFooter from "@/examples/PageLayout/Footer.vue";
import SoftInput from "@/components/SoftInput.vue";
import SoftSwitch from "@/components/SoftSwitch.vue";
import SoftButton from "@/components/SoftButton.vue";
// import router from "@/router/index.js";
// import axios from "axios";
// import Login from "@/api/auth/auth.js";
// const body = document.getElementsByTagName("body")[0];
// require("dotenv").config();

// import { mapMutations } from "vuex";

export default {
  name: "SignIn",
  data() {
    return {
      email: "",
      pass: "",
      host: "https://energy-allf.onrender.com",
      // host: "10.229.10.101:3000",
      // host: "localhost:3000",
      // Login,
    };
  },
  components: {
    // Navbar,
    // AppFooter,
    SoftInput,
    SoftSwitch,
    SoftButton,
  },
  /* created() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
    body.classList.remove("bg-gray-100");
  },
  beforeUnmount() {
    this.toggleEveryDisplay();
    this.toggleHideConfig();
    body.classList.add("bg-gray-100");
  },
  methods: {
    ...mapMutations(["toggleEveryDisplay", "toggleHideConfig"]),

    auth: function () {
      var alert = document.getElementById("alert");
      let url = `${this.host}/api/noc/auth?email_noc=${this.email}&password_noc=${this.pass}`;
      console.log(url);
      axios({
        url: url,
        method: "GET",
      })
        .then((response) => {
          if (response.data.noc[0].error) {
            console.log("Error");
            alert.style.display = "block";
          } else {
            console.log("first");
            router.push({ path: "/dashboard" });
          }

          // console.log(response.data.noc[0]);
        })
        .catch((err) => {
          console.log(err);
        });
      // let url = "http://localhost:3000/api/noc/auth";
      // Login(this.email, this.pass, url);
    },
  }, */
};
</script>
