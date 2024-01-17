import { createRouter, createWebHistory } from '@ionic/vue-router';
import NavbarIonic from '../components/NavbarIonic.vue';
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  redirect: { path: "/" },
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
          path: 'analytics',
          component: () => import('../views/Analytics.vue'),
        },
        {
          path: 'more',
          component: () => import('../views/More.vue'),
        },
      ],
    },
  ]

})

export default router
