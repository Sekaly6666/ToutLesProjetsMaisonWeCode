<template>
  <section class="vstack gap-4">
    <div v-if="loading" class="surface-card p-5 text-center">
      <div class="spinner-border text-danger" role="status" aria-hidden="true" />
    </div>

    <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

    <template v-else>
      <div class="d-flex flex-wrap justify-content-between align-items-start gap-3">
        <div>
          <p class="text-uppercase small text-muted mb-1">Utilisateur bêta</p>
          <h1 class="section-title h2 mb-2">
            Contacts de {{ selectedUser?.name || 'l’utilisateur sélectionné' }}
          </h1>
          <p class="text-muted mb-0">
            Cette page montre la liste des contacts d’un autre utilisateur de l’application.
          </p>
        </div>
        <div class="d-flex flex-wrap gap-2">
          <RouterLink class="btn btn-outline-brand" to="/contacts">Mes contacts</RouterLink>
          <RouterLink class="btn btn-brand" to="/contacts/new">Ajouter un contact</RouterLink>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-4">
          <div class="surface-card p-4">
            <div class="label-muted small mb-1">Utilisateur affiché</div>
            <h2 class="h4 mb-2">{{ selectedUser?.name || 'Inconnu' }}</h2>
            <p class="text-muted mb-3">{{ selectedUser?.email || 'Aucun e-mail' }}</p>

            <label class="form-label fw-semibold" for="beta-switcher">Changer d’utilisateur</label>
            <select id="beta-switcher" v-model="selectedId" class="form-select mb-3">
              <option v-for="account in users" :key="account.id" :value="String(account.id)">
                {{ account.name }}
              </option>
            </select>

            <button class="btn btn-brand w-100 mb-4" type="button" @click="switchUser">
              Voir ses contacts
            </button>

            <div class="metric-card p-3 mb-3">
              <div class="label-muted mb-1">Total</div>
              <div class="metric-value">{{ metrics.total }}</div>
            </div>
            <div class="metric-card p-3 mb-3">
              <div class="label-muted mb-1">Avec e-mail</div>
              <div class="metric-value">{{ metrics.emails }}</div>
            </div>
            <div class="metric-card p-3">
              <div class="label-muted mb-1">Avec téléphone</div>
              <div class="metric-value">{{ metrics.phones }}</div>
            </div>
          </div>
        </div>

        <div class="col-lg-8">
          <div class="surface-card p-4 p-lg-5">
            <div class="d-flex flex-wrap justify-content-between align-items-end gap-3 mb-4">
              <div>
                <h2 class="section-title h3 mb-1">Liste des contacts</h2>
                <p class="text-muted mb-0">Vous pouvez consulter les contacts de l’utilisateur choisi.</p>
              </div>
              <div class="w-100 w-lg-auto" style="min-width: min(100%, 26rem)">
                <SearchBar
                  v-model="search"
                  input-id="beta-search"
                  label="Rechercher"
                  placeholder="Prénom, nom, e-mail, poste, entreprise..."
                />
              </div>
            </div>

            <EmptyState
              v-if="!filteredContacts.length"
              title="Aucun contact trouvé"
              description="Cet utilisateur ne possède pas encore de contact, ou la recherche est trop restrictive."
              action-label="Changer d’utilisateur"
              @action="selectedId = String((session.token ? session.user?.id : '') || '')"
            />

            <div v-else class="row g-3">
              <div v-for="contact in filteredContacts" :key="contact.id" class="col-xl-6">
                <ContactCard :contact="contact" :owner-name="selectedUser?.name || ''" :show-actions="false" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import ContactCard from '@/components/ContactCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import SearchBar from '@/components/SearchBar.vue'
import { fetchUserById, fetchUsers } from '@/services/auth'
import { fetchContacts } from '@/services/contacts'
import { session } from '@/stores/session'
import { formatContactName, formatGender } from '@/utils/entities'
import { sameId } from '@/utils/ids'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref('')
const users = ref([])
const contacts = ref([])
const search = ref('')
const selectedId = ref(String(route.params.id || (session.token ? session.user?.id : '') || ''))
const selectedUser = ref(null)

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

async function loadUsers() {
  users.value = await fetchUsers()
}

async function loadSelectedUser(id) {
  const account = users.value.find((entry) => sameId(entry.id, id))

  if (account) {
    selectedUser.value = account
    return
  }

  if (sameId(id, session.token ? session.user?.id : null)) {
    selectedUser.value = session.user
    return
  }

  try {
    selectedUser.value = await fetchUserById(id)
  } catch {
    selectedUser.value = null
  }
}

async function loadContacts(id) {
  const allContacts = await fetchContacts({ scope: 'all' })
  contacts.value = allContacts.filter(
    (contact) => sameId(contact.userId, id) || sameId(contact.user?.id, id) || sameId(contact.user?._id, id)
  )
}

async function loadPage(id = route.params.id || (session.token ? session.user?.id : '')) {
  if (!id) {
    error.value = 'Aucun utilisateur n’a été sélectionné.'
    loading.value = false
    return
  }

  loading.value = true
  error.value = ''

  try {
    if (!users.value.length) {
      await loadUsers()
    }

    await Promise.all([loadSelectedUser(id), loadContacts(id)])
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Impossible de charger la vue bêta.'
  } finally {
    loading.value = false
  }
}

function switchUser() {
  if (!selectedId.value) {
    return
  }

  router.push(`/users/${selectedId.value}/contacts`)
}

onMounted(() => {
  loadPage()
})

watch(
  () => route.params.id,
  (value) => {
    selectedId.value = String(value || '')
    loadPage(value)
  }
)
</script>
