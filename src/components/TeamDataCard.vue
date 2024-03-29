<script setup lang="ts">
import type { Team } from '@/api/interfaces';
import AppCard from './app/AppCard.vue';
import { reactive, watch } from 'vue';
import type { FormInstance } from 'element-plus';
import { ref } from 'vue';
import { teamsApi } from '@/api/resources';
import FileUpload from './forms/FileUpload.vue';

/* PROPS */

const props = defineProps<{
  team: Team;
}>();

/* EXPOSE */

defineExpose({ uploadPaymentCertificate });

/* DATA */

const formRef = ref<FormInstance>();
const form = reactive({
  name: props.team.name,
  manager: props.team.manager,
  manager_cell: props.team.manager_cell,
  tent_request: props.team.tent_request === 1,
  tent_notes: props.team.tent_notes,
});

const paymentUploadRef = ref();

const backendTeamAttachmentUrl = `${import.meta.env.VITE_APP_BACKEND_URL}/events/${
  props.team.event_id
}/teams/${props.team.id}/attachments`;

/* EVENTS */

const emits = defineEmits(['data-updated']);

/* METHODS */

async function downloadAttachment(fileName: string) {
  const file = await teamsApi.getAttachmentFile(props.team.event_id, props.team.id, fileName);
  // Create file link in browser's memory
  const href = URL.createObjectURL(file);
  // Create "a" HTML element with href to file & click
  const link = document.createElement('a');
  link.href = href;
  link.target = '_blank';
  link.setAttribute('download', `${props.team.type.name}_${props.team.name}_${fileName}`);
  document.body.appendChild(link);
  link.click();
  // Clean up "a" element and remove ObjectURL
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
}

function uploadPaymentCertificate() {
  paymentUploadRef.value.submit();
}

/* WATCH */

watch(
  form,
  () => {
    emits('data-updated', form);
  },
  { deep: true },
);
</script>

<template>
  <AppCard shadow="never" :title="$t('teams.teamInfo')">
    <template #content>
      <ElForm ref="formRef" :model="form" status-icon label-position="top" @submit.prevent>
        <ElFormItem :label="$t('forms.name')" required>
          <ElInput v-model="form.name" />
        </ElFormItem>
        <ElFormItem :label="$t('teams.manager')" required>
          <ElInput v-model="form.manager" />
        </ElFormItem>
        <ElFormItem :label="$t('forms.phoneNumber')" required>
          <ElInput v-model="form.manager_cell" />
        </ElFormItem>
        <ElFormItem prop="tent_request">
          <template #label>
            <span style="line-height: initial">{{ $t('teams.requestTent') }}</span>
          </template>
          <ElCheckbox v-model="form.tent_request" />
        </ElFormItem>
        <ElFormItem v-if="form.tent_request" prop="tent_notes">
          <template #label>
            <span style="line-height: initial">{{ $t('teams.tentNotes') }}</span>
          </template>
          <ElInput v-model="form.tent_notes" type="textarea" :rows="4" id="test" />
        </ElFormItem>
        <ElFormItem :label="$t('teams.paymentCertificate')" class="is-align-center">
          <FileUpload
            ref="paymentUploadRef"
            :action="`${backendTeamAttachmentUrl}/payment`"
            filename="payment"
            :files="team.attachments"
            @show-file="downloadAttachment('payment')"
          />
        </ElFormItem>
      </ElForm>
    </template>
  </AppCard>
</template>
