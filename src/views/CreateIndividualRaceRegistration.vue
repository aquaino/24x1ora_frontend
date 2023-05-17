<script setup lang="ts">
import { ref } from 'vue';
import AppPageTitle from '@/components/base/AppPageTitle.vue';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance } from 'element-plus';
import { teamsApi } from '@/api/resources';
import IndividualRaceRegistrationForm from '@/components/individualRaceRegistrations/IndividualRaceRegistrationForm.vue';
import type { Runner } from '@/api/interfaces';
import { useI18n } from 'vue-i18n';

/**
 * MAIN FUNCTION
 * Create an individual team.
 *
 * LOGIC
 * Get team data from form and create team with a WS call.
 *
 * EXCEPTIONS
 * - WS call fails -> Error alert
 */

/* Data */

const router = useRouter();
const route = useRoute();
const { t } = useI18n();

const eventId = route.params.eventId as string;
const raceId = route.params.raceId as string;
const availableDiscount = route.query.availableDiscount
  ? Math.round(parseInt(route.query.availableDiscount as string))
  : 0;
const raceName = route.query.raceName;

const alert = ref({
  type: 'error',
  text: '',
});

/* Methods */

async function subscribe(formRef: FormInstance | undefined, form: Runner) {
  if (!formRef) return;
  await formRef.validate(async (valid) => {
    if (valid) {
      try {
        const newTeam = await teamsApi.createIndividualRaceRegistration(
          parseInt(eventId),
          parseInt(raceId),
          form,
        );
        router.push({
          name: 'race-registrations',
          query: {
            messageType: 'success',
            messageText: t('teams.teamInserted', { msg: newTeam.id }),
          },
        });
      } catch (error) {
        alert.value = { type: 'error', text: t('api.generalError') };
      }
    }
  });
}
</script>

<template>
  <AppPageTitle
    :title="$t('teams.subscriptionTitle', { msg: raceName })"
    :subtitle="$t('teams.subscriptionSubtitle')"
    :back-to="{ name: 'races', params: { id: route.params.eventId } }"
  />
  <ElRow justify="center">
    <ElCol :xs="24" :sm="16" :md="12" :lg="8">
      <ElCard shadow="never">
        <template #header>
          <h2>{{ $t('teams.participantInfo') }}</h2>
        </template>
        <IndividualRaceRegistrationForm
          @subscribe="
            (formRef, form) => {
              subscribe(formRef, form);
            }
          "
          :discount="availableDiscount"
        />
      </ElCard>
    </ElCol>
  </ElRow>
</template>
