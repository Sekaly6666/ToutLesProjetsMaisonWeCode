<template>
  <nav class="navbar navbar-expand-lg navbar-dark mc-navbar">
    <div class="container-xxl py-2">
      <RouterLink class="navbar-brand fw-bold text-white" to="/">
        MYCONTACTS
      </RouterLink>

      <div class="d-flex flex-wrap align-items-center justify-content-end gap-2 ms-auto">
        <template v-if="user">
          <RouterLink class="nav-link-pill text-decoration-none" to="/">Accueil</RouterLink>
          <RouterLink class="nav-link-pill text-decoration-none" to="/contacts">Contacts</RouterLink>
          <RouterLink class="nav-link-pill text-decoration-none" to="/profile">Profil</RouterLink>
          <RouterLink class="nav-link-pill text-decoration-none" :to="`/users/${user.id}/contacts`">
            Bêta
          </RouterLink>
          <button class="btn btn-sm btn-outline-light rounded-pill px-3" type="button" @click="handleLogout">
            Déconnexion
          </button>
          <div class="d-none d-md-flex align-items-center gap-2 text-white-50">
            <span class="badge rounded-pill text-bg-danger">{{ initials }}</span>
            <small>{{ user.name }}</small>
          </div>
        </template>

        <template v-else>
          <RouterLink class="nav-link-pill text-decoration-none" to="/login">Connexion</RouterLink>
          <RouterLink class="nav-link-pill text-decoration-none" to="/register">Créer un compte</RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { clearSession, session } from '@/stores/session'
import { getInitials } from '@/utils/format'

const router = useRouter()

const user = computed(() => (session.token ? session.user : null))
const initials = computed(() => getInitials(user.value?.name || 'Moi'))

function handleLogout() {
  clearSession()
  router.push('/login')
}
</script>
