<script setup lang="ts">
import { ref } from 'vue';
import AppPageTitle from '@/components/shared/AppPageTitle.vue';
import { useRoute } from 'vue-router';
import type { FormInstance } from 'element-plus';
import { resetForm } from '@/utils';
import { eventsApi } from '@/api/resources/events';
import SubscriptionForm from '@/components/subscriptions/SubscriptionForm.vue';
import type { Runner } from '@/api/resources/teams';

const route = useRoute();

/* Data */

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
        await eventsApi.subscribe(parseInt(eventId), parseInt(raceId), form);
        resetForm(formRef);
        alert.value = { type: 'success', text: 'Iscrizione effettuata con successo.' };
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
    <ElCol :xs="20" :sm="16" :md="12">
      <ElCard shadow="never">
        <template #header>
          <h2>Informazioni partecipante</h2>
        </template>
        <SubscriptionForm
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
