import { createRouter, createWebHistory } from '@ionic/vue-router';
import NavbarIonic from '../components/NavbarIonic.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/transactions',
    },
    {
      path: '/',
      component: NavbarIonic,
      children: [
        {
          path: '',
          redirect: '/transactions',
        },
        {
          path: 'accounts',
          component: () => import('../views/Accounts.vue'),
        },
        {
          path: 'transactions',
          component: () => import('../views/Transactions.vue'),
        },
        {
          path: 'radio',
          component: () => import('../views/RadioPage.vue'),
        },
        {
          path: 'library',
          component: () => import('../views/LibraryPage.vue'),
        },
        {
          path: 'search',
          component: () => import('../views/SearchPage.vue'),
        },
      ],
    },
  ]
})

export default router
