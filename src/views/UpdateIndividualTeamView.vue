<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import AppPageTitle from '@/components/base/AppPageTitle.vue';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance, UploadInstance } from 'element-plus';
import IndividualTeamForm from '@/components/individualTeams/IndividualTeamForm.vue';
import { teamsApi } from '@/api/resources';
import type { RunnerUpdate, Team } from '@/api/interfaces';
import AppCard from '@/components/base/AppCard.vue';
import { UploadFilled } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';
import { hasAttachment } from '@/utils';

/**
 * MAIN FUNCTION
 * Update individual team.
 *
 * BEHAVIOR
 * Display team data and allow to modify them.
 *
 * EXCEPTIONS
 * Nothing to report.
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

const userStore = useUserStore();

const medcertUploadRef = ref<UploadInstance>();
const paymentUploadRef = ref<UploadInstance>();

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
        medcertUploadRef.value!.submit();
        paymentUploadRef.value!.submit();
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
              <ElFormItem label="Certificato medico" class="is-align-center">
                <ElUpload
                  ref="medcertUploadRef"
                  :action="`${backendTeamAttachmentUrl}/medcert`"
                  :headers="{
                    Authorization: `Bearer ${userStore.user.access}`,
                  }"
                  method="POST"
                  :auto-upload="false"
                  :limit="1"
                >
                  <template #trigger>
                    <ElButton :icon="UploadFilled">Carica</ElButton>
                  </template>
                  <div class="is-margin-top-05" v-if="team.attachments">
                    <ElAlert
                      v-if="hasAttachment(/medcert.*/, team.attachments)"
                      title="File già caricato"
                      type="success"
                      show-icon
                      :closable="false"
                    />
                    <ElAlert
                      v-else
                      title="Nessun file caricato"
                      type="error"
                      show-icon
                      :closable="false"
                    />
                  </div>
                </ElUpload>
              </ElFormItem>
              <ElFormItem label="Ricevuta bonifico" class="is-align-center">
                <ElUpload
                  ref="paymentUploadRef"
                  :action="`${backendTeamAttachmentUrl}/payment`"
                  :headers="{
                    Authorization: `Bearer ${userStore.user.access}`,
                  }"
                  method="POST"
                  :auto-upload="false"
                  :limit="1"
                >
                  <template #trigger>
                    <ElButton :icon="UploadFilled">Carica</ElButton>
                  </template>
                  <div class="is-margin-top-05" v-if="team.attachments">
                    <ElAlert
                      v-if="hasAttachment(/payment.*/, team.attachments)"
                      title="File già caricato"
                      type="success"
                      show-icon
                      :closable="false"
                    />
                    <ElAlert
                      v-else
                      title="Nessun file caricato"
                      type="error"
                      show-icon
                      :closable="false"
                    />
                  </div>
                </ElUpload>
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
