import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('../views/GameView.vue')
    },
    {
      path: '/game/:challengeId',
      name: 'game-challenge',
      component: () => import('../views/GameView.vue')
    },
    {
      path: '/challenge/:challengeId',
      name: 'challenge',
      component: () => import('../views/ChallengeView.vue')
    }
  ]
})

export default router