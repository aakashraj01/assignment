<template>
  <header class="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 shadow-md">
    <div class="container mx-auto px-4 py-3">
      <!-- Three-column layout -->
      <div class="flex justify-between items-center">
        <!-- Logo section (left) -->
        <div class="w-1/4">
          <router-link to="/" class="flex items-center">
            <div class="mr-3">
              <span class="text-2xl">🌍</span>
            </div>
            <h1 class="text-xl font-bold text-white hidden sm:block">Globetrotter</h1>
          </router-link>
        </div>
        
        <!-- Game stats (center - using 2/4 for emphasis) -->
        <div class="w-2/4 flex justify-center">
          <!-- Logged in user stats -->
          <div v-if="userStore.isLoggedIn" 
               class="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center justify-center shadow-inner">
            <div class="flex items-center space-x-6">
              <div class="flex items-center text-yellow-300">
                <span class="text-xl mr-2">🏆</span>
                <span class="font-bold">{{ userStore.score }}</span>
              </div>
              <div class="flex items-center text-green-300">
                <span class="text-xl mr-2">✅</span>
                <span class="font-bold">{{ userStore.correctAnswers }}</span>
              </div>
              <div class="flex items-center text-red-300">
                <span class="text-xl mr-2">❌</span>
                <span class="font-bold">{{ userStore.totalAttempts - userStore.correctAnswers }}</span>
              </div>
            </div>
          </div>
          
          <!-- Anonymous user stats - Changed condition to check attempts instead of score -->
          <div v-else-if="anonymousAttempts > 0" 
               class="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center justify-center shadow-inner">
            <div class="flex items-center space-x-6">
              <div class="flex items-center text-yellow-300">
                <span class="text-xl mr-2">🏆</span>
                <span class="font-bold">{{ anonymousScore }}</span>
              </div>
              <div class="flex items-center text-green-300">
                <span class="text-xl mr-2">✅</span>
                <span class="font-bold">{{ anonymousCorrectAnswers }}</span>
              </div>
              <div class="flex items-center text-red-300">
                <span class="text-xl mr-2">❌</span>
                <span class="font-bold">{{ anonymousAttempts - anonymousCorrectAnswers }}</span>
              </div>
            </div>
          </div>
          
          <!-- Current game info when playing -->
          <div v-else-if="gameStore.currentScore > 0" 
               class="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center shadow-inner">
            <div class="text-white font-bold">
              Score: {{ gameStore.currentScore }}
              <span v-if="gameStore.streak > 1" class="ml-2 text-orange-300">
                🔥 {{ gameStore.streak }}
              </span>
            </div>
          </div>
        </div>
        
        <!-- User profile (right) -->
        <div class="w-1/4 flex justify-end">
          <div v-if="userStore.isLoggedIn" class="flex items-center">
            <span class="hidden md:inline text-white font-medium mr-2">{{ userStore.username }}</span>
            <button 
              @click="logout" 
              class="bg-white/20 hover:bg-white/30 rounded-full p-2 text-white"
              title="Sign out"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 00-3 3v8a1 1 0 003 3h10a1 1 0 003-3V6a1 1 0 00-3-3H3zm11 8a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 11H14z" />
              </svg>
            </button>
          </div>
          
          <!-- Sign in button if not logged in -->
          <button v-else 
                  @click="$emit('show-login')" 
                  class="bg-white text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
            Sign In
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { useGameStore } from '@/stores/game';
import { useRouter } from 'vue-router';

const props = defineProps({
  // Add props for anonymous stats
  anonymousScore: {
    type: Number,
    default: 0
  },
  anonymousCorrectAnswers: {
    type: Number,
    default: 0
  },
  anonymousAttempts: {
    type: Number,
    default: 0
  }
});

const userStore = useUserStore();
const gameStore = useGameStore();
const router = useRouter();

const logout = () => {
  userStore.logout();
  if (router.currentRoute.value.path !== '/') {
    router.push('/');
  }
};
</script>