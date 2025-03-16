<template>
  <div class="card">
    <!-- Result header with fresh colors -->
    <div class="p-5 text-center border-b" 
         :class="correct ? 'bg-gradient-to-r from-accent-500 to-accent-400 border-accent-600' : 'bg-gradient-to-r from-coral-500 to-coral-400 border-coral-600'">
      <div class="mb-3">
        <span v-if="correct" class="text-4xl">🎉</span>
        <span v-else class="text-3xl">😔</span>
      </div>
      
      <h3 class="text-xl font-bold text-white mb-2">
        {{ correct ? 'Correct!' : 'Not quite...' }}
      </h3>
      
      <p class="text-white text-opacity-90 text-lg">
        <span v-if="!correct">
          The correct answer is <span class="font-bold">{{ correctAnswer.city }}, {{ correctAnswer.country }}</span>
        </span>
        <span v-else>
          You guessed it! <span class="font-bold">{{ correctAnswer.city }}, {{ correctAnswer.country }}</span>
        </span>
      </p>
    </div>
    
    <!-- Fun fact section with fresh styling -->
    <div class="card-body">
      <div class="p-5 bg-gray-50 rounded-lg border border-gray-200">
        <div class="flex">
          <div class="flex-shrink-0 bg-white rounded-full p-2 shadow-sm mr-4">
            <span class="text-xl">💡</span>
          </div>
          
          <div>
            <h4 class="font-medium text-gray-900 mb-2">Fun Fact</h4>
            <p class="text-gray-700">{{ funFact }}</p>
          </div>
        </div>
      </div>
      
      <!-- Action buttons - Next and Challenge with consistent styling -->
      <div class="mt-5 flex flex-row gap-3 justify-center">
        <!-- Next button on the left -->
        <button @click="$emit('next')" 
                class="btn btn-primary">
          Next
        </button>
        
        <!-- Challenge button on the right - always visible for all users -->
        <button @click="$emit('challenge')" 
                class="btn btn-primary">
          Challenge a Friend
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';

const props = defineProps({
  correct: {
    type: Boolean,
    required: true,
  },
  correctAnswer: {
    type: Object,
    required: true,
  },
  funFact: {
    type: String,
    required: true,
  },
});

defineEmits(['next', 'challenge']);

onMounted(() => {
  if (props.correct) {
    // More colorful confetti with our fresh palette
    import('canvas-confetti').then(module => {
      const confetti = module.default;
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#25b6a6', '#2d8eff', '#f9654c', '#0c97e2']
      });
    });
  }
});
</script>