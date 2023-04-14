<script setup lang="ts">
import { ref } from 'vue';
import AppPageTitle from '@/components/shared/AppPageTitle.vue';
import { useRoute } from 'vue-router';
import type { FormInstance } from 'element-plus';
import { resetForm } from '@/utils';
import SubscriptionForm from '@/components/subscriptions/SubscriptionForm.vue';
import { teamsApi, type RunnerUpdate } from '@/api/resources/teams';

const route = useRoute();

/* Data */

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
        await teamsApi.update(eventId, teamId, form);
        resetForm(formRef);
        alert.value = { type: 'success', text: 'Iscrizione modificata con successo.' };
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
    <ElCol :xs="20" :sm="16" :md="12">
      <ElCard shadow="never">
        <template #header>
          <h2>Informazioni partecipante</h2>
        </template>
        <SubscriptionForm
          update
          :event-id="eventId"
          :team-id="teamId"
          @update-subscription="
            (formRef, form) => {
              updateSubscription(formRef, form);
            }
          "
          :alert="alert"
          :discount="availableDiscount"
        />
      </ElCard>
    </ElCol>
  </ElRow>
</template>
