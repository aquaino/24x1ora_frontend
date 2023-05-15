<script setup lang="ts">
import { reactive, watch } from 'vue';
import AppCard from '../base/AppCard.vue';
import type { FormRules } from 'element-plus';
import { useI18n } from 'vue-i18n';

/* Interfaces */

interface TeamInfo {
  name: string;
}

/* Data */

const { t } = useI18n();

const form: TeamInfo = reactive({
  name: '',
});
const formRules = reactive<FormRules>({
  name: [{ required: true, message: t('forms.requiredField'), trigger: 'none' }],
});

/* Events */

const emits = defineEmits(['step-completed']);

/* Watch */

watch(
  form,
  () => {
    form.name !== '' ? emits('step-completed', true, form) : emits('step-completed', false, form);
  },
  { deep: true },
);
</script>

<template>
  <ElCol :xs="24" :sm="12" :md="8" :lg="6">
    <AppCard shadow="never" title="Informazioni squadra">
      <template #content>
        <ElForm :model="form" :rules="formRules" status-icon>
          <ElFormItem :label="$t('forms.name')" prop="name" required>
            <ElInput v-model="form.name" />
          </ElFormItem>
        </ElForm>
      </template>
    </AppCard>
  </ElCol>
</template>
