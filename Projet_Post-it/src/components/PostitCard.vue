<!-- faite par sekou amara bamba -->
<!-- Composant qui représente une seule note (Post-it) sous forme de carte. Il s'occupe de l'affichage individuel d'un Post-it et redirige vers la vue détaillée au clic. -->
<script setup lang="ts">
// Import du hook useRouter pour naviguer programmatiquement entre les pages
import { useRouter } from 'vue-router';
// Import du type (interface) Postit pour avoir l'autocomplétion et la vérification de type
import type { Postit } from '@/models/Postit';
// Import des icônes depuis la bibliothèque 'lucide-vue-next'
import { Calendar, ChevronRight } from 'lucide-vue-next';

// defineProps permet au composant parent (PostitGrid) de passer des données à ce composant enfant.
// Ici, on attend un objet de type 'Postit' qu'on nommera 'note'.
const props = defineProps<{
  note: Postit;
}>();

// Initialisation du routeur pour l'utiliser dans la fonction suivante
const router = useRouter();

// Fonction pour naviguer vers la page de détail d'un Post-it quand on clique dessus
const goToDetail = () => {
  // Pousse une nouvelle route dans l'historique : la route nommée 'detail' avec l'ID du post-it en paramètre
  router.push({ name: 'detail', params: { id: props.note.id } });
};

// Fonction utilitaire pour formater une date de format 'ISO' (ex: 2024-03-29T10:00:00Z) en une date lisible (29 mar. 2024)
const formatDate = (dateStr: string | undefined) => {
  if (!dateStr) return 'Date inconnue'; // Sécurité si aucune date n'est fournie
  try {
    const d = new Date(dateStr); // Crée un objet Date valide
    if (isNaN(d.getTime())) return 'Date invalide'; 
    // toLocaleDateString permet un formatage localisé, on choisit ici le français ('fr-FR')
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit', // Jour sur 2 chiffres
      month: 'short', // Mois en format court (janv, févr...)
      year: 'numeric' // Année complète
    });
  } catch {
    return 'Date invalide'; // En cas d'erreur inattendue
  }
};
</script>

<template>
  <router-link :to="{ name: 'detail', params: { id: note.id } }" class="post-it-wrapper"> <!-- Toucher par SEKOU AMARA BAMBA -->
    <div class="post-it-card"> <!-- Toucher par SEKOU AMARA BAMBA -->
      <div class="post-it-pin"></div> <!-- Toucher par SEKOU AMARA BAMBA -->
      <h3 class="post-it-title">{{ note.title }}</h3> <!-- Toucher par SEKOU AMARA BAMBA -->
      <div class="post-it-content"> <!-- Toucher par SEKOU AMARA BAMBA -->
        <p v-for="(line, index) in note.content" :key="index">{{ line }}</p> <!-- Toucher par SEKOU AMARA BAMBA -->
      </div>
      <div class="post-it-footer"> <!-- Toucher par SEKOU AMARA BAMBA -->
        <div class="date-flex"> <!-- Toucher par SEKOU AMARA BAMBA -->
          <Calendar :size="14" /> <!-- Toucher par SEKOU AMARA BAMBA -->
          <span>{{ formatDate(note.date) }}</span> <!-- Toucher par SEKOU AMARA BAMBA -->
        </div>
        <ChevronRight :size="18" class="arrow-icon" /> <!-- Toucher par SEKOU AMARA BAMBA -->
      </div>
    </div>
  </router-link>
</template>

<style scoped>
/* Toucher par SEKOU AMARA BAMBA */
.post-it-wrapper {
  perspective: 1000px;
  cursor: pointer;
  transition: transform 0.3s ease;
  text-decoration: none;
  display: block;
}

.post-it-card {
  background: linear-gradient(135deg, #fff27d 0%, #ffeb3b 100%);
  padding: 1.5rem;
  width: 260px;
  aspect-ratio: 1 / 1;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 20px rgba(0,0,0,0.1), 0 6px 6px rgba(0,0,0,0.1);
  position: relative;
  transform: rotate(-1deg);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border-radius: 2px;
  overflow: hidden;
}

.post-it-wrapper:hover .post-it-card {
  transform: rotate(0deg) translateY(-10px) scale(1.02);
  box-shadow: 0 15px 30px rgba(0,0,0,0.2), 0 10px 10px rgba(0,0,0,0.1);
}

.post-it-pin {
  width: 12px;
  height: 12px;
  background: #ff5252;
  border-radius: 50%;
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.3);
}

.post-it-title {
  font-family: 'Shadows Into Light', cursive, sans-serif;
  font-size: 1.4rem;
  margin-bottom: 0.8rem;
  color: #333;
  border-bottom: 1px dashed rgba(0,0,0,0.1);
  padding-bottom: 0.5rem;
}

.post-it-content {
  flex-grow: 1;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  color: #555;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 6;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.post-it-footer {
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: #888;
}

.date-flex {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.arrow-icon {
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.post-it-wrapper:hover .arrow-icon {
  opacity: 1;
  transform: translateX(0);
}

/* Animation flottante (Toucher par SEKOU AMARA BAMBA) */
@keyframes float {
  0% { transform: translateY(0px) rotate(-1deg); }
  50% { transform: translateY(-5px) rotate(1deg); }
  100% { transform: translateY(0px) rotate(-1deg); }
}

.post-it-card {
  animation: float 6s ease-in-out infinite;
}

.post-it-wrapper:hover .post-it-card {
  animation-play-state: paused;
}
</style>
// Toucher par SEKOU AMARA BAMBA
