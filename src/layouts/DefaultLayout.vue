<script setup lang="ts">
import TheHeaderContent from '@/components/shared/TheHeaderContent.vue';
import TheFooterContent from '@/components/shared/TheFooterContent.vue';
</script>

<template>
  <div class="common-layout">
    <ElContainer>
      <ElHeader
        :style="{
          boxShadow: 'var(--el-box-shadow-light)',
        }"
        height="80px"
      >
        <TheHeaderContent />
      </ElHeader>
      <ElMain class="is-margin-bottom-20 is-margin-top-20"><RouterView /></ElMain>
      <ElFooter height="100px">
        <TheFooterContent class="is-margin-top-10" />
      </ElFooter>
    </ElContainer>
  </div>
</template>
