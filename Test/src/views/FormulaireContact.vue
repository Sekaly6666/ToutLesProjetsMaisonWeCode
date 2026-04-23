<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import api from '../services/api'
import { translateError } from '../services/traducteurErreurs'
import { User, Mail, Phone, Calendar, Briefcase, Building } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const isEdit = ref(false)
const loading = ref(false)
const saving = ref(false)

const form = ref({
  firstname: '',
  lastname: '',
  phone: '',
  email: '',
  gender: 'Male',
  birthdate: '',
  position: '',
  company: ''
})

onMounted(async () => {
  if (route.params.id) {
    isEdit.value = true
    loading.value = true
    try {
      const response = await api.get(`/contacts/${route.params.id}`)
      const data = response.data
      // Map data to form
      Object.keys(form.value).forEach(key => {
        if (data[key]) form.value[key] = data[key]
      })
    } catch (err) {
      console.error('Failed to fetch contact details', err)
      router.push('/')
    } finally {
      loading.value = false
    }
  }
})

const handleSubmit = async () => {
  saving.value = true
  try {
    if (isEdit.value) {
      await api.put(`/contacts/${route.params.id}`, form.value)
    } else {
      await api.post('/contacts', form.value)
    }
    router.push('/')
  } catch (err) {
    alert(translateError(err.response?.data?.message || 'Failed to save contact'))
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="max-w-2xl mx-auto px-4 py-8">
    <div class="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
      <div class="bg-black p-6 text-white">
        <h1 class="text-2xl font-black">
          {{ isEdit ? 'Modifier' : 'Ajouter' }} <span class="text-red-600">Contact</span>
        </h1>
        <p class="text-gray-400 mt-1 text-sm">Remplissez les détails ci-dessous pour {{ isEdit ? 'mettre à jour' : 'créer' }} un contact.</p>
      </div>

      <div v-if="loading" class="p-20 text-center">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="p-8 space-y-6">
        <!-- Nom / Prénom -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1.5">
            <label class="block text-sm font-bold text-gray-700 ml-1">Prénom</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User class="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
              </div>
              <input v-model="form.firstname" type="text" required class="input-field !pl-11 !bg-gray-50/50 focus:!bg-white" placeholder="Jane">
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="block text-sm font-bold text-gray-700 ml-1">Nom</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User class="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
              </div>
              <input v-model="form.lastname" type="text" required class="input-field !pl-11 !bg-gray-50/50 focus:!bg-white" placeholder="Doe">
            </div>
          </div>
        </div>

        <!-- Email / Téléphone -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1.5">
            <label class="block text-sm font-bold text-gray-700 ml-1">Email</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Mail class="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
              </div>
              <input v-model="form.email" type="email" required class="input-field !pl-11 !bg-gray-50/50 focus:!bg-white" placeholder="jane@example.com">
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="block text-sm font-bold text-gray-700 ml-1">Téléphone</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Phone class="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
              </div>
              <input v-model="form.phone" type="tel" required class="input-field !pl-11 !bg-gray-50/50 focus:!bg-white" placeholder="+1 234 567 890">
            </div>
          </div>
        </div>

        <!-- Genre / Date de naissance -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-1.5">
            <label class="block text-sm font-bold text-gray-700 ml-1">Genre</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <User class="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
              </div>
              <select v-model="form.gender" class="input-field !pl-11 !bg-gray-50/50 focus:!bg-white appearance-none">
                <option value="Male">Homme</option>
                <option value="Female">Femme</option>
              </select>
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="block text-sm font-bold text-gray-700 ml-1">Date de naissance (MM/JJ/AAAA)</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Calendar class="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
              </div>
              <input v-model="form.birthdate" type="text" class="input-field !pl-11 !bg-gray-50/50 focus:!bg-white" placeholder="01/01/1990">
            </div>
          </div>
        </div>

        <!-- Poste / Entreprise -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-gray-100 pt-6 mt-2">
          <div class="space-y-1.5">
            <label class="block text-sm font-bold text-gray-700 ml-1">Poste</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Briefcase class="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
              </div>
              <input v-model="form.position" type="text" class="input-field !pl-11 !bg-gray-50/50 focus:!bg-white" placeholder="Développeur">
            </div>
          </div>
          <div class="space-y-1.5">
            <label class="block text-sm font-bold text-gray-700 ml-1">Entreprise</label>
            <div class="relative group">
              <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Building class="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
              </div>
              <input v-model="form.company" type="text" class="input-field !pl-11 !bg-gray-50/50 focus:!bg-white" placeholder="Tech Inc.">
            </div>
          </div>
        </div>

        <div class="pt-6 flex items-center justify-end space-x-4 border-t border-gray-100">
          <button 
            type="button" 
            @click="router.back()"
            class="px-6 py-3 text-gray-500 font-bold hover:text-black transition-all hover:bg-gray-100 rounded-xl"
          >
            Annuler
          </button>
          <button 
            type="submit"
            :disabled="saving"
            class="bg-red-600 hover:bg-red-700 text-white px-10 py-3.5 rounded-2xl font-black shadow-lg shadow-red-100 hover:shadow-red-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-50"
          >
            {{ saving ? 'Enregistrement...' : (isEdit ? 'Mettre à jour' : 'Créer Contact') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

