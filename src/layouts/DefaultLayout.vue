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
      <ElMain
        :style="{
          marginTop: '20px',
          marginBottom: '20px',
        }"
        ><RouterView
      /></ElMain>
      <ElFooter height="100px">
        <TheFooterContent style="margin-top: 1rem" />
      </ElFooter>
    </ElContainer>
  </div>
</template>
