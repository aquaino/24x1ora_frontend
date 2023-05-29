<script setup lang="ts">
import { ref } from 'vue';
import { Fold } from '@element-plus/icons-vue';
import type { MenuItem } from '../interfaces';
import { useAppStore } from '@/store';
import { storeToRefs } from 'pinia';

/* PROPS */

const props = defineProps<{
  menuItems: MenuItem[];
}>();

/* DATA */

const appName = import.meta.env.VITE_APP_NAME;
const mobileMenu = ref(false);

const store = useAppStore();
const { navigation } = storeToRefs(store);
</script>

<template>
  <div class="hidden-md-and-up">
    <ElButton
      @click="mobileMenu = true"
      link
      type="primary"
      size="large"
      circle
      :title="$t('menu.menuTitle')"
    >
      <ElIcon size="32"><Fold /></ElIcon>
    </ElButton>
    <ElDrawer v-model="mobileMenu" size="67%">
      <template #header>
        <h1 class="is-margin-0">{{ appName }}</h1>
      </template>
      <template #default>
        <ElMenu
          :default-active="navigation.activeMenuItem"
          mode="vertical"
          :router="true"
          :ellipsis="false"
        >
          <ElMenuItem
            v-for="(menuItem, index) in props.menuItems"
            :key="`menu-item-${index}`"
            :index="(index + 1).toString()"
            :route="{ name: menuItem.routeName }"
            :title="menuItem.title"
            @click="
              store.setActiveMenuItem((index + 1).toString());
              mobileMenu = false;
            "
            :style="{
              color: menuItem.type === 'danger' ? 'var(--el-color-danger)' : '',
            }"
          >
            <ElIcon><component :is="menuItem.icon" /></ElIcon>
            {{ menuItem.text }}
          </ElMenuItem>
        </ElMenu>
      </template>
    </ElDrawer>
  </div>
</template>

<style scoped>
:deep(.el-menu-item) {
  font-size: 20px;
}

:deep(.el-menu-item .el-icon) {
  font-size: 22px;
}

:deep(.el-drawer__header) {
  margin-bottom: 1rem;
}

:deep(.el-drawer__body) {
  padding: 0;
}
</style>
