<script setup lang="ts">
import LoginHeader from '@/components/login/LoginHeader.vue';
import TheFooterContent from '@/components/shared/TheFooterContent.vue';
</script>

<template>
  <ElRow justify="center" style="padding: 100px 0">
    <ElCol :xs="20" :sm="12" :md="8">
      <LoginHeader />
      <RouterView />
      <TheFooterContent style="margin-top: 2rem" />
    </ElCol>
  </ElRow>
</template>
