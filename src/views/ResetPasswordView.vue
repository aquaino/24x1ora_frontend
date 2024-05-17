<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { Message, Key } from '@element-plus/icons-vue';
import { usersApi } from '@/api/resources';
import type { FormInstance, FormRules } from 'element-plus';
import { useRoute, useRouter } from 'vue-router';
import { useAppStore } from '@/store';
import { useI18n } from 'vue-i18n';

/* DATA */

const { t } = useI18n();
const store = useAppStore();
const router = useRouter();

const route = useRoute();
const token = route.query.token as string;

const formRef = ref<FormInstance>();
const form = reactive({
  email: store.preferences.rememberEmail ? store.preferences.rememberEmail : '',
  password: '',
  confirmPassword: '',
});

// TODO: renderla utils generica perché usata anche nella pagina di registrazione utente
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

/* METHODS */

async function resetPassword(formRef: FormInstance | undefined, token: string) {
  if (!formRef) return;

  await formRef.validate(async (valid: boolean) => {
    if (valid) {
      try {
        await usersApi.resetPassword(form.email, form.password, token);
        store.setFeedback('success', t('auth.passwordResetSuccess'));
        router.push({ name: 'login' });
      } catch (error: any) {
        store.setFeedback('error');
      }
    }
  });
}

/* MOUNTED */

onMounted(() => {
  store.clearFeedback();
});
</script>

<template>
  <ElCard shadow="never">
    <template #header>
      <h2>{{ $t('auth.resetYourPassword') }}</h2>
    </template>
    <ElForm
      ref="formRef"
      @submit.prevent="resetPassword(formRef, token)"
      :model="form"
      :rules="formRules"
      status-icon
    >
      <ElFormItem prop="email" required>
        <ElInput placeholder="E-mail" v-model="form.email">
          <template #prefix>
            <ElIcon class="el-input__icon"><Message /></ElIcon>
          </template>
        </ElInput>
      </ElFormItem>
      <ElFormItem prop="password" required>
        <ElInput :placeholder="$t('forms.newPassword')" show-password v-model="form.password">
          <template #prefix>
            <ElIcon class="el-input__icon"><Key /></ElIcon>
          </template>
        </ElInput>
      </ElFormItem>
      <ElFormItem prop="confirmPassword" required>
        <ElInput
          :placeholder="$t('forms.confirmPassword')"
          show-password
          v-model="form.confirmPassword"
        >
          <template #prefix>
            <ElIcon class="el-input__icon"><Key /></ElIcon>
          </template>
        </ElInput>
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" native-type="submit" :title="$t('general.confirm')">{{
          $t('general.confirm')
        }}</ElButton>
      </ElFormItem>
    </ElForm>
  </ElCard>
</template>
