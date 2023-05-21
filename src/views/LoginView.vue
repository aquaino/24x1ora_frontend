<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Message, Key } from '@element-plus/icons-vue';
import { usersApi } from '@/api/resources';
import type { FormInstance, FormRules } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import { useAppStore } from '@/store';
import { useI18n } from 'vue-i18n';

/* DATA */

const { t } = useI18n();

const store = useAppStore();
const router = useRouter();
const route = useRoute();

const formRef = ref<FormInstance>();
const rememberEmail = ref(store.preferences.rememberEmail !== null);

const form = reactive({
  email: store.preferences.rememberEmail ? store.preferences.rememberEmail : '',
  password: '',
});
const formRules = reactive<FormRules>({
  email: [
    { required: true, message: t('forms.requiredField'), trigger: 'none' },
    { type: 'email', message: t('forms.insertValidEmail'), trigger: 'none' },
  ],
  password: [{ required: true, message: t('forms.requiredField'), trigger: 'none' }],
});

const alert = ref({
  type: route.query.alertType
    ? (route.query.alertType as 'success' | 'warning' | 'error' | 'info')
    : 'error',
  text: route.query.alertText ? (route.query.alertText as string) : '',
});

/* METHODS */

async function login(formRef: FormInstance | undefined) {
  if (!formRef) return;
  // Set wether to remember email or not
  store.setRememberEmail(rememberEmail.value ? form.email : null);
  await formRef.validate(async (valid) => {
    if (valid) {
      try {
        // Authenticate and save user data
        const authData = await usersApi.login(form.email, form.password);
        store.setAccessToken(authData.token);
        const userData = await usersApi.getProfileDetails();
        store.setUserData(userData);
        router.push({ name: 'home' });
      } catch (error: any) {
        if (error.response.status === 401) {
          alert.value = { type: 'error', text: t('auth.invalidCredentials') };
        } else {
          alert.value = {
            type: 'error',
            text: t('api.generalError'),
          };
        }
      }
    }
  });
}
</script>

<template>
  <ElCard shadow="never">
    <template #header>
      <h2>{{ $t('auth.loginToPortal') }}</h2>
    </template>
    <ElForm
      ref="formRef"
      @submit.prevent="login(formRef)"
      :model="form"
      :rules="formRules"
      status-icon
    >
      <ElFormItem prop="email" required>
        <ElInput placeholder="E-mail" v-model="form.email" type="email">
          <template #prefix>
            <ElIcon class="el-input__icon"><message /></ElIcon>
          </template>
        </ElInput>
      </ElFormItem>
      <ElFormItem prop="password" required>
        <ElInput placeholder="Password" show-password v-model="form.password" type="password">
          <template #prefix>
            <ElIcon class="el-input__icon"><key /></ElIcon>
          </template>
        </ElInput>
      </ElFormItem>
      <ElFormItem>
        <ElCheckbox :label="$t('auth.rememberEmail')" v-model="rememberEmail" />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" native-type="submit" :title="$t('auth.loginToPortal')">{{
          $t('auth.login')
        }}</ElButton>
      </ElFormItem>
    </ElForm>
    <ElDivider />
    <div>
      {{ $t('auth.askNotRegistered') }}
      <ElLink>
        <RouterLink :to="{ name: 'register' }">{{ $t('auth.registerNow') }}</RouterLink>
      </ElLink>
    </div>
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
.el-link {
  vertical-align: inherit;
}
</style>
