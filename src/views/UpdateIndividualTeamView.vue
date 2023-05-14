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
import { useAppStore } from '@/store';
import { hasAttachment } from '@/utils';
import { useI18n } from 'vue-i18n';

/**
 * MAIN FUNCTION
 * Update individual team.
 *
 * LOGIC
 * Display team data and allow user to update them.
 *
 * EXCEPTIONS
 * - WS call fails -> Error alert
 */

/* Data */

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

const appStore = useAppStore();

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
            messageText: t('teams.teamUpdated', { msg: teamId }),
          },
        });
      } catch (error) {
        alert.value = { type: 'error', text: t('api.generalError') };
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
    alert.value = { type: 'error', text: t('api.generalError') };
  }
});
</script>

<template>
  <AppPageTitle
    :title="$t('teams.updateTeamTitle', { msg1: teamId, msg2: raceName })"
    :subtitle="$t('teams.updateTeamSubtitle')"
    :back-to="{ name: 'subscriptions' }"
  />
  <ElRow justify="center">
    <ElCol :xs="24" :sm="16" :md="12">
      <AppCard :title="$t('teams.participantInfo')" shadow="never" v-loading="loading">
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
            :discount="availableDiscount"
          >
            <template #additional-form-items>
              <ElDivider />
              <ElFormItem :label="$t('teams.medcert')" class="is-align-center">
                <ElUpload
                  ref="medcertUploadRef"
                  :action="`${backendTeamAttachmentUrl}/medcert`"
                  :headers="{
                    Authorization: `Bearer ${appStore.user.access}`,
                  }"
                  method="POST"
                  :auto-upload="false"
                  :limit="1"
                >
                  <template #trigger>
                    <ElButton :icon="UploadFilled">{{ $t('forms.upload') }}</ElButton>
                  </template>
                  <div class="is-margin-top-05" v-if="team.attachments">
                    <ElAlert
                      v-if="hasAttachment(/medcert.*/, team.attachments)"
                      :title="$t('forms.fileAlreadyUploaded')"
                      type="success"
                      show-icon
                      :closable="false"
                    />
                    <ElAlert
                      v-else
                      :title="$t('forms.fileNotUploaded')"
                      type="error"
                      show-icon
                      :closable="false"
                    />
                  </div>
                </ElUpload>
              </ElFormItem>
              <ElFormItem :label="$t('teams.paymentCertificate')" class="is-align-center">
                <ElUpload
                  ref="paymentUploadRef"
                  :action="`${backendTeamAttachmentUrl}/payment`"
                  :headers="{
                    Authorization: `Bearer ${appStore.user.access}`,
                  }"
                  method="POST"
                  :auto-upload="false"
                  :limit="1"
                >
                  <template #trigger>
                    <ElButton :icon="UploadFilled">{{ $t('forms.upload') }}</ElButton>
                  </template>
                  <div class="is-margin-top-05" v-if="team.attachments">
                    <ElAlert
                      v-if="hasAttachment(/payment.*/, team.attachments)"
                      :title="$t('forms.fileAlreadyUploaded')"
                      type="success"
                      show-icon
                      :closable="false"
                    />
                    <ElAlert
                      v-else
                      :title="$t('forms.fileNotUploaded')"
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
