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
import RegistrationCard from '@/components/RegistrationCard.vue';

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

const events: Ref<RaceEvent[]> = ref(Array());
const currentEventId: Ref<number | null> = ref(null);

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

/* MOUNTED */

onMounted(async () => {
  if (store.user.email_verified_at) {
    await getEvents();
    if (events.value.length > 0) {
      currentEventId.value = events.value[events.value.length - 1].id;
      await getEventTeams(currentEventId.value);
    }
  }
  loading.value = false;
});

/* METHODS */

async function getEvents() {
  try {
    events.value = await eventsApi.getEvents();
  } catch (error) {
    alert.value.text = t('api.generalError');
  }
}

async function getEventTeams(eventId: number) {
  try {
    const eventAndTeams = await teamsApi.getEventTeams(eventId);
    registrations.value = eventAndTeams.teams.map((team: any) => {
      team['medcertUploaded'] = hasAttachment(/medcert.*/, team.attachments);
      team['paymentUploaded'] = hasAttachment(/payment.*/, team.attachments);
      return team;
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

async function refreshAndNotify(teamId: number) {
  await getEventTeams(currentEventId.value as number);
  message.value = {
    type: 'success',
    text: t('teams.teamConfirmed', { msg: teamId }),
  };
}

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
      <ElCol :xs="24" :sm="16" :md="14" :lg="10">
        <ElAlert type="error" show-icon :closable="false" :title="alert.text" />
      </ElCol>
    </ElRow>
    <ElSelect
      v-model="currentEventId"
      :placeholder="$t('forms.selectPlaceholder')"
      @change="
        (value: number) => {
          getEventTeams(value);
        }
      "
      class="is-width-100 is-margin-bottom-15"
    >
      <ElOption
        v-for="event in events"
        :key="`event-${event.id}`"
        :label="event.name"
        :value="event.id"
      />
    </ElSelect>
    <div v-for="registration in registrations" :key="`registration-${registration.teams[0].id}`">
      <!-- <div>
        <div class="is-flex is-justify-center is-align-center">
          <ElIcon color="var(--el-color-primary)" size="32"><TrophyBase /></ElIcon>
          <h2 class="is-margin-left-05 is-margin-top-0" style="line-height: 32px">
            {{ registration.event.name }}
          </h2>
        </div>
        <div
          v-if="registration.teams.length > 0"
          style="color: var(--el-text-color-regular)"
          class="is-text-center is-margin-bottom-10 is-margin-top-05"
        >
          {{
            $t(
              'teams.registrationsCount',
              { msg: registration.teams.length },
              registration.teams.length,
            )
          }}
        </div>
      </div> -->
      <ElRow :justify="registration.teams.length <= 3 ? 'center' : 'start'" :gutter="20">
        <ElCol
          v-for="team in registration.teams"
          :key="`team-${team.id}`"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
        >
          <RegistrationCard
            :team="team"
            :event="registration.event"
            @team-confirmed="
              (teamId) => {
                refreshAndNotify(teamId);
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
