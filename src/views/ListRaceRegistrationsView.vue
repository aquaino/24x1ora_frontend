<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import type { RaceEvent, Team } from '@/api/interfaces';
import { eventsApi } from '@/api/resources';
import AppPageTitle from '@/components/base/AppPageTitle.vue';
import { TrophyBase } from '@element-plus/icons-vue';
import { teamsApi } from '@/api/resources';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import { hasAttachment } from '@/utils';
import { useAppStore } from '@/store';
import { useI18n } from 'vue-i18n';
import TeamRegistrationCard from '@/components/ListRaceRegistrationsView/TeamRegistrationCard.vue';

/**
 * MAIN FUNCTION
 * Show all user teams.
 *
 * LOGIC
 * Display user teams for all events and allow to update them.
 *
 * EXCEPTIONS
 * Nothing to report.
 */

/* INTERFACES */

export interface TeamWithAttachmentStatus extends Team {
  medcertUploaded: boolean;
  paymentUploaded: boolean;
}

interface RaceRegistration extends Team {
  event: RaceEvent;
  teams: TeamWithAttachmentStatus[];
}

/* DATA */

const eventIds: Ref<number[]> = ref(Array());
const registrations: Ref<RaceRegistration[]> = ref(Array());

const loading = ref(true);

const route = useRoute();
const store = useAppStore();
const { t } = useI18n();

const message = ref({
  type: route.query.messageType as 'success' | 'warning' | 'error' | 'info',
  text: route.query.messageText as string,
});

const alert = ref({
  type: 'error',
  text: '',
});

/* METHODS */

async function getEventIds() {
  try {
    const events = await eventsApi.getEvents();
    eventIds.value = (events as RaceEvent[]).map((event: RaceEvent) => {
      return event.id;
    });
  } catch (error) {
    alert.value.text = t('api.generalError');
  }
}

async function getSubscriptions() {
  try {
    for (let index = 0; index < eventIds.value.length; index++) {
      const eventAndTeams = await teamsApi.getEventTeams(eventIds.value[index]);
      registrations.value.push(eventAndTeams as RaceRegistration);
    }
    registrations.value.forEach((subscription) => {
      subscription.teams.forEach((team: any) => {
        team['medcertUploaded'] = hasAttachment(/medcert.*/, team.attachments);
        team['paymentUploaded'] = hasAttachment(/payment.*/, team.attachments);
      });
    });
  } catch (error) {
    alert.value.text = t('api.generalError');
  }
}

function showMessage() {
  if (message.value.type && message.value.text) {
    ElMessage({
      type: message.value.type,
      showClose: true,
      dangerouslyUseHTMLString: true,
      message: message.value.text,
    });
  }
}

async function reFetchRegistrations(teamId: number) {
  loading.value = true;
  await getEventIds();
  await getSubscriptions();
  loading.value = false;
  message.value = {
    type: 'success',
    text: t('teams.teamConfirmed', { msg: teamId }),
  };
}

/* MOUNTED */

onMounted(async () => {
  // Get user teams for each event
  if (store.user.email_verified_at) {
    await getEventIds();
    await getSubscriptions();
  }
  loading.value = false;
});

/* WATCH */

watch(
  message,
  () => {
    showMessage();
  },
  { immediate: true },
);
</script>

<template>
  <AppPageTitle
    :title="$t('teams.teamsTitle')"
    :subtitle="$t('teams.teamsSubtitle')"
    :back-to="{ name: 'events' }"
  />
  <div v-if="loading" v-loading="loading"></div>
  <ElEmpty
    v-else-if="registrations.length === 0 || registrations[0].teams.length === 0"
    :description="$t('teams.noTeams')"
  />
  <div v-else>
    <ElRow v-if="alert.text" justify="center">
      <ElCol :xs="24" :sm="16" :md="14" :lg="10" class="is-margin-bottom-15">
        <ElAlert type="error" show-icon :closable="false" :title="alert.text" />
      </ElCol>
    </ElRow>
    <div v-for="registration in registrations" :key="`registration-${registration.teams[0].id}`">
      <div class="is-flex is-justify-center is-align-center is-margin-bottom-20">
        <ElIcon color="var(--el-color-primary)" size="32"><TrophyBase /></ElIcon>
        <h2 class="is-margin-left-05 is-margin-top-0" style="line-height: 32px">
          {{ registration.event.name }}
        </h2>
      </div>
      <ElRow :justify="registration.teams.length <= 3 ? 'center' : 'start'" :gutter="20">
        <ElCol
          v-for="team in registration.teams"
          :key="`team-${team.id}`"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <TeamRegistrationCard
            :team="team"
            :event="registration.event"
            @team-confirmed="
              (teamId) => {
                reFetchRegistrations(teamId);
              }
            "
            @error="alert.text = t('api.generalError')"
            :individual="team.type.class[0] === 'i'"
          />
        </ElCol>
      </ElRow>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-progress__text) {
  min-width: unset;
}

:deep(.el-progress__text) {
  font-size: 18px !important;
}
</style>
