<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import type { RaceEvent, Team } from '@/api/interfaces';
import { eventsApi } from '@/api/resources';
import AppPageTitle from '@/components/base/AppPageTitle.vue';
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

/* DATA */

const events: Ref<RaceEvent[] | null> = ref(null);
const currentEvent: Ref<RaceEvent | null> = ref(null);
const teams: Ref<TeamWithAttachmentStatus[] | null> = ref(null);

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
    if (events.value && events.value.length > 0) {
      currentEvent.value = events.value[events.value.length - 1];
      await getEventTeams(currentEvent.value.id);
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
    teams.value = eventAndTeams.teams.map((team: any) => {
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

async function refreshAndNotify(teamId: number, action: string) {
  await getEventTeams(currentEvent.value!.id);
  if (action === 'confirm') {
    message.value = {
      type: 'success',
      text: t('teams.teamConfirmed', { msg: teamId }),
    };
  } else if (action === 'delete') {
    message.value = {
      type: 'error',
      text: t('teams.teamDeleted'),
    };
  }
  loading.value = false;
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
  <ElEmpty v-else-if="teams && teams.length === 0" :description="$t('teams.noTeams')" />
  <div v-else>
    <ElRow v-if="alert.text" justify="center">
      <ElCol :xs="24" :sm="16" :md="14" :lg="10">
        <ElAlert type="error" show-icon :closable="false" :title="alert.text" />
      </ElCol>
    </ElRow>
    <ElRow justify="space-between" :gutter="20" class="is-align-center is-margin-bottom-05">
      <ElCol :xs="24" :sm="12" :md="8" :lg="6" style="margin-bottom: 0 !important">
        <ElSelect
          :placeholder="$t('forms.selectPlaceholder')"
          v-model="currentEvent!.id"
          @change="
        (value: number) => {
          getEventTeams(value);
        }
      "
          class="is-margin-bottom-10 is-width-100"
        >
          <ElOption
            v-for="event in events"
            :key="`event-${event.id}`"
            :label="event.name"
            :value="event.id"
          />
        </ElSelect>
      </ElCol>
      <ElCol
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        class="is-text-right"
        style="margin-bottom: 0 !important"
      >
        <div
          v-if="teams && teams.length > 0"
          style="color: var(--el-text-color-regular)"
          class="is-margin-bottom-10"
        >
          {{ $t('teams.registrationsCount', { msg: teams.length }, teams.length) }}
        </div>
      </ElCol>
    </ElRow>
    <ElRow :justify="teams!.length <= 3 ? 'center' : 'start'" :gutter="20">
      <ElCol v-for="team in teams" :key="`team-${team.id}`" :xs="24" :sm="12" :md="8" :lg="6">
        <RegistrationCard
          :team="team"
          :event="currentEvent!"
          @team-confirmed="
            (teamId) => {
              refreshAndNotify(teamId, 'confirm');
            }
          "
          @team-deleted="
            (teamId) => {
              refreshAndNotify(teamId, 'delete');
            }
          "
          @error="alert.text = t('api.generalError')"
          :individual="team.type.class[0] === 'i'"
        />
      </ElCol>
    </ElRow>
  </div>
  <!-- </div> -->
</template>
