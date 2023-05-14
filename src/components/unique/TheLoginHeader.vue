<script setup lang="ts">
import logo from '/logo.png';

/**
 * MAIN FUNCTION
 * Define the page header for unauthenticated users.
 */
</script>

<template>
  <div class="logo-wrapper">
    <ElImage :src="logo" :alt="$t('general.logoAlt')" />
    <h1>{{ $t('general.portal') }}</h1>
  </div>
</template>

<style scoped>
.logo-wrapper {
  margin-bottom: 2rem;
  text-align: center;
}
</style>
