<script setup lang="ts">
import LoginHeader from '@/components/auth/LoginHeader.vue';
import TheFooterContent from '@/components/shared/TheFooterContent.vue';
</script>

<template>
  <ElRow justify="center" style="padding: 100px 0">
    <ElCol :xs="24" :sm="12" :md="8">
      <LoginHeader />
      <RouterView />
      <TheFooterContent class="is-margin-top-20" />
    </ElCol>
  </ElRow>
</template>
