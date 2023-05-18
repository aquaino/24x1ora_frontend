<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import AppPageTitle from '@/components/base/AppPageTitle.vue';
import TeamDataCard from '@/components/TeamDataCard.vue';
import RunnersDataCard from '@/components/RunnersDataCard.vue';
import type { Team } from '@/api/interfaces';
import { onMounted, ref, type Ref } from 'vue';
import { teamsApi } from '@/api/resources';
import { useI18n } from 'vue-i18n';

/* DATA */

const route = useRoute();
const eventId = parseInt(route.params.eventId as string);
const teamId = parseInt(route.params.teamId as string);
const raceName = route.query.raceName;

const router = useRouter();

const { t } = useI18n();

const team: Ref<Team | null> = ref(null);

const teamDataCardRef = ref();

const alert = ref({
  type: 'error',
  text: '',
});

/* METHODS */

async function updateTeam() {
  try {
    teamDataCardRef.value.uploadPaymentCertificate();
    await teamsApi.updateTeam(eventId, teamId, team.value as Team);
    router.push({
      name: 'race-registrations',
      query: {
        messageType: 'success',
        messageText: t('teams.teamUpdated', { msg: teamId }),
      },
    });
  } catch (error) {
    alert.value = { type: 'error', text: t('api.generalError') };
  }
}

/* MOUNTED */

onMounted(async () => {
  try {
    const eventAndTeam = await teamsApi.getEventTeamDetails(eventId, teamId);
    team.value = eventAndTeam.team;
  } catch (error) {
    alert.value = { type: 'error', text: t('api.generalError') };
  }
});
</script>

<template>
  <AppPageTitle
    :title="$t('teams.updateTeamTitle', { msg1: teamId, msg2: raceName })"
    :subtitle="$t('teams.updateTeamSubtitle')"
    :back-to="{ name: 'race-registrations' }"
  />
  <ElRow v-if="team" justify="center" :gutter="20">
    <ElCol :xs="24" :sm="8" :md="8">
      <TeamDataCard
        ref="teamDataCardRef"
        :team="team"
        @data-updated="
          (basicTeamData) => {
            team!.name = basicTeamData.name;
            team!.manager = basicTeamData.manager;
            team!.manager_cell = basicTeamData.manager_cell;
          }
        "
      />
    </ElCol>
    <ElCol :xs="24" :sm="16" :md="16">
      <RunnersDataCard
        :team="team"
        @data-updated="
          (runnersData) => {
            team!.runners = runnersData;
          }
        "
      />
    </ElCol>
  </ElRow>
  <ElRow>
    <ElButton
      type="success"
      native-type="submit"
      :title="$t('teams.confirmEnrollment')"
      @click.prevent="updateTeam()"
      >{{ $t('general.confirm') }}
    </ElButton>
    <ElAlert
      v-if="alert.text"
      type="error"
      show-icon
      :closable="false"
      :title="alert.text"
      class="is-margin-top-15"
    />
  </ElRow>
</template>
