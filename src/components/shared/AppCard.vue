<script setup lang="ts">
defineProps<{
  title?: string;
  subtitle?: string;
  smallerTitle?: string;
  image?: string;
  imageAlt?: string;
  shadow?: string;
}>();
</script>

<template>
  <ElCard :body-style="{ padding: '0px' }" :shadow="shadow ? shadow : false">
    <img v-if="image" :src="image" :alt="imageAlt" class="card-image" />
    <div style="padding: 20px">
      <div v-if="title || subtitle">
        <h2 style="margin-bottom: 0">{{ title }}</h2>
        <div>{{ subtitle }}</div>
      </div>
      <div v-else-if="smallerTitle">
        <h2 style="margin-bottom: 0">{{ smallerTitle }}</h2>
      </div>
      <div style="margin-top: 1rem; margin-bottom: 1rem">
        <slot name="content" />
      </div>
      <div>
        <slot name="footer" />
      </div>
    </div>
  </ElCard>
</template>

<style scoped>
.card-image {
  width: 100%;
  display: block;
}
</style>
