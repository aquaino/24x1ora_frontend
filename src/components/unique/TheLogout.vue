<script setup lang="ts">
import { onMounted } from 'vue';
import { logout } from '@/utils';

/* Mounted */

onMounted(() => {
  logout(true);
});
</script>

<template>&nbsp;</template>
