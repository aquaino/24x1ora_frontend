import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';
import DefaultLayout from '@/layouts/DefaultLayout.vue';
import LoginLayout from '@/layouts/LoginLayout.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginLayout,
      redirect: '/login',
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import('../views/LoginView.vue'),
        },
        {
          path: '/register',
          name: 'register',
          component: () => import('../views/RegisterView.vue'),
        },
      ],
    },
    {
      path: '/',
      name: 'home',
      component: DefaultLayout,
      redirect: '/events',
      meta: {
        requireLogin: true,
      },
      children: [
        {
          path: '/events',
          name: 'events',
          component: () => import('@/views/EventsView.vue'),
        },
        {
          path: '/events/:id/races',
          name: 'races',
          component: () => import('@/views/RacesView.vue'),
        },
        {
          path: '/events/:eventId/races/:raceId/subscribe',
          name: 'subscribe',
          component: () => import('@/views/SubscribeView.vue'),
        },
        {
          path: '/subscriptions',
          name: 'subscriptions',
          component: () => import('@/views/SubscriptionsView.vue'),
        },
      ],
    },
  ],
});

// Navigation guard to check against authentication
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (to.matched.some((record) => record.meta.requireLogin) && !userStore.user.access) {
    next({ name: 'login', query: { to: to.path } });
  } else {
    next();
  }
});

export default router;
