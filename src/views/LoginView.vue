<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Message, Key } from '@element-plus/icons-vue';
import { usersApi } from '@/api/resources';
import { useUserStore } from '@/stores/user';
import type { FormInstance, FormRules } from 'element-plus';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();
const formRef = ref<FormInstance>();

/* Data */

const form = reactive({
  email: '',
  password: '',
});

const requiredMessage = 'Questo campo è obbligatorio';
('Questo campo è obbligatorio');
const formRules = reactive<FormRules>({
  email: [
    { required: true, message: requiredMessage, trigger: 'none' },
    { type: 'email', message: 'Inserisci un indirizzo email valido', trigger: 'none' },
  ],
  password: [{ required: true, message: requiredMessage, trigger: 'none' }],
});

const alert = ref({
  type: 'error',
  text: '',
});

/* Methods */

async function login(formRef: FormInstance | undefined) {
  userStore.$reset();
  if (!formRef) return;
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
        console.log(error);
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
        <ElInput placeholder="Email" v-model="form.email">
          <template #prefix>
            <ElIcon class="el-input__icon"><message /></ElIcon>
          </template>
        </ElInput>
      </ElFormItem>
      <ElFormItem prop="password" required>
        <ElInput placeholder="Password" show-password v-model="form.password">
          <template #prefix>
            <ElIcon class="el-input__icon"><key /></ElIcon>
          </template>
        </ElInput>
      </ElFormItem>
      <ElFormItem>
        <el-button type="primary" native-type="submit" title="Accedi al portale">Accedi</el-button>
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
