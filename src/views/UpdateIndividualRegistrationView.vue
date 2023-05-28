<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import AppPageTitle from '@/components/app/AppPageTitle.vue';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance } from 'element-plus';
import IndividualRaceRegistrationForm from '@/components/IndividualRegistrationForm.vue';
import { teamsApi } from '@/api/resources';
import type { RunnerUpdate, Team } from '@/api/interfaces';
import AppCard from '@/components/app/AppCard.vue';
import FileUpload from '@/components/forms/FileUpload.vue';
import { useI18n } from 'vue-i18n';

/* DATA */

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const eventId = parseInt(route.params.eventId as string);
const teamId = parseInt(route.params.teamId as string);
const raceName = route.query.raceName;
const availableDiscount = route.query.availableDiscount
  ? Math.round(parseInt(route.query.availableDiscount as string))
  : 0;

const loading = ref(true);

const medcertUploadRef = ref();
const paymentUploadRef = ref();

const team: Ref<Team> = ref(Object());

const backendTeamAttachmentUrl = `${
  import.meta.env.VITE_APP_BACKEND_URL
}/events/${eventId}/teams/${teamId}/attachments`;

const alert = ref({
  type: 'error',
  text: '',
});

/* METHODS */

async function updateSubscription(formRef: FormInstance | undefined, form: RunnerUpdate) {
  if (!formRef) return;
  await formRef.validate(async (valid) => {
    if (valid) {
      try {
        // Upload medical and/or payment certificates
        medcertUploadRef.value.submit();
        paymentUploadRef.value.submit();
        // Update data
        await teamsApi.updateIndividualTeam(eventId, teamId, form);
        router.push({
          name: 'race-registrations',
          query: {
            messageType: 'success',
            messageText: t('teams.teamUpdated', { msg: teamId }),
          },
        });
      } catch (error) {
        alert.value = { type: 'error', text: t('api.generalError') };
      }
    }
  });
}

async function downloadAttachment(fileName: string) {
  try {
    const file = await teamsApi.getAttachmentFile(eventId, teamId, fileName);
    // Create file link in browser's memory
    const href = URL.createObjectURL(file);
    // Create "a" HTML element with href to file & click
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.setAttribute('download', `${raceName}_${team.value.name}_${fileName}`);
    document.body.appendChild(link);
    link.click();
    // Clean up "a" element and remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  } catch (error) {
    alert.value = { type: 'error', text: t('api.generalError') };
  }
}

/* MOUNTED */

onMounted(async () => {
  try {
    const eventAndTeam = await teamsApi.getEventTeamDetails(eventId, teamId);
    team.value = eventAndTeam.team;
  } catch (error) {
    alert.value = { type: 'error', text: t('api.generalError') };
  }
});
</script>

<template>
  <AppPageTitle
    :title="$t('teams.updateTeamTitle', { msg1: teamId, msg2: raceName })"
    :subtitle="$t('teams.updateTeamSubtitle')"
    :back-to="{ name: 'race-registrations' }"
  />
  <ElRow justify="center">
    <ElCol :xs="24" :sm="16" :md="12" :lg="8">
      <AppCard :title="$t('teams.participantInfo')" shadow="never">
        <template #content>
          <IndividualRaceRegistrationForm
            update
            :event-id="eventId"
            :team-id="teamId"
            @data-fetched="loading = false"
            @update-registration="
              (formRef, form) => {
                updateSubscription(formRef, form);
              }
            "
            :discount="availableDiscount"
          >
            <template #additional-form-items>
              <ElDivider />
              <ElFormItem :label="$t('teams.medcert')" class="is-align-center">
                <FileUpload
                  ref="medcertUploadRef"
                  :action="`${backendTeamAttachmentUrl}/medcert`"
                  filename="medcert"
                  :files="team.attachments"
                  @show-file="downloadAttachment('medcert')"
                />
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
            </template>
          </IndividualRaceRegistrationForm>
        </template>
      </AppCard>
    </ElCol>
  </ElRow>
</template>

<style scoped>
.el-form-item__content div {
  width: 100%;
}
</style>
