<script setup lang="ts">
import TheLoginHeader from '@/components/unique/TheLoginHeader.vue';
import TheFooterContent from '@/components/unique/TheFooterContent.vue';
import AppAlert from '@/components/app/AppAlert.vue';
import { useI18n } from 'vue-i18n';

/* DATA */

const i18n = useI18n();
let html = document.querySelector('html');
if (html) html.setAttribute('lang', i18n.locale.value);
</script>

<template>
  <ElRow justify="center" style="padding: 60px 0">
    <ElCol :xs="24" :sm="12" :md="8" :lg="6" style="padding: 0 20px">
      <TheLoginHeader />
      <RouterView />
      <AppAlert margin />
      <TheFooterContent />
    </ElCol>
  </ElRow>
</template>
