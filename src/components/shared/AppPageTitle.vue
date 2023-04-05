<script setup lang="ts">
/* Props */
const props = defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>

<template>
  <div style="text-align: center; margin-bottom: 2rem">
    <h1 style="margin-bottom: 0.5rem">{{ props.title }}</h1>
    <div v-if="subtitle">{{ subtitle }}</div>
  </div>
</template>
