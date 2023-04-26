import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior() {
    return { top: 0 };
  },
  routes: [
    {
      path: '/',
      name: 'auth',
      component: () => import('@/layouts/LoginLayout.vue'),
      redirect: '/login',
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import('@/views/LoginView.vue'),
        },
        {
          path: '/logout',
          name: 'logout',
          component: () => import('@/components/unique/TheLogout.vue'),
          meta: {
            requireLogin: true,
          },
        },
        {
          path: '/register',
          name: 'register',
          component: () => import('@/views/RegisterView.vue'),
        },
        {
          path: '/verify',
          name: 'verify',
          component: () => import('@/views/VerifyEmailView.vue'),
        },
      ],
    },
    {
      path: '/',
      name: 'home',
      component: () => import('@/layouts/DefaultLayout.vue'),
      redirect: '/events',
      meta: {
        requireLogin: true,
      },
      children: [
        {
          path: '/events',
          name: 'events',
          component: () => import('@/views/ListEventsView.vue'),
        },
        {
          path: '/events/:id/races',
          name: 'races',
          component: () => import('@/views/ListEventRacesView.vue'),
        },
        {
          path: '/events/:eventId/races/:raceId/subscribe',
          name: 'subscribe',
          component: () => import('@/views/CreateIndividualTeamView.vue'),
        },
        {
          path: '/subscriptions',
          name: 'subscriptions',
          component: () => import('@/views/ListUserTeamsView.vue'),
        },
        {
          path: '/events/:eventId/teams/:teamId/edit',
          name: 'update-subscription',
          component: () => import('@/views/UpdateIndividualTeamView.vue'),
        },
        {
          path: '/user',
          name: 'user',
          component: () => import('@/views/UserProfileView.vue'),
        },
        {
          path: '/:pathMatch(.*)*',
          name: 'not-found',
          component: () => import('@/views/NotFoundView.vue'),
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

// Navigation guard to prevent re-login and re-registration
router.beforeEach((to, from, next) => {
  const userStore = useUserStore();
  if (
    to.matched.some(
      (record) =>
        record.path.includes('/login') ||
        record.path.includes('/register') ||
        record.path.includes('/verify'),
    ) &&
    userStore.user.access
  ) {
    next({ name: 'home' });
  } else {
    next();
  }
});

// Navigation guard to set page title
router.beforeEach((to, from, next) => {
  document.title = import.meta.env.VITE_APP_NAME;
  next();
});

export default router;
