<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import { useAuthStore } from '../store/authentification'
import { translateError } from '../services/traducteurErreurs'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'

const authStore = useAuthStore()
const loading = ref(true)
const updating = ref(false)
const message = ref({ text: '', type: '' })

const showOldPassword = ref(false)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const form = ref({
  name: '',
  email: ''
})

const passwordForm = ref({
  old_password: '',
  new_password: '',
  confirm_password: ''
})

const fetchProfile = async () => {
  try {
    const response = await api.get('/users/me')
    const user = response.data
    form.value.name = user.name
    form.value.email = user.email
    authStore.setUser(user)
  } catch (err) {
    console.error('Failed to fetch profile', err)
  } finally {
    loading.value = false
  }
}

const updateProfile = async () => {
  updating.value = true
  message.value = { text: '', type: '' }
  try {
    const response = await api.put('/users/me', form.value)
    authStore.setUser(response.data)
    message.value = { text: translateError('Profile updated successfully!'), type: 'success' }
  } catch (err) {
    message.value = { text: translateError(err.response?.data?.message || 'Failed to update profile'), type: 'error' }
  } finally {
    updating.value = false
  }
}

const updatePassword = async () => {
  if (passwordForm.value.new_password !== passwordForm.value.confirm_password) {
    message.value = { text: translateError('Passwords do not match'), type: 'error' }
    return
  }
  
  updating.value = true
  message.value = { text: '', type: '' }
  try {
    await api.put('/users/me/password', passwordForm.value)
    message.value = { text: translateError('Password changed successfully!'), type: 'success' }
    passwordForm.value = { old_password: '', new_password: '', confirm_password: '' }
  } catch (err) {
    message.value = { text: translateError(err.response?.data?.message || 'Failed to change password'), type: 'error' }
  } finally {
    updating.value = false
  }
}

onMounted(fetchProfile)
</script>

<template>
  <div class="max-w-4xl mx-auto px-4 py-12">
    <div class="flex items-center justify-between mb-12">
      <div>
        <h1 class="text-4xl font-black text-black">Votre <span class="text-red-600">Profil</span></h1>
        <p class="text-gray-500 mt-2">Gérez vos paramètres de compte et vos préférences.</p>
      </div>
    </div>

    <div v-if="loading" class="text-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto"></div>
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-12">
      <!-- Left side: Basic Info -->
      <div class="lg:col-span-2 space-y-8">
        <div class="bg-white p-8 rounded-3xl shadow-xl border border-gray-50">
          <h2 class="text-xl font-black mb-8">Informations Personnelles</h2>
          <form @submit.prevent="updateProfile" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div class="space-y-1.5">
                <label class="block text-sm font-bold text-gray-700 ml-1">Nom Complet</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User class="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                  </div>
                  <input v-model="form.name" type="text" required class="input-field !pl-11 !bg-gray-50/50 focus:!bg-white">
                </div>
              </div>
              <div class="space-y-1.5">
                <label class="block text-sm font-bold text-gray-700 ml-1">Adresse Email</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail class="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                  </div>
                  <input v-model="form.email" type="email" required class="input-field !pl-11 !bg-gray-50/50 focus:!bg-white">
                </div>
              </div>
            </div>
            
            <div class="flex justify-end pt-2">
              <button 
                type="submit" 
                :disabled="updating"
                class="bg-black text-white px-10 py-3.5 rounded-2xl font-black hover:bg-gray-900 transition-all shadow-lg shadow-gray-100 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-50"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>

        <div class="bg-white p-8 rounded-3xl shadow-xl border border-gray-50">
          <h2 class="text-xl font-black mb-8">Changer le mot de passe</h2>
          <form @submit.prevent="updatePassword" class="space-y-6">
            <div class="space-y-6">
              <div class="space-y-1.5">
                <label class="block text-sm font-bold text-gray-700 ml-1">Mot de passe actuel</label>
                <div class="relative group">
                  <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock class="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                  </div>
                  <input v-model="passwordForm.old_password" :type="showOldPassword ? 'text' : 'password'" required class="input-field !pl-11 !pr-12 !bg-gray-50/50 focus:!bg-white" placeholder="••••••••">
                  <button type="button" @click="showOldPassword = !showOldPassword" class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-600 transition-all active:scale-90">
                    <EyeOff v-if="showOldPassword" class="h-5 w-5" />
                    <Eye v-else class="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="space-y-1.5">
                  <label class="block text-sm font-bold text-gray-700 ml-1">Nouveau mot de passe</label>
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock class="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                    </div>
                    <input v-model="passwordForm.new_password" :type="showNewPassword ? 'text' : 'password'" required class="input-field !pl-11 !pr-12 !bg-gray-50/50 focus:!bg-white" placeholder="••••••••">
                    <button type="button" @click="showNewPassword = !showNewPassword" class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-600 transition-all active:scale-90">
                      <EyeOff v-if="showNewPassword" class="h-5 w-5" />
                      <Eye v-else class="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <div class="space-y-1.5">
                  <label class="block text-sm font-bold text-gray-700 ml-1">Confirmer le nouveau</label>
                  <div class="relative group">
                    <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                      <Lock class="h-5 w-5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
                    </div>
                    <input v-model="passwordForm.confirm_password" :type="showConfirmPassword ? 'text' : 'password'" required class="input-field !pl-11 !pr-12 !bg-gray-50/50 focus:!bg-white" placeholder="••••••••">
                    <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-red-600 transition-all active:scale-90">
                      <EyeOff v-if="showConfirmPassword" class="h-5 w-5" />
                      <Eye v-else class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="flex justify-end pt-2">
              <button 
                type="submit" 
                :disabled="updating"
                class="bg-red-600 text-white px-10 py-3.5 rounded-2xl font-black hover:bg-red-700 transition-all shadow-lg shadow-red-100 transform hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-50"
              >
                Mettre à jour le mot de passe
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Right side: Stats/Card -->
      <div class="space-y-8">
        <div class="bg-black rounded-3xl p-8 text-white text-center">
          <div class="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center text-4xl font-black mx-auto mb-6 tracking-widest">
            {{ authStore.user.value?.name ? authStore.user.value.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'U' }}
          </div>
          <h3 class="text-2xl font-black">{{ authStore.user.value?.name }}</h3>
          <p class="text-gray-400 mt-1">{{ authStore.user.value?.email }}</p>
          <div class="mt-8 pt-8 border-t border-gray-800">
            <div class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">Type de compte</div>
            <div class="text-red-600 font-black">
              Utilisateur
            </div>
          </div>
        </div>

        <div v-if="message.text" :class="message.type === 'success' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-red-50 text-red-700 border-red-100'" class="p-4 rounded-2xl border-2 text-center font-bold">
          {{ message.text }}
        </div>
      </div>
    </div>
  </div>
</template>

