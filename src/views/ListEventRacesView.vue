<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import AppPageTitle from '@/components/shared/AppPageTitle.vue';
import { eventsApi } from '@/api/resources';
import type { Race, RaceEventDetails } from '@/api/interfaces';
import { useRoute } from 'vue-router';
import AppCard from '@/components/shared/AppCard.vue';
import { formatDate } from '@/utils';
import { Ticket } from '@element-plus/icons-vue';

const route = useRoute();

/* Data */

const eventId = route.params.id as string;
const event: Ref<RaceEventDetails> = ref(Object());
const loading = ref(true);
const races: Ref<Race[]> = ref(Array());
const eventName = route.query.eventName;

/* Methods */

async function getRaces() {
  try {
    event.value = await eventsApi.getEventDetails(parseInt(eventId));
    races.value = event.value.races;
    loading.value = false;
  } catch (error) {
    console.log(error);
  }
}

/* Mounted */
onMounted(async () => {
  await getRaces();
});
</script>

<template>
  <div>
    <AppPageTitle
      :title="'Gare dell\'evento ' + `&quot;${eventName}&quot;`"
      subtitle="Elenco di tutte le gare relative all'evento corrente"
      :back-to="{ name: 'events' }"
    />

    <ElEmpty v-if="races.length === 0 && !loading" description="Nessuna gara disponibile" />
    <ElRow
      v-else
      :justify="races.length <= 4 ? 'center' : 'start'"
      :gutter="20"
      v-loading="loading"
    >
      <ElCol v-for="race in races" :key="`race-${race.id}`" :xs="24" :sm="12" :md="8" :lg="6">
        <AppCard shadow="hover" :title="race.type.name">
          <template #content>
            <div class="is-flex is-justify-space-between is-align-center">
              <ElDescriptions direction="vertical" :column="2">
                <ElDescriptionsItem label="Data" width="100px">{{
                  formatDate(event['date'])
                }}</ElDescriptionsItem>
                <ElDescriptionsItem label="Partenza"
                  >{{ event['start_hour'] + race['type']['start_offset'] }}:00</ElDescriptionsItem
                >
                <ElDescriptionsItem label="Durata"
                  >{{ race.type.duration / 60 }}h</ElDescriptionsItem
                >
                <ElDescriptionsItem label="Corridori per squadra">{{
                  race.type.runners_per_team
                }}</ElDescriptionsItem>
              </ElDescriptions>
              <div class="is-text-center" style="font-size: 20px; font-weight: 300">
                <ElIcon size="32" color="var(--el-color-info-light-5)"><Ticket /></ElIcon>
                <div>{{ race.price }}€</div>
              </div>
            </div>
          </template>
          <template #footer>
            <ElButton
              @click="
                $router.push({
                  name: 'subscribe',
                  params: {
                    eventId: event['id'],
                    raceId: race.id,
                  },
                  query: {
                    raceName: race.type.name,
                    availableDiscount: race.available_discount,
                  },
                })
              "
              title="Iscriviti alla gara"
              type="primary"
              >Iscriviti</ElButton
            >
          </template>
        </AppCard>
      </ElCol>
    </ElRow>
  </div>
</template>
