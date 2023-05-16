import { createRouter, createWebHistory } from 'vue-router';
import { useAppStore } from '@/store';

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
          component: () => import('@/views/LogoutView.vue'),
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
          path: '/events/:eventId/races/:raceId/individual-race-registration',
          name: 'individual-race-registration',
          component: () => import('@/views/CreateIndividualRaceRegistration.vue'),
        },
        {
          path: '/events/:eventId/races/:raceId/team-race-registration',
          name: 'team-race-registration',
          component: () => import('@/views/CreateTeamRaceRegistration.vue'),
        },
        {
          path: '/race-registrations',
          name: 'race-registrations',
          component: () => import('@/views/ListRaceRegistrationsView.vue'),
        },
        {
          path: '/events/:eventId/teams/:teamId/update',
          name: 'update-subscription',
          component: () => import('@/views/UpdateIndividualRaceRegistrationView.vue'),
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue'),
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
  const store = useAppStore();
  if (to.matched.some((record) => record.meta.requireLogin) && !store.user.access) {
    next({ name: 'login', query: { to: to.path } });
  } else {
    next();
  }
});

// Navigation guard to prevent re-login and re-registration
router.beforeEach((to, from, next) => {
  const store = useAppStore();
  if (
    to.matched.some(
      (record) => record.path.includes('/login') || record.path.includes('/register'),
    ) &&
    store.user.access
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
