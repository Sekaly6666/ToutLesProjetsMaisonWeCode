<!-- faite par sekou amara bamba -->
<!-- Composant responsable de l'affichage sous forme de grille de plusieurs composants PostitCard. Il gère également les animations de transition de liste de notes. -->
<script setup lang="ts">
// Toucher par SEKOU AMARA BAMBA
import type { Postit } from '@/models/Postit'; // Toucher par SEKOU AMARA BAMBA
import PostitCard from './PostitCard.vue'; // Toucher par SEKOU AMARA BAMBA

const props = defineProps<{ // Toucher par SEKOU AMARA BAMBA
  notes: Postit[]; // Toucher par SEKOU AMARA BAMBA
}>(); // Toucher par SEKOU AMARA BAMBA
</script>

<template>
  <div class="post-it-grid"> <!-- Toucher par SEKOU AMARA BAMBA -->
    <transition-group name="post-it-list"> <!-- Toucher par SEKOU AMARA BAMBA -->
      <PostitCard v-for="note in notes" :key="note.id" :note="note" /> <!-- Toucher par SEKOU AMARA BAMBA -->
    </transition-group>
  </div>
</template>

<style scoped>
/* Toucher par SEKOU AMARA BAMBA */
.post-it-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, 260px);
  gap: 2.5rem;
  padding: 2rem;
  justify-items: center;
  justify-content: center;
}

/* Animations de liste (Toucher par SEKOU AMARA BAMBA) */
.post-it-list-enter-active,
.post-it-list-leave-active {
  transition: all 0.5s ease;
}

.post-it-list-enter-from {
  opacity: 0;
  transform: translateY(30px) scale(0.9);
}

.post-it-list-leave-to {
  opacity: 0;
  transform: translateY(-30px) scale(0.9);
}

.post-it-list-move {
  transition: transform 0.4s ease;
}
</style>
// Toucher par SEKOU AMARA BAMBA
