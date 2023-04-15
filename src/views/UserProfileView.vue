<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue';
import { usersApi } from '@/api/resources/users';
import type { User } from '@/api/resources/users';
import AppCard from '@/components/shared/AppCard.vue';

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
  <ElRow justify="center" :gutter="20" v-loading="loading">
    <ElCol :xs="20" :sm="12" :md="8" style="margin-bottom: 20px">
      <AppCard
        title="Informazioni utente"
        subtitle="Visualizza e modifica le informazioni del tuo account"
      >
        <template #content>
          <ElForm ref="formRef" :model="form" status-icon label-width="auto">
            <ElFormItem label="Nome e cognome" prop="name">
              <ElInput v-model="form.name" disabled />
            </ElFormItem>
            <ElFormItem label="Indirizzo email" prop="email">
              <ElInput v-model="form.email" disabled> </ElInput>
            </ElFormItem>
          </ElForm>
        </template>
      </AppCard>
    </ElCol>
  </ElRow>
</template>
