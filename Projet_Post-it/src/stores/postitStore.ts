// faite par sekou amara bamba
// Ce fichier utilise Pinia pour centraliser et gérer l'état global des Post-its. Il contient toute la logique métier (opérations CRUD : lecture, ajout, modification, suppression) et coordonne les appels à l'API backend avec la sauvegarde locale (localStorage).
import { defineStore } from 'pinia'; // Toucher par SEKOU AMARA BAMBA
import { ref, computed } from 'vue'; // Toucher par SEKOU AMARA BAMBA
import type { Postit } from '@/models/Postit'; // Toucher par SEKOU AMARA BAMBA
import axios from 'axios'; // Toucher par SEKOU AMARA BAMBA

const API_BASE_URL = 'https://postit.zoul.dev'; // Toucher par SEKOU AMARA BAMBA

export const usePostitStore = defineStore('postit', () => { // Toucher par SEKOU AMARA BAMBA
  const notes = ref<Postit[]>([]); // État local des notes (Toucher par SEKOU AMARA BAMBA)
  const isLoading = ref(false); // État de chargement (Toucher par SEKOU AMARA BAMBA)
  const error = ref<string | null>(null); // Erreur (Toucher par SEKOU AMARA BAMBA)

  // Charger depuis localStorage (Initiale)
  const loadLocal = () => { // Toucher par SEKOU AMARA BAMBA
    const saved = localStorage.getItem('postits'); // Toucher par SEKOU AMARA BAMBA
    if (saved) { // Toucher par SEKOU AMARA BAMBA
      notes.value = JSON.parse(saved); // Toucher par SEKOU AMARA BAMBA
    }
  }; // Toucher par SEKOU AMARA BAMBA

  // Sauvegarder dans localStorage
  const saveLocal = () => { // Toucher par SEKOU AMARA BAMBA
    localStorage.setItem('postits', JSON.stringify(notes.value)); // Toucher par SEKOU AMARA BAMBA
  }; // Toucher par SEKOU AMARA BAMBA

  // FETCH - Récupérer toutes les notes depuis l'API (Toucher par SEKOU AMARA BAMBA)
  const fetchNotes = async () => { // Toucher par SEKOU AMARA BAMBA
    isLoading.value = true; // Toucher par SEKOU AMARA BAMBA
    try { // Toucher par SEKOU AMARA BAMBA
      const response = await axios.get(`${API_BASE_URL}/notes`); // Toucher par SEKOU AMARA BAMBA
      // Mapper les champs API vers le format attendu par le frontend (Toucher par SEKOU AMARA BAMBA)
      notes.value = response.data.notes.map((n: any) => ({ // Toucher par SEKOU AMARA BAMBA
        ...n, // Toucher par SEKOU AMARA BAMBA
        id: n._id || n.id, // Support _id de MongoDB (Toucher par SEKOU AMARA BAMBA)
        date: n.createdAt || n.date || new Date().toISOString() // Support createdAt (Toucher par SEKOU AMARA BAMBA)
      })); // Toucher par SEKOU AMARA BAMBA
      saveLocal(); // Sync avec local (Toucher par SEKOU AMARA BAMBA)
    } catch (err) { // Toucher par SEKOU AMARA BAMBA
      error.value = "Erreur lors de la récupération des notes."; // Toucher par SEKOU AMARA BAMBA
      console.error(err); // Toucher par SEKOU AMARA BAMBA
    } finally { // Toucher par SEKOU AMARA BAMBA
      isLoading.value = false; // Toucher par SEKOU AMARA BAMBA
    }
  }; // Toucher par SEKOU AMARA BAMBA

  // ADD - Ajouter une nouvelle note
  const addNote = async (title: string, content: string[]) => { // Toucher par SEKOU AMARA BAMBA
    try { // Toucher par SEKOU AMARA BAMBA
      const response = await axios.post(`${API_BASE_URL}/notes`, { title, content }); // Toucher par SEKOU AMARA BAMBA
      const newId = response.data.note_id; // Correction : accès direct au champ note_id (Toucher par SEKOU AMARA BAMBA)
      
      const newNote: Postit = { // Toucher par SEKOU AMARA BAMBA
        id: newId, // Toucher par SEKOU AMARA BAMBA
        title, // Toucher par SEKOU AMARA BAMBA
        content, // Toucher par SEKOU AMARA BAMBA
        date: new Date().toISOString() // Toucher par SEKOU AMARA BAMBA
      }; // Toucher par SEKOU AMARA BAMBA
      
      notes.value.unshift(newNote); // Ajouter au début (Toucher par SEKOU AMARA BAMBA)
      saveLocal(); // Toucher par SEKOU AMARA BAMBA
    } catch (err) { // Toucher par SEKOU AMARA BAMBA
      error.value = "Erreur lors de l'ajout de la note."; // Toucher par SEKOU AMARA BAMBA
    }
  }; // Toucher par SEKOU AMARA BAMBA

  // UPDATE - Modifier une note existante
  const updateNote = async (id: string, title: string, content: string[]) => { // Toucher par SEKOU AMARA BAMBA
    try { // Toucher par SEKOU AMARA BAMBA
      await axios.put(`${API_BASE_URL}/notes/${id}`, { title, content }); // Toucher par SEKOU AMARA BAMBA
      const index = notes.value.findIndex(n => n.id === id); // Toucher par SEKOU AMARA BAMBA
      if (index !== -1) { // Toucher par SEKOU AMARA BAMBA
        notes.value[index] = { ...notes.value[index], title, content }; // Toucher par SEKOU AMARA BAMBA
        saveLocal(); // Toucher par SEKOU AMARA BAMBA
      }
    } catch (err) { // Toucher par SEKOU AMARA BAMBA
      error.value = "Erreur lors de la mise à jour."; // Toucher par SEKOU AMARA BAMBA
    }
  }; // Toucher par SEKOU AMARA BAMBA

  // DELETE - Supprimer une note
  const deleteNote = async (id: string) => { // Toucher par SEKOU AMARA BAMBA
    error.value = null; // Réinitialiser l'erreur (Toucher par SEKOU AMARA BAMBA)
    try { // Toucher par SEKOU AMARA BAMBA
      await axios.delete(`${API_BASE_URL}/notes/${id}`); // Toucher par SEKOU AMARA BAMBA
      notes.value = notes.value.filter(n => n.id !== id); // Toucher par SEKOU AMARA BAMBA
      saveLocal(); // Toucher par SEKOU AMARA BAMBA
    } catch (err: any) { // Toucher par SEKOU AMARA BAMBA
      // Si l'erreur est 404, on le retire quand même localement (Toucher par SEKOU AMARA BAMBA)
      if (err.response?.status === 404) { // Toucher par SEKOU AMARA BAMBA
        notes.value = notes.value.filter(n => n.id !== id); // Toucher par SEKOU AMARA BAMBA
        saveLocal(); // Toucher par SEKOU AMARA BAMBA
      } else { // Toucher par SEKOU AMARA BAMBA
        error.value = "Erreur lors de la suppression."; // Toucher par SEKOU AMARA BAMBA
        throw err; // Relancer pour que la vue puisse gérer (Toucher par SEKOU AMARA BAMBA)
      } // Toucher par SEKOU AMARA BAMBA
    }
  }; // Toucher par SEKOU AMARA BAMBA

  // Getters (computed)
  const getNoteById = (id: string) => notes.value.find(n => n.id === id); // Toucher par SEKOU AMARA BAMBA

  return { // Toucher par SEKOU AMARA BAMBA
    notes, // Toucher par SEKOU AMARA BAMBA
    isLoading, // Toucher par SEKOU AMARA BAMBA
    error, // Toucher par SEKOU AMARA BAMBA
    loadLocal, // Toucher par SEKOU AMARA BAMBA
    fetchNotes, // Toucher par SEKOU AMARA BAMBA
    addNote, // Toucher par SEKOU AMARA BAMBA
    updateNote, // Toucher par SEKOU AMARA BAMBA
    deleteNote, // Toucher par SEKOU AMARA BAMBA
    getNoteById // Toucher par SEKOU AMARA BAMBA
  }; // Toucher par SEKOU AMARA BAMBA
}); // Toucher par SEKOU AMARA BAMBA
