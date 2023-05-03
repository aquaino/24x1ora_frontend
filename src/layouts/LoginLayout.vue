<script setup lang="ts">
import LoginHeader from '@/components/auth/LoginHeader.vue';
import TheFooterContent from '@/components/unique/TheFooterContent.vue';
</script>

<template>
  <ElRow justify="center" style="padding: 80px 0">
    <ElCol :xs="24" :sm="12" :md="8" style="padding: 0 20px">
      <LoginHeader />
      <RouterView />
      <TheFooterContent />
    </ElCol>
  </ElRow>
</template>
