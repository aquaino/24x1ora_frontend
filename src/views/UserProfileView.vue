<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue';
import { usersApi } from '@/api/resources';
import type { User } from '@/api/interfaces';
import AppCard from '@/components/base/AppCard.vue';
import AppPageTitle from '@/components/base/AppPageTitle.vue';

/* Data */

const loading = ref(true);
const form: Ref<User> = ref(Object());

/* Methods */

async function getUserData() {
  try {
    form.value = await usersApi.getProfileDetails();
    loading.value = false;
  } catch (error) {
    console.log(error);
  }
}

/* Mounted */

onMounted(async () => {
  await getUserData();
});
</script>

<template>
  <AppPageTitle
    title="Profilo"
    subtitle="Visualizza e modifica le informazioni del tuo account"
    :back-to="{ name: 'home' }"
  />

  <ElRow justify="center" :gutter="20" v-loading="loading">
    <ElCol :xs="24" :sm="12" :md="8">
      <AppCard title="Informazioni utente">
        <template #content>
          <ElForm ref="formRef" :model="form" status-icon label-width="auto">
            <ElFormItem label="Nome e cognome" prop="name">
              <ElInput v-model="form.name" disabled />
            </ElFormItem>
            <ElFormItem label="Indirizzo e-mail" prop="email">
              <ElInput v-model="form.email" disabled />
            </ElFormItem>
          </ElForm>
        </template>
      </AppCard>
    </ElCol>
  </ElRow>
</template>
