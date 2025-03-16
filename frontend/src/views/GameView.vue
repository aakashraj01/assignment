<template>
  <div class="min-h-screen bg-gray-50">
    <AppHeader :anonymous-score="anonymousScore" :anonymous-correct-answers="anonymousCorrectAnswers"
      :anonymous-attempts="anonymousAttempts" @show-login="showLoginModal = true" />

    <div class="container mx-auto px-4 py-6">
      <div class="max-w-2xl mx-auto">
        <!-- Loading state -->
        <div v-if="gameStore.loading && !gameStore.hasDestination"
          class="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg class="animate-spin h-10 w-10 mx-auto text-primary-500 mb-4" xmlns="http://www.w3.org/2000/svg"
            fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          <p class="text-gray-700">Loading your next destination...</p>
        </div>

        <!-- Error state -->
        <div v-else-if="gameStore.error" class="bg-white rounded-lg shadow-sm p-8 text-center">
          <div class="text-red-500 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 class="text-lg font-medium text-gray-900 mb-2">Something went wrong</h2>
          <p class="text-gray-500 mb-4">{{ gameStore.error }}</p>
          <button @click="loadDestination" class="btn btn-primary">
            Try Again
          </button>
        </div>

        <!-- Game content -->
        <div v-else>
          <!-- Show feedback if answer was submitted -->
          <FeedbackMessage v-if="gameStore.lastAnswer" :correct="gameStore.answerCorrect"
            :correct-answer="gameStore.lastAnswer" :fun-fact="gameStore.funFact" @next="loadDestination"
            @challenge="handleChallengeClick" />

          <!-- Show game if no answer yet -->
          <div v-else class="space-y-6">
            <!-- Challenge info if applicable -->
            <div v-if="challengeStore.hasActiveChallenge"
              class="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div class="flex items-center gap-3">
                <span class="text-xl">🏆</span>
                <div>
                  <p class="font-medium text-gray-900">Challenge from {{ challengeStore.creatorInfo?.username }}</p>
                  <div class="text-sm text-gray-500">
                    Score: {{ challengeStore.creatorInfo?.score }} |
                    Accuracy: {{ challengeStore.creatorInfo?.totalAttempts ?
                      Math.round((challengeStore.creatorInfo?.correctAnswers / challengeStore.creatorInfo?.totalAttempts)
                        * 100) : 0 }}%
                  </div>
                </div>
              </div>
            </div>

            <div v-if="!userStore.isLoggedIn && anonymousScore > 0"
              class="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-4">
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div class="flex flex-row gap-4">
                  <div class="flex items-center text-primary-600">
                    <span class="text-xl mr-1">🏆</span>
                    <span class="font-medium">{{ anonymousScore }}</span>
                  </div>
                  <div class="flex items-center text-green-600">
                    <span class="text-xl mr-1">✅</span>
                    <span>{{ anonymousCorrectAnswers }}</span>
                  </div>
                  <div class="flex items-center text-red-600">
                    <span class="text-xl mr-1">❌</span>
                    <span>{{ anonymousAttempts - anonymousCorrectAnswers }}</span>
                  </div>
                </div>
                <button @click="showLoginModal = true"
                  class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  Sign in to save your progress
                </button>
              </div>
            </div>

            <!-- Clues -->
            <DestinationClue :clues="gameStore.clues" />

            <!-- Answer options -->
            <AnswerOptions :options="gameStore.options" :loading="gameStore.answering" :disabled="gameStore.answering"
              @select="submitAnswer" />

            <!-- Skip and Challenge buttons - always show both -->
            <div v-if="!gameStore.answering" class="mt-6">
              <div class="flex justify-center gap-4">
                <button @click="skipQuestion" class="btn btn-primary">
                  Skip Question
                </button>
                <button @click="handleChallengeClick" class="btn btn-primary">
                  Challenge a Friend
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User registration modal -->
    <div v-if="showLoginModal" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="absolute inset-0 bg-black bg-opacity-25" @click="showLoginModal = false"></div>
      <div class="z-10 max-w-md w-full mx-4">
        <UserRegistration @success="handleLoginSuccess" :anonymousStats="{
          score: anonymousScore,
          correctAnswers: anonymousCorrectAnswers,
          totalAttempts: anonymousAttempts
        }" />
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
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { useGameStore } from '@/stores/game';
import { useChallengeStore } from '@/stores/challenge';
import AppHeader from '@/components/AppHeader.vue';
import DestinationClue from '@/components/DestinationClue.vue';
import AnswerOptions from '@/components/AnswerOptions.vue';
import FeedbackMessage from '@/components/FeedbackMessage.vue';
import UserRegistration from '@/components/UserRegistration.vue';
import ChallengeInvite from '@/components/ChallengeInvite.vue';

const route = useRoute();
const userStore = useUserStore();
const gameStore = useGameStore();
const challengeStore = useChallengeStore();

const showLoginModal = ref(false);
const showChallengeModal = ref(false);
const pendingChallengeModal = ref(false);

// Anonymous score tracking
const anonymousScore = ref(0);
const anonymousCorrectAnswers = ref(0);
const anonymousAttempts = ref(0);

// Load user profile if logged in
onMounted(async () => {
  if (userStore.isLoggedIn) {
    try {
      await userStore.fetchUserProfile();
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
    }
  }

  // Check for challenge ID in URL
  const challengeId = route.params.challengeId;
  if (challengeId) {
    try {
      await challengeStore.fetchChallenge(challengeId);
    } catch (error) {
      console.error('Failed to fetch challenge:', error);
    }
  }

  // Load first destination
  await loadDestination();
});

// Clean up on component unmount
onBeforeUnmount(() => {
  gameStore.resetGame();
});

const loadDestination = async () => {
  try {
    await gameStore.fetchRandomDestination();
  } catch (error) {
    console.error('Failed to fetch destination:', error);
  }
};

const submitAnswer = async (answer) => {
  try {
    await gameStore.submitAnswer(answer);

    // Update anonymous stats if not logged in
    if (!userStore.isLoggedIn) {
      anonymousAttempts.value += 1;
      if (gameStore.answerCorrect) {
        anonymousScore.value += 10; // Assuming 10 points per correct answer
        anonymousCorrectAnswers.value += 1;
      }
    }

    // Play confetti animation if correct
    if (gameStore.answerCorrect) {
      playConfetti();
    }
  } catch (error) {
    console.error('Failed to submit answer:', error);
  }
};

const skipQuestion = async () => {
  // Simply load a new destination
  await loadDestination();
};

const handleChallengeClick = () => {
  if (userStore.isLoggedIn) {
    showChallengeModal.value = true;
  } else {
    // Mark that we want to show challenge modal after login
    pendingChallengeModal.value = true;
    showLoginModal.value = true;
  }
};

const handleLoginSuccess = async (username) => {
  showLoginModal.value = false;

  // Apply anonymous scores if any, directly at user creation time
  if (anonymousAttempts.value > 0) {
    try {
      // No need to apply scores after registration because they were
      // already included in the user creation payload

      // Reset anonymous scores since they're now part of the user account
      anonymousScore.value = 0;
      anonymousCorrectAnswers.value = 0;
      anonymousAttempts.value = 0;
    } catch (error) {
      console.error('Error with score transfer during registration:', error);
    }
  }

  // Show challenge modal if it was pending
  if (pendingChallengeModal.value) {
    pendingChallengeModal.value = false;
    showChallengeModal.value = true;
  }
};

if (gameStore.answerCorrect) {
  playConfetti();
}
</script>