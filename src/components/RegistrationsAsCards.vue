<script setup lang="ts">
import type { RaceEvent } from '@/api/interfaces';
import RegistrationCard from '@/components/RegistrationCard.vue';
import type { TeamWithAttachmentStatus } from '@/views/ListRegistrationsView.vue';

/* PROPS */

const props = defineProps<{
  event: RaceEvent;
  teams: TeamWithAttachmentStatus[];
}>();

/* EVENTS */

const emits = defineEmits(['team-confirmed', 'team-deleted', 'error']);
</script>

<template>
  <ElRow :justify="props.teams!.length <= 3 ? 'center' : 'start'" :gutter="20">
    <ElCol v-for="team in props.teams" :key="`team-${team.id}`" :xs="24" :sm="12" :md="8" :lg="6">
      <RegistrationCard
        :team="team"
        :event="props.event!"
        @team-confirmed="emits('team-confirmed', team.id)"
        @team-deleted="emits('team-deleted', team.id)"
        @error="emits('error')"
        :individual="team.type.class[0] === 'i'"
      />
    </ElCol>
  </ElRow>
</template>
