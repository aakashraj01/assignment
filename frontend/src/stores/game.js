import { defineStore } from 'pinia';
import { destinationsApi } from '@/services/api';
import { useUserStore } from './user';

export const useGameStore = defineStore('game', {
  state: () => ({
    currentDestination: null,
    clues: [],
    options: [],
    loading: false,
    error: null,
    answering: false,
    lastAnswer: null,
    answerCorrect: false,
    funFact: '',
    currentScore: 0,
    streak: 0,
  }),
  
  getters: {
    hasDestination: (state) => !!state.currentDestination,
  },
  
  actions: {
    async fetchRandomDestination() {
      this.loading = true;
      this.error = null;
      this.lastAnswer = null;
      
      try {
        const data = await destinationsApi.getRandomDestination();
        this.currentDestination = data.id;
        this.clues = data.clues;
        this.options = data.options;
        return data;
      } catch (error) {
        this.error = error.response?.data?.error?.message || 'Failed to fetch destination';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async submitAnswer(answer) {
      if (!this.currentDestination) return;
      
      this.answering = true;
      this.error = null;
      
      const userStore = useUserStore();
      const username = userStore.isLoggedIn ? userStore.username : null;
      
      try {
        const result = await destinationsApi.submitAnswer(
          this.currentDestination, 
          answer,
          username
        );
        
        this.lastAnswer = result.correct_answer;
        this.answerCorrect = result.correct;
        this.funFact = result.fun_fact;
        
        // Update streak and score
        if (result.correct) {
          this.streak += 1;
          this.currentScore += result.score_update;
        } else {
          this.streak = 0;
        }
        
        // If user is logged in, update user stats in user store
        if (username) {
          userStore.updateStats(result.correct, result.score_update || 0);
        }
        
        return result;
      } catch (error) {
        this.error = error.response?.data?.error?.message || 'Failed to submit answer';
        throw error;
      } finally {
        this.answering = false;
      }
    },
    
    resetGame() {
      this.currentDestination = null;
      this.clues = [];
      this.options = [];
      this.lastAnswer = null;
      this.answerCorrect = false;
      this.funFact = '';
      this.currentScore = 0;
      this.streak = 0;
    },
  },
});