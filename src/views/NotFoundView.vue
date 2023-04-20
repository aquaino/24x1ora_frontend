<script setup lang="ts"></script>

<template>
  <ElResult icon="error" title="Pagina non trovata" sub-title="La pagina cercata non esiste">
    <template #extra>
      <ElButton @click="$router.push({ name: 'home' })" title="Torna alla home" type="primary"
        >Home</ElButton
      >
    </template>
  </ElResult>
</template>
