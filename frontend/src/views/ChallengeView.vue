<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader @show-login="showLoginModal = true" />

    <div class="container mx-auto px-4 py-8">
      <div class="max-w-3xl mx-auto">
        <!-- Loading state -->
        <div v-if="loading" class="text-center py-16">
          <svg class="animate-spin h-12 w-12 mx-auto text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <p class="mt-4 text-lg text-gray-600">Loading challenge...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="error" class="card p-6 text-center">
          <div class="text-4xl mb-4">😕</div>
          <h2 class="text-xl font-bold mb-2">Challenge Not Found</h2>
          <p class="text-gray-600 mb-6">{{ error }}</p>
          <router-link to="/" class="btn btn-primary">
            Go Home
          </router-link>
        </div>

        <!-- Challenge info -->
        <div v-else-if="challengeStore.hasActiveChallenge" class="card p-6 text-center mb-8">
          <div class="text-4xl mb-4">🏆</div>
          <h2 class="text-2xl font-bold mb-2">You've Been Challenged!</h2>

          <div class="my-6 p-4 bg-amber-50 rounded-lg">
            <p class="font-semibold text-lg mb-1">
              {{ challengeStore.creatorInfo?.username }} has challenged you
            </p>
            <p class="text-gray-600">
              Their score: {{ challengeStore.creatorInfo?.score }} | Accuracy:
              {{ challengeStore.creatorInfo?.totalAttempts ?
                Math.round((challengeStore.creatorInfo?.correctAnswers / challengeStore.creatorInfo?.totalAttempts) * 100)
              : 0 }}%
            </p>
          </div>

          <p class="mb-6">
            Think you can beat them? Let's find out which of you knows more about world destinations!
          </p>

          <div class="flex justify-center">
            <button @click="startChallenge" class="btn btn-primary text-lg py-3 px-8">
              Accept Challenge
            </button>
          </div>

          <!-- Registration prompt if not logged in -->
          <div v-if="!userStore.isLoggedIn" class="mt-6 p-4 bg-primary-50 rounded-lg text-center">
            <p class="mb-2">Want to track your score and challenge others?</p>
            <button @click="showLoginModal = true" class="btn btn-secondary">
              Create a Profile
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- User registration modal -->
    <div v-if="showLoginModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showLoginModal = false"></div>
      <div class="z-10 max-w-md w-full mx-4">
        <UserRegistration @success="handleLoginSuccess" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useChallengeStore } from '@/stores/challenge';
import AppHeader from '@/components/AppHeader.vue';
import UserRegistration from '@/components/UserRegistration.vue';

const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const challengeStore = useChallengeStore();

const loading = ref(false);
const error = ref('');
const showLoginModal = ref(false);

onMounted(async () => {
  const challengeId = route.params.challengeId;

  if (!challengeId) {
    error.value = 'No challenge ID provided';
    return;
  }

  loading.value = true;
  try {
    await challengeStore.fetchChallenge(challengeId);
  } catch (err) {
    console.error('Failed to fetch challenge:', err);
    error.value = 'This challenge doesn\'t exist or has expired.';
  } finally {
    loading.value = false;
  }

  // Try to fetch user profile if logged in
  if (userStore.isLoggedIn) {
    try {
      await userStore.fetchUserProfile();
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  }
});

const startChallenge = () => {
  // Store the challenge creator's info temporarily if needed
  const challengerInfo = {
    username: challengeStore.creator?.username,
    score: challengeStore.creator?.score
  };
  
  // Save this in sessionStorage if you need it later
  try {
    sessionStorage.setItem('challenger_info', JSON.stringify(challengerInfo));
  } catch (e) {
    console.warn('Could not save challenger info to session storage', e);
  }
  
  // Navigate to regular game
  router.push('/game');
  
  // We'll clear the challenge from the global store AFTER navigation
  // to prevent interference with the challenge creation functionality
  setTimeout(() => {
    // Only clear the active challenge context, not everything
    challengeStore.challengeId = null;
    challengeStore.createdAt = null;
  }, 100);
};
</script>