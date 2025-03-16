import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Destinations API
export const destinationsApi = {
  /**
   * Get a random destination with multiple choice options
   * @returns {Promise} Promise with destination data
   */
  getRandomDestination: async () => {
    const response = await api.get('/destinations/random');
    return response.data;
  },

  /**
   * Submit an answer for a destination
   * @param {string} destinationId - The destination ID
   * @param {string} answer - The user's answer
   * @param {string} username - Optional username
   * @returns {Promise} Promise with answer feedback
   */
  submitAnswer: async (destinationId, answer, username = null) => {
    const payload = {
      destination_id: destinationId,
      answer,
      username,
    };
    const response = await api.post('/destinations/answer', payload);
    return response.data;
  },
};

// Users API
export const usersApi = {
  /**
* Create a new user, optionally with initial anonymous stats
 * @param {string} username - The username
 * @param {object} initialStats - Optional stats from anonymous play
 * @returns {Promise} Promise with user data
 */
  createUser: async (username, initialStats = null) => {
    const payload = {
      username: username
    };

    // Add initial stats if available (from anonymous play)
    if (initialStats) {
      payload.initial_score = initialStats.score;
      payload.initial_correct_answers = initialStats.correctAnswers;
      payload.initial_total_attempts = initialStats.totalAttempts;
    }

    const response = await api.post('/users', payload);
    return response.data;
  },

  /**
   * Get a user by username
   * @param {string} username - The username
   * @returns {Promise} Promise with user data
   */
  getUser: async (username) => {
    const response = await api.get(`/users/${username}`);
    return response.data;
  },
};

// Challenges API
export const challengesApi = {
  /**
   * Create a new challenge
   * @param {string} username - The creator's username
   * @returns {Promise} Promise with challenge data
   */
  createChallenge: async (username) => {
    const response = await api.post(`/challenges?creator_username=${username}`);
    return response.data;
  },

  /**
   * Get a challenge by ID
   * @param {string} challengeId - The challenge ID
   * @returns {Promise} Promise with challenge data
   */
  getChallenge: async (challengeId) => {
    const response = await api.get(`/challenges/${challengeId}`);
    return response.data;
  },
};

export default {
  destinations: destinationsApi,
  users: usersApi,
  challenges: challengesApi,
};