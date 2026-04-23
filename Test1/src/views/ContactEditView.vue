<template>
  <section class="surface-card p-4 p-lg-5">
    <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
      <div>
        <p class="text-uppercase small text-muted mb-1">Éditer un contact</p>
        <h1 class="section-title h2 mb-2">Modifier le contact</h1>
        <p class="text-muted mb-0">Les contacts d’un autre utilisateur restent en lecture seule.</p>
      </div>
      <RouterLink class="btn btn-outline-brand" :to="contact ? `/contacts/${contact.id}` : '/contacts'">
        Retour
      </RouterLink>
    </div>

    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-danger" role="status" aria-hidden="true" />
    </div>

    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <EmptyState
      v-else-if="contact && !isOwner"
      title="Modification refusée"
      description="Seul le propriétaire du contact peut le modifier."
      action-label="Revenir à la liste"
      @action="router.push('/contacts')"
    />

    <ContactForm
      v-else-if="contact"
      :contact="contact"
      :loading="saving"
      submit-label="Mettre à jour"
      @cancel="router.push(`/contacts/${contact.id}`)"
      @submit="handleSubmit"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ContactForm from '@/components/ContactForm.vue'
import EmptyState from '@/components/EmptyState.vue'
import { fetchContact, updateContact } from '@/services/contacts'
import { session } from '@/stores/session'
import { sameId } from '@/utils/ids'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const saving = ref(false)
const error = ref('')
const contact = ref(null)

const currentUserId = computed(() => (session.token ? session.user?.id : null))
const isOwner = computed(() => sameId(contact.value?.user?.id ?? contact.value?.userId, currentUserId.value))

async function loadContact() {
  loading.value = true
  error.value = ''

  try {
    contact.value = await fetchContact(route.params.id)
  } catch (err) {
    contact.value = null
    error.value = err instanceof Error ? err.message : 'Impossible de charger le contact.'
  } finally {
    loading.value = false
  }
}

async function handleSubmit(payload) {
  if (!contact.value) {
    return
  }

  saving.value = true
  error.value = ''

  try {
    const updated = await updateContact(contact.value.id, payload)
    router.push(`/contacts/${updated.id}`)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'La mise à jour a échoué.'
  } finally {
    saving.value = false
  }
}

onMounted(loadContact)

watch(
  () => route.params.id,
  () => {
    loadContact()
  }
)
</script>
