<template>
  <div>
    <label class="form-label fw-semibold" :for="inputId">{{ label }}</label>
    <input
      :id="inputId"
      class="form-control form-control-lg search-input"
      :value="modelValue"
      :placeholder="placeholder"
      type="search"
      @input="emit('update:modelValue', $event.target.value)"
    />
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: 'Rechercher',
  },
  placeholder: {
    type: String,
    default: 'Tapez un nom, un numéro ou un e-mail',
  },
  inputId: {
    type: String,
    default: 'search-input',
  },
})

const emit = defineEmits(['update:modelValue'])
</script>
