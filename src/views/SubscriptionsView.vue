<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import type { RaceEvent, Team } from '@/api/resources/events';
import { eventsApi } from '@/api/resources/events';
import AppPageTitle from '@/components/shared/AppPageTitle.vue';
import AppCard from '@/components/shared/AppCard.vue';
import { formatDateTime, formatDate } from '@/utils';
import { Ticket } from '@element-plus/icons-vue';

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
  <div v-else-if="subscriptions.length === 0" class="is-text-center">
    Nessuna iscrizione inserita
  </div>
  <div
    v-else
    v-for="subscription in subscriptions"
    :key="`subscription-${subscription.teams[0].id}`"
  >
    <h2 class="is-text-center" style="margin-bottom: 1.5rem">{{ subscription.event.name }}</h2>
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
            <div class="is-flex is-justify-space-between is-align-center">
              <div>
                <div>
                  Data:
                  {{ formatDate(subscription.event.date) }}
                </div>
                <div>
                  Partenza: {{}} {{ subscription.event.start_hour + team.type.start_offset }}:00
                </div>
                <div>Durata: {{ team.type.duration / 60 }}h</div>
              </div>
              <div class="is-text-center" style="font-size: 1.25rem; font-weight: 300">
                <ElIcon size="32" color="var(--el-color-info-light-5)"><Ticket /></ElIcon>
                <div>{{ team.price }}€</div>
              </div>
            </div>
            <div class="small-text">Inserita: {{ formatDateTime(team.created_at, 'ISO') }}</div>
          </template>
          <template #footer>
            <div class="is-margin-top-05">
              <ElButton type="primary" title="Modifica iscrizione">Modifica</ElButton>
              <ElButton type="danger" title="Elimina iscrizione" disabled>Elimina</ElButton>
            </div>
          </template>
        </AppCard>
      </ElCol>
    </ElRow>
  </div>
</template>
