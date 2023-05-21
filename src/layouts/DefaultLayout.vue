<script setup lang="ts">
import TheHeaderContent from '@/components/unique/TheHeaderContent.vue';
import TheFooterContent from '@/components/unique/TheFooterContent.vue';
import { useI18n } from 'vue-i18n';

/* DATA */

const i18n = useI18n();
let html = document.querySelector('html');
if (html) html.setAttribute('lang', i18n.locale.value);
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
      <ElMain class="is-margin-bottom-10 is-margin-top-10"><RouterView /></ElMain>
    </div>
    <ElFooter height="200px">
      <TheFooterContent />
    </ElFooter>
  </ElContainer>
</template>
