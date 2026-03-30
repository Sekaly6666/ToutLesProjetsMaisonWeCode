<!-- faite par sekou amara bamba -->
<!-- Vue principale de l'application (page d'accueil). Elle affiche la liste complète des Post-its sous forme de grille et intègre une barre de recherche en temps réel pour filtrer les notes par titre ou contenu. -->
<script setup lang="ts">
// Toucher par SEKOU AMARA BAMBA
import { onMounted, computed } from 'vue'; // Toucher par SEKOU AMARA BAMBA
import { usePostitStore } from '@/stores/postitStore'; // Toucher par SEKOU AMARA BAMBA
import PostitGrid from '@/components/PostitGrid.vue'; // Toucher par SEKOU AMARA BAMBA
import { Plus, Search, Loader2 } from 'lucide-vue-next'; // Toucher par SEKOU AMARA BAMBA
import { ref } from 'vue'; // Toucher par SEKOU AMARA BAMBA

const store = usePostitStore(); // Toucher par SEKOU AMARA BAMBA
const searchQuery = ref(''); // Toucher par SEKOU AMARA BAMBA

// Initialisation au montage (Toucher par SEKOU AMARA BAMBA)
onMounted(() => { // Toucher par SEKOU AMARA BAMBA
  store.loadLocal(); // Charger le cache d'abord (Toucher par SEKOU AMARA BAMBA)
  store.fetchNotes(); // Puis synchroniser avec l'API (Toucher par SEKOU AMARA BAMBA)
}); // Toucher par SEKOU AMARA BAMBA

// Filtrage des notes (Toucher par SEKOU AMARA BAMBA)
const filteredNotes = computed(() => { // Toucher par SEKOU AMARA BAMBA
  if (!searchQuery.value) return store.notes; // Toucher par SEKOU AMARA BAMBA
  const q = searchQuery.value.toLowerCase(); // Toucher par SEKOU AMARA BAMBA
  return store.notes.filter(n => // Toucher par SEKOU AMARA BAMBA
    n.title.toLowerCase().includes(q) || // Toucher par SEKOU AMARA BAMBA
    n.content.some(line => line.toLowerCase().includes(q)) // Toucher par SEKOU AMARA BAMBA
  ); // Toucher par SEKOU AMARA BAMBA
}); // Toucher par SEKOU AMARA BAMBA
</script>

<template>
  <div class="list-view"> <!-- Toucher par SEKOU AMARA BAMBA -->
    <header class="list-header"> <!-- Toucher par SEKOU AMARA BAMBA -->
      <div class="brand"> <!-- Toucher par SEKOU AMARA BAMBA -->
        <h1>Mes Post-its</h1> <!-- Toucher par SEKOU AMARA BAMBA -->
        <p class="subtitle">Organisez vos idées avec style</p> <!-- Toucher par SEKOU AMARA BAMBA -->
      </div>
      
      <div class="actions-bar"> <!-- Toucher par SEKOU AMARA BAMBA -->
        <div class="search-container"> <!-- Toucher par SEKOU AMARA BAMBA -->
          <Search :size="18" class="search-icon" /> <!-- Toucher par SEKOU AMARA BAMBA -->
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Rechercher une note..." 
          /> <!-- Toucher par SEKOU AMARA BAMBA -->
        </div>
        
        <router-link :to="{ name: 'edit' }" class="add-btn"> <!-- Toucher par SEKOU AMARA BAMBA -->
          <Plus :size="20" /> <!-- Toucher par SEKOU AMARA BAMBA -->
          <span>Nouvelle Note</span> <!-- Toucher par SEKOU AMARA BAMBA -->
        </router-link> <!-- Toucher par SEKOU AMARA BAMBA -->
      </div>
    </header>

    <main class="content-area"> <!-- Toucher par SEKOU AMARA BAMBA -->
      <div v-if="store.isLoading && !store.notes.length" class="loading-state"> <!-- Toucher par SEKOU AMARA BAMBA -->
        <Loader2 class="animate-spin" :size="48" /> <!-- Toucher par SEKOU AMARA BAMBA -->
        <p>Récupération de vos précieux post-its...</p> <!-- Toucher par SEKOU AMARA BAMBA -->
      </div>

      <div v-else-if="!filteredNotes.length" class="empty-state"> <!-- Toucher par SEKOU AMARA BAMBA -->
        <p v-if="searchQuery">Aucun post-it ne correspond à votre recherche.</p> <!-- Toucher par SEKOU AMARA BAMBA -->
        <p v-else>Vous n'avez pas encore de notes. Commencez par en créer une !</p> <!-- Toucher par SEKOU AMARA BAMBA -->
      </div>

      <PostitGrid v-else :notes="filteredNotes" /> <!-- Toucher par SEKOU AMARA BAMBA -->
    </main>
  </div>
</template>

<style scoped>
/* Toucher par SEKOU AMARA BAMBA */
.list-view {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.list-header {
  padding: 3rem 2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 2rem;
}

.brand h1 {
  font-family: 'Shadows Into Light', cursive;
  font-size: 3.5rem;
  color: #fff;
  text-shadow: 0 4px 10px rgba(0,0,0,0.3);
  margin-bottom: 0.2rem;
}

.brand .subtitle {
  color: rgba(255,255,255,0.7);
  font-size: 1.1rem;
}

.actions-bar {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.search-container {
  position: relative;
  min-width: 300px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

.search-container input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.8rem;
  border-radius: 50px;
  border: 1px solid rgba(255,255,255,0.3);
  background: rgba(255,255,255,0.9);
  font-size: 1rem;
  transition: all 0.3s ease;
  outline: none;
}

.search-container input:focus {
  background: #fff;
  box-shadow: 0 0 15px rgba(255, 242, 125, 0.4);
}

.add-btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: #ffeb3b;
  color: #333;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 235, 59, 0.3);
}

.add-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 235, 59, 0.5);
  background: #fff176;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 2rem;
  color: #fff;
  gap: 1.5rem;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>
// Toucher par SEKOU AMARA BAMBA
