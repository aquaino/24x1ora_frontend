<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import { eventsApi } from '@/api/resources/events';
import type { Event } from '@/api/resources/events';

/* Data */

const events: Ref<Event[]> = ref(Array());

/* Methods */

async function getEvents() {
  try {
    events.value = await eventsApi.get();
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
  <div style="text-align: center; margin-bottom: 2rem">
    <h1>Tutti gli eventi di gara</h1>
  </div>
  <ElRow justify="center" :gutter="20">
    <ElCol v-for="event in events" :key="`event-${event.id}`" :xs="20" :sm="12" :md="8">
      <ElCard :body-style="{ padding: '0px' }" shadow="hover">
        <img
          src="partenza_2019.jpg"
          alt="Partenza edizione 2019"
          style="width: 100%; display: block"
        />
        <div style="padding: 14px">
          <h2>{{ event.name }}</h2>
        </div>
      </ElCard>
    </ElCol>
  </ElRow>
</template>
