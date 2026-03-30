<!-- faite par sekou amara bamba -->
<!-- Composant racine de l'application (App). Son rôle est d'englober toute l'interface utilisateur, de fournir le conteneur global et de gérer les transitions d'animation entre les différentes vues (pages) affichées par le RouterView. -->
<script setup lang="ts">
// Toucher par SEKOU AMARA BAMBA
import { RouterView } from 'vue-router'; // Toucher par SEKOU AMARA BAMBA
</script>

<template>
  <div class="app-container"> <!-- Toucher par SEKOU AMARA BAMBA -->
    <RouterView v-slot="{ Component }"> <!-- Toucher par SEKOU AMARA BAMBA -->
      <transition name="fade" mode="out-in"> <!-- Toucher par SEKOU AMARA BAMBA -->
        <component :is="Component" /> <!-- Toucher par SEKOU AMARA BAMBA -->
      </transition> <!-- Toucher par SEKOU AMARA BAMBA -->
    </RouterView> <!-- Toucher par SEKOU AMARA BAMBA -->
  </div>
</template>

<style>
/* Toucher par SEKOU AMARA BAMBA */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Shadows+Into+Light&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  background-attachment: fixed;
  color: #333;
  min-height: 100vh;
}

.app-container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Transitions globales (Toucher par SEKOU AMARA BAMBA) */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
// Toucher par SEKOU AMARA BAMBA
