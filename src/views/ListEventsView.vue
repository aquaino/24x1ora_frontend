<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import AppPageTitle from '@/components/shared/AppPageTitle.vue';
import { eventsApi } from '@/api/resources/events';
import type { RaceEvent } from '@/api/resources/events';
import { formatDateTime } from '@/utils';
import AppCard from '@/components/shared/AppCard.vue';

/* Data */

const loading = ref(true);
const events: Ref<RaceEvent[]> = ref(Array());

/* Methods */

async function getEvents() {
  try {
    events.value = (await eventsApi.get()) as RaceEvent[];
    loading.value = false;
  } catch (error) {
    console.log(error);
  }
}

/* Mounted */
onMounted(async () => {
  await getEvents();
});
</script>

<template>
  <AppPageTitle title="Eventi" subtitle="Elenco di tutti gli eventi disponibili" />

  <ElEmpty v-if="events.length === 0 && !loading" description="Nessun evento disponibile" />
  <ElRow v-else justify="center" :gutter="20" v-loading="loading">
    <ElCol
      v-for="event in events"
      :key="`event-${event.id}`"
      :xs="20"
      :sm="12"
      :md="8"
      style="margin-bottom: 20px"
    >
      <AppCard
        image="partenza_2019.jpg"
        image-alt="Partenza edizione 2019"
        shadow="hover"
        :title="event.name"
        :subtitle="formatDateTime(event.date)"
      >
        <template #content>
          <div>
            Inizio iscrizioni:
            {{ event.subscription_from ? formatDateTime(event.subscription_from) : 'Non definito' }}
          </div>
          <div>
            Termine iscrizioni:
            {{ event.subscription_to ? formatDateTime(event.subscription_to) : 'Non definito' }}
          </div>
        </template>
        <template #footer>
          <ElButton
            @click="
              $router.push({
                name: 'races',
                params: { id: event.id },
                query: {
                  eventName: event.name,
                },
              })
            "
            title="Visualizza le gare dell'evento"
            type="primary"
            >Visualizza gare</ElButton
          >
        </template>
      </AppCard>
    </ElCol>
  </ElRow>
</template>
