<script setup lang="ts">
import type { MenuItem } from '../../types';

/* Props */
const props = defineProps<{
  menuItems: MenuItem[];
}>();
</script>

<template>
  <div class="hidden-sm-and-down">
    <template v-for="item in props.menuItems" :key="`menu-item-${item.routeName}`">
      <ElButton
        @click="$router.push({ name: item.routeName })"
        :icon="item.icon"
        :title="item.title"
        link
        :type="item.type"
        >{{ item.text }}</ElButton
      >
      <ElDivider v-if="item.divider" direction="vertical" />
    </template>
  </div>
</template>
