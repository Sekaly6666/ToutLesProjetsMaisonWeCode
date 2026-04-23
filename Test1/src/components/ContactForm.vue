<template>
  <form class="row g-3" @submit.prevent="handleSubmit">
    <div class="col-12 col-lg-6">
      <label class="form-label fw-semibold" for="contact-firstname">Prénom</label>
      <input
        id="contact-firstname"
        v-model.trim="form.firstname"
        class="form-control form-control-lg"
        type="text"
        required
        placeholder="Ex. Awa"
      />
    </div>

    <div class="col-12 col-lg-6">
      <label class="form-label fw-semibold" for="contact-lastname">Nom</label>
      <input
        id="contact-lastname"
        v-model.trim="form.lastname"
        class="form-control form-control-lg"
        type="text"
        required
        placeholder="Ex. Diallo"
      />
    </div>

    <div class="col-12 col-lg-6">
      <label class="form-label fw-semibold" for="contact-phone">Téléphone</label>
      <input
        id="contact-phone"
        v-model.trim="form.phone"
        class="form-control form-control-lg"
        type="tel"
        required
        placeholder="Ex. +225 07 12 34 56 78"
      />
    </div>

    <div class="col-12 col-lg-6">
      <label class="form-label fw-semibold" for="contact-email">E-mail</label>
      <input
        id="contact-email"
        v-model.trim="form.email"
        class="form-control form-control-lg"
        type="email"
        required
        placeholder="contact@email.com"
      />
    </div>

    <div class="col-12 col-lg-6">
      <label class="form-label fw-semibold" for="contact-gender">Genre</label>
      <select id="contact-gender" v-model="form.gender" class="form-select form-select-lg" required>
        <option disabled value="">Sélectionnez un genre</option>
        <option v-for="option in genderOptions" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>
    </div>

    <div class="col-12 col-lg-6">
      <label class="form-label fw-semibold" for="contact-birthdate">Date de naissance</label>
      <input
        id="contact-birthdate"
        v-model="form.birthdate"
        class="form-control form-control-lg"
        type="date"
      />
    </div>

    <div class="col-12 col-lg-6">
      <label class="form-label fw-semibold" for="contact-position">Poste</label>
      <input
        id="contact-position"
        v-model.trim="form.position"
        class="form-control form-control-lg"
        type="text"
        placeholder="Ex. Responsable commercial"
      />
    </div>

    <div class="col-12 col-lg-6">
      <label class="form-label fw-semibold" for="contact-company">Entreprise</label>
      <input
        id="contact-company"
        v-model.trim="form.company"
        class="form-control form-control-lg"
        type="text"
        placeholder="Ex. EPITECH Afrique"
      />
    </div>

    <div class="col-12 d-flex flex-wrap gap-2 pt-2">
      <button class="btn btn-brand px-4" type="submit" :disabled="loading">
        <span v-if="loading" class="spinner-border spinner-border-sm me-2" aria-hidden="true" />
        {{ loading ? 'Enregistrement...' : submitLabel }}
      </button>
      <button class="btn btn-outline-brand px-4" type="button" @click="emit('cancel')">
        Annuler
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive, watch } from 'vue'

import { toDateInputValue } from '@/utils/format'

const genderOptions = [
  { label: 'Homme', value: 'Male' },
  { label: 'Femme', value: 'Female' },
]

const props = defineProps({
  contact: {
    type: Object,
    default: () => ({}),
  },
  submitLabel: {
    type: String,
    default: 'Enregistrer',
  },
  loading: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['submit', 'cancel'])

const createForm = (source = {}) => ({
  firstname: source.firstname ?? '',
  lastname: source.lastname ?? '',
  phone: source.phone ?? '',
  email: source.email ?? '',
  gender: source.gender ?? '',
  birthdate: toDateInputValue(source.birthdate),
  position: source.position ?? '',
  company: source.company ?? '',
})

const form = reactive(createForm(props.contact))

watch(
  () => props.contact,
  (value) => {
    Object.assign(form, createForm(value))
  },
  { immediate: true, deep: true }
)

function handleSubmit() {
  emit('submit', {
    firstname: form.firstname.trim(),
    lastname: form.lastname.trim(),
    phone: form.phone.trim(),
    email: form.email.trim(),
    gender: form.gender,
    birthdate: form.birthdate,
    position: form.position.trim(),
    company: form.company.trim(),
  })
}
</script>
