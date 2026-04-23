<template>
  <section class="auth-shell row g-4 align-items-stretch">
    <div class="col-lg-5 d-flex">
      <aside class="auth-aside p-4 p-lg-5 w-100 d-flex flex-column justify-content-between">
        <div>
          <p class="hero-eyebrow mb-2">Connexion</p>
          <h1 class="display-6 fw-bold mb-3" style="font-family: 'Space Grotesk', sans-serif">
            Reprenez vos contacts là où vous les avez laissés.
          </h1>
          <p class="text-white-75 mb-0">
            L’application garde chaque liste liée au compte connecté et affiche les pages de détail, les
            formulaires et la vue bêta en toute simplicité.
          </p>
        </div>
        <div class="mt-5 pt-4 soft-divider border-white-25">
          <div class="d-flex gap-3 flex-wrap">
            <span class="badge rounded-pill text-bg-light text-dark">Vue Router</span>
            <span class="badge rounded-pill text-bg-light text-dark">CRUD</span>
            <span class="badge rounded-pill text-bg-light text-dark">API JSON Server</span>
          </div>
        </div>
      </aside>
    </div>

    <div class="col-lg-7 d-flex">
      <div class="auth-card p-4 p-lg-5 w-100">
        <div class="mb-4">
          <h2 class="section-title h2 mb-2">Se connecter</h2>
          <p class="text-muted mb-0">Entrez votre e-mail et votre mot de passe pour accéder à l’espace contacts.</p>
        </div>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <form class="row g-3" @submit.prevent="handleSubmit">
          <div class="col-12">
            <label class="form-label fw-semibold" for="login-email">E-mail</label>
            <input
              id="login-email"
              v-model.trim="form.email"
              class="form-control form-control-lg"
              type="email"
              placeholder="vous@email.com"
              required
            />
          </div>

          <div class="col-12">
            <label class="form-label fw-semibold" for="login-password">Mot de passe</label>
            <input
              id="login-password"
              v-model="form.password"
              class="form-control form-control-lg"
              type="password"
              placeholder="Votre mot de passe"
              required
            />
          </div>

          <div class="col-12 d-flex flex-wrap gap-2 pt-2">
            <button class="btn btn-brand px-4" type="submit" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" aria-hidden="true" />
              {{ loading ? 'Connexion...' : 'Se connecter' }}
            </button>
            <RouterLink class="btn btn-outline-brand px-4" to="/register">Créer un compte</RouterLink>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import { loginUser } from '@/services/auth'
import { saveSession } from '@/stores/session'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  password: '',
})

async function handleSubmit() {
  error.value = ''
  loading.value = true

  try {
    const sessionData = await loginUser(form)
    saveSession(sessionData)
    router.push(route.query.redirect?.toString() || '/contacts')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'La connexion a échoué.'
  } finally {
    loading.value = false
  }
}
</script>
