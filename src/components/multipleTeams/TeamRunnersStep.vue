<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import AppCard from '../base/AppCard.vue';
import { useI18n } from 'vue-i18n';
import type { Runner } from '@/api/interfaces';
import type { FormInstance, FormRules } from 'element-plus';
import { resetForm } from '@/utils';
import { Delete } from '@element-plus/icons-vue';

/* Interfaces */

interface RunnersData {
  currentRunner: Runner;
  runners: Runner[];
}

/* Data */

const { t } = useI18n();

const input: RunnersData = reactive({
  currentRunner: {
    id: 1,
    first_name: 'Test',
    last_name: 'Test',
    birth_date: '',
    member_iuta: true,
    member_csm: false,
    fidal_id: '1234',
    csi_id: '',
    other_id: '',
  },
  runners: [],
});

const formRef = ref<FormInstance>();

const formRules = reactive<FormRules>({
  first_name: [{ required: true, message: t('forms.requiredField'), trigger: 'none' }],
  last_name: [{ required: true, message: t('forms.requiredField'), trigger: 'none' }],
});

/* Events */

const emits = defineEmits(['step-completed']);

/* Watch */

watch(
  input,
  () => {
    input.runners.length > 0
      ? emits('step-completed', true, input)
      : emits('step-completed', false, input);
  },
  { deep: true },
);

/* Methods */

async function addParticipant(formRef: FormInstance | undefined) {
  if (!formRef) return;
  await formRef.validate(async (valid) => {
    if (valid) {
      input.runners.push(Object.assign({}, input.currentRunner));
    }
  });
}

function removeParticipant(index: number) {
  input.runners.splice(index, 1);
}
</script>

<template>
  <ElCol :xs="24" :sm="10" :md="8">
    <AppCard shadow="never" :title="$t('teams.participantInfo')">
      <template #content>
        <ElForm
          ref="formRef"
          :model="input.currentRunner"
          status-icon
          :rules="formRules"
          label-width="auto"
          class="is-width-100"
          @submit.prevent="addParticipant(formRef)"
        >
          <ElFormItem :label="$t('forms.firstname')" prop="first_name" required>
            <ElInput v-model="input.currentRunner.first_name" />
          </ElFormItem>
          <ElFormItem :label="$t('forms.lastname')" prop="last_name" required>
            <ElInput v-model="input.currentRunner.last_name" />
          </ElFormItem>
          <ElDivider />
          <ElFormItem :label="$t('forms.birthDate')" prop="birth_date">
            <ElDatePicker
              v-model="input.currentRunner.birth_date"
              type="date"
              value-format="YYYY-MM-DD"
              class="is-width-100"
            />
          </ElFormItem>
          <ElFormItem :label="$t('teams.iutaMember')" prop="member_iuta" class="has-help-text">
            <ElSwitch v-model="input.currentRunner.member_iuta" />
          </ElFormItem>
          <ElFormItem :label="$t('teams.csmiMember')" prop="member_csm" class="has-help-text">
            <ElSwitch v-model="input.currentRunner.member_csm" />
          </ElFormItem>
          <ElDivider />
          <ElFormItem>
            <div class="is-help-text">
              {{ $t('teams.requiredAtLeastACard') }}
            </div>
          </ElFormItem>
          <ElFormItem :label="$t('teams.fidalCard')" prop="fidal_id">
            <ElInput v-model="input.currentRunner.fidal_id" />
          </ElFormItem>
          <ElFormItem :label="$t('teams.csiCard')" prop="csi_id">
            <ElInput v-model="input.currentRunner.csi_id" />
          </ElFormItem>
          <ElFormItem :label="$t('teams.otherCard')" prop="other_id">
            <ElInput v-model="input.currentRunner.other_id" />
          </ElFormItem>
          <ElFormItem class="is-margin-bottom-0">
            <ElButton type="success" native-type="submit" :title="$t('general.add')">{{
              $t('general.add')
            }}</ElButton>
            <ElButton @click="resetForm(formRef)" :title="$t('forms.resetForm')">{{
              $t('forms.reset')
            }}</ElButton>
          </ElFormItem>
        </ElForm>
      </template>
    </AppCard>
  </ElCol>
  <ElCol :xs="24" :sm="14" :md="16">
    <AppCard shadow="never" :title="$t('teams.teamRunners')">
      <template #content>
        <ElTable :data="input.runners" :empty-text="$t('general.noRows')" style="width: 100%">
          <ElTableColumn type="index" />
          <ElTableColumn prop="first_name" :label="$t('forms.firstname')" />
          <ElTableColumn prop="last_name" :label="$t('forms.lastname')" />
          <ElTableColumn prop="birth_date" :label="$t('forms.birthDate')" />
          <ElTableColumn prop="member_iuta" :label="$t('teams.iutaMember')" />
          <ElTableColumn prop="member_csm" :label="$t('teams.csmiMember')" />
          <ElTableColumn prop="fidal_id" :label="$t('teams.fidalCard')" />
          <ElTableColumn prop="csi_id" :label="$t('teams.csiCard')" />
          <ElTableColumn prop="other_id" :label="$t('teams.otherCard')" />
          <ElTableColumn>
            <template #default="{ $index }">
              <ElButton
                class="table-action-button"
                type="danger"
                :icon="Delete"
                :title="t('general.delete')"
                @click="removeParticipant($index)"
              />
            </template>
          </ElTableColumn>
        </ElTable>
      </template>
    </AppCard>
  </ElCol>
</template>

<style scoped>
.table-action-button {
  padding: 0 8px;
}
</style>
