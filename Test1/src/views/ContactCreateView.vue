<template>
  <section class="surface-card p-4 p-lg-5">
    <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
      <div>
        <p class="text-uppercase small text-muted mb-1">Nouveau contact</p>
        <h1 class="section-title h2 mb-2">Créer un contact</h1>
        <p class="text-muted mb-0">Le contact sera enregistré sous votre compte connecté.</p>
      </div>
      <RouterLink class="btn btn-outline-brand" to="/contacts">Retour</RouterLink>
    </div>

    <div v-if="error" class="alert alert-danger">{{ error }}</div>

    <ContactForm
      :loading="loading"
      submit-label="Créer le contact"
      @cancel="router.push('/contacts')"
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import ContactForm from '@/components/ContactForm.vue'
import { createContact } from '@/services/contacts'
import { session } from '@/stores/session'

const router = useRouter()
const loading = ref(false)
const error = ref('')

async function handleSubmit(contact) {
  error.value = ''

  if (!session.token || !session.user) {
    error.value = 'Vous devez être connecté pour ajouter un contact.'
    return
  }

  loading.value = true

  try {
    const created = await createContact(contact)
    router.push(`/contacts/${created.id}`)
  } catch (err) {
    error.value = err instanceof Error ? err.message : "La création du contact a échoué."
  } finally {
    loading.value = false
  }
}
</script>
