<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { SwitchButton } from '@element-plus/icons-vue';

const userStore = useUserStore();
const router = useRouter();

/* Data */
const appName = import.meta.env.VITE_APP_NAME;

/* Methods */
function logout() {
  userStore.$reset();
  axios.defaults.headers.common['Authorization'] = '';
  router.push({ name: 'login' });
}
</script>

<template>
  <div style="display: flex; align-items: center">
    <RouterLink :to="{ name: 'home' }" style="display: flex">
      <ElImage src="/logo.png" alt="Logo 24x1Ora Buttrio" style="width: 130px" fit="contain" />
      <h2>{{ appName }}</h2>
    </RouterLink>
    <ElButton
      @click="logout()"
      type="danger"
      plain
      :icon="SwitchButton"
      title="Disconnettiti dal portale"
      style="margin-left: auto"
      >Esci</ElButton
    >
  </div>
</template>
