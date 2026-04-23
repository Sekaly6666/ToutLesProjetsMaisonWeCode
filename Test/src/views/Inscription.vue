<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { translateError } from '../services/traducteurErreurs'
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'

const name = ref('')
const email = ref('')
const password = ref('')
const confirm_password = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const error = ref('')
const loading = ref(false)
const router = useRouter()

const handleRegister = async () => {
  if (password.value !== confirm_password.value) {
    error.value = translateError('Passwords do not match')
    return
  }
  
  loading.value = true
  error.value = ''
  try {
    await api.post('/users', {
      name: name.value,
      email: email.value,
      password: password.value,
      confirm_password: confirm_password.value
    })
    router.push('/login')
  } catch (err) {
    error.value = translateError(err.response?.data?.message || 'Registration failed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-[80vh] px-4">
    <div class="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-black text-black">Créer un <span class="text-red-600">Compte</span></h1>
        <p class="text-gray-500 text-sm mt-1">Rejoignez-nous pour gérer vos contacts</p>
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <!-- Groupe Nom -->
        <div class="space-y-1">
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Nom Complet</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User class="h-4.5 w-4.5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
            </div>
            <input 
              v-model="name"
              type="text" 
              required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all !pl-10 !bg-gray-50/50 focus:!bg-white text-sm"
              placeholder="John Doe"
            >
          </div>
        </div>

        <!-- Groupe Email -->
        <div class="space-y-1">
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Adresse Email</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail class="h-4.5 w-4.5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
            </div>
            <input 
              v-model="email"
              type="email" 
              required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all !pl-10 !bg-gray-50/50 focus:!bg-white text-sm"
              placeholder="john@example.com"
            >
          </div>
        </div>

        <!-- Groupe Mot de passe -->
        <div class="space-y-1">
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Mot de passe</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock class="h-4.5 w-4.5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
            </div>
            <input 
              v-model="password"
              :type="showPassword ? 'text' : 'password'" 
              required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all !pl-10 !pr-10 !bg-gray-50/50 focus:!bg-white text-sm"
              placeholder="••••••••"
            >
            <button 
              type="button" 
              @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-600 transition-all active:scale-90"
            >
              <EyeOff v-if="showPassword" class="h-4.5 w-4.5" />
              <Eye v-else class="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        <!-- Groupe Confirmation -->
        <div class="space-y-1">
          <label class="block text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Confirmer le mot de passe</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock class="h-4.5 w-4.5 text-gray-400 group-focus-within:text-red-600 transition-colors" />
            </div>
            <input 
              v-model="confirm_password"
              :type="showConfirmPassword ? 'text' : 'password'" 
              required
              class="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 focus:border-transparent outline-none transition-all !pl-10 !pr-10 !bg-gray-50/50 focus:!bg-white text-sm"
              placeholder="••••••••"
            >
            <button 
              type="button" 
              @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-600 transition-all active:scale-90"
            >
              <EyeOff v-if="showConfirmPassword" class="h-4.5 w-4.5" />
              <Eye v-else class="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        <div v-if="error" class="text-red-600 text-xs font-bold bg-red-50 p-2.5 rounded-lg text-center border border-red-100">
          {{ error }}
        </div>

        <button 
          :disabled="loading"
          type="submit"
          class="w-full bg-red-600 text-white font-black py-3 rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-100 transform active:scale-98 disabled:opacity-50 mt-2 text-sm"
        >
          <span v-if="loading">Traitement...</span>
          <span v-else>S'inscrire</span>
        </button>
      </form>

      <p class="text-center mt-4 text-gray-600 text-sm">
        Vous avez déjà un compte ? 
        <router-link to="/login" class="text-black font-bold hover:underline">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>
