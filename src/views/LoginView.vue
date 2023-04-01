<script setup lang="ts">
import { ref, reactive } from 'vue';
import { Message, Key } from '@element-plus/icons-vue';
import { usersApi } from '@/api/resources/users';
import { useUserStore } from '@/stores/user';
import type { FormInstance, FormRules } from 'element-plus';
import LoginHeader from '@/components/login/LoginHeader.vue';

const userStore = useUserStore();
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
        const user = await usersApi.login(form.email, form.password);
        userStore.setAccessToken('test');
        // Save user data
      } catch (error) {
        console.log(error);
        alert.value = { type: 'error', text: 'Si è verificato un errore.' };
      }
    }
  });
}
</script>

<template>
  <ElRow justify="center">
    <ElCol :xs="20" :sm="12" :md="8">
      <LoginHeader />
      <ElCard>
        <template #header>
          <div class="card-header">
            <h2>Accedi al portale</h2>
          </div>
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
            <el-button type="primary" native-type="submit">Accedi</el-button>
          </ElFormItem>
        </ElForm>
        <ElDivider />
        <div>
          Non sei registrato?
          <ElLink>
            <RouterLink :to="{ name: 'register' }">Registrati ora.</RouterLink>
          </ElLink>
        </div>
        <ElAlert v-show="alert.text" :type="alert.type" :title="alert.text" show-icon />
      </ElCard>
    </ElCol>
  </ElRow>
</template>

<style scoped>
.el-row {
  padding: 100px 0;
}

.el-alert {
  margin-top: 1.5rem;
}
</style>
