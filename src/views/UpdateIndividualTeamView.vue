<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import AppPageTitle from '@/components/shared/AppPageTitle.vue';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance, UploadInstance } from 'element-plus';
import IndividualTeamForm from '@/components/individualTeams/IndividualTeamForm.vue';
import { teamsApi } from '@/api/resources';
import type { RunnerUpdate } from '@/api/interfaces';
import AppCard from '@/components/shared/AppCard.vue';
import { UploadFilled } from '@element-plus/icons-vue';
import { useUserStore } from '@/stores/user';

/* Data */

const router = useRouter();
const route = useRoute();
const loading = ref(true);
const eventId = parseInt(route.params.eventId as string);
const teamId = parseInt(route.params.teamId as string);
const availableDiscount = route.query.availableDiscount
  ? Math.round(parseInt(route.query.availableDiscount as string))
  : 0;
const raceName = route.query.raceName;
const userStore = useUserStore();
const medcertUploadRef = ref<UploadInstance>();
const paymentUploadRef = ref<UploadInstance>();
const medCert: Ref<boolean> = ref(false);
const paymentCert: Ref<boolean> = ref(false);
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
        alert.value = { type: 'error', text: 'Si è verificato un errore.' };
      }
    }
  });
}

/* Mounted */

onMounted(async () => {
  try {
    medCert.value = await teamsApi.hasMedicalCertificate(eventId, teamId);
    paymentCert.value = await teamsApi.hasPaymentCertificate(eventId, teamId);
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
                  :action="`https://iscrizioni.24oredibuttrio.it/apitest/v1/events/${eventId}/teams/${teamId}/attachments/medcert`"
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
                  <div class="is-margin-top-05">
                    <ElAlert
                      v-if="medCert"
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
                  :action="`https://iscrizioni.24oredibuttrio.it/apitest/v1/events/${eventId}/teams/${teamId}/attachments/payment`"
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
                  <div class="is-margin-top-05">
                    <ElAlert
                      v-if="paymentCert"
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
