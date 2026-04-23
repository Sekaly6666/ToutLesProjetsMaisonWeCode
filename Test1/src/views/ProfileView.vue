<template>
  <section class="surface-card p-4 p-lg-5">
    <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
      <div>
        <p class="text-uppercase small text-muted mb-1">Profil</p>
        <h1 class="section-title h2 mb-2">Modifier mon profil</h1>
        <p class="text-muted mb-0">La mise à jour du nom, de l’e-mail et du mot de passe est prise en charge.</p>
      </div>
      <RouterLink class="btn btn-outline-brand" to="/contacts">Retour aux contacts</RouterLink>
    </div>

    <div v-if="success" class="alert alert-success">{{ success }}</div>
    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <div class="row g-4">
      <div class="col-lg-4">
        <div class="user-card p-4 h-100">
          <div class="label-muted mb-1">Compte connecté</div>
          <h2 class="h4 mb-3">{{ user?.name }}</h2>
          <p class="mb-2">
            <strong>E-mail :</strong> {{ user?.email }}
          </p>
          <p class="mb-0">
            <strong>ID :</strong> {{ user?.id }}
          </p>
          <hr />
          <p class="mb-0">
            <strong>Contacts liés :</strong> {{ stats.contacts }}
          </p>
        </div>
      </div>

      <div class="col-lg-8">
        <form class="row g-3" @submit.prevent="handleSubmit">
          <div class="col-12 col-lg-6">
            <label class="form-label fw-semibold" for="profile-name">Nom complet</label>
            <input id="profile-name" v-model.trim="form.name" class="form-control form-control-lg" type="text" required />
          </div>

          <div class="col-12 col-lg-6">
            <label class="form-label fw-semibold" for="profile-email">E-mail</label>
            <input id="profile-email" v-model.trim="form.email" class="form-control form-control-lg" type="email" required />
          </div>

          <div class="col-12 col-lg-6">
            <label class="form-label fw-semibold" for="profile-password">Nouveau mot de passe</label>
            <input
              id="profile-password"
              v-model="form.password"
              class="form-control form-control-lg"
              type="password"
              placeholder="Laisser vide pour conserver"
              autocomplete="new-password"
            />
            <small class="form-text text-muted d-block mt-2">
              Laissez vide pour conserver le mot de passe actuel. Si vous le changez, la validation s'affiche
              en direct.
            </small>
            <div v-if="form.password" class="d-flex flex-wrap gap-2 mt-2">
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
              v-if="form.password"
              class="small mb-0 mt-2"
              role="status"
              aria-live="polite"
              :class="passwordIsStrong ? 'text-dark' : 'text-danger'"
            >
              {{ passwordStatus }}
            </p>
          </div>

          <div class="col-12 col-lg-6">
            <label class="form-label fw-semibold" for="profile-confirm">Confirmation</label>
            <input
              id="profile-confirm"
              v-model="form.confirmPassword"
              class="form-control form-control-lg"
              type="password"
              placeholder="Confirmez si vous changez le mot de passe"
              autocomplete="new-password"
            />
          </div>

          <div class="col-12">
            <button class="btn btn-brand px-4" type="submit" :disabled="saving">
              <span v-if="saving" class="spinner-border spinner-border-sm me-2" aria-hidden="true" />
              {{ saving ? 'Mise à jour...' : 'Enregistrer les changements' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'

import { updateUser } from '@/services/auth'
import { fetchContacts } from '@/services/contacts'
import { saveSession, session } from '@/stores/session'
import { getPasswordStrengthChecks, getPasswordStrengthMessage } from '@/utils/password'

const saving = ref(false)
const error = ref('')
const success = ref('')
const stats = ref({
  contacts: 0,
})

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
    return ''
  }

  if (passwordIsStrong.value) {
    return 'Mot de passe valide.'
  }

  const validCount = passwordChecks.value.filter((check) => check.valid).length
  return `${validCount}/${passwordChecks.value.length} critères respectés.`
})

const user = computed(() => (session.token ? session.user : null))

function syncForm() {
  if (!user.value) {
    return
  }

  form.name = user.value.name || ''
  form.email = user.value.email || ''
  form.password = ''
  form.confirmPassword = ''
}

async function loadStats() {
  if (!user.value) {
    stats.value.contacts = 0
    return
  }

  try {
    const contacts = await fetchContacts({ scope: 'me' })
    stats.value.contacts = contacts.length
  } catch {
    stats.value.contacts = 0
  }
}

async function handleSubmit() {
  success.value = ''
  error.value = ''

  if (form.password) {
    const passwordError = getPasswordStrengthMessage(form.password)

    if (passwordError) {
      error.value = passwordError
      return
    }
  }

  if (form.password && form.password !== form.confirmPassword) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }

  if (!user.value) {
    error.value = 'Aucun utilisateur connecté.'
    return
  }

  saving.value = true

  try {
    const updated = await updateUser(user.value.id, {
      name: form.name,
      email: form.email,
      ...(form.password ? { password: form.password } : {}),
    })

    saveSession(updated)
    success.value = 'Votre profil a été mis à jour.'
    await loadStats()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'La mise à jour du profil a échoué.'
  } finally {
    saving.value = false
  }
}

watch(
  () => user.value,
  () => {
    syncForm()
    loadStats()
  },
  { immediate: true, deep: true }
)
</script>
