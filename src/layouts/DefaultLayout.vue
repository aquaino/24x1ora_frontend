<script setup lang="ts">
import TheHeaderContent from '@/components/TheHeaderContent.vue';
import TheFooterContent from '@/components/TheFooterContent.vue';
</script>

<template>
  <div class="common-layout">
    <ElContainer>
      <ElHeader>
        <TheHeaderContent />
      </ElHeader>
      <ElMain><RouterView /></ElMain>
      <ElFooter>
        <TheFooterContent style="margin-top: 1rem" />
      </ElFooter>
    </ElContainer>
  </div>
</template>
