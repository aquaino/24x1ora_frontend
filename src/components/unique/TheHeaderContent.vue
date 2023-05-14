<script setup lang="ts">
import logo from '/logo.png';
import TheDesktopMenu from '@/components/unique/TheDesktopMenu.vue';
import TheMobileMenu from '@/components/unique/TheMobileMenu.vue';
import { Calendar, SwitchButton, Tickets, User } from '@element-plus/icons-vue';
import type { MenuItem } from '../../interfaces';
import { useAppStore } from '@/store';
import { useI18n } from 'vue-i18n';

/**
 * MAIN FUNCTION
 * Display header informations: logo and desktop/mobile navigation.
 */

/* Data */

const appName = import.meta.env.VITE_APP_NAME;
const store = useAppStore();
const { t } = useI18n();

const menu: MenuItem[] = [
  {
    routeName: 'events',
    icon: Calendar,
    text: t('general.event', 2),
    title: t('general.eventsTitle'),
  },
  {
    routeName: 'subscriptions',
    icon: Tickets,
    text: t('general.team', 2),
    title: t('general.teamsTitle'),
  },
  { routeName: 'user', icon: User, text: t('general.profile'), title: t('menu.profileTitle') },
  {
    routeName: 'logout',
    icon: SwitchButton,
    text: t('menu.logout'),
    title: t('menu.logoutTitle'),
    type: 'danger',
  },
];
</script>

<template>
  <div class="is-flex is-align-center is-justify-space-between is-height-100">
    <RouterLink
      :to="{ name: 'home' }"
      class="is-flex"
      title="Home"
      @click="store.setActiveMenuItem('1')"
    >
      <ElImage :src="logo" :alt="t('general.logoAlt')" style="width: 130px" fit="contain" />
      <h2 class="hidden-sm-and-down">{{ appName }}</h2>
    </RouterLink>
    <TheDesktopMenu :menu-items="menu" />
    <TheMobileMenu :menu-items="menu" />
  </div>
</template>
