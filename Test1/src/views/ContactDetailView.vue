<template>
  <section class="vstack gap-4">
    <div v-if="loading" class="surface-card p-5 text-center">
      <div class="spinner-border text-danger" role="status" aria-hidden="true" />
    </div>

    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <template v-else-if="contact">
      <div class="d-flex flex-wrap justify-content-between align-items-start gap-3">
        <div>
          <p class="text-uppercase small text-muted mb-1">Détail du contact</p>
          <h1 class="section-title h2 mb-2">{{ displayName }}</h1>
          <p class="text-muted mb-0">
            Vue détaillée, avec actions de modification et suppression pour le propriétaire.
          </p>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <RouterLink class="btn btn-outline-brand" to="/contacts">Retour</RouterLink>
          <RouterLink v-if="isOwner" class="btn btn-brand" :to="`/contacts/${contact.id}/edit`">
            Modifier
          </RouterLink>
          <button v-if="isOwner" class="btn btn-outline-danger" type="button" @click="handleDelete">
            Supprimer
          </button>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-5">
          <ContactCard :contact="contact" :owner-name="ownerName" :show-actions="false" />
        </div>

        <div class="col-lg-7">
          <div class="surface-card p-4 p-lg-5 h-100">
            <h2 class="section-title h4 mb-4">Informations complètes</h2>

            <div class="row g-3">
              <div class="col-md-6">
                <div class="user-card p-3 h-100">
                  <div class="label-muted small mb-1">Prénom</div>
                  <div class="fw-semibold">{{ contact.firstname || 'Non renseigné' }}</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="user-card p-3 h-100">
                  <div class="label-muted small mb-1">Nom</div>
                  <div class="fw-semibold">{{ contact.lastname || 'Non renseigné' }}</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="user-card p-3 h-100">
                  <div class="label-muted small mb-1">Téléphone</div>
                  <div class="fw-semibold">{{ contact.phone || 'Non renseigné' }}</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="user-card p-3 h-100">
                  <div class="label-muted small mb-1">E-mail</div>
                  <div class="fw-semibold">{{ contact.email || 'Non renseigné' }}</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="user-card p-3 h-100">
                  <div class="label-muted small mb-1">Genre</div>
                  <div class="fw-semibold">{{ formatGender(contact.gender) }}</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="user-card p-3 h-100">
                  <div class="label-muted small mb-1">Date de naissance</div>
                  <div class="fw-semibold">{{ contact.birthdate ? formatDate(contact.birthdate) : 'Non renseigné' }}</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="user-card p-3 h-100">
                  <div class="label-muted small mb-1">Poste</div>
                  <div class="fw-semibold">{{ contact.position || 'Non renseigné' }}</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="user-card p-3 h-100">
                  <div class="label-muted small mb-1">Entreprise</div>
                  <div class="fw-semibold">{{ contact.company || 'Non renseigné' }}</div>
                </div>
              </div>
              <div class="col-12">
                <div class="user-card p-3 h-100">
                  <div class="label-muted small mb-1">Propriétaire</div>
                  <div class="fw-semibold">{{ ownerLabel }}</div>
                  <RouterLink
                    v-if="contactOwnerId && !isOwner"
                    class="btn btn-sm btn-outline-brand mt-2"
                    :to="`/users/${contactOwnerId}/contacts`"
                  >
                    Voir ses contacts
                  </RouterLink>
                </div>
              </div>
              <div class="col-md-6">
                <div class="user-card p-3 h-100">
                  <div class="label-muted small mb-1">Créé le</div>
                  <div class="fw-semibold">{{ formatDateTime(contact.createdAt) }}</div>
                </div>
              </div>
              <div class="col-md-6">
                <div class="user-card p-3 h-100">
                  <div class="label-muted small mb-1">Mis à jour le</div>
                  <div class="fw-semibold">{{ formatDateTime(contact.updatedAt) }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <EmptyState
      v-else
      title="Contact introuvable"
      description="Le contact demandé n’existe pas ou a déjà été supprimé."
      action-label="Retour à la liste"
      @action="router.push('/contacts')"
    />
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ContactCard from '@/components/ContactCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { deleteContact, fetchContact } from '@/services/contacts'
import { session } from '@/stores/session'
import { formatContactName, formatGender } from '@/utils/entities'
import { formatDate, formatDateTime } from '@/utils/format'
import { sameId } from '@/utils/ids'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref('')
const contact = ref(null)

const currentUserId = computed(() => (session.token ? session.user?.id : null))
const contactOwnerId = computed(
  () => contact.value?.user?.id ?? contact.value?.user?._id ?? contact.value?.userId ?? null
)
const isOwner = computed(() => sameId(contactOwnerId.value, currentUserId.value))
const displayName = computed(() => (contact.value ? formatContactName(contact.value) : ''))
const ownerName = computed(() => contact.value?.user?.name || contact.value?.user?.email || '')
const ownerLabel = computed(() => {
  if (isOwner.value) {
    return 'Vous'
  }

  return ownerName.value || 'Non renseigné'
})

async function loadDetail() {
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

async function handleDelete() {
  if (!contact.value) {
    return
  }

  const ok = window.confirm(`Supprimer définitivement ${displayName.value} ?`)

  if (!ok) {
    return
  }

  try {
    await deleteContact(contact.value.id)
    router.push('/contacts')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'La suppression a échoué.'
  }
}

onMounted(loadDetail)

watch(
  () => route.params.id,
  () => {
    loadDetail()
  }
)
</script>
