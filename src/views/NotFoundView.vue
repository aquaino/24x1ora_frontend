<script setup lang="ts">
/**
 * MAIN FUNCTION
 * Give feedback about not found pages and let user to return to homepage.
 */
</script>

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
