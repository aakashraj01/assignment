<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="text-center mb-4">
      <span class="text-3xl">👤</span>
      <h2 class="text-xl font-medium mt-2 text-gray-900">
        {{ isRegistering ? 'Create Your Profile' : 'Sign In' }}
      </h2>
    </div>
    
    <!-- Show anonymous stats if available -->
    <div v-if="anonymousStats && anonymousStats.totalAttempts > 0"
         class="bg-primary-50 p-4 rounded-lg mb-4">
      <p class="font-medium text-primary-700">
        Your current progress will be saved:
      </p>
      <ul class="mt-2 text-sm text-primary-800">
        <li>Score: {{ anonymousStats.score }}</li>
        <li>Correct answers: {{ anonymousStats.correctAnswers }} of {{ anonymousStats.totalAttempts }}</li>
        <li>Accuracy: {{ calculateAccuracy(anonymousStats) }}%</li>
      </ul>
    </div>
    
    <form @submit.prevent="handleSubmit">
      <div class="mb-4">
        <label for="username" class="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          id="username"
          v-model="username"
          type="text"
          required
          class="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
          placeholder="Enter a username"
          :disabled="loading"
        />
        <p v-if="error" class="mt-1 text-sm text-red-600">{{ error }}</p>
      </div>
      
      <div class="mt-5">
        <button
          type="submit"
          class="w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
          :disabled="loading || !username"
        >
          <span v-if="loading" class="inline-flex items-center">
            <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing...
          </span>
          <span v-else>
            {{ isRegistering ? 'Create Profile' : 'Sign In' }}
          </span>
        </button>
      </div>
    </form>
    
    <div class="mt-4 text-center text-sm text-gray-500">
      <p>
        Creating a profile lets you track your score and challenge friends!
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { usersApi } from '@/services/api';

const props = defineProps({
  isRegistering: {
    type: Boolean,
    default: true,
  },
  anonymousStats: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['success', 'cancel']);

const userStore = useUserStore();
const username = ref('');
const loading = ref(false);
const error = ref('');

const calculateAccuracy = (stats) => {
  if (!stats || stats.totalAttempts === 0) return 0;
  return Math.round((stats.correctAnswers / stats.totalAttempts) * 100);
};

const handleSubmit = async () => {
  if (!username.value.trim()) return;
  
  loading.value = true;
  error.value = '';
  
  try {
    // Register user with anonymous stats if available
    const userData = await usersApi.createUser(
      username.value.trim(), 
      props.anonymousStats
    );
    
    // Set user store data
    userStore.username = userData.username;
    userStore.score = userData.score;
    userStore.correctAnswers = userData.correct_answers;
    userStore.totalAttempts = userData.total_attempts;
    
    // Save username to localStorage
    localStorage.setItem('username', username.value.trim());
    
    emit('success', username.value);
  } catch (err) {
    console.error('Registration error:', err);
    error.value = err.response?.data?.error?.message || 'Failed to create profile. Try a different username.';
  } finally {
    loading.value = false;
  }
};
</script>