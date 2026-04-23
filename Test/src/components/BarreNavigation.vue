<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/authentification'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <nav class="bg-black text-white shadow-lg">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        <div class="flex items-center">
          <router-link to="/" class="text-2xl font-bold tracking-tighter flex items-center">
            Mes<span class="text-red-600">Contacts</span>
          </router-link>
        </div>
        
        <div class="flex items-center space-x-4">
          <template v-if="authStore.isAuthenticated.value">
            <router-link to="/" class="nav-link hover:text-red-600 transition-colors px-3 py-2 rounded-md text-sm font-medium">Contacts</router-link>
            <router-link to="/profile" class="nav-link group flex items-center space-x-2 px-3 py-2 rounded-md transition-colors">
              <div class="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-bold text-sm group-hover:bg-red-500 transition-colors tracking-widest">
                {{ authStore.user.value?.name ? authStore.user.value.name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : 'U' }}
              </div>
              <span class="text-sm font-medium group-hover:text-red-600 transition-colors">
                {{ authStore.user.value?.name || 'Profil' }}
              </span>
            </router-link>
            <button @click="handleLogout" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105">
              Déconnexion
            </button>
          </template>
          <template v-else>
            <router-link to="/login" class="nav-link hover:text-red-600 transition-colors px-3 py-2 rounded-md text-sm font-medium">Connexion</router-link>
            <router-link to="/register" class="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full text-sm font-bold transition-all transform hover:scale-105">
              S'inscrire
            </router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* On cible uniquement les liens de navigation qui ne sont pas le logo */
.nav-link.router-link-active {
  color: #ef4444; /* text-red-500 */
}
</style>
