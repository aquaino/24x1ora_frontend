<script setup lang="ts">
import TheHeaderContent from '@/components/shared/TheHeaderContent.vue';
import TheFooterContent from '@/components/shared/TheFooterContent.vue';
</script>

<template>
  <ElContainer>
    <div class="content-wrapper">
      <ElHeader
        :style="{
          boxShadow: 'var(--el-box-shadow-light)',
        }"
        height="80px"
      >
        <TheHeaderContent />
      </ElHeader>
      <ElMain class="is-margin-bottom-20 is-margin-top-20"><RouterView /></ElMain>
    </div>
    <ElFooter height="100px">
      <TheFooterContent />
    </ElFooter>
  </ElContainer>
</template>
