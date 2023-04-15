<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import type { Runner } from '@/api/resources/teams';
import type { FormInstance, FormRules } from 'element-plus';
import { resetForm } from '@/utils';
import { teamsApi } from '@/api/resources/teams';

/* Props */

const props = defineProps<{
  update?: boolean;
  eventId?: number;
  teamId?: number;
  discount: number;
  alert: { type: string; text: string };
}>();

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

const requiredMessage = 'Questo campo è obbligatorio';
const formRules = reactive<FormRules>({
  first_name: [{ required: true, message: requiredMessage, trigger: 'none' }],
  last_name: [{ required: true, message: requiredMessage, trigger: 'none' }],
});

/* Events */

const emits = defineEmits(['subscribe', 'update-subscription']);

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
        form.member_iuta = runner.member_iuta;
        form.member_csm = runner.member_csm;
        form.fidal_id = runner.fidal_id;
        form.csi_id = runner.csi_id;
        form.other_id = runner.other_id;
      }
    }
  } catch (error) {
    console.log(error);
  }
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
      style="width: 100%"
    >
      <ElFormItem label="Nome" prop="first_name" required>
        <ElInput v-model="form.first_name" />
      </ElFormItem>
      <ElFormItem label="Cognome" prop="last_name" required>
        <ElInput v-model="form.last_name"> </ElInput>
      </ElFormItem>
      <ElFormItem label="Data di nascita" prop="birth_date">
        <ElDatePicker
          v-model="form.birth_date"
          type="date"
          value-format="YYYY-MM-DD"
          style="width: 100%"
        />
      </ElFormItem>
      <ElFormItem label="Membro IUTA" prop="member_iuta">
        <ElSwitch v-model="form.member_iuta" />
        <div v-if="props.discount" class="small-text">
          Attivare se si è membri dell'Associazione Italiana Ultramaratona e Trail per avere diritto
          al <strong>{{ props.discount }}% di sconto</strong> sul costo dell'iscrizione.
        </div>
      </ElFormItem>
      <ElFormItem label="Membro CSMI" prop="member_csm">
        <ElSwitch v-model="form.member_csm" />
        <div v-if="props.discount" class="small-text">
          Attivare se si è membri del Club Super Marathon Italia per avere diritto al
          <strong>{{ props.discount }}% di sconto</strong> sul costo dell'iscrizione.
        </div>
      </ElFormItem>
      <ElFormItem label="Tessera FIDAL" prop="fidal_id">
        <ElInput v-model="form.fidal_id"> </ElInput>
      </ElFormItem>
      <ElFormItem label="Tessera CSI" prop="csi_id">
        <ElInput v-model="form.csi_id"> </ElInput>
      </ElFormItem>
      <ElFormItem label="Altra tessera" prop="other_id">
        <ElInput v-model="form.other_id"> </ElInput>
      </ElFormItem>
      <ElFormItem>
        <ElButton
          type="success"
          native-type="submit"
          title="Conferma iscrizione"
          @click.prevent="
            update ? emits('update-subscription', formRef, form) : emits('subscribe', formRef, form)
          "
          >Conferma</ElButton
        >
        <ElButton v-if="!update" @click="resetForm(formRef)" title="Ripristina il form"
          >Reset</ElButton
        >
      </ElFormItem>
    </ElForm>
  </div>
  <ElAlert
    v-show="props.alert.text"
    :type="props.alert.type"
    :title="props.alert.text"
    show-icon
    style="margin-top: 1.5rem"
  />
</template>
