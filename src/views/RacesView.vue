<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import AppPageTitle from '@/components/shared/AppPageTitle.vue';
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
    <AppPageTitle
      title="Gare dell'evento"
      subtitle="Elenco di tutte le gare relative all'evento corrente"
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
                params: {
                  eventId: event ? event['id'] : 0,
                  raceId: race.id,
                },
                query: {
                  raceName: race.type.name,
                },
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
    <div style="text-align: center">
      <ElButton
        @click="$router.push({ name: 'events' })"
        text
        style="margin-left: auto"
        title="Torna indietro"
        >Indietro</ElButton
      >
    </div>
  </div>
</template>
