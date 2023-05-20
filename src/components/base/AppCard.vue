<script setup lang="ts">
import { useSlots } from 'vue';

/**
 * MAIN FUNCTION
 * Define card component to reuse in app.
 */

/* Props */

const props = defineProps<{
  title?: string;
  subtitle?: string;
  image?: string;
  imageAlt?: string;
  shadow?: string;
}>();

/* Data */

const slots = useSlots();
const hasFooter = !!slots['footer'];
</script>

<template>
  <ElCard :body-style="{ padding: '0px' }" :shadow="props.shadow ? props.shadow : 'never'">
    <img v-if="props.image" :src="props.image" :alt="props.imageAlt" class="card-image" />
    <template v-if="props.title && !props.image" #header>
      <div class="is-flex is-justify-space-between is-align-center">
        <h2 class="is-margin-0">{{ props.title }}</h2>
        <slot name="right-header" />
      </div>
    </template>
    <div style="padding: 20px">
      <div v-if="props.title && props.image">
        <h2 class="is-margin-bottom-05">{{ title }}</h2>
        <div v-if="props.subtitle">{{ props.subtitle }}</div>
      </div>
      <div :class="props.image ? 'is-margin-top-10 is-margin-bottom-10' : ''">
        <slot name="content" />
      </div>
      <div :class="hasFooter ? 'is-margin-top-10' : ''">
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
