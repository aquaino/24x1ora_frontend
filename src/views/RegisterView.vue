<script setup lang="ts">
import { ref, reactive } from 'vue';
import { usersApi } from '@/api/resources';
import { useAppStore } from '@/store';
import type { UserInputWihtConfirmPassword } from '@/api/interfaces';
import { resetForm } from '@/utils';
import type { FormInstance, FormRules } from 'element-plus';
import { ArrowLeftBold } from '@element-plus/icons-vue';
import router from '@/router';
import { useI18n } from 'vue-i18n';

/**
 * FEATURES
 * Register new user.
 *
 * LOGIC
 * Get user data from input and register him.
 *
 * EXCEPTIONS
 * - User already exists -> Error alert
 * - WS call failure -> Error alert
 */

/* Data */

const appStore = useAppStore();
const { t } = useI18n();
const formRef = ref<FormInstance>();

const form = reactive<UserInputWihtConfirmPassword>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});
const checkPasswords = function (rule: any, value: any, callback: any) {
  if (value !== form.confirmPassword) {
    callback(new Error(t('forms.passwordsNotMatching')));
  } else if (value !== form.password) {
    callback(new Error(t('forms.passwordsNotMatching')));
  } else {
    callback();
  }
};

const formRules = reactive<FormRules>({
  email: [
    { required: true, message: t('forms.requiredField'), trigger: 'none' },
    {
      type: 'email',
      message: t('forms.insertValidEmail'),
      trigger: 'none',
    },
  ],
  password: [
    { required: true, message: t('forms.requiredField'), trigger: 'none' },
    { validator: checkPasswords, trigger: 'none' },
  ],
  confirmPassword: [
    { required: true, message: t('forms.requiredField'), trigger: 'none' },
    { validator: checkPasswords, trigger: 'none' },
  ],
});

const alert = ref({
  type: 'error',
  text: '',
});

/* Methods */

async function register(formRef: FormInstance | undefined) {
  appStore.clearUserData();
  if (!formRef) return;
  await formRef.validate(async (valid) => {
    if (valid) {
      try {
        await usersApi.register(form);
        router.push({
          name: 'login',
          query: {
            alertType: 'success',
            alertText: t('auth.registrationSuccess'),
          },
        });
      } catch (error: any) {
        if (error.response.status === 422) {
          alert.value.text = t('auth.alreadyRegistered');
        } else {
          alert.value.text = t('api.generalError');
        }
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
          title="Indietro"
        />
        <h2 class="is-margin-0">{{ $t('auth.registerToPortal') }}</h2>
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
      <ElFormItem :label="$t('forms.fullname')" prop="name">
        <ElInput v-model="form.name" />
      </ElFormItem>
      <ElFormItem :label="$t('forms.email')" prop="email" required>
        <ElInput v-model="form.email" type="email" />
      </ElFormItem>
      <ElDivider />
      <ElFormItem label="Password" prop="password" required>
        <ElInput show-password v-model="form.password" type="password" />
      </ElFormItem>
      <ElFormItem :label="$t('forms.confirmPassword')" prop="confirmPassword" required>
        <ElInput show-password v-model="form.confirmPassword" type="password" />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" native-type="submit" :title="$t('auth.registerToPortal')">{{
          $t('auth.register')
        }}</ElButton>
        <ElButton @click="resetForm(formRef)" :title="$t('forms.resetForm')">{{
          $t('forms.reset')
        }}</ElButton>
      </ElFormItem>
    </ElForm>
    <ElAlert
      v-show="alert.text"
      :type="alert.type"
      :title="alert.text"
      show-icon
      class="is-margin-top-15"
    />
  </ElCard>
</template>

<style scoped>
:deep(.el-card__header) {
  padding: 13px;
}
</style>
