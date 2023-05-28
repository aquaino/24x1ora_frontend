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
      component: () => import('@/layouts/AuthLayout.vue'),
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
          component: () => import('@/views/CreateIndividualRegistrationView.vue'),
        },
        {
          path: '/events/:eventId/races/:raceId/team-race-registration',
          name: 'team-race-registration',
          component: () => import('@/views/CreateTeamRegistrationView.vue'),
        },
        {
          path: '/race-registrations',
          name: 'race-registrations',
          component: () => import('@/views/ListRegistrationsView.vue'),
        },
        {
          path: '/events/:eventId/teams/:teamId/update-individual',
          name: 'update-individual-registration',
          component: () => import('@/views/UpdateIndividualRegistrationView.vue'),
        },
        {
          path: '/events/:eventId/teams/:teamId/update-team',
          name: 'update-team-registration',
          component: () => import('@/views/UpdateTeamRegistrationView.vue'),
        },
        {
          path: '/profile',
          name: 'profile',
          component: () => import('@/views/ProfileView.vue'),
        },
        {
          path: '/users',
          name: 'users',
          component: () => import('@/views/ListUsersView.vue'),
          meta: {
            requireAdmin: true,
          },
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

// Navigation guard
router.beforeEach((to, from, next) => {
  // Set page title
  document.title = import.meta.env.VITE_APP_NAME;

  const store = useAppStore();
  // Check against authentication
  if (to.matched.some((record) => record.meta.requireLogin) && !store.user.access) {
    next({ name: 'login', query: { to: to.path } });
    // Protect admin views
  } else if (to.matched.some((record) => record.meta.requireAdmin) && !store.user.isAdmin) {
    next({ name: 'not-found' });
    // Prevent re-login and re-registration
  } else if (
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

export default router;
