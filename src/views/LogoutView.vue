<script setup lang="ts">
import { onMounted } from 'vue';
import { logout } from '@/utils';

/* MOUNTED */

onMounted(() => {
  logout(true);
});
</script>

<template>&nbsp;</template>
