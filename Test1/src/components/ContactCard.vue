<template>
  <article class="card contact-card h-100">
    <div class="card-body p-4">
      <div class="d-flex gap-3 align-items-start">
        <div class="contact-avatar" :style="{ background: avatarColor }">
          {{ initials }}
        </div>

        <div class="flex-grow-1">
          <div class="d-flex justify-content-between gap-2 align-items-start">
            <div>
              <p class="text-uppercase small text-muted mb-1">
                {{ isMine ? 'Votre contact' : 'Contact bêta' }}
              </p>
              <h3 class="h5 mb-1">{{ displayName }}</h3>
            </div>
            <span class="badge rounded-pill" :class="isMine ? 'text-bg-dark' : 'text-bg-danger'">
              {{ isMine ? 'Moi' : 'Bêta' }}
            </span>
          </div>

          <p v-if="subtitle" class="mb-2 text-muted small">
            {{ subtitle }}
          </p>

          <ul class="list-unstyled mb-0 small">
            <li class="mb-1">
              <strong>Prénom :</strong> {{ contact.firstname || 'Non renseigné' }}
            </li>
            <li class="mb-1">
              <strong>Nom :</strong> {{ contact.lastname || 'Non renseigné' }}
            </li>
            <li class="mb-1">
              <strong>Tél :</strong> {{ contact.phone || 'Non renseigné' }}
            </li>
            <li class="mb-1">
              <strong>E-mail :</strong> {{ contact.email || 'Non renseigné' }}
            </li>
            <li class="mb-1">
              <strong>Naissance :</strong> {{ contact.birthdate ? formatDate(contact.birthdate) : 'Non renseigné' }}
            </li>
            <li v-if="ownerName && !isMine">
              <strong>Utilisateur :</strong> {{ ownerName }}
            </li>
          </ul>
        </div>
      </div>

      <div v-if="showActions" class="d-flex flex-wrap gap-2 mt-3">
        <RouterLink class="btn btn-sm btn-outline-brand" :to="`/contacts/${contact.id}`">
          Détails
        </RouterLink>
        <RouterLink v-if="isMine" class="btn btn-sm btn-brand" :to="`/contacts/${contact.id}/edit`">
          Modifier
        </RouterLink>
        <button v-if="isMine" class="btn btn-sm btn-outline-danger" type="button" @click="emit('delete')">
          Supprimer
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

import { session } from '@/stores/session'
import { formatContactName, formatGender } from '@/utils/entities'
import { formatDate, getInitials, toneFromString } from '@/utils/format'
import { sameId } from '@/utils/ids'

const props = defineProps({
  contact: {
    type: Object,
    required: true,
  },
  ownerName: {
    type: String,
    default: '',
  },
  showActions: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['delete'])

const currentUserId = computed(() => (session.token ? session.user?.id : null))
const contactOwnerId = computed(
  () => props.contact?.user?.id ?? props.contact?.user?._id ?? props.contact?.userId ?? null
)
const isMine = computed(() => sameId(contactOwnerId.value, currentUserId.value))
const displayName = computed(() => formatContactName(props.contact))
const initials = computed(() => getInitials(displayName.value))
const avatarColor = computed(() => toneFromString(displayName.value))
const subtitle = computed(() => {
  const parts = []

  if (props.contact.gender) {
    parts.push(formatGender(props.contact.gender))
  }

  if (props.contact.position) {
    parts.push(props.contact.position)
  }

  if (props.contact.company) {
    parts.push(props.contact.company)
  }

  return parts.join(' • ')
})
</script>
