<script setup lang="ts">
import { ref } from 'vue';
import { Menu } from '@element-plus/icons-vue';
import type { MenuItem } from '../../interfaces';
import { useNavigationStore } from '@/stores/navigation';
import { storeToRefs } from 'pinia';

/* Props */

const props = defineProps<{
  menuItems: MenuItem[];
}>();

/* Data */

const appName = import.meta.env.VITE_APP_NAME;
const mobileMenu = ref(false);

const navigationStore = useNavigationStore();
const { activeMenuItem } = storeToRefs(navigationStore);
</script>

<template>
  <div class="hidden-md-and-up">
    <ElButton
      @click="mobileMenu = true"
      link
      type="primary"
      size="large"
      circle
      title="Menu di navigazione"
    >
      <ElIcon size="32"><Menu /></ElIcon>
    </ElButton>
    <ElDrawer v-model="mobileMenu" size="67%">
      <template #header>
        <h1 class="is-margin-0">{{ appName }}</h1>
      </template>
      <template #default>
        <ElMenu :default-active="activeMenuItem" mode="vertical" :router="true" :ellipsis="false">
          <ElMenuItem
            v-for="(menuItem, index) in props.menuItems"
            :key="`menu-item-${index}`"
            :index="(index + 1).toString()"
            :route="{ name: menuItem.routeName }"
            :title="menuItem.title"
            @click="
              navigationStore.setActiveMenuItem((index + 1).toString());
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
:deep(.el-drawer__header) {
  margin-bottom: 1rem;
}

:deep(.el-drawer__body) {
  padding: 0;
}
</style>
