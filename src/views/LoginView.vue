<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Message, Key } from '@element-plus/icons-vue';
import { usersApi } from '@/api/resources';
import { useUserStore } from '@/stores/user';
import type { FormInstance, FormRules } from 'element-plus';
import { useRouter, useRoute } from 'vue-router';
import { useNavigationStore } from '@/stores/navigation';

/* Data */

const userStore = useUserStore();
const navigationStore = useNavigationStore();
const router = useRouter();
const route = useRoute();

const formRef = ref<FormInstance>();
const rememberEmail = ref(navigationStore.rememberEmail !== null);

const form = reactive({
  email: navigationStore.rememberEmail ? navigationStore.rememberEmail : '',
  password: '',
});

const alert = ref({
  type: route.query.alertType
    ? (route.query.alertType as 'success' | 'warning' | 'error' | 'info')
    : 'error',
  text: route.query.alertText ? (route.query.alertText as string) : '',
});

// Validation
const requiredMessage = 'Questo campo è obbligatorio';
('Questo campo è obbligatorio');
const formRules = reactive<FormRules>({
  email: [
    { required: true, message: requiredMessage, trigger: 'none' },
    { type: 'email', message: 'Inserisci un indirizzo e-mail valido', trigger: 'none' },
  ],
  password: [{ required: true, message: requiredMessage, trigger: 'none' }],
});

/* Methods */

async function login(formRef: FormInstance | undefined) {
  userStore.$reset();
  if (!formRef) return;
  // Set wether to remember email or not
  navigationStore.setRememberEmail(rememberEmail.value ? form.email : null);
  await formRef.validate(async (valid) => {
    if (valid) {
      try {
        // Authenticate and save user data
        const authData = await usersApi.login(form.email, form.password);
        userStore.setAccessToken(authData.token);
        const userData = await usersApi.getProfileDetails();
        userStore.setUserData(userData);
        router.push({ name: 'home' });
      } catch (error: any) {
        if (error.response.status === 401) {
          alert.value = { type: 'error', text: 'Credenziali non valide.' };
        } else {
          alert.value = {
            type: 'error',
            text: 'Si è verificato un problema, riprovare più tardi.',
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
      <h2>Accedi al portale</h2>
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
        <ElCheckbox label="Ricorda indirizzo e-mail" v-model="rememberEmail" />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" native-type="submit" title="Accedi al portale">Accedi</ElButton>
      </ElFormItem>
    </ElForm>
    <ElDivider />
    <div>
      Non sei registrato?
      <ElLink>
        <RouterLink :to="{ name: 'register' }">Registrati ora.</RouterLink>
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
