<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import { useAuthStore } from '../store/authentification'
import { translateError } from '../services/traducteurErreurs'
import { Mail, Lock, Eye, EyeOff } from 'lucide-vue-next'

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const error = ref('')
const loading = ref(false)
const router = useRouter()
const authStore = useAuthStore()

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  try {
    const response = await api.post('/users/login', {
      email: email.value,
      password: password.value
    })
    const { token, ...user } = response.data
    authStore.login(user, token)
    router.push('/')
  } catch (err) {
    error.value = translateError(err.response?.data?.message || 'Invalid email or password')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex items-center justify-center min-h-[80vh] px-4">
    <div class="w-full max-w-md bg-white p-6 rounded-2xl shadow-xl border border-gray-100">
      <div class="text-center mb-6">
        <h1 class="text-2xl font-black text-black">Bon <span class="text-red-600">Retour</span></h1>
        <p class="text-gray-500 text-sm mt-1">Connectez-vous pour gérer vos contacts</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
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

        <div v-if="error" class="text-red-600 text-xs font-bold bg-red-50 p-2.5 rounded-lg text-center border border-red-100">
          {{ error }}
        </div>

        <button 
          :disabled="loading"
          type="submit"
          class="w-full bg-black text-white font-black py-3 rounded-xl hover:bg-gray-900 transition-all shadow-xl shadow-gray-200 transform active:scale-98 disabled:opacity-50 mt-2 text-sm"
        >
          <span v-if="loading">Connexion...</span>
          <span v-else>Se connecter</span>
        </button>
      </form>

      <p class="text-center mt-4 text-gray-600 text-sm">
        Vous n'avez pas de compte ? 
        <router-link to="/register" class="text-red-600 font-bold hover:underline">S'inscrire</router-link>
      </p>
    </div>
  </div>
</template>
