<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <AppHeader @show-login="showLoginModal = true" class="absolute top-0 left-0 right-0" />
    
    <div class="container mx-auto px-4 py-6">
      <div class="max-w-3xl mx-auto">
        <!-- Hero section -->
        <div class="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div class="text-center">
            <h1 class="text-3xl font-bold mb-4 text-gray-900">
              <span class="text-primary-600">Welcome to Globetrotter</span> Challenge
            </h1>
            
            <p class="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
              Test your knowledge of famous places around the world in this
              fun travel guessing game!
            </p>
            
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                @click="startGame" 
                class="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-medium transition-colors"
              >
                Start Playing
              </button>
              
              <button 
                v-if="userStore.isLoggedIn"
                @click="showChallengeModal = true" 
                class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Challenge a Friend
              </button>
              <button 
                v-if="!userStore.isLoggedIn"
                @click="showLoginModal = true"
                class="bg-gray-100 hover:bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Create a Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- User registration modal -->
    <div v-if="showLoginModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black bg-opacity-25" @click="showLoginModal = false"></div>
      <div class="z-10 max-w-md w-full mx-4">
        <UserRegistration @success="handleLoginSuccess" />
      </div>
    </div>
    
    <!-- Challenge modal -->
    <div v-if="showChallengeModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black bg-opacity-25" @click="showChallengeModal = false"></div>
      <div class="z-10 max-w-md w-full mx-4">
        <ChallengeInvite @close="showChallengeModal = false" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import AppHeader from '@/components/AppHeader.vue';
import UserRegistration from '@/components/UserRegistration.vue';
import ChallengeInvite from '@/components/ChallengeInvite.vue';

const router = useRouter();
const userStore = useUserStore();

const showLoginModal = ref(false);
const showChallengeModal = ref(false);

const startGame = () => {
  router.push('/game');
};

const handleLoginSuccess = () => {
  showLoginModal.value = false;
};
</script>