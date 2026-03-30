<!-- faite par sekou amara bamba -->
<!-- Vue d'édition et de création (page de formulaire). Elle fournit l'interface utilisateur pour saisir un nouveau Post-it ou modifier le titre et le contenu d'un Post-it existant, avant de le sauvegarder. -->
<script setup lang="ts">
// Toucher par SEKOU AMARA BAMBA
import { ref, onMounted, computed } from 'vue'; // Toucher par SEKOU AMARA BAMBA
import { useRoute, useRouter } from 'vue-router'; // Toucher par SEKOU AMARA BAMBA
import { usePostitStore } from '@/stores/postitStore'; // Toucher par SEKOU AMARA BAMBA
import { Save, X, Loader2, AlertCircle } from 'lucide-vue-next'; // Toucher par SEKOU AMARA BAMBA

const route = useRoute(); // Toucher par SEKOU AMARA BAMBA
const router = useRouter(); // Toucher par SEKOU AMARA BAMBA
const store = usePostitStore(); // Toucher par SEKOU AMARA BAMBA

const noteId = route.params.id as string; // Toucher par SEKOU AMARA BAMBA
const isEditMode = computed(() => !!noteId); // Toucher par SEKOU AMARA BAMBA

const title = ref(''); // Toucher par SEKOU AMARA BAMBA
const contentString = ref(''); // Toucher par SEKOU AMARA BAMBA
const isSaving = ref(false); // Toucher par SEKOU AMARA BAMBA
const validationError = ref(''); // Toucher par SEKOU AMARA BAMBA

onMounted(() => { // Toucher par SEKOU AMARA BAMBA
  if (isEditMode.value) { // Toucher par SEKOU AMARA BAMBA
    const note = store.getNoteById(noteId); // Toucher par SEKOU AMARA BAMBA
    if (note) { // Toucher par SEKOU AMARA BAMBA
      title.value = note.title; // Toucher par SEKOU AMARA BAMBA
      contentString.value = note.content.join('\n'); // Toucher par SEKOU AMARA BAMBA
    } else { // Toucher par SEKOU AMARA BAMBA
      router.push({ name: 'home' }); // Toucher par SEKOU AMARA BAMBA
    }
  }
}); // Toucher par SEKOU AMARA BAMBA

const saveNote = async () => { // Toucher par SEKOU AMARA BAMBA
  if (!title.value.trim()) { // Toucher par SEKOU AMARA BAMBA
    validationError.value = "Un titre est requis !"; // Toucher par SEKOU AMARA BAMBA
    return; // Toucher par SEKOU AMARA BAMBA
  }
  
  if (!contentString.value.trim()) { // Toucher par SEKOU AMARA BAMBA
    validationError.value = "Le contenu ne peut pas être vide !"; // Toucher par SEKOU AMARA BAMBA
    return; // Toucher par SEKOU AMARA BAMBA
  }

  isSaving.value = true; // Toucher par SEKOU AMARA BAMBA
  validationError.value = ''; // Toucher par SEKOU AMARA BAMBA

  const contentArray = contentString.value.split('\n').filter(line => line.length > 0); // Toucher par SEKOU AMARA BAMBA

  try { // Toucher par SEKOU AMARA BAMBA
    if (isEditMode.value) { // Toucher par SEKOU AMARA BAMBA
      await store.updateNote(noteId, title.value, contentArray); // Toucher par SEKOU AMARA BAMBA
    } else { // Toucher par SEKOU AMARA BAMBA
      await store.addNote(title.value, contentArray); // Toucher par SEKOU AMARA BAMBA
    }
    router.push({ name: 'home' }); // Toucher par SEKOU AMARA BAMBA
  } catch (err) { // Toucher par SEKOU AMARA BAMBA
    validationError.value = "Une erreur est survenue lors de l'enregistrement."; // Toucher par SEKOU AMARA BAMBA
  } finally { // Toucher par SEKOU AMARA BAMBA
    isSaving.value = false; // Toucher par SEKOU AMARA BAMBA
  }
}; // Toucher par SEKOU AMARA BAMBA

const cancel = () => { // Toucher par SEKOU AMARA BAMBA
  router.back(); // Toucher par SEKOU AMARA BAMBA
}; // Toucher par SEKOU AMARA BAMBA
</script>

<template>
  <div class="edit-view"> <!-- Toucher par SEKOU AMARA BAMBA -->
    <div class="form-container"> <!-- Toucher par SEKOU AMARA BAMBA -->
      <div class="form-header"> <!-- Toucher par SEKOU AMARA BAMBA -->
        <h2>{{ isEditMode ? 'Modifier le Post-it' : 'Nouveau Post-it' }}</h2> <!-- Toucher par SEKOU AMARA BAMBA -->
        <button @click="cancel" class="close-btn"> <!-- Toucher par SEKOU AMARA BAMBA -->
          <X :size="24" /> <!-- Toucher par SEKOU AMARA BAMBA -->
        </button> <!-- Toucher par SEKOU AMARA BAMBA -->
      </div>

      <div class="form-body"> <!-- Toucher par SEKOU AMARA BAMBA -->
        <div v-if="validationError" class="error-banner"> <!-- Toucher par SEKOU AMARA BAMBA -->
          <AlertCircle :size="18" /> <!-- Toucher par SEKOU AMARA BAMBA -->
          <span>{{ validationError }}</span> <!-- Toucher par SEKOU AMARA BAMBA -->
        </div>

        <div class="input-group"> <!-- Toucher par SEKOU AMARA BAMBA -->
          <label>Titre</label> <!-- Toucher par SEKOU AMARA BAMBA -->
          <input 
            v-model="title" 
            type="text" 
            placeholder="Réunion d'équipe, Liste de courses..." 
            class="title-input"
            autofocus
          /> <!-- Toucher par SEKOU AMARA BAMBA -->
        </div>

        <div class="input-group"> <!-- Toucher par SEKOU AMARA BAMBA -->
          <label>Contenu</label> <!-- Toucher par SEKOU AMARA BAMBA -->
          <textarea 
            v-model="contentString" 
            placeholder="Écrivez vos pensées ici... (Appuyez sur Entrée pour un nouveau paragraphe)" 
            class="content-input"
            rows="10"
          ></textarea> <!-- Toucher par SEKOU AMARA BAMBA -->
        </div>
      </div>

      <div class="form-footer"> <!-- Toucher par SEKOU AMARA BAMBA -->
        <button @click="cancel" class="cancel-btn" :disabled="isSaving"> <!-- Toucher par SEKOU AMARA BAMBA -->
          Annuler
        </button> <!-- Toucher par SEKOU AMARA BAMBA -->
        <button @click="saveNote" class="save-btn" :disabled="isSaving"> <!-- Toucher par SEKOU AMARA BAMBA -->
          <Loader2 v-if="isSaving" class="animate-spin" :size="20" /> <!-- Toucher par SEKOU AMARA BAMBA -->
          <Save v-else :size="20" /> <!-- Toucher par SEKOU AMARA BAMBA -->
          <span>{{ isSaving ? 'Enregistrement...' : 'Enregistrer' }}</span> <!-- Toucher par SEKOU AMARA BAMBA -->
        </button> <!-- Toucher par SEKOU AMARA BAMBA -->
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Toucher par SEKOU AMARA BAMBA */
.edit-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.form-container {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 25px 50px rgba(0,0,0,0.4);
  overflow: hidden;
  animation: modalScale 0.4s ease-out;
}

.form-header {
  padding: 1rem 1.2rem;
  background: #f8f9fa;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-header h2 {
  font-family: 'Shadows Into Light', cursive;
  font-size: 1.5rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  transition: color 0.3s;
}

.close-btn:hover { color: #333; }

.form-body {
  padding: 1.2rem;
}

.error-banner {
  background: #fee2e2;
  color: #dc2626;
  padding: 1rem;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 2rem;
  font-weight: 500;
}

.input-group {
  margin-bottom: 2rem;
}

.input-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.6rem;
  color: #555;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.title-input, .content-input {
  width: 100%;
  padding: 0.8rem 1rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  outline: none;
  font-family: 'Inter', sans-serif;
}

.title-input:focus, .content-input:focus {
  border-color: #ffeb3b;
  box-shadow: 0 0 10px rgba(255, 235, 59, 0.2);
}

.form-footer {
  padding: 1.5rem 2rem;
  background: #f8f9fa;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 1.5rem;
}

.cancel-btn {
  background: none;
  border: none;
  color: #666;
  font-weight: 600;
  cursor: pointer;
}

.save-btn {
  background: #ffeb3b;
  color: #333;
  padding: 0.8rem 2rem;
  border-radius: 50px;
  border: none;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(255, 235, 59, 0.3);
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 235, 59, 0.5);
  background: #fff176;
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes modalScale {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}
</style>
// Toucher par SEKOU AMARA BAMBA
