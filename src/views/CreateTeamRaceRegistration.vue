<script setup lang="ts">
import { ref } from 'vue';
import TeamDataStep from '@/components/CreateTeamRaceRegistration/TeamDataStep.vue';
import TeamRunnersStep from '@/components/CreateTeamRaceRegistration/TeamRunnersStep.vue';
import TeamConfirmStep from '@/components/CreateTeamRaceRegistration/TeamConfirmStep.vue';
import type { Team } from '@/api/interfaces';
import AppPageTitle from '@/components/base/AppPageTitle.vue';
import { useRoute } from 'vue-router';

/**
 * MAIN FUNCTION
 * Create a team with multiple runners.
 *
 * LOGIC
 * Get team and runners from steps and create team with a WS call.
 * 1. Input team name
 * 2. Compose team with runners
 * 3. Confirm team
 *
 * EXCEPTIONS
 * - WS call fails -> Error alert
 */

/* Data */

const route = useRoute();

const currentStep = ref({
  index: 0,
  completed: false,
});
const totalSteps = 3;

const raceName = route.query.raceName;
const team: Team = Object();
</script>

<template>
  <AppPageTitle
    :title="$t('teams.subscriptionTitle', { msg: raceName })"
    :subtitle="$t('teams.multipleSubscriptionSubtitle')"
    :back-to="{ name: 'races', params: { id: route.params.eventId } }"
  />
  <!-- Steps header -->
  <ElSteps :active="currentStep.index" align-center class="is-margin-top-30">
    <ElStep :title="$t('teams.teamInfo')" />
    <ElStep :title="$t('teams.runnersInfo')" />
    <ElStep :title="$t('general.confirm')" />
  </ElSteps>
  <!-- Steps content -->
  <ElRow justify="center" :gutter="20" class="is-margin-top-25 is-margin-bottom-15">
    <TeamDataStep
      v-if="currentStep.index === 0"
      @step-completed="
        (completed, input) => {
          currentStep.completed = completed;
          team.name = input.name;
        }
      "
    />
    <TeamRunnersStep
      v-if="currentStep.index === 1"
      @step-completed="
        (completed, input) => {
          currentStep.completed = completed;
          team.runners = input.runners;
        }
      "
    />
    <TeamConfirmStep v-if="currentStep.index === totalSteps - 1" />
  </ElRow>
  <!-- Steps navigation -->
  <ElRow justify="center" class="is-margin-top-15">
    <ElCol :xs="24" :sm="22" :md="20" class="is-flex is-justify-space-between">
      <ElButton @click="currentStep.index--" v-if="currentStep.index !== 0">{{
        $t('general.back')
      }}</ElButton>
      <ElButton
        v-if="currentStep.index !== totalSteps - 1"
        type="primary"
        @click="
          currentStep.index++;
          currentStep.completed = false;
        "
        :class="currentStep.index === 0 ? 'is-margin-left-auto' : ''"
        :disabled="!currentStep.completed"
        >{{ $t('general.next') }}</ElButton
      >
    </ElCol>
  </ElRow>
</template>
