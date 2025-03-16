<template>
  <div class="bg-white rounded-lg shadow-sm p-6">
    <div class="text-center mb-4">
      <span class="text-3xl">🏆</span>
      <h3 class="text-xl font-medium mt-2 text-gray-900">Challenge a Friend</h3>
    </div>

    <div v-if="challengeStore.loading" class="text-center py-4">
      <svg class="animate-spin h-8 w-8 mx-auto text-primary-500 mb-2" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
        </path>
      </svg>
      <p class="text-gray-600">Creating your challenge...</p>
    </div>

    <div v-else-if="challengeStore.challengeId || directChallengeId">
      <!-- Challenge created successfully -->
      <div class="mb-5">
        <div class="bg-primary-50 p-4 rounded-md mb-4">
          <p class="text-center text-gray-700">
            Your challenge is ready to share! Challenge your friends to beat your score of <strong>{{ userStore.score
            }}</strong>.
          </p>
        </div>

        <!-- Challenge Link -->
        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Challenge Link
          </label>
          <div class="flex">
            <input type="text" readonly :value="challengeLink"
              class="flex-1 px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" />
            <button @click="copyToClipboard"
              class="px-3 bg-gray-100 text-gray-600 border border-gray-300 border-l-0 rounded-r-md hover:bg-gray-200"
              title="Copy to clipboard">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
              </svg>
            </button>
          </div>
          <p v-if="copied" class="mt-1 text-sm text-green-600">
            Copied to clipboard!
          </p>
        </div>

        <div class="mt-5">
          <a :href="whatsappLink" target="_blank" rel="noopener noreferrer" class="block w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium
        transition-colors text-center">
            Share on WhatsApp
          </a>
        </div>
      </div>
    </div>

    <div v-else>
      <!-- Create challenge button -->
      <p class="text-center mb-4 text-gray-600">
        Create a challenge to invite your friends to play Globetrotter and compare your scores!
      </p>

      <button @click="createChallenge"
        class="block w-full bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
        :disabled="!userStore.isLoggedIn">
        Create Challenge
      </button>

      <p v-if="!userStore.isLoggedIn" class="mt-2 text-sm text-red-600 text-center">
        You need to sign in first to create a challenge
      </p>
    </div>

    <div class="mt-5 text-center">
      <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700">
        Close
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue';
import { useUserStore } from '@/stores/user';
import { useChallengeStore } from '@/stores/challenge';
import { challengesApi } from '@/services/api';

const emit = defineEmits(['close']);

const userStore = useUserStore();
const challengeStore = useChallengeStore();

const copied = ref(false);
const directChallengeId = ref(null);

const createChallenge = async () => {
  try {
    // Create a brand new challenge
    const response = await challengesApi.createChallenge(userStore.username);
    
    // Use the direct ID approach to avoid store conflicts
    directChallengeId.value = response.challenge_id;
    
    console.log('New Challenge Created with ID:', directChallengeId.value);
  } catch (error) {
    console.error('Challenge Creation Failed:', error);
  }
};

// Replace the existing computed properties with these more reliable versions
const challengeLink = computed(() => {
  if (directChallengeId.value) {
    const baseUrl = window.location.origin;
    return `${baseUrl}/challenge/${directChallengeId.value}`;
  }
  return null;
});

const whatsappLink = computed(() => {
  if (directChallengeId.value) {
    const baseUrl = window.location.origin;
    const directLink = `${baseUrl}/challenge/${directChallengeId.value}`;
    const message = encodeURIComponent(
      `Hey! I'm playing Globetrotter and I challenge you to beat my score! 🌍✈️ ${userStore.username} has challenged you to a geography quiz. Click here to play: ${directLink}`
    );
    return `https://wa.me/?text=${message}`;
  }
  return null;
});

const copyToClipboard = () => {
  if (!challengeLink.value) return;

  navigator.clipboard.writeText(challengeLink.value).then(() => {
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  });
};
</script>