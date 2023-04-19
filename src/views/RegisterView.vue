<script setup lang="ts">
import { ref, reactive } from 'vue';
import { usersApi } from '@/api/resources';
import { useUserStore } from '@/stores/user';
import type { UserInputWihtConfirmPassword } from '@/api/interfaces';
import { resetForm } from '@/utils';
import type { FormInstance, FormRules } from 'element-plus';
import { ArrowLeftBold } from '@element-plus/icons-vue';

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
        alert.value = {
          type: 'success',
          text: "Registrazione effettuata con successo. A breve verrà inviata una email per la conferma dell'indirizzo indicato.",
        };
      } catch (error) {
        console.log(error);
        alert.value = { type: 'error', text: 'Si è verificato un errore.' };
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
          @click="$router.push({ name: 'login' })"
          :icon="ArrowLeftBold"
          type="primary"
          circle
          text
          title="Indietro"
        />
        <h2 class="is-margin-0">Registrati al portale</h2>
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
      <ElFormItem label="Nome e cognome" prop="name">
        <ElInput v-model="form.name" />
      </ElFormItem>
      <ElFormItem label="Indirizzo email" prop="email" required>
        <ElInput v-model="form.email" type="email" />
      </ElFormItem>
      <ElDivider />
      <ElFormItem label="Password" prop="password" required>
        <ElInput show-password v-model="form.password" type="password" />
      </ElFormItem>
      <ElFormItem label="Conferma password" prop="confirmPassword" required>
        <ElInput show-password v-model="form.confirmPassword" type="password" />
      </ElFormItem>
      <ElFormItem>
        <ElButton type="primary" native-type="submit" title="Registrati sul portale"
          >Registrati</ElButton
        >
        <ElButton @click="resetForm(formRef)" title="Ripristina il form">Reset</ElButton>
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
