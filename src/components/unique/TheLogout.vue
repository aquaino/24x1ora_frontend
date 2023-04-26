<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import axios from 'axios';
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';

/* Data */

const userStore = useUserStore();
const router = useRouter();

/* Methods */

function logout() {
  userStore.$reset();
  axios.defaults.headers.common['Authorization'] = '';
  router.push({ name: 'login' });
}

/* Mounted */

onMounted(() => {
  logout();
});
</script>

<template>&nbsp;</template>
