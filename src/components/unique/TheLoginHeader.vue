<script setup lang="ts">
import logo from '/logo.png';
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
