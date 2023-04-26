<script setup lang="ts">
import { ref } from 'vue';
import { Menu } from '@element-plus/icons-vue';
import type { MenuItem } from '../../types';

/* Props */
const props = defineProps<{
  menuItems: MenuItem[];
}>();

/* Data */

const appName = import.meta.env.VITE_APP_NAME;
const mobileMenu = ref(false);
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
        <h1>{{ appName }}</h1>
      </template>
      <template #default>
        <div id="mobile-menu">
          <template v-for="item in props.menuItems" :key="`menu-item-${item.routeName}`">
            <ElButton
              @click="
                $router.push({ name: item.routeName });
                mobileMenu = false;
              "
              :icon="item.icon"
              :title="item.title"
              link
              :type="item.type"
              >{{ item.text }}</ElButton
            >
            <ElDivider v-if="item.divider" direction="horizontal" />
          </template>
        </div>
      </template>
    </ElDrawer>
  </div>
</template>

<style scoped>
#mobile-menu {
  position: relative;
  height: 100%;
}

#mobile-menu .el-button {
  display: flex;
  font-size: 22px;
  font-weight: 400;
  margin-left: 0;
}

#mobile-menu .el-button:not(:first-of-type) {
  margin-top: 1.25rem;
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
}
</style>
