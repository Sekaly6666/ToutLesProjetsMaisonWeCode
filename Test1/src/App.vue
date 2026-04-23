<template>
  <div class="app-shell">
    <AppNavbar />
    <main class="container-xxl py-4 py-lg-5">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import AppNavbar from '@/components/AppNavbar.vue'
</script>

