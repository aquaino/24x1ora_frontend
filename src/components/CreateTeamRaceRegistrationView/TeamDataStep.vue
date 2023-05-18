<script setup lang="ts">
import { reactive, watch } from 'vue';
import AppCard from '../base/AppCard.vue';
import { useI18n } from 'vue-i18n';

/**
 * MAIN FUNCTION
 * Get general team data.
 *
 * LOGIC
 * Get team info from input and pass them to main view.
 */

/* Interfaces */

interface TeamInfo {
  name: string;
}

/* Data */

const { t } = useI18n();

const form: TeamInfo = reactive({
  name: '',
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
    <AppCard shadow="never" :title="$t('teams.teamInfo')">
      <template #content>
        <ElForm @submit.prevent>
          <ElFormItem :label="$t('forms.name')" required>
            <ElInput v-model="form.name" />
          </ElFormItem>
        </ElForm>
      </template>
    </AppCard>
  </ElCol>
</template>
