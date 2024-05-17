<script setup lang="ts">
import { ref, reactive } from 'vue';
import { usersApi } from '@/api/resources';
import { useAppStore } from '@/store';
import { resetForm } from '@/utils';
import type { FormInstance, FormRules } from 'element-plus';
import { ArrowLeftBold } from '@element-plus/icons-vue';
import router from '@/router';
import { useI18n } from 'vue-i18n';

/* DATA */

const store = useAppStore();
const { t } = useI18n();

const formRef = ref<FormInstance>();
const form = reactive<{ email: string }>({
  email: store.preferences.rememberEmail ? store.preferences.rememberEmail : '',
});

const formRules = reactive<FormRules>({
  email: [
    { required: true, message: t('forms.requiredField'), trigger: 'none' },
    {
      type: 'email',
      message: t('forms.insertValidEmail'),
      trigger: 'none',
    },
  ],
});

/* METHODS */

async function register(formRef: FormInstance | undefined) {
  store.clearUserData();
  if (!formRef) return;
  await formRef.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await usersApi.requestPasswordReset(form.email);
        store.setFeedback('success', t('auth.passwordResetRequestSuccess'));
        router.push({
          name: 'login',
        });
      } catch (error: any) {
        store.setFeedback('error');
      }
    }
  });
}
</script>

<template>
  <ElCard shadow="never">
    <template #header>
      <div class="is-flex is-align-center">
        <ElButton
          @click="
            $router.push({
              name: 'login',
            })
          "
          :icon="ArrowLeftBold"
          type="primary"
          circle
          text
          :title="$t('general.back')"
        />
        <h2 class="is-margin-0">{{ $t('auth.resetYourPassword') }}</h2>
      </div>
    </template>
    <ElForm
      ref="formRef"
      @submit.prevent="register(formRef)"
      :model="form"
      :rules="formRules"
      status-icon
      label-width="auto"
    >
      <ElFormItem :label="$t('forms.email')" prop="email" required>
        <ElInput v-model="form.email" />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" native-type="submit" :title="$t('general.confirm')">{{
          $t('general.confirm')
        }}</ElButton>
        <ElButton @click="resetForm(formRef)" :title="$t('forms.resetForm')">{{
          $t('forms.reset')
        }}</ElButton>
      </ElFormItem>
    </ElForm>
  </ElCard>
</template>

<style scoped>
:deep(.el-card__header) {
  padding: 13px;
}
</style>
