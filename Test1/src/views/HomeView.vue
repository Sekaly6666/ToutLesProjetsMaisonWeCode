<template>
  <div class="vstack gap-4 gap-lg-5">
    <section v-if="!user" class="hero-panel p-4 p-lg-5">
      <div class="row align-items-center g-4 position-relative" style="z-index: 1">
        <div class="col-lg-7">
          <p class="hero-eyebrow mb-2">Vue 3 • Vue Router • API JSON Server</p>
          <h1 class="display-5 fw-bold mb-3" style="font-family: 'Space Grotesk', sans-serif">
            MyContacts centralise vos contacts dans une interface claire, rapide et persistante.
          </h1>
          <p class="lead text-white-75 mb-4" style="max-width: 44rem;">
            Créez un compte, connectez-vous, ajoutez des contacts, consultez leur détail, modifiez-les
            et partagez la liste d’un autre utilisateur pour la partie bêta.
          </p>
          <div class="d-flex flex-wrap gap-2">
            <RouterLink class="btn btn-light px-4" to="/register">Créer un compte</RouterLink>
            <RouterLink class="btn btn-outline-light px-4" to="/login">Se connecter</RouterLink>
          </div>
        </div>

        <div class="col-lg-5">
          <div class="surface-card p-4 bg-white text-dark">
            <h2 class="h5 section-title mb-3">Ce que l’application couvre</h2>
            <div class="d-grid gap-3">
              <div class="d-flex gap-3">
                <span class="badge rounded-pill text-bg-dark align-self-start">01</span>
                <div>
                  <h3 class="h6 mb-1">Formulaires complets</h3>
                  <p class="text-muted small mb-0">Ajout et édition via `v-model` et composants réutilisables.</p>
                </div>
              </div>
              <div class="d-flex gap-3">
                <span class="badge rounded-pill text-bg-danger align-self-start">02</span>
                <div>
                  <h3 class="h6 mb-1">CRUD complet</h3>
                  <p class="text-muted small mb-0">Créer, lire, mettre à jour et supprimer les contacts.</p>
                </div>
              </div>
              <div class="d-flex gap-3">
                <span class="badge rounded-pill text-bg-dark align-self-start">03</span>
                <div>
                  <h3 class="h6 mb-1">Détail et vues bêta</h3>
                  <p class="text-muted small mb-0">Vue détaillée par contact et navigation entre utilisateurs.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section v-else class="hero-panel p-4 p-lg-5">
      <div class="row align-items-center g-4 position-relative" style="z-index: 1">
        <div class="col-lg-8">
          <p class="hero-eyebrow mb-2">Bienvenue</p>
          <h1 class="display-6 fw-bold mb-3" style="font-family: 'Space Grotesk', sans-serif">
            Bonjour {{ user.name }}, votre espace contacts est prêt.
          </h1>
          <p class="text-white-75 mb-4">
            Vos contacts sont filtrés par compte, avec des pages de détail, un éditeur, une vue bêta
            sur les contacts d’un autre utilisateur et une esthétique blanc, noir, rouge.
          </p>
          <div class="d-flex flex-wrap gap-2">
            <RouterLink class="btn btn-light px-4" to="/contacts">Voir mes contacts</RouterLink>
            <RouterLink class="btn btn-outline-light px-4" to="/contacts/new">Ajouter un contact</RouterLink>
            <RouterLink class="btn btn-outline-light px-4" to="/profile">Modifier mon profil</RouterLink>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="surface-card p-4 bg-white text-dark">
            <p class="text-uppercase small text-muted mb-1">Raccourci</p>
            <h2 class="h5 section-title mb-3">Ouvrir la vue bêta</h2>
            <p class="text-muted small mb-3">
              Explorez les contacts d’un autre utilisateur pour vérifier le partage côté API.
            </p>
            <RouterLink class="btn btn-brand w-100" :to="`/users/${user.id}/contacts`">
              Aller à la vue bêta
            </RouterLink>
          </div>
        </div>
      </div>
    </section>

    <section v-if="user" class="row g-3 g-lg-4">
      <div class="col-md-4">
        <div class="metric-card p-4 h-100">
          <div class="label-muted mb-1">Mes contacts</div>
          <div class="metric-value">{{ stats.total }}</div>
          <p class="text-muted mb-0">Enregistrés pour le compte connecté.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="metric-card p-4 h-100">
          <div class="label-muted mb-1">Avec e-mail</div>
          <div class="metric-value">{{ stats.emails }}</div>
          <p class="text-muted mb-0">Contacts joignables par mail.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="metric-card p-4 h-100">
          <div class="label-muted mb-1">Avec téléphone</div>
          <div class="metric-value">{{ stats.phones }}</div>
          <p class="text-muted mb-0">Contacts joignables par appel ou SMS.</p>
        </div>
      </div>
    </section>

    <section v-if="user" class="surface-card p-4 p-lg-5">
      <div class="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <h2 class="section-title h3 mb-1">Contacts récents</h2>
          <p class="text-muted mb-0">Les 3 derniers contacts de votre compte.</p>
        </div>
        <RouterLink class="btn btn-outline-brand" to="/contacts">Voir tout</RouterLink>
      </div>

      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-danger" role="status" aria-hidden="true" />
      </div>

      <div v-else-if="recentContacts.length" class="row g-3">
        <div v-for="contact in recentContacts" :key="contact.id" class="col-lg-4">
          <ContactCard :contact="contact" :show-actions="false" />
        </div>
      </div>

      <EmptyState
        v-else
        title="Aucun contact pour le moment"
        description="Ajoutez votre premier contact pour remplir le tableau de bord."
        action-label="Créer un contact"
        @action="goToCreateContact"
      />
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import ContactCard from '@/components/ContactCard.vue'
import EmptyState from '@/components/EmptyState.vue'
import { fetchContacts } from '@/services/contacts'
import { session } from '@/stores/session'

const router = useRouter()
const loading = ref(false)
const contacts = ref([])

const user = computed(() => (session.token ? session.user : null))
const recentContacts = computed(() => contacts.value.slice(0, 3))
const stats = computed(() => ({
  total: contacts.value.length,
  emails: contacts.value.filter((contact) => contact.email).length,
  phones: contacts.value.filter((contact) => contact.phone).length,
}))

async function loadDashboard() {
  if (!user.value) {
    contacts.value = []
    loading.value = false
    return
  }

  loading.value = true

  try {
    contacts.value = await fetchContacts({ scope: 'me' })
  } catch {
    contacts.value = []
  } finally {
    loading.value = false
  }
}

function goToCreateContact() {
  router.push('/contacts/new')
}

onMounted(loadDashboard)

watch(
  () => user.value?.id,
  () => {
    loadDashboard()
  }
)
</script>
