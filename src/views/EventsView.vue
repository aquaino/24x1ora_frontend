<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import AppPageTitle from '@/components/shared/AppPageTitle.vue';
import { eventsApi } from '@/api/resources/events';
import type { RaceEvent } from '@/api/resources/events';
import { formatDateTime } from '@/utils';

/* Data */

const loading = ref(true);
const events: Ref<RaceEvent[]> = ref(Array());

/* Methods */

async function getEvents() {
  try {
    events.value = await eventsApi.get();
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

  <ElRow justify="center" :gutter="20" v-loading="loading">
    <ElCol
      v-for="event in events"
      :key="`event-${event.id}`"
      :xs="20"
      :sm="12"
      :md="8"
      style="margin-bottom: 20px"
    >
      <ElCard :body-style="{ padding: '0px' }" shadow="hover">
        <img
          src="partenza_2019.jpg"
          alt="Partenza edizione 2019"
          style="width: 100%; display: block"
        />
        <div style="padding: 20px">
          <div>
            <h2 style="margin-bottom: 0">{{ event.name }}</h2>
            <div>{{ formatDateTime(event.date) }}</div>
          </div>
          <div style="margin-top: 1rem">
            <div>
              Inizio iscrizioni:
              {{
                event.subscription_from ? formatDateTime(event.subscription_from) : 'Non definito'
              }}
            </div>
            <div>
              Termine iscrizioni:
              {{ event.subscription_to ? formatDateTime(event.subscription_to) : 'Non definito' }}
            </div>
          </div>
          <ElButton
            @click="$router.push({ name: 'races', params: { id: event.id } })"
            title="Visualizza le gare dell'evento"
            type="primary"
            style="margin-top: 1rem"
            >Visualizza gare</ElButton
          >
        </div>
      </ElCard>
    </ElCol>
  </ElRow>
</template>
