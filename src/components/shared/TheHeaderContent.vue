<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { Calendar, SwitchButton, Tickets, User } from '@element-plus/icons-vue';
import logo from '/logo.png';
import { Menu } from '@element-plus/icons-vue';

/* Data */

const userStore = useUserStore();
const router = useRouter();
const appName = import.meta.env.VITE_APP_NAME;
const mobileMenu = ref(false);

/* Methods */

function logout() {
  userStore.$reset();
  axios.defaults.headers.common['Authorization'] = '';
  router.push({ name: 'login' });
}
</script>

<template>
  <div class="is-flex is-align-center is-justify-space-between is-height-100">
    <RouterLink :to="{ name: 'home' }" class="is-flex">
      <ElImage :src="logo" :alt="`Logo ${appName}`" style="width: 130px" fit="contain" />
      <h2 class="hidden-sm-and-down">{{ appName }}</h2>
    </RouterLink>
    <!-- Desktop menu -->
    <div class="hidden-sm-and-down">
      <ElButton
        @click="$router.push({ name: 'events' })"
        :icon="Calendar"
        title="Visualizza eventi"
        link
        >Eventi</ElButton
      >
      <ElButton
        @click="$router.push({ name: 'subscriptions' })"
        :icon="Tickets"
        title="Visualizza iscrizioni attive"
        link
        >Iscrizioni</ElButton
      >
      <ElDivider direction="vertical" />
      <ElButton @click="$router.push({ name: 'user' })" :icon="User" title="Gestisci profilo" link
        >Profilo</ElButton
      >
      <ElButton
        @click="logout()"
        type="danger"
        :icon="SwitchButton"
        title="Disconnettiti dal
      portale"
        link
        >Esci</ElButton
      >
    </div>
    <!-- Mobile menu -->
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
            <ElButton
              @click="
                $router.push({ name: 'events' });
                mobileMenu = false;
              "
              :icon="Calendar"
              title="Visualizza eventi"
              link
              >Eventi</ElButton
            >
            <ElButton
              @click="
                $router.push({ name: 'subscriptions' });
                mobileMenu = false;
              "
              :icon="Tickets"
              title="Visualizza iscrizioni attive"
              link
              >Iscrizioni</ElButton
            >
            <ElDivider direction="horizontal" />
            <ElButton
              @click="
                $router.push({ name: 'user' });
                mobileMenu = false;
              "
              :icon="User"
              title="Gestisci profilo"
              link
              >Profilo</ElButton
            >
            <ElButton
              @click="logout()"
              type="danger"
              :icon="SwitchButton"
              title="Disconnettiti dal
      portale"
              link
              >Esci</ElButton
            >
          </div>
        </template>
      </ElDrawer>
    </div>
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
  margin-top: 1rem;
}

:deep(.el-drawer__header) {
  margin-bottom: 0;
}
</style>
