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
  <div class="is-margin-bottom-20">
    <div class="is-flex is-justify-center is-align-baseline">
      <el-button
        v-if="typeof props.backTo !== 'undefined'"
        :icon="ArrowLeftBold"
        type="primary"
        circle
        text
        title="Indietro"
        @click="$router.push(props.backTo as RouteLocationRaw)"
      />
      <h1 class="is-margin-top-0">{{ props.title }}</h1>
    </div>
    <h3 v-if="subtitle" class="is-text-center">{{ subtitle }}</h3>
  </div>
</template>
