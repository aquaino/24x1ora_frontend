<script setup lang="ts"></script>

<template>
  <ElResult
    icon="error"
    :title="$t('general.pageNotFoundTitle')"
    :sub-title="$t('general.pageNotFoundSubtitle')"
  >
    <template #extra>
      <ElButton
        @click="$router.push({ name: 'home' })"
        :title="$t('general.backToHome')"
        type="primary"
        >{{ $t('general.home') }}</ElButton
      >
    </template>
  </ElResult>
</template>
