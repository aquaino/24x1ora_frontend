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
  <div class="is-margin-bottom-2">
    <div class="is-flex is-justify-center is-align-items-baseline">
      <el-button
        v-if="typeof backTo !== 'undefined'"
        :icon="ArrowLeftBold"
        type="primary"
        circle
        text
        title="Indietro"
        @click="$router.push(props.backTo as RouteLocationRaw)"
      />
      <h1>{{ props.title }}</h1>
    </div>
    <div v-if="subtitle" class="is-text-center">{{ subtitle }}</div>
  </div>
</template>
