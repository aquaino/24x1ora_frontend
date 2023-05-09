<script setup lang="ts">
/**
 * MAIN FUNCTION
 * Give feedback about not found pages and let user to return to homepage.
 */
</script>

<template>
  <ElResult icon="error" title="Pagina non trovata" sub-title="La pagina cercata non esiste">
    <template #extra>
      <ElButton @click="$router.push({ name: 'home' })" title="Torna alla home" type="primary"
        >Home</ElButton
      >
    </template>
  </ElResult>
</template>
