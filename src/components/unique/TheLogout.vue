<script setup lang="ts">
import { onMounted } from 'vue';
import { logout } from '@/utils';

/**
 * MAIN FUNCTION
 * Provide a page/route to reach for loggging out the user.
 */

/* Mounted */

onMounted(() => {
  logout(true);
});
</script>

<template>&nbsp;</template>
