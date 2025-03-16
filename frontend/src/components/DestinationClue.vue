<template>
  <div class="card">
    <!-- Header with fresh gradient -->
    <div class="card-header">
      <h2 class="flex items-center text-lg font-medium text-primary-800">
        <span class="text-xl mr-2">🌍</span>
        Where is this place?
      </h2>
    </div>
    
    <!-- Clues section with larger text -->
    <div class="card-body">
      <div class="space-y-4">
        <div v-for="(clue, index) in clues" :key="index" class="clue-card">
          <div class="flex">
            <div class="text-accent-600 font-medium mr-3">Clue {{ index + 1 }}:</div>
            <p class="text-gray-700 italic flex-grow">
              "{{ clue }}"
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  clues: {
    type: Array,
    required: true,
  },
});
</script>