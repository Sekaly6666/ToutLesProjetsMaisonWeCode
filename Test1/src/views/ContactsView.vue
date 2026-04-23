<template>
  <div class="vstack gap-4">
    <section class="surface-card p-4 p-lg-5">
      <div class="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-4">
        <div>
          <p class="text-uppercase small text-muted mb-1">Mes contacts</p>
          <h1 class="section-title h2 mb-2">Votre liste personnelle</h1>
          <p class="text-muted mb-0">
            Les contacts affichés ici sont liés à votre compte connecté.
          </p>
        </div>
        <RouterLink class="btn btn-brand" to="/contacts/new">Ajouter un contact</RouterLink>
      </div>

      <div class="row g-3 g-lg-4 mb-4">
        <div class="col-md-4">
          <div class="metric-card p-4 h-100">
            <div class="label-muted mb-1">Total</div>
            <div class="metric-value">{{ metrics.total }}</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="metric-card p-4 h-100">
            <div class="label-muted mb-1">Avec e-mail</div>
            <div class="metric-value">{{ metrics.emails }}</div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="metric-card p-4 h-100">
            <div class="label-muted mb-1">Avec téléphone</div>
            <div class="metric-value">{{ metrics.phones }}</div>
          </div>
        </div>
      </div>

      <div class="row g-3 align-items-end mb-4">
        <div class="col-lg-8">
          <SearchBar
            v-model="search"
            input-id="contact-search"
            label="Rechercher un contact"
            placeholder="Prénom, nom, téléphone, e-mail, poste, entreprise..."
          />
        </div>
        <div class="col-lg-4">
          <div class="user-card p-3">
            <div class="small text-muted mb-1">Compteur affiché</div>
            <div class="h4 mb-0">{{ filteredContacts.length }} contact(s)</div>
          </div>
        </div>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-danger" role="status" aria-hidden="true" />
      </div>

      <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

      <EmptyState
        v-else-if="!filteredContacts.length"
        title="Aucun contact trouvé"
        description="Aucun contact ne correspond à votre recherche ou votre compte est encore vide."
        action-label="Créer un contact"
        @action="router.push('/contacts/new')"
      />

      <div v-else class="row g-3">
        <div v-for="contact in filteredContacts" :key="contact.id" class="col-md-6 col-xl-4">
          <ContactCard :contact="contact" @delete="handleDelete(contact)" />
        </div>
      </div>
    </section>

    <section class="surface-card p-4 p-lg-5">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <p class="text-uppercase small text-muted mb-1">Bêta</p>
          <h2 class="section-title h3 mb-2">Voir les contacts d’un autre utilisateur</h2>
          <p class="text-muted mb-0">
            Sélectionnez un utilisateur pour ouvrir sa liste de contacts.
          </p>
        </div>
          <RouterLink v-if="user" class="btn btn-outline-brand" :to="`/users/${user.id}/contacts`">
          Ouvrir mes contacts en bêta
        </RouterLink>
      </div>

      <div class="row g-4">
        <div class="col-lg-5">
          <label class="form-label fw-semibold" for="beta-user">Choisir un utilisateur</label>
          <select id="beta-user" v-model="selectedBetaUserId" class="form-select form-select-lg mb-3">
            <option value="">Sélectionnez un utilisateur</option>
            <option v-for="account in users" :key="account.id" :value="String(account.id)">
              {{ account.name }} - {{ account.email }}
            </option>
          </select>

          <button
            class="btn btn-brand w-100 mb-4"
            type="button"
            :disabled="!selectedBetaUserId"
            @click="openBetaUser"
          >
            Voir ses contacts
          </button>

          <div class="user-card p-4">
            <h3 class="h6 section-title mb-3">Utilisateurs disponibles</h3>
            <div v-if="users.length" class="list-group">
              <RouterLink
                v-for="account in users"
                :key="account.id"
                class="list-group-item list-group-item-action user-option"
                :to="`/users/${account.id}/contacts`"
              >
                <div class="d-flex justify-content-between align-items-center">
                  <div>
                    <strong class="d-block">{{ account.name }}</strong>
                    <small class="text-muted">{{ account.email }}</small>
                  </div>
                  <span class="badge rounded-pill text-bg-dark">ID {{ account.id }}</span>
                </div>
              </RouterLink>
            </div>
            <p v-else class="text-muted mb-0">Aucun utilisateur n’a été trouvé sur l’API.</p>
          </div>
        </div>

        <div class="col-lg-7">
          <div class="soft-divider pt-4 pt-lg-0">
            <div class="text-muted small mb-3">Liste de vos contacts</div>
            <div class="row g-3">
              <div v-for="contact in filteredContacts" :key="`grid-${contact.id}`" class="col-xl-6">
                <ContactCard :contact="contact" @delete="handleDelete(contact)" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import ContactCard from '@/components/ContactCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import SearchBar from '@/components/SearchBar.vue'
import { fetchUsers } from '@/services/auth'
import { deleteContact, fetchContacts } from '@/services/contacts'
import { session } from '@/stores/session'
import { formatContactName, formatGender } from '@/utils/entities'

const router = useRouter()
const loading = ref(true)
const error = ref('')
const contacts = ref([])
const users = ref([])
const search = ref('')
const selectedBetaUserId = ref('')

const user = computed(() => (session.token ? session.user : null))

const metrics = computed(() => ({
  total: contacts.value.length,
  emails: contacts.value.filter((contact) => contact.email).length,
  phones: contacts.value.filter((contact) => contact.phone).length,
}))

const filteredContacts = computed(() => {
  const query = search.value.trim().toLowerCase()

  if (!query) {
    return contacts.value
  }

  return contacts.value.filter((contact) =>
    [
      formatContactName(contact),
      contact.firstname,
      contact.lastname,
      contact.phone,
      contact.email,
      formatGender(contact.gender),
      contact.birthdate,
      contact.position,
      contact.company,
    ]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(query))
  )
})

async function loadContacts() {
  if (!user.value) {
    contacts.value = []
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  try {
    contacts.value = await fetchContacts({ scope: 'me' })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Impossible de charger vos contacts.'
  } finally {
    loading.value = false
  }
}

async function loadUsers() {
  try {
    users.value = await fetchUsers()
  } catch {
    users.value = []
  }
}

async function handleDelete(contact) {
  const ok = window.confirm(`Supprimer ${formatContactName(contact)} ?`)

  if (!ok) {
    return
  }

  try {
    await deleteContact(contact.id)
    await loadContacts()
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'La suppression a échoué.'
  }
}

function openBetaUser() {
  if (!selectedBetaUserId.value) {
    return
  }

  router.push(`/users/${selectedBetaUserId.value}/contacts`)
}

onMounted(async () => {
  await Promise.all([loadContacts(), loadUsers()])
})

watch(
  () => user.value?.id,
  async () => {
    await Promise.all([loadContacts(), loadUsers()])
  }
)
</script>
