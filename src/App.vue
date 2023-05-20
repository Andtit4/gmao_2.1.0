<template>
  <div id="app">
    <!-- <router-link to="/">Accueil</router-link>
    <router-link to="/about">À propos</router-link> -->
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
</style>
