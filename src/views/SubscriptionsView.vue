<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import type { RaceEvent, Team } from '@/api/resources/events';
import { eventsApi } from '@/api/resources/events';
import AppPageTitle from '@/components/shared/AppPageTitle.vue';
import AppCard from '@/components/shared/AppCard.vue';
import { formatDateTime, formatDate } from '@/utils';

/* Data */
const eventIds: Ref<number[]> = ref(Array());
const subscriptions: Ref<{ event: RaceEvent; teams: Team[] }[]> = ref(Array());
const loading = ref(true);

/* Methods */
async function getEventIds() {
  try {
    const events = await eventsApi.get();
    eventIds.value = (events as RaceEvent[]).map((event: RaceEvent) => {
      return event.id;
    });
  } catch (error) {
    console.log(error);
  }
}

async function getSubscriptions() {
  try {
    for (let index = 0; index < eventIds.value.length; index++) {
      const eventAndTeams = await eventsApi.getTeams(eventIds.value[index]);
      subscriptions.value.push(eventAndTeams);
    }

    loading.value = false;
  } catch (error) {
    console.log(error);
  }
}

/* Mounted */
onMounted(async () => {
  // Get subscriptions (teams) for each event
  await getEventIds();
  await getSubscriptions();
});
</script>

<template>
  <AppPageTitle
    title="Iscrizioni attive"
    subtitle="Elenco di tutte le iscrizioni attive"
    :back-to="{ name: 'events' }"
  />

  <div v-if="loading" v-loading="loading"></div>
  <div v-else-if="subscriptions.length === 0" style="text-align: center">
    Nessuna iscrizione inserita
  </div>
  <div
    v-else
    v-for="subscription in subscriptions"
    :key="`subscription-${subscription.teams[0].id}`"
  >
    <h2 style="text-align: center; margin-bottom: 1.5rem">{{ subscription.event.name }}</h2>
    <ElRow justify="center" :gutter="20">
      <ElCol
        v-for="team in subscription.teams"
        :key="`team-${team.id}`"
        :xs="20"
        :sm="12"
        :md="6"
        style="margin-bottom: 20px"
      >
        <AppCard shadow="hover" :title="team.name" :subtitle="team.type.name">
          <template #content>
            <div>
              Data:
              {{ formatDate(subscription.event.date) }}
            </div>
            <div>
              Partenza: {{}} {{ subscription.event.start_hour + team.type.start_offset }}:00
            </div>
            <div>Durata: {{ team.type.duration / 60 }}h</div>
          </template>
          <template #footer>
            <small>Inserita: {{ formatDateTime(team.created_at, 'ISO') }}</small>
          </template>
        </AppCard>
      </ElCol>
    </ElRow>
  </div>
</template>
