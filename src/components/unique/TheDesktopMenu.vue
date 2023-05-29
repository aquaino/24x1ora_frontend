<script setup lang="ts">
import { computed, type Ref } from 'vue';
import type { MenuItem } from '../interfaces';
import { useAppStore } from '@/store';
import { storeToRefs } from 'pinia';

/* PROPS */

const props = defineProps<{
  menuItems: MenuItem[];
}>();

/* DATA */

const store = useAppStore();
const { navigation } = storeToRefs(store);

/* COMPUTED */

const menuItemsComputed: Ref<MenuItem[]> = computed(() => {
  let res = Array();
  if (store.user.isAdmin) {
    res = props.menuItems;
  } else {
    res = props.menuItems.filter(function (item) {
      return !item.requireAdmin;
    });
  }
  return res;
});
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
        v-for="(menuItem, index) in menuItemsComputed"
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
