import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import CountryDetailView from '@/views/CountryDetailView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/country/:code',
      name: 'country-detail',
      component: CountryDetailView,
      props: true,
    },
  ],
})

export default router
