<script setup lang="ts">
import { usersApi } from '@/api/resources';
import { useAppStore } from '@/store';
import { logout } from '@/utils';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

/* DATA */

const router = useRouter();
const route = useRoute();
const token = route.query.token as string;

const { t } = useI18n();

const appStore = useAppStore();
const alreadyVerified = appStore.user.email_verified_at !== null;

const alert = ref({
  type: 'error',
  text: '',
});

/* METHODS */

async function verifyEmail() {
  try {
    await usersApi.verifyEmail(token);
    logout(false);
    router.push({
      name: 'login',
      query: { alertType: 'success', alertText: t('auth.emailConfirmed') },
    });
  } catch (error) {
    alert.value.text = t('api.generalError');
  }
}
</script>

<template>
  <div v-if="token && !alreadyVerified" class="is-text-center">
    <ElButton type="primary" :title="$t('auth.confirmEmailTitle')" @click="verifyEmail()">{{
      $t('auth.verifyEmail')
    }}</ElButton>
  </div>
  <div v-else-if="alreadyVerified">
    <ElResult
      icon="success"
      class="is-padding-top-0"
      :title="$t('auth.emailAlreadyVerifiedTitle')"
      :sub-title="$t('auth.emailAlreadyVerifiedSubtitle')"
    >
      <template #extra>
        <ElButton
          @click="$router.push({ name: 'home' })"
          :title="$t('general.backToHome')"
          type="primary"
          >{{ $t('general.home') }}</ElButton
        >
      </template>
    </ElResult>
  </div>
  <div v-else>
    <ElResult
      icon="error"
      class="is-padding-top-0"
      :title="$t('general.error')"
      :sub-title="$t('auth.emailVerifyError')"
    >
      <template #extra>
        <ElButton
          @click="$router.push({ name: 'home' })"
          :title="$t('general.backToHome')"
          type="primary"
          >{{ $t('general.home') }}</ElButton
        >
      </template>
    </ElResult>
  </div>
  <ElAlert v-show="alert.text" :type="alert.type" :title="alert.text" show-icon />
</template>
