<script setup lang="ts">
import { ref } from 'vue';
import TeamInfoStep from '@/components/multipleTeams/TeamInfoStep.vue';
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

const raceName = route.query.raceName;

const step = ref(0);
const currentStepCompleted = ref(false);
const team: Team = Object();
</script>

<template>
  <AppPageTitle
    :title="$t('teams.subscriptionTitle', { msg: raceName })"
    :subtitle="$t('teams.multipleSubscriptionSubtitle')"
    :back-to="{ name: 'races' }"
  />
  <!-- Steps header -->
  <ElSteps :active="step" align-center class="is-margin-top-30">
    <ElStep title="Informazioni squadra" />
    <ElStep title="Inserimento corridori" />
    <ElStep title="Conferma iscrizione" />
  </ElSteps>
  <!-- Steps content -->
  <ElRow justify="center" class="is-margin-top-25 is-margin-bottom-15">
    <TeamInfoStep
      v-if="step === 0"
      @step-completed="
        (completed, form) => {
          currentStepCompleted = completed;
          completed ? (team.name = form.name) : (team = form);
        }
      "
    />
    <div v-else-if="step === 1">Step 2</div>
    <div v-else>Step 3</div>
  </ElRow>
  <!-- Steps navigation -->
  <ElRow justify="center">
    <ElCol :span="18" class="is-margin-top-15">
      <ElButton @click="step--">Indietro</ElButton>
      <ElButton type="primary" @click="step++" :disabled="!currentStepCompleted">Avanti</ElButton>
    </ElCol>
  </ElRow>
</template>
