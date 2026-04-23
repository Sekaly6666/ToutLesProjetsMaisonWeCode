<script setup>
import { ref, onMounted, watch } from 'vue'
import api from '../services/api'
import CarteContact from '../components/CarteContact.vue'
import { useAuthStore } from '../store/authentification'
import { Contact } from 'lucide-vue-next'

const contacts = ref([])
const loading = ref(false)
const search = ref('')
const viewMode = ref('me') // 'me' or 'all'
const authStore = useAuthStore()

const fetchContacts = async () => {
  loading.value = true
  try {
    const endpoint = viewMode.value === 'me' ? '/contacts/me' : '/contacts'
    const response = await api.get(endpoint, {
      params: { q: search.value }
    })
    // JSON Server might return an array directly or { data: [] }
    contacts.value = response.data.data || response.data
  } catch (err) {
    console.error('Failed to fetch contacts', err)
  } finally {
    loading.value = false
  }
}

onMounted(fetchContacts)

// Debounce search
let timeout
watch(search, () => {
  clearTimeout(timeout)
  timeout = setTimeout(fetchContacts, 500)
})

watch(viewMode, fetchContacts)
</script>

<template>
  <div class="px-4 py-8">
    <div class="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
      <div>
        <h1 class="text-4xl font-black text-black tracking-tight">Vos <span class="text-red-600">Contacts</span></h1>
        <p class="text-gray-500 mt-2 font-medium">Gérez et organisez votre réseau efficacement.</p>
      </div>
      
      <div class="flex items-center space-x-3">
        <div class="bg-gray-100 p-1 rounded-xl flex">
          <button 
            @click="viewMode = 'me'"
            :class="viewMode === 'me' ? 'bg-white text-black shadow-md' : 'text-gray-500'"
            class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
          >
            Mes Contacts
          </button>
          <button 
            @click="viewMode = 'all'"
            :class="viewMode === 'all' ? 'bg-white text-black shadow-md' : 'text-gray-500'"
            class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
          >
            Tous (Beta)
          </button>
        </div>
        
        <router-link 
          to="/contacts/new" 
          class="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-black shadow-lg shadow-red-200 transition-all transform hover:scale-105 active:scale-95 flex items-center"
        >
          <span class="mr-2 text-xl">+</span> Ajouter
        </router-link>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="relative mb-12">
      <input 
        v-model="search"
        type="text" 
        placeholder="Rechercher par nom, email ou entreprise..."
        class="w-full bg-white border-2 border-gray-100 py-5 pl-14 pr-6 rounded-2xl shadow-sm focus:border-red-600 focus:ring-0 outline-none transition-all text-lg font-medium"
      >
      <div class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <div v-for="i in 6" :key="i" class="h-64 bg-gray-50 animate-pulse rounded-2xl"></div>
    </div>

    <!-- Empty State -->
    <div v-else-if="contacts.length === 0" class="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
      <div class="flex justify-center mb-6">
        <div class="p-6 bg-white rounded-full shadow-sm">
          <Contact class="w-16 h-16 text-gray-300" />
        </div>
      </div>
      <h3 class="text-xl font-black text-black">Aucun contact trouvé</h3>
      <p class="text-gray-500 mt-2">Essayez d'ajuster votre recherche ou ajoutez un nouveau contact.</p>
    </div>

    <!-- Contacts Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      <CarteContact 
        v-for="contact in contacts" 
        :key="contact._id" 
        :contact="contact" 
      />
    </div>
  </div>
</template>
