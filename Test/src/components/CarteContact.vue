<script setup>
defineProps({
  contact: Object
})
</script>

<template>
  <div class="group bg-white rounded-2xl p-5 border border-gray-100 hover:border-red-100 hover:shadow-xl transition-all duration-300 relative overflow-hidden">
    <!-- Background Accent -->
    <div class="absolute top-0 right-0 w-24 h-24 bg-red-50 rounded-bl-[5rem] -mr-8 -mt-8 group-hover:bg-red-100 transition-colors"></div>
    
    <div class="relative z-10">
      <div class="flex items-center space-x-4 mb-4">
        <div class="w-12 h-12 bg-black text-white rounded-xl flex items-center justify-center font-black text-xl">
          {{ contact.firstname?.charAt(0) }}{{ contact.lastname?.charAt(0) }}
        </div>
        <div>
          <h3 class="text-lg font-black text-black group-hover:text-red-600 transition-colors">
            {{ contact.firstname }} {{ contact.lastname }}
          </h3>
          <p class="text-sm text-gray-500 font-medium">{{ contact.position }} chez {{ contact.company }}</p>
        </div>
      </div>
      
      <div class="space-y-2">
        <div class="flex items-center text-sm text-gray-600">
          <span class="w-5 h-5 mr-2 text-red-600">
            <svg fill="currentColor" viewBox="0 0 20 20"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path></svg>
          </span>
          {{ contact.email }}
        </div>
        <div class="flex items-center text-sm text-gray-600">
          <span class="w-5 h-5 mr-2 text-red-600">
            <svg fill="currentColor" viewBox="0 0 20 20"><path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path></svg>
          </span>
          {{ contact.phone }}
        </div>
      </div>
    </div>
    
    <div class="mt-6 flex justify-end space-x-2">
      <router-link 
        :to="`/contacts/${contact._id}`" 
        class="text-xs font-black uppercase tracking-widest text-black hover:text-red-600 transition-colors"
      >
        Voir Détails →
      </router-link>
    </div>
  </div>
</template>
