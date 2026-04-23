<template>
  <div class="empty-state p-4 p-lg-5 text-center">
    <div class="d-inline-flex align-items-center justify-content-center rounded-circle mb-3" style="width: 64px; height: 64px; background: rgba(217, 4, 41, 0.1); color: var(--mc-red);">
      <strong>MC</strong>
    </div>
    <h3 class="h4 section-title mb-2">{{ title }}</h3>
    <p class="text-muted mb-4 mx-auto" style="max-width: 42rem;">
      {{ description }}
    </p>

    <slot name="action">
      <button v-if="actionLabel" class="btn btn-brand" type="button" @click="emit('action')">
        {{ actionLabel }}
      </button>
    </slot>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  actionLabel: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['action'])
</script>
