<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import { eventsApi } from '@/api/resources/events';
import type { RaceEvent, Race } from '@/api/resources/events';
import { useRoute } from 'vue-router';

const route = useRoute();

/* Data */

const eventId = route.params.id as string;
const event: Ref<RaceEvent> | Ref<null> = ref(null);
const loading = ref(true);
const races: Ref<Race[]> = ref(Array());

/* Methods */

async function getRaces() {
  try {
    event.value = await eventsApi.get(parseInt(eventId));
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
    <div v-if="event" style="text-align: center; margin-bottom: 2rem">
      <h1 style="margin-bottom: 0.5rem">Gare dell'evento "{{ event['name'] }}"</h1>
      <div>Elenco di tutte le gare relative all'evento corrente</div>
    </div>
    <ElRow justify="center" :gutter="20" v-loading="loading">
      <ElCol
        v-for="race in races"
        :key="`race-${race.id}`"
        :xs="20"
        :sm="12"
        :md="8"
        style="margin-bottom: 20px"
      >
        <ElCard shadow="hover">
          <h2 style="margin-bottom: 0">{{ race.type.name }}</h2>
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 1rem;
            "
          >
            <div>
              <div v-if="event">Inizio: {{ event['start_hour'] }}:00</div>
              <div>Durata: {{ race.type.duration / 60 }}h</div>
              <div>Corridori per squadra: {{ race.type.runners_per_team }}</div>
            </div>
            <div style="font-size: 1.25rem; font-weight: 300">{{ race.price }}€</div>
          </div>
          <ElButton
            @click="
              $router.push({
                name: 'subscribe',
                params: { eventId: event ? event['id'] : 0, raceId: race.id },
              })
            "
            title="Iscriviti alla gara"
            type="primary"
            style="margin-top: 1rem"
            >Iscriviti</ElButton
          >
        </ElCard>
      </ElCol>
    </ElRow>
  </div>
</template>
