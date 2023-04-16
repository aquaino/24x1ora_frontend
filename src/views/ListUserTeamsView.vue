<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import type { RaceEvent, Team } from '@/api/interfaces';
import { eventsApi } from '@/api/resources';
import AppPageTitle from '@/components/shared/AppPageTitle.vue';
import AppCard from '@/components/shared/AppCard.vue';
import { formatDateTime, formatDate } from '@/utils';
import { Ticket, TrophyBase } from '@element-plus/icons-vue';
import { teamsApi } from '@/api/resources';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';

/* Data */

const eventIds: Ref<number[]> = ref(Array());
const subscriptions: Ref<{ event: RaceEvent; teams: Team[] }[]> = ref(Array());
const loading = ref(true);
const route = useRoute();
const message = {
  type: route.query.messageType as 'success' | 'warning' | 'error' | 'info',
  text: route.query.messageText as string,
};

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

function showMessage() {
  ElMessage({
    type: message.type,
    showClose: true,
    dangerouslyUseHTMLString: true,
    message: message.text,
  });
}

/* Mounted */

onMounted(async () => {
  // Get user teams for each event
  await getEventIds();
  await getSubscriptions();

  if (message.type && message.text) {
    showMessage();
  }
});
</script>

<template>
  <AppPageTitle
    title="Iscrizioni attive"
    subtitle="Elenco di tutte le iscrizioni attive per ogni evento"
    :back-to="{ name: 'events' }"
  />

  <div v-if="loading" v-loading="loading"></div>
  <ElEmpty v-else-if="subscriptions.length === 0" description="Nessuna iscrizione inserita" />
  <div
    v-else
    v-for="subscription in subscriptions"
    :key="`subscription-${subscription.teams[0].id}`"
  >
    <div class="is-flex is-justify-center is-align-items-center is-margin-bottom-2">
      <ElIcon color="var(--el-color-primary)" size="24"><TrophyBase /></ElIcon>
      <h1 class="is-margin-left-05 is-margin-top-0">{{ subscription.event.name }}</h1>
    </div>
    <ElRow :justify="subscription.teams.length <= 3 ? 'center' : 'start'" :gutter="20">
      <ElCol
        v-for="team in subscription.teams"
        :key="`team-${team.id}`"
        :xs="24"
        :sm="12"
        :md="8"
        style="margin-bottom: 20px"
      >
        <AppCard shadow="hover" :title="`#${team.id} - ${team.name}`">
          <template #content>
            <div class="is-flex is-justify-space-between is-align-center">
              <ElDescriptions direction="vertical" :column="2">
                <ElDescriptionsItem label="Gara" width="150px">{{
                  team.type.name
                }}</ElDescriptionsItem>
                <ElDescriptionsItem label="Codice pagamento">{{
                  team.payment_code
                }}</ElDescriptionsItem>
                <ElDescriptionsItem label="Data">{{
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
                <div>{{ parseInt(team.price) - parseInt(team.discount) }}€</div>
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
