<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import AppPageTitle from '@/components/base/AppPageTitle.vue';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance } from 'element-plus';
import IndividualTeamForm from '@/components/individualTeams/IndividualTeamForm.vue';
import { teamsApi } from '@/api/resources';
import type { RunnerUpdate, Team } from '@/api/interfaces';
import AppCard from '@/components/base/AppCard.vue';
import FileUpload from '@/components/forms/FileUpload.vue';

/**
 * FUNCTION
 * Update individual team.
 *
 * LOGIC
 * Display team data and allow to modify them.
 *
 * EXCEPTIONS
 * - WS call fails -> Error alert
 */

/* Data */

const router = useRouter();
const route = useRoute();

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

/* Methods */

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
          name: 'subscriptions',
          query: {
            messageType: 'success',
            messageText: `Iscrizione <strong>#${teamId}</strong> modificata con successo.`,
          },
        });
      } catch (error) {
        console.log(error);
        alert.value = { type: 'error', text: 'Si è verificato un errore' };
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
    console.log(error);
    alert.value = { type: 'error', text: 'Si è verificato un errore' };
  }
}

/* Mounted */

onMounted(async () => {
  try {
    const eventAndTeam = await teamsApi.getEventTeamDetails(eventId, teamId);
    team.value = eventAndTeam.team;
  } catch (error) {
    console.log(error);
  }
});
</script>

<template>
  <AppPageTitle
    :title="`Modifica iscrizione #${teamId} - Gara &quot;${raceName}&quot;`"
    subtitle="Modifica i dati dell'iscrizione tramite il form sottostante"
    :back-to="{ name: 'subscriptions' }"
  />
  <ElRow justify="center">
    <ElCol :xs="24" :sm="16" :md="12">
      <AppCard title="Informazioni partecipante" shadow="never" v-loading="loading">
        <template #content>
          <IndividualTeamForm
            update
            :event-id="eventId"
            :team-id="teamId"
            @data-fetched="loading = false"
            @update-subscription="
              (formRef, form) => {
                updateSubscription(formRef, form);
              }
            "
            :alert="alert"
            :discount="availableDiscount"
          >
            <template #additional-form-items>
              <ElDivider />
              <ElFormItem label="Certificato medico" class="is-align-center">
                <FileUpload
                  ref="medcertUploadRef"
                  :action="`${backendTeamAttachmentUrl}/medcert`"
                  filename="medcert"
                  :files="team.attachments"
                  @show-file="downloadAttachment('medcert')"
                />
              </ElFormItem>
              <ElFormItem label="Ricevuta bonifico" class="is-align-center">
                <FileUpload
                  ref="paymentUploadRef"
                  :action="`${backendTeamAttachmentUrl}/payment`"
                  filename="payment"
                  :files="team.attachments"
                  @show-file="downloadAttachment('payment')"
                />
              </ElFormItem>
            </template>
          </IndividualTeamForm>
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
