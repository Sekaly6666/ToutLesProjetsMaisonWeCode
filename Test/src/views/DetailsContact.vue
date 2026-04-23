<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'
import { useAuthStore } from '../store/authentification'
import { translateError } from '../services/traducteurErreurs'

const contact = ref(null)
const loading = ref(true)
const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const fetchContact = async () => {
  try {
    const response = await api.get(`/contacts/${route.params.id}`)
    contact.value = response.data
  } catch (err) {
    console.error('Failed to fetch contact', err)
    router.push('/')
  } finally {
    loading.value = false
  }
}

const deleteContact = async () => {
  if (!confirm('Êtes-vous sûr de vouloir supprimer ce contact ?')) return
  
  try {
    await api.delete(`/contacts/${route.params.id}`)
    router.push('/')
  } catch (err) {
    alert(translateError('Failed to delete contact'))
  }
}

onMounted(fetchContact)
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div v-if="loading" class="text-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
    </div>

    <div v-else-if="contact" class="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      <div class="relative h-32 bg-black">
        <div class="absolute -bottom-12 left-8">
          <div class="w-24 h-24 bg-red-600 text-white rounded-2xl flex items-center justify-center font-black text-3xl shadow-lg border-4 border-white">
            {{ contact.firstname?.charAt(0) }}{{ contact.lastname?.charAt(0) }}
          </div>
        </div>
      </div>

      <div class="pt-16 px-8 pb-8">
        <div class="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 class="text-3xl font-black text-black tracking-tight">
              {{ contact.firstname }} <span class="text-red-600">{{ contact.lastname }}</span>
            </h1>
            <p class="text-lg text-gray-500 mt-1 font-bold">{{ contact.position }} @ {{ contact.company }}</p>
          </div>
          
          <div class="flex space-x-3">
            <router-link 
              :to="`/contacts/${contact._id}/edit`"
              class="px-6 py-2 bg-black text-white rounded-xl font-black transition-all transform hover:scale-105 active:scale-95 text-sm"
            >
              Modifier
            </router-link>
            <button 
              @click="deleteContact"
              class="px-6 py-2 border-2 border-red-100 text-red-600 rounded-xl font-black hover:bg-red-50 transition-all transform hover:scale-105 active:scale-95 text-sm"
            >
              Supprimer
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
          <div class="space-y-6">
            <div>
              <h3 class="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Coordonnées</h3>
              <div class="space-y-3">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-red-600 mr-3">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-gray-400 uppercase">Adresse Email</p>
                    <p class="font-bold text-black text-sm">{{ contact.email }}</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-red-600 mr-3">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-gray-400 uppercase">Numéro de téléphone</p>
                    <p class="font-bold text-black text-sm">{{ contact.phone }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <h3 class="text-xs font-black uppercase tracking-widest text-gray-400 mb-3">Détails Personnels</h3>
              <div class="space-y-3">
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-red-600 mr-3">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-gray-400 uppercase">Genre</p>
                    <p class="font-bold text-black text-sm">{{ contact.gender === 'Male' ? 'Homme' : 'Femme' }}</p>
                  </div>
                </div>
                <div class="flex items-center">
                  <div class="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center text-red-600 mr-3">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path></svg>
                  </div>
                  <div>
                    <p class="text-[10px] font-bold text-gray-400 uppercase">Date de naissance</p>
                    <p class="font-bold text-black text-sm">{{ contact.birthdate || 'Non spécifiée' }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 flex justify-start">
          <button @click="router.back()" class="text-gray-400 font-bold hover:text-black transition-colors flex items-center text-sm">
            ← Retour aux contacts
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
