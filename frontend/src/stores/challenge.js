import { defineStore } from 'pinia';
import { challengesApi } from '@/services/api';

export const useChallengeStore = defineStore('challenge', {

  persist: false, // Disable persistence

  state: () => ({
    challengeId: null,
    creator: null,
    loading: false,
    error: null,
    createdAt: null, // Add creation timestamp
  }),

  getters: {
    hasActiveChallenge: (state) => {
      // Check if challenge is recent (e.g., less than 1 hour old)
      if (!state.challengeId || !state.createdAt) return false;

      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      return new Date(state.createdAt).getTime() > oneHourAgo;
    },
    creatorInfo: (state) => state.creator ? {
      username: state.creator.username,
      score: state.creator.score,
      correctAnswers: state.creator.correct_answers,
      totalAttempts: state.creator.total_attempts,
    } : null,
  },

  actions: {
    async createChallenge(username) {
      // Force clear existing challenge
      this.clearChallenge();

      this.loading = true;

      try {
        const data = await challengesApi.createChallenge(username);

        // Explicitly set challenge details with creation timestamp
        this.challengeId = data.challenge_id;
        this.createdAt = new Date(); // Set current timestamp

        // Optional: Log for debugging
        console.log('Challenge Created:', {
          id: this.challengeId,
          createdAt: this.createdAt
        });

        return data;
      } catch (error) {
        this.error = error.response?.data?.error?.message || 'Failed to create challenge';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async fetchChallenge(challengeId) {
      this.loading = true;
      this.error = null;

      try {
        const data = await challengesApi.getChallenge(challengeId);

        // Reset everything before setting new challenge
        this.clearChallenge();

        this.challengeId = data.challenge_id;
        this.creator = data.creator;
        this.createdAt = new Date(); // Set fetch timestamp

        return data;
      } catch (error) {
        this.error = error.response?.data?.error?.message || 'Failed to fetch challenge';
        throw error;
      } finally {
        this.loading = false;
      }
    },

    clearChallenge() {
      this.challengeId = null;
      this.creator = null;
      this.loading = false;
      this.error = null;
      this.createdAt = null;

      // Additional clearing of any potential persistent storage
      try {
        localStorage.removeItem('challenge-id');
        sessionStorage.removeItem('challenge-id');
      } catch (error) {
        console.warn('Error clearing challenge storage:', error);
      }
    },
  },
});