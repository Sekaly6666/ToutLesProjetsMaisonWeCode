<template>
  <section class="auth-shell row g-4 align-items-stretch">
    <div class="col-lg-5 d-flex">
      <aside class="auth-aside p-4 p-lg-5 w-100 d-flex flex-column justify-content-between">
        <div>
          <p class="hero-eyebrow mb-2">Créer un compte</p>
          <h1 class="display-6 fw-bold mb-3" style="font-family: 'Space Grotesk', sans-serif">
            Ouvrez votre espace MyContacts en quelques secondes.
          </h1>
          <p class="text-white-75 mb-0">
            Le compte enregistré sert à filtrer les contacts, à synchroniser les données sur l’API et à
            rendre votre profil modifiable.
          </p>
        </div>
        <div class="mt-5 pt-4 soft-divider border-white-25">
          <div class="d-flex gap-3 flex-wrap">
            <span class="badge rounded-pill text-bg-light text-dark">Compte</span>
            <span class="badge rounded-pill text-bg-light text-dark">Profil</span>
            <span class="badge rounded-pill text-bg-light text-dark">Persistance</span>
          </div>
        </div>
      </aside>
    </div>

    <div class="col-lg-7 d-flex">
      <div class="auth-card p-4 p-lg-5 w-100">
        <div class="mb-4">
          <h2 class="section-title h2 mb-2">Créer un compte</h2>
          <p class="text-muted mb-0">Renseignez votre nom, votre e-mail et un mot de passe.</p>
        </div>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <form class="row g-3" @submit.prevent="handleSubmit">
          <div class="col-12">
            <label class="form-label fw-semibold" for="register-name">Nom complet</label>
            <input
              id="register-name"
              v-model.trim="form.name"
              class="form-control form-control-lg"
              type="text"
              placeholder="Ex. Fatou Ndiaye"
              required
            />
          </div>

          <div class="col-12">
            <label class="form-label fw-semibold" for="register-email">E-mail</label>
            <input
              id="register-email"
              v-model.trim="form.email"
              class="form-control form-control-lg"
              type="email"
              placeholder="vous@email.com"
              required
            />
          </div>

          <div class="col-12 col-lg-6">
            <label class="form-label fw-semibold" for="register-password">Mot de passe</label>
            <input
              id="register-password"
              v-model="form.password"
              class="form-control form-control-lg"
              type="password"
              autocomplete="new-password"
              placeholder="8 caractères, 1 majuscule, 1 minuscule et 1 caractère spécial"
              required
            />
            <small class="form-text text-muted d-block mt-2">La validation s'affiche en direct.</small>
            <div class="d-flex flex-wrap gap-2 mt-2">
              <span
                v-for="check in passwordChecks"
                :key="check.key"
                class="badge rounded-pill border"
                :class="check.valid ? 'text-bg-dark border-dark' : 'text-bg-light border-danger text-danger'"
              >
                {{ check.label }}
              </span>
            </div>
            <p
              class="small mb-0 mt-2"
              role="status"
              aria-live="polite"
              :class="passwordIsStrong ? 'text-dark' : 'text-danger'"
            >
              {{ passwordStatus }}
            </p>
          </div>

          <div class="col-12 col-lg-6">
            <label class="form-label fw-semibold" for="register-confirm">Confirmation</label>
            <input
              id="register-confirm"
              v-model="form.confirmPassword"
              class="form-control form-control-lg"
              type="password"
              placeholder="Répétez le mot de passe"
              autocomplete="new-password"
              required
            />
          </div>

          <div class="col-12 d-flex flex-wrap gap-2 pt-2">
            <button class="btn btn-brand px-4" type="submit" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2" aria-hidden="true" />
              {{ loading ? 'Création...' : 'Créer mon compte' }}
            </button>
            <RouterLink class="btn btn-outline-brand px-4" to="/login">J’ai déjà un compte</RouterLink>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

import { loginUser, registerUser } from '@/services/auth'
import { saveSession } from '@/stores/session'
import { getPasswordStrengthChecks, getPasswordStrengthMessage } from '@/utils/password'

const router = useRouter()
const loading = ref(false)
const error = ref('')

const form = reactive({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const passwordChecks = computed(() => getPasswordStrengthChecks(form.password))
const passwordIsStrong = computed(() => passwordChecks.value.every((check) => check.valid))
const passwordStatus = computed(() => {
  if (!form.password) {
    return 'Saisissez un mot de passe pour voir les critères en direct.'
  }

  if (passwordIsStrong.value) {
    return 'Mot de passe valide.'
  }

  const validCount = passwordChecks.value.filter((check) => check.valid).length
  return `${validCount}/${passwordChecks.value.length} critères respectés.`
})

async function handleSubmit() {
  error.value = ''

  const passwordError = getPasswordStrengthMessage(form.password)

  if (passwordError) {
    error.value = passwordError
    return
  }

  if (form.password !== form.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  loading.value = true

  try {
    await registerUser(form)
    const sessionData = await loginUser({
      email: form.email,
      password: form.password,
    })
    saveSession(sessionData)
    router.push('/contacts')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'La création du compte a échoué.'
  } finally {
    loading.value = false
  }
}
</script>
