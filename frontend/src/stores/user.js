import { defineStore } from 'pinia';
import { usersApi } from '@/services/api';

export const useUserStore = defineStore('user', {
  state: () => ({
    username: localStorage.getItem('username') || null,
    score: 0,
    correctAnswers: 0,
    totalAttempts: 0,
    loading: false,
    error: null,
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.username,
    accuracyPercentage: (state) => {
      if (state.totalAttempts === 0) return 0;
      return Math.round((state.correctAnswers / state.totalAttempts) * 100);
    },
  },
  
  actions: {
    async registerUser(username) {
      this.loading = true;
      this.error = null;
      
      try {
        const userData = await usersApi.createUser(username);
        this.username = userData.username;
        this.score = userData.score;
        this.correctAnswers = userData.correct_answers;
        this.totalAttempts = userData.total_attempts;
        
        // Save username to localStorage
        localStorage.setItem('username', username);
        
        return userData;
      } catch (error) {
        this.error = error.response?.data?.error?.message || 'Failed to register user';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchUserProfile() {
      if (!this.username) return null;
      
      this.loading = true;
      this.error = null;
      
      try {
        const userData = await usersApi.getUser(this.username);
        this.score = userData.score;
        this.correctAnswers = userData.correct_answers;
        this.totalAttempts = userData.total_attempts;
        return userData;
      } catch (error) {
        this.error = error.response?.data?.error?.message || 'Failed to fetch user profile';
        // If user not found, clear local storage
        if (error.response?.status === 404) {
          this.logout();
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    updateStats(isCorrect, points) {
      this.score += points;
      this.totalAttempts += 1;
      if (isCorrect) {
        this.correctAnswers += 1;
      }
    },
    
    logout() {
      this.username = null;
      this.score = 0;
      this.correctAnswers = 0;
      this.totalAttempts = 0;
      localStorage.removeItem('username');
    },
  },
});