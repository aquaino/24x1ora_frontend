<script setup lang="ts">
import { ref, reactive } from 'vue';
import { usersApi } from '@/api/resources/users';
import { useUserStore } from '@/stores/user';
import type { UserInputWihtConfirmPassword } from '@/api/resources/users';
import type { FormInstance, FormRules } from 'element-plus';

const userStore = useUserStore();
const formRef = ref<FormInstance>();

/* Data */

const form = reactive<UserInputWihtConfirmPassword>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

// Validation

const checkPasswords = function (rule: any, value: any, callback: any) {
  const notMatchingMessage = 'Le due password non coincidono';
  ('Le due password non coincidono');
  if (value !== form.confirmPassword) {
    callback(new Error(notMatchingMessage));
  } else if (value !== form.password) {
    callback(new Error(notMatchingMessage));
  } else {
    callback();
  }
};

const requiredMessage = 'Questo campo è obbligatorio';

const formRules = reactive<FormRules>({
  name: [{ required: true, message: requiredMessage, trigger: 'none' }],
  email: [
    { required: true, message: requiredMessage, trigger: 'none' },
    {
      type: 'email',
      message: 'Inserisci un indirizzo email valido',
      trigger: 'none',
    },
  ],
  password: [
    { required: true, message: requiredMessage, trigger: 'none' },
    { validator: checkPasswords, trigger: 'none' },
  ],
  confirmPassword: [
    { required: true, message: requiredMessage, trigger: 'none' },
    { validator: checkPasswords, trigger: 'none' },
  ],
});

const alert = ref({
  type: 'error',
  text: '',
});

/* Methods */

async function register(formRef: FormInstance | undefined) {
  userStore.$reset();
  if (!formRef) return;
  await formRef.validate(async (valid) => {
    if (valid) {
      try {
        await usersApi.register(form);
        resetForm(formRef);
      } catch (error) {
        console.log(error);
        alert.value = { type: 'error', text: 'Si è verificato un errore.' };
      }
    }
  });
}

async function resetForm(formRef: FormInstance | undefined) {
  if (!formRef) return;
  formRef.resetFields();
}
</script>

<template>
  <ElCard>
    <template #header>
      <div class="card-header">
        <h2>Registrati al portale</h2>
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
      <ElFormItem label="Nome e cognome" prop="name" required>
        <ElInput v-model="form.name" />
      </ElFormItem>
      <ElFormItem label="Indirizzo email" prop="email" required>
        <ElInput v-model="form.email"> </ElInput>
      </ElFormItem>
      <ElDivider />
      <ElFormItem label="Password" prop="password" required>
        <ElInput show-password v-model="form.password"> </ElInput>
      </ElFormItem>
      <ElFormItem label="Conferma password" prop="confirmPassword" required>
        <ElInput show-password v-model="form.confirmPassword"> </ElInput>
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" native-type="submit">Registrati</ElButton>
        <ElButton @click="resetForm(formRef)">Reset</ElButton>
        <ElButton
          @click="$router.push({ name: 'login' })"
          id="back-button"
          text
          style="margin-left: auto"
          >Indietro</ElButton
        >
      </ElFormItem>
    </ElForm>
    <ElAlert
      v-show="alert.text"
      :type="alert.type"
      :title="alert.text"
      show-icon
      style="margin-top: 1.5rem"
    />
  </ElCard>
</template>
