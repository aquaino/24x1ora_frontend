<script setup lang="ts">
import type { MenuItem } from '../../interfaces';
import { useAppStore } from '@/store';
import { storeToRefs } from 'pinia';

/**
 * MAIN FUNCTION
 * Define desktop navigation menu.
 */

/* Props */

const props = defineProps<{
  menuItems: MenuItem[];
}>();

/* Data */

const store = useAppStore();
const { navigation } = storeToRefs(store);
</script>

<template>
  <div class="hidden-sm-and-down is-height-100">
    <ElMenu
      :default-active="navigation.activeMenuItem"
      mode="horizontal"
      :router="true"
      :ellipsis="false"
      class="is-height-100"
    >
      <ElMenuItem
        v-for="(menuItem, index) in props.menuItems"
        :key="`menu-item-${index}`"
        :index="(index + 1).toString()"
        :route="{ name: menuItem.routeName }"
        :title="menuItem.title"
        :style="{
          color: menuItem.type === 'danger' ? 'var(--el-color-danger)' : '',
        }"
        @click="store.setActiveMenuItem((index + 1).toString())"
      >
        <ElIcon><component :is="menuItem.icon" /></ElIcon>
        {{ menuItem.text }}
      </ElMenuItem>
    </ElMenu>
  </div>
</template>
