<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import AppPageTitle from '@/components/shared/AppPageTitle.vue';
import { eventsApi } from '@/api/resources/events';
import type { RaceEvent, Race } from '@/api/resources/events';
import { useRoute } from 'vue-router';
import AppCard from '@/components/shared/AppCard.vue';
import { formatDate } from '@/utils';

const route = useRoute();

/* Data */

const eventId = route.params.id as string;
const event: Ref<RaceEvent> | Ref<null> = ref(null);
const loading = ref(true);
const races: Ref<Race[]> = ref(Array());

/* Methods */

async function getRaces() {
  try {
    event.value = (await eventsApi.get(parseInt(eventId))) as RaceEvent;
    races.value = event.value ? event.value.races : [];
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
      title="Gare dell'evento"
      subtitle="Elenco di tutte le gare relative all'evento corrente"
      :back-to="{ name: 'events' }"
    />

    <ElRow justify="center" :gutter="20" v-loading="loading">
      <ElCol
        v-for="race in races"
        :key="`race-${race.id}`"
        :xs="20"
        :sm="12"
        :md="6"
        style="margin-bottom: 20px"
      >
        <AppCard shadow="hover" :smaller-title="race.type.name">
          <template #content>
            <div style="display: flex; justify-content: space-between; align-items: center">
              <div>
                <div v-if="event">
                  <div>
                    Data:
                    {{ formatDate(event['date']) }}
                  </div>
                  <div>Partenza: {{ event['start_hour'] + race['type']['start_offset'] }}:00</div>
                </div>
                <div>Durata: {{ race.type.duration / 60 }}h</div>
                <div>Corridori per squadra: {{ race.type.runners_per_team }}</div>
              </div>
              <div style="font-size: 1.25rem; font-weight: 300">{{ race.price }}€</div>
            </div>
          </template>
          <template #footer>
            <ElButton
              @click="
                if (event) {
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
                  });
                }
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
