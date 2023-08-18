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
                  <input
                    id=""
                    type="email"
                    name=""
                    placeholder="Email"
                    class="form-control form-control-default"
                    v-model="email"
                    style="
                      border: 0px none;
                      background-color: rgb(241, 241, 241);
                    "
                  />
                  <label>Mot de passe</label>
                  <input
                    id=""
                    type="password"
                    name=""
                    placeholder="Mot de passe"
                    class="form-control form-control-default"
                    v-model="pass"
                    style="
                      border: 0px none;
                      background-color: rgb(241, 241, 241);
                    "
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
                    <!-- <soft-progress variant="gradient" ></soft-progress> -->
                  </div>
                </form>
              </div>
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
// import SoftInput from "@/components/SoftInput.vue";
import SoftSwitch from "@/components/SoftSwitch.vue";
import SoftButton from "@/components/SoftButton.vue";
import CryptoJS from "crypto-js";
import axios from "axios";

export default {
  name: "SignIn",
  data() {
    return {
      email: "",
      pass: "",
      // host: "http://localhost:3000",
      host: "https://burgundy-deer-gear.cyclic.app"
      // host: "10.229.10.101:3000",
      // host: "localhost:3000",
      // Login,
    };
  },
  components: {
    // Navbar,
    // AppFooter,
    // SoftInput,
    SoftSwitch,
    SoftButton,
  },

  methods: {
    auth: function () {
      const hashPassword = CryptoJS.SHA256(this.pass).toString();
      console.log("hash == " + hashPassword);

      axios({
        url: this.host + "/admin/auth/" + this.email + "/" + hashPassword,
        method: "GET",
      })
        .then((response) => {
          console.log("Response ==> " + response.data._id);

          if (response.data.email == undefined) {
            console.log("Undefinied");
            this.createNotification(
              "Erreur de connexion",
              "Email ou mot de passe incorrect"
            );
          } else {
            const userAgent = navigator.userAgent;
            console.log("Device: " + userAgent);
            axios({
              url: this.host + "/logs",
              method: "POST",
              data: {
                email: response.data.email,
                device: userAgent,
              },
            })
              .then((res) => {
                console.log("log insert for " + res);
                this.$router.push({
                  name: "Dash",
                  params: { id: response.data._id },
                });
              })
              .catch((err) => {
                console.log("An error occured while insert log == " + err);
              });
          }
        })
        .catch((e) => {
          console.log("An error occured ==> " + e);
        });

      // this.$router.push({ path: "/dash" });
    },

    createNotification(titre, text) {
      if (Notification.permission === "granted") {
        const options = {
          body: text,
          // icon: "path/to/icon.png", // Chemin vers une icône pour la notification
        };
        // eslint-disable-next-line no-unused-vars
        const notification = new Notification(titre, options);
      } else {
        this.requestNotificationPermission();
        console.log("La permission de notification n'est pas accordée");
      }
    },

    requestNotificationPermission() {
      if (Notification.permission !== "granted") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            console.log("Permission de notification accordée");
          }
        });
      } else {
        console.log("La permission de notification est déjà accordée");
      }
    },
  },

  created() {
    this.requestNotificationPermission();
  },

  mounted() {
    this.requestNotificationPermission();
  },
};
</script>
