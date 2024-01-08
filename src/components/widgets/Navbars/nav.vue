<!-- Navbar.vue -->

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <!-- Logo -->
    <img src="@/assets/logo1.png" alt="Logo" class="navbar-logo">

    <!-- Nom de l'application -->
    <a class="navbar-brand font-weight-bolder text-success text-gradient mt-0" href="#">Energy eye</a>

    <!-- Bouton de basculement pour les petits écrans -->
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>

    <!-- Liens de navigation -->
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ml-auto">
        <li class="nav-item">
          <a class="nav-link" href="#">Accueil</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">À Propos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Services</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Contact</a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'NavComponent',
};
</script>

<style scoped>
/* Ajoutez des styles spécifiques à la navbar ici si nécessaire */

.navbar-logo {
  max-height: 30px; /* Ajustez la hauteur maximale du logo selon vos besoins */
  margin-right: 10px; /* Ajustez la marge à droite du logo selon vos besoins */
}
</style>
