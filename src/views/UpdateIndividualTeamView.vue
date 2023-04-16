<script setup lang="ts">
import { ref } from 'vue';
import AppPageTitle from '@/components/shared/AppPageTitle.vue';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance } from 'element-plus';
import IndividualTeamForm from '@/components/individualTeams/IndividualTeamForm.vue';
import { teamsApi } from '@/api/resources';
import type { RunnerUpdate } from '@/api/interfaces';
import AppCard from '@/components/shared/AppCard.vue';

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
</script>

<template>
  <AppPageTitle
    :title="`Modifica iscrizione alla gara &quot;${raceName}&quot;`"
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
          />
        </template>
      </AppCard>
    </ElCol>
  </ElRow>
</template>
