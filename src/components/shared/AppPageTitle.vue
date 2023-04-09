<script setup lang="ts">
import { ArrowLeftBold } from '@element-plus/icons-vue';
import type { RouteLocationRaw } from 'vue-router';

/* Props */
const props = defineProps<{
  title: string;
  subtitle?: string;
  backTo?: RouteLocationRaw;
}>();
</script>

<template>
  <div style="margin-bottom: 2rem">
    <div style="display: flex; align-items: baseline; justify-content: center">
      <el-button
        v-if="typeof backTo !== 'undefined'"
        :icon="ArrowLeftBold"
        circle
        text
        title="Indietro"
        @click="$router.push(backTo)"
      />
      <h1>{{ props.title }}</h1>
    </div>
    <div v-if="subtitle" style="text-align: center">{{ subtitle }}</div>
  </div>
</template>
