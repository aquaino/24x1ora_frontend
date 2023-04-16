<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { Calendar, SwitchButton, Tickets, User } from '@element-plus/icons-vue';

/* Data */

const userStore = useUserStore();
const router = useRouter();

const appName = import.meta.env.VITE_APP_NAME;

/* Methods */

function logout() {
  userStore.$reset();
  axios.defaults.headers.common['Authorization'] = '';
  router.push({ name: 'login' });
}
</script>

<template>
  <div class="is-flex is-align-center is-justify-space-between is-height-100">
    <RouterLink :to="{ name: 'home' }" class="is-flex">
      <ElImage src="/logo.png" :alt="`Logo ${appName}`" style="width: 130px" fit="contain" />
      <h2 class="hidden-xs-only">{{ appName }}</h2>
    </RouterLink>
    <div>
      <ElButton
        @click="$router.push({ name: 'events' })"
        :icon="Calendar"
        title="Visualizza eventi"
        link
        >Eventi</ElButton
      >
      <ElButton
        @click="$router.push({ name: 'subscriptions' })"
        :icon="Tickets"
        title="Visualizza iscrizioni attive"
        link
        >Iscrizioni</ElButton
      >
      <ElDivider direction="vertical" />
      <ElButton @click="$router.push({ name: 'user' })" :icon="User" title="Gestisci profilo" link
        >Profilo</ElButton
      >
      <ElButton
        @click="logout()"
        type="danger"
        :icon="SwitchButton"
        title="Disconnettiti dal
      portale"
        link
        >Esci</ElButton
      >
    </div>
  </div>
</template>
