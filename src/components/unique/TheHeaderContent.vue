<script setup lang="ts">
import logo from '/logo.png';
import TheDesktopMenu from '@/components/unique/TheDesktopMenu.vue';
import TheMobileMenu from '@/components/unique/TheMobileMenu.vue';
import { Calendar, SwitchButton, Tickets, User } from '@element-plus/icons-vue';
import type { MenuItem } from '../../interfaces';
import { useAppStore } from '@/store';

/**
 * MAIN FUNCTION
 * Display header informations: logo and desktop/mobile navigation.
 */

/* Data */

const appName = import.meta.env.VITE_APP_NAME;
const appStore = useAppStore();

const menu: MenuItem[] = [
  {
    routeName: 'events',
    icon: Calendar,
    text: 'Eventi',
    title: 'Visualizza eventi',
  },
  {
    routeName: 'subscriptions',
    icon: Tickets,
    text: 'Iscrizioni',
    title: 'Visualizza iscrizioni',
  },
  { routeName: 'user', icon: User, text: 'Profilo', title: 'Gestisci profilo' },
  {
    routeName: 'logout',
    icon: SwitchButton,
    text: 'Esci',
    title: 'Disconnettiti dal portale',
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
      @click="appStore.setActiveMenuItem('1')"
    >
      <ElImage :src="logo" :alt="`Logo ${appName}`" style="width: 130px" fit="contain" />
      <h2 class="hidden-sm-and-down">{{ appName }}</h2>
    </RouterLink>
    <TheDesktopMenu :menu-items="menu" />
    <TheMobileMenu :menu-items="menu" />
  </div>
</template>
