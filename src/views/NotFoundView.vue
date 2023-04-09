<script setup lang="ts">
import { Warning } from '@element-plus/icons-vue';
</script>

<template>
  <div class="is-text-center">
    <ElIcon color="var(--el-color-primary)" size="48"><Warning /></ElIcon>
    <h1>Pagina non trovata</h1>
    <p>Ci dispiace, ma la pagina cercata non esiste</p>
    <ElButton
      @click="$router.push({ name: 'home' })"
      title="Torna alla home"
      type="primary"
      class="is-margin-top-05"
      >Home</ElButton
    >
  </div>
</template>
