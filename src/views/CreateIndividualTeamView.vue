<script setup lang="ts">
import { ref } from 'vue';
import AppPageTitle from '@/components/base/AppPageTitle.vue';
import { useRoute, useRouter } from 'vue-router';
import type { FormInstance } from 'element-plus';
import { eventsApi } from '@/api/resources';
import IndividualTeamForm from '@/components/individualTeams/IndividualTeamForm.vue';
import type { Runner } from '@/api/interfaces';

/* Data */

const router = useRouter();
const route = useRoute();
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
        const newTeam = await eventsApi.subscribeIndividual(
          parseInt(eventId),
          parseInt(raceId),
          form,
        );
        alert.value = { type: 'success', text: 'Iscrizione effettuata con successo.' };
        router.push({
          name: 'subscriptions',
          query: {
            messageType: 'success',
            messageText: `Iscrizione <strong>#${newTeam.id}</strong> inserita con successo.`,
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
    :title="`Iscrizione alla gara &quot;${raceName}&quot;`"
    subtitle="Compila il form sottostante per iscriverti alla gara"
    :back-to="{ name: 'races', params: { id: route.params.eventId } }"
  />
  <ElRow justify="center">
    <ElCol :xs="24" :sm="16" :md="12">
      <ElCard shadow="never">
        <template #header>
          <h2>Informazioni partecipante</h2>
        </template>
        <IndividualTeamForm
          @subscribe="
            (formRef, form) => {
              subscribe(formRef, form);
            }
          "
          :alert="alert"
          :discount="availableDiscount"
        />
      </ElCard>
    </ElCol>
  </ElRow>
</template>
