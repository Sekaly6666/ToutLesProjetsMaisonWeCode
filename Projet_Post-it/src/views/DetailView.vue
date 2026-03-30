<!-- faite par sekou amara bamba -->
<!-- Vue de détail (page) d'un Post-it spécifique. Ce composant permet d'afficher en grand le contenu d'une note, et offre des actions directes pour la modifier, la supprimer ou revenir en arrière. -->
<script setup lang="ts">
// Toucher par SEKOU AMARA BAMBA
import { computed } from 'vue'; // Toucher par SEKOU AMARA BAMBA
import { useRoute, useRouter } from 'vue-router'; // Toucher par SEKOU AMARA BAMBA
import { usePostitStore } from '@/stores/postitStore'; // Toucher par SEKOU AMARA BAMBA
import { ArrowLeft, Edit, Trash2, Calendar, FileText } from 'lucide-vue-next'; // Toucher par SEKOU AMARA BAMBA

const route = useRoute(); // Toucher par SEKOU AMARA BAMBA
const router = useRouter(); // Toucher par SEKOU AMARA BAMBA
const store = usePostitStore(); // Toucher par SEKOU AMARA BAMBA
import { onMounted } from 'vue'; // Toucher par SEKOU AMARA BAMBA

const noteId = route.params.id as string; // Toucher par SEKOU AMARA BAMBA
const note = computed(() => store.getNoteById(noteId)); // Toucher par SEKOU AMARA BAMBA

onMounted(() => { // Toucher par SEKOU AMARA BAMBA
  if (store.notes.length === 0) { // Toucher par SEKOU AMARA BAMBA
    store.loadLocal(); // Toucher par SEKOU AMARA BAMBA
    store.fetchNotes(); // Toucher par SEKOU AMARA BAMBA
  } // Toucher par SEKOU AMARA BAMBA
}); // Toucher par SEKOU AMARA BAMBA

const goBack = () => router.push({ name: 'home' }); // Toucher par SEKOU AMARA BAMBA
const goToEdit = () => router.push({ name: 'edit', params: { id: noteId } }); // Toucher par SEKOU AMARA BAMBA

const deleteNote = async () => { // Toucher par SEKOU AMARA BAMBA
  if (confirm('Êtes-vous sûr de vouloir supprimer ce post-it ?')) { // Toucher par SEKOU AMARA BAMBA
    try {
      await store.deleteNote(noteId); // Toucher par SEKOU AMARA BAMBA
      router.push({ name: 'home' }); // Toucher par SEKOU AMARA BAMBA
    } catch (err: any) {
      alert("Une erreur est survenue lors de la suppression. Le post-it n'a pas pu être retiré du serveur.");
    }
  }
}; // Toucher par SEKOU AMARA BAMBA

const formatDate = (dateStr: string) => { // Toucher par SEKOU AMARA BAMBA
  return new Date(dateStr).toLocaleDateString('fr-FR', { // Toucher par SEKOU AMARA BAMBA
    day: 'numeric', // Toucher par SEKOU AMARA BAMBA
    month: 'long', // Toucher par SEKOU AMARA BAMBA
    year: 'numeric', // Toucher par SEKOU AMARA BAMBA
    hour: '2-digit', // Toucher par SEKOU AMARA BAMBA
    minute: '2-digit' // Toucher par SEKOU AMARA BAMBA
  }); // Toucher par SEKOU AMARA BAMBA
}; // Toucher par SEKOU AMARA BAMBA
</script>

<template>
  <div class="detail-view"> <!-- Toucher par SEKOU AMARA BAMBA -->
    <div class="nav-container"> <!-- Toucher par SEKOU AMARA BAMBA -->
      <button @click="goBack" class="back-btn"> <!-- Toucher par SEKOU AMARA BAMBA -->
        <ArrowLeft :size="20" /> <!-- Toucher par SEKOU AMARA BAMBA -->
        <span>Retour à la liste</span> <!-- Toucher par SEKOU AMARA BAMBA -->
      </button> <!-- Toucher par SEKOU AMARA BAMBA -->
    </div>

    <div v-if="note" class="note-container"> <!-- Toucher par SEKOU AMARA BAMBA -->
      <div class="post-it-expanded"> <!-- Toucher par SEKOU AMARA BAMBA -->
        <header class="note-header"> <!-- Toucher par SEKOU AMARA BAMBA -->
          <div class="note-info"> <!-- Toucher par SEKOU AMARA BAMBA -->
            <h1>{{ note.title }}</h1> <!-- Toucher par SEKOU AMARA BAMBA -->
            <div class="date-tag"> <!-- Toucher par SEKOU AMARA BAMBA -->
              <Calendar :size="16" /> <!-- Toucher par SEKOU AMARA BAMBA -->
              <span>{{ formatDate(note.date) }}</span> <!-- Toucher par SEKOU AMARA BAMBA -->
            </div>
          </div>
          
          <div class="actions"> <!-- Toucher par SEKOU AMARA BAMBA -->
            <button @click="goToEdit" class="edit-btn" title="Modifier"> <!-- Toucher par SEKOU AMARA BAMBA -->
              <Edit :size="20" /> <!-- Toucher par SEKOU AMARA BAMBA -->
            </button> <!-- Toucher par SEKOU AMARA BAMBA -->
            <button @click="deleteNote" class="delete-btn" title="Supprimer"> <!-- Toucher par SEKOU AMARA BAMBA -->
              <Trash2 :size="20" /> <!-- Toucher par SEKOU AMARA BAMBA -->
            </button> <!-- Toucher par SEKOU AMARA BAMBA -->
          </div>
        </header>

        <main class="note-body"> <!-- Toucher par SEKOU AMARA BAMBA -->
          <div class="content-wrapper"> <!-- Toucher par SEKOU AMARA BAMBA -->
            <p v-for="(line, index) in note.content" :key="index" class="content-line"> <!-- Toucher par SEKOU AMARA BAMBA -->
              {{ line }}
            </p> <!-- Toucher par SEKOU AMARA BAMBA -->
          </div>
        </main>

        <footer class="note-footer"> <!-- Toucher par SEKOU AMARA BAMBA -->
          <div class="note-stats"> <!-- Toucher par SEKOU AMARA BAMBA -->
            <FileText :size="16" /> <!-- Toucher par SEKOU AMARA BAMBA -->
            <span>{{ note.content.length }} paragraphe(s)</span> <!-- Toucher par SEKOU AMARA BAMBA -->
          </div>
        </footer>
      </div>
    </div>

    <div v-else class="not-found"> <!-- Toucher par SEKOU AMARA BAMBA -->
      <h2>Oups ! Note introuvable.</h2> <!-- Toucher par SEKOU AMARA BAMBA -->
      <p>Le post-it que vous recherchez n'existe plus ou a été supprimé.</p> <!-- Toucher par SEKOU AMARA BAMBA -->
      <button @click="goBack" class="back-btn-filled"> <!-- Toucher par SEKOU AMARA BAMBA -->
        Retourner à l'accueil
      </button> <!-- Toucher par SEKOU AMARA BAMBA -->
    </div>
  </div>
</template>

<style scoped>
/* Toucher par SEKOU AMARA BAMBA */
.detail-view {
  min-height: 100vh;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.nav-container {
  width: 100%;
  max-width: 800px;
  margin-bottom: 3rem;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  background: none;
  border: none;
  color: #fff;
  cursor: pointer;
  font-size: 1.1rem;
  opacity: 0.8;
  transition: all 0.3s ease;
}

.back-btn:hover {
  opacity: 1;
  transform: translateX(-5px);
}

.note-container {
  width: 100%;
  max-width: 800px;
  animation: slideUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.post-it-expanded {
  background: #fff9c4;
  padding: 3rem;
  box-shadow: 0 15px 40px rgba(0,0,0,0.3);
  border-radius: 4px;
  position: relative;
  min-height: 500px;
  display: flex;
  flex-direction: column;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 2px dashed rgba(0,0,0,0.1);
  padding-bottom: 1.5rem;
  margin-bottom: 2rem;
}

.note-info h1 {
  font-family: 'Shadows Into Light', cursive;
  font-size: 3rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.date-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #666;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 1rem;
}

.edit-btn, .delete-btn {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
}

.edit-btn { background: #e3f2fd; color: #1976d2; }
.edit-btn:hover { background: #bbdefb; transform: rotate(15deg); }

.delete-btn { background: #ffebee; color: #d32f2f; }
.delete-btn:hover { background: #ffcdd2; transform: rotate(-15deg); }

.note-body {
  flex-grow: 1;
}

.content-wrapper {
  font-size: 1.2rem;
  line-height: 1.8;
  color: #444;
  font-family: 'Inter', sans-serif;
}

.content-line {
  margin-bottom: 1.5rem;
}

.note-footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(0,0,0,0.05);
}

.note-stats {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #888;
  font-size: 0.9rem;
}

.not-found {
  text-align: center;
  color: #fff;
  padding: 5rem;
}

.back-btn-filled {
  margin-top: 2rem;
  background: #ffeb3b;
  color: #333;
  padding: 1rem 2rem;
  border-radius: 50px;
  border: none;
  font-weight: 600;
  cursor: pointer;
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(50px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
</style>
// Toucher par SEKOU AMARA BAMBA
