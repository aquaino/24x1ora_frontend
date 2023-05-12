<script setup lang="ts">
import { ref, reactive } from 'vue';
import { usersApi } from '@/api/resources';
import { useAppStore } from '@/store';
import type { UserInputWihtConfirmPassword } from '@/api/interfaces';
import { resetForm } from '@/utils';
import type { FormInstance, FormRules } from 'element-plus';
import { ArrowLeftBold } from '@element-plus/icons-vue';
import router from '@/router';

const store = useAppStore();
const formRef = ref<FormInstance>();

/* Data */

const form = reactive<UserInputWihtConfirmPassword>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const alert = ref({
  type: 'error',
  text: '',
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
      message: 'Inserisci un indirizzo e-mail valido',
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

/* Methods */

async function register(formRef: FormInstance | undefined) {
  store.clearUserData();
  if (!formRef) return;
  await formRef.validate(async (valid) => {
    if (valid) {
      try {
        await usersApi.register(form);
        router.push({
          name: 'login',
          query: {
            alertType: 'success',
            alertText:
              "Registrazione effettuata con successo! A breve riceverai un'e-mail per la conferma dell'indirizzo indicato. Controllare anche nella casella della posta indesiderata.",
          },
        });
      } catch (error: any) {
        console.log(error);
        if (error.response.status === 422) {
          alert.value.text = 'Esiste già un utente registrato con questa e-mail';
        } else {
          alert.value.text = 'Si è verificato un errore, riprovare più tardi';
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
      <ElFormItem label="Indirizzo e-mail" prop="email" required>
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
