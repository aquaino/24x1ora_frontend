<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { Runner } from '@/api/interfaces';
import type { FormInstance, FormRules } from 'element-plus';
import { resetForm } from '@/utils';
import { teamsApi } from '@/api/resources';
import { useI18n } from 'vue-i18n';

/**
 * MAIN FUNCTION
 * Define individual team creation/update form.
 *
 * LOGIC
 * Get user input and pass it to parent page using specific events.
 * If in update mode, fetch current team data and populate fields.
 *
 * EXCEPTIONS
 * - WS call fails -> Error alert
 */

/* Props */

const props = defineProps<{
  update?: boolean;
  eventId?: number;
  teamId?: number;
  discount: number;
}>();

/* Data */

const { t } = useI18n();

const alert = ref({
  type: 'error',
  text: '',
});

/* Events */

const emits = defineEmits(['subscribe', 'update-subscription', 'data-fetched']);

/* Data */

const form = reactive<Runner>({
  id: null,
  first_name: '',
  last_name: '',
  member_iuta: false,
  member_csm: false,
  fidal_id: '',
  csi_id: '',
  other_id: '',
  birth_date: '',
});
const formRef = ref<FormInstance>();

const formRules = reactive<FormRules>({
  first_name: [{ required: true, message: t('forms.requiredField'), trigger: 'none' }],
  last_name: [{ required: true, message: t('forms.requiredField'), trigger: 'none' }],
});

/* Methods */

async function getSubscriptionData() {
  try {
    if (props.eventId) {
      const data = await teamsApi.getEventTeamDetails(props.eventId, props.teamId);
      // Preset form inputs
      if (data.team) {
        const runner: Runner = data.team.runners[0];
        form.id = runner.id;
        form.first_name = runner.first_name;
        form.last_name = runner.last_name;
        form.birth_date = runner.birth_date;
        form.member_iuta = runner.member_iuta === 1 ? true : false;
        form.member_csm = runner.member_csm === 1 ? true : false;
        form.fidal_id = runner.fidal_id;
        form.csi_id = runner.csi_id;
        form.other_id = runner.other_id;
      }
      emits('data-fetched');
    }
  } catch (error) {
    alert.value.text = t('api.generalError');
  }
}

function generateDiscountText(society: string, discount: number) {
  return `${t('teams.discountText.enableIfMember')} "${society}" ${t('teams.discountText.toHave')}
          <strong>${discount}€ ${t('teams.discountText.ofSale')}</strong> ${t(
    'teams.discountText.onCost',
  )}.`;
}

/* Mounted */

onMounted(async () => {
  if (props.update) {
    getSubscriptionData();
  }
});
</script>

<template>
  <div class="is-flex is-justify-space-between is-align-center">
    <ElForm
      ref="formRef"
      :model="form"
      status-icon
      :rules="formRules"
      label-width="auto"
      class="is-width-100"
    >
      <ElFormItem :label="$t('forms.firstname')" prop="first_name" required>
        <ElInput v-model="form.first_name" />
      </ElFormItem>
      <ElFormItem :label="$t('forms.lastname')" prop="last_name" required>
        <ElInput v-model="form.last_name" />
      </ElFormItem>
      <ElDivider />
      <ElFormItem :label="$t('forms.birthDate')" prop="birth_date">
        <ElDatePicker
          v-model="form.birth_date"
          type="date"
          value-format="YYYY-MM-DD"
          class="is-width-100"
        />
      </ElFormItem>
      <ElFormItem :label="$t('teams.iutaMember')" prop="member_iuta" class="has-help-text">
        <ElSwitch v-model="form.member_iuta" />
        <div
          v-html="
            props.discount
              ? generateDiscountText('Associazione Italiana Ultramaratona e Trail', props.discount)
              : $t('teams.disableDiscountWarning')
          "
          class="is-help-text"
        />
      </ElFormItem>
      <ElFormItem :label="$t('teams.csmiMember')" prop="member_csm" class="has-help-text">
        <ElSwitch v-model="form.member_csm" />
        <div
          v-html="
            props.discount
              ? generateDiscountText('Club Super Marathon Italia', props.discount)
              : $t('teams.disableDiscountWarning')
          "
          class="is-help-text"
        />
      </ElFormItem>
      <ElDivider />
      <ElFormItem>
        <div class="is-help-text">
          {{ $t('teams.requiredAtLeastACard') }}
        </div>
      </ElFormItem>
      <ElFormItem :label="$t('teams.fidalCard')" prop="fidal_id">
        <ElInput v-model="form.fidal_id" />
      </ElFormItem>
      <ElFormItem :label="$t('teams.csiCard')" prop="csi_id">
        <ElInput v-model="form.csi_id" />
      </ElFormItem>
      <ElFormItem :label="$t('teams.otherCard')" prop="other_id">
        <ElInput v-model="form.other_id" />
      </ElFormItem>
      <slot name="additional-form-items" />
      <ElFormItem class="is-margin-bottom-0">
        <ElButton
          type="success"
          native-type="submit"
          :title="$t('teams.confirmEnrollment')"
          @click.prevent="
            update ? emits('update-subscription', formRef, form) : emits('subscribe', formRef, form)
          "
          >Conferma</ElButton
        >
        <ElButton v-if="!update" @click="resetForm(formRef)" :title="$t('forms.resetForm')"
          >Reset</ElButton
        >
      </ElFormItem>
    </ElForm>
  </div>
  <ElAlert
    v-show="alert.text"
    :type="alert.type"
    :title="alert.text"
    show-icon
    class="is-margin-top-15"
  />
</template>

<style scoped>
:deep(.has-help-text .el-form-item__content) {
  display: block;
}
</style>
