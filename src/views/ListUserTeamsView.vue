<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import type { RaceEvent } from '@/api/resources/events';
import type { Team } from '@/api/resources/teams';
import { eventsApi } from '@/api/resources/events';
import AppPageTitle from '@/components/shared/AppPageTitle.vue';
import AppCard from '@/components/shared/AppCard.vue';
import { formatDateTime, formatDate } from '@/utils';
import { Ticket } from '@element-plus/icons-vue';
import { teamsApi } from '@/api/resources/teams';

/* Data */
const eventIds: Ref<number[]> = ref(Array());
const subscriptions: Ref<{ event: RaceEvent; teams: Team[] }[]> = ref(Array());
const loading = ref(true);

/* Methods */
async function getEventIds() {
  try {
    const events = await eventsApi.getEvents();
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
      const eventAndTeams = await teamsApi.getEventTeams(eventIds.value[index]);
      subscriptions.value.push(eventAndTeams as { event: RaceEvent; teams: Team[] });
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
  <ElEmpty v-else-if="subscriptions.length === 0" description="Nessuna iscrizione inserita" />
  <div
    v-else
    v-for="subscription in subscriptions"
    :key="`subscription-${subscription.teams[0].id}`"
  >
    <h1 class="is-text-center is-margin-bottom-15">{{ subscription.event.name }}</h1>
    <ElRow justify="center" :gutter="20">
      <ElCol
        v-for="team in subscription.teams"
        :key="`team-${team.id}`"
        :xs="24"
        :sm="12"
        :md="8"
        style="margin-bottom: 20px"
      >
        <AppCard shadow="hover" :title="team.name">
          <template #content>
            <div class="is-flex is-justify-space-between is-align-center">
              <ElDescriptions direction="vertical" :column="2">
                <ElDescriptionsItem label="Gara" span="2">{{ team.type.name }}</ElDescriptionsItem>
                <ElDescriptionsItem label="Data" width="100px">{{
                  formatDate(subscription.event.date)
                }}</ElDescriptionsItem>
                <ElDescriptionsItem label="Partenza"
                  >{{
                    subscription.event.start_hour + team.type.start_offset
                  }}:00</ElDescriptionsItem
                >
                <ElDescriptionsItem label="Durata"
                  >{{ team.type.duration / 60 }}h</ElDescriptionsItem
                >
                <ElDescriptionsItem label="Inserita">{{
                  formatDateTime(team.created_at, 'ISO')
                }}</ElDescriptionsItem>
              </ElDescriptions>
              <div class="is-text-center" style="font-size: 1.25rem; font-weight: 300">
                <ElIcon size="32" color="var(--el-color-info-light-5)"><Ticket /></ElIcon>
                <div>{{ team.price }}€</div>
              </div>
            </div>
          </template>
          <template #footer>
            <div class="is-margin-top-05">
              <ElButton
                type="primary"
                title="Modifica iscrizione"
                @click="
                  $router.push({
                    name: 'update-subscription',
                    params: { eventId: subscription.event.id, teamId: team.id },
                    query: {
                      raceName: team.type.name,
                    },
                  })
                "
                >Modifica</ElButton
              >
              <ElButton type="danger" title="Elimina iscrizione" disabled>Elimina</ElButton>
            </div>
          </template>
        </AppCard>
      </ElCol>
    </ElRow>
  </div>
</template>
