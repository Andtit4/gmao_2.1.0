<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1>404 - Not Found</h1>
      <p>La page que vous recherchez n'existe pas.</p>
      <router-link to="/">Retour à la page d'accueil</router-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NotFound',
};
</script>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
}

.not-found-content {
  text-align: center;
}

h1 {
  font-size: 4rem;
  color: #e74c3c; /* Couleur rouge, à titre d'exemple */
}

p {
  font-size: 1.5rem;
  margin-bottom: 20px;
}

router-link {
  text-decoration: underline;
  color: #3498db; /* Couleur bleue, à titre d'exemple */
}
</style>
