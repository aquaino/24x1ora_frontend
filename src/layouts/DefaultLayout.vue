<script setup lang="ts">
import TheHeaderContent from '@/components/unique/TheHeaderContent.vue';
import TheFooterContent from '@/components/unique/TheFooterContent.vue';
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
    <ElFooter height="140px">
      <TheFooterContent />
    </ElFooter>
  </ElContainer>
</template>
