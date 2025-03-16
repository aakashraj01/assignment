<template>
  <div class="card">
    <div class="card-header">
      <h3 class="text-lg font-medium text-primary-800">Select the correct destination</h3>
    </div>
    
    <div class="card-body">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          v-for="(option, index) in options"
          :key="`${option.city}-${option.country}`"
          :disabled="disabled || loading"
          @click="selectAnswer(`${option.city}, ${option.country}`)"
          class="destination-option"
          :class="{'opacity-75 cursor-not-allowed': disabled || loading}"
        >
          <div class="destination-option-letter">{{ ['A', 'B', 'C', 'D'][index] }}</div>
          <div>
            <div class="font-medium text-gray-900">{{ option.city }}</div>
            <div class="text-gray-500">{{ option.country }}</div>
          </div>
        </button>
      </div>
      
      <!-- Loading indicator -->
      <div v-if="loading" class="mt-4 text-center">
        <div class="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-lg">
          <svg class="animate-spin h-5 w-5 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="font-medium">Checking your answer...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  options: {
    type: Array,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['select']);

const selectAnswer = (answer) => {
  emit('select', answer);
};
</script>