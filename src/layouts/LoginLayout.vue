<script setup lang="ts">
import TheLoginHeader from '@/components/unique/TheLoginHeader.vue';
import TheFooterContent from '@/components/unique/TheFooterContent.vue';

/**
 * MAIN FUNCTION
 * Define page structure for unauthenticated users.
 */
</script>

<template>
  <ElRow justify="center" style="padding: 80px 0">
    <ElCol :xs="24" :sm="12" :md="8" style="padding: 0 20px">
      <TheLoginHeader />
      <RouterView />
      <TheFooterContent />
    </ElCol>
  </ElRow>
</template>
