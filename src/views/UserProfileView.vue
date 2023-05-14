<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue';
import { usersApi } from '@/api/resources';
import type { User } from '@/api/interfaces';
import AppCard from '@/components/base/AppCard.vue';
import AppPageTitle from '@/components/base/AppPageTitle.vue';
import { useI18n } from 'vue-i18n';

/**
 * MAIN FUNCTION
 * Show and update user info.
 *
 * LOGIC
 * Show user info and update them from input.
 *
 * EXCEPTIONS
 * - User already exists -> Error alert
 * - WS call failure -> Error alert
 */

/* Data */

const { t } = useI18n();
const loading = ref(true);
const form: Ref<User> = ref(Object());
const alert = ref({
  type: 'error',
  text: '',
});

/* Methods */

async function getUserData() {
  try {
    form.value = await usersApi.getProfileDetails();
    loading.value = false;
  } catch (error) {
    alert.value.text = t('api.generalError');
  }
}

/* Mounted */

onMounted(async () => {
  await getUserData();
});
</script>

<template>
  <AppPageTitle
    :title="$t('general.profile')"
    :subtitle="$t('general.showAndEditProfile')"
    :back-to="{ name: 'home' }"
  />

  <ElRow justify="center" :gutter="20" v-loading="loading">
    <ElCol :xs="24" :sm="12" :md="8" :lg="6">
      <AppCard :title="$t('general.userInfo')">
        <template #content>
          <ElForm ref="formRef" :model="form" status-icon label-width="auto">
            <ElFormItem :label="$t('forms.fullname')" prop="name">
              <ElInput v-model="form.name" disabled />
            </ElFormItem>
            <ElFormItem :label="$t('forms.email')" prop="email">
              <ElInput v-model="form.email" disabled />
            </ElFormItem>
          </ElForm>
        </template>
        <ElAlert
          v-show="alert.text"
          :type="alert.type"
          :title="alert.text"
          show-icon
          class="is-margin-top-15"
        />
      </AppCard>
    </ElCol>
  </ElRow>
</template>
