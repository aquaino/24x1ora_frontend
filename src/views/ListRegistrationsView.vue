<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import type { RaceEvent, RaceEventDetails, Team } from '@/api/interfaces';
import { eventsApi } from '@/api/resources';
import AppPageTitle from '@/components/app/AppPageTitle.vue';
import { teamsApi } from '@/api/resources';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import { hasAttachment } from '@/utils';
import { useAppStore } from '@/store';
import { useI18n } from 'vue-i18n';
import RegistrationsAsCards from '@/components/RegistrationsAsCards.vue';
import RegistrationsAsTable from '@/components/RegistrationsAsTable.vue';
import type { TeamWithAttachmentStatus } from '@/components/interfaces';
import { DateTime } from 'luxon';

const route = useRoute();
const store = useAppStore();
const { t } = useI18n();

/* DATA */

const events: Ref<RaceEvent[]> = ref([]);
const currentEvent: Ref<RaceEventDetails | null> = ref(null);
const teams: Ref<TeamWithAttachmentStatus[]> = ref([]);

const selectedEventId: Ref<number | undefined> = ref(undefined);

const tableView: Ref<boolean> = ref(store.user.isAdmin!);

const loading: Ref<boolean> = ref(true);

const message = ref({
  type: route.query.messageType as 'success' | 'warning' | 'error' | 'info',
  text: route.query.messageText as string,
});

/* MOUNTED */

onMounted(async () => {
  if (store.user.email_verified_at) {
    try {
      await getEvents();
      if (events.value.length > 0) {
        setCurrentEvent();
        await getCurrentEventDetails();
        await getEventTeams(currentEvent.value!.id);
      }
    } catch (error) {
      store.setFeedback('error');
    }
    loading.value = false;
  }
});

/* METHODS */

async function getEvents() {
  events.value = await eventsApi.getEvents();
}

async function getEventTeams(eventId: number) {
  const eventAndTeams = await teamsApi.getEventTeams(eventId);
  teams.value = eventAndTeams.teams.map((team: Team) => {
    return {
      ...team,
      medcertUploaded: hasAttachment(/medcert.*/, team.attachments),
      paymentUploaded: hasAttachment(/payment.*/, team.attachments),
    };
  });
}

async function getCurrentEventDetails() {
  currentEvent.value = await eventsApi.getEventDetails(selectedEventId.value as number);
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
  loading.value = true;
  await getEventTeams(currentEvent.value!.id);
  loading.value = false;
  if (action === 'confirm') {
    message.value = {
      type: 'success',
      text: t('teams.teamConfirmed'),
    };
  } else if (action === 'delete') {
    message.value = {
      type: 'error',
      text: t('teams.teamDeleted'),
    };
  }
}

function setCurrentEvent() {
  let currentYear = DateTime.local().year;
  let currentEvent = events.value.find((event) => {
    return event.date.substring(0, 4) == currentYear;
  });
  if (currentEvent) {
    selectedEventId.value = currentEvent.id;
  } else {
    selectedEventId.value = events.value[events.value.length - 1].id;
  }
}

/* WATCH */

watch(
  message,
  () => {
    showMessage();
  },
  { immediate: true },
);

watch(selectedEventId, async () => {
  await getEventTeams(selectedEventId.value as number);
});
</script>

<template>
  <AppPageTitle
    :title="$t('teams.teamsTitle')"
    :subtitle="$t('teams.teamsSubtitle')"
    :back-to="{ name: 'events' }"
  />
  <div v-if="loading"></div>
  <ElEmpty v-else-if="events.length === 0" :description="$t('events.noEvents')" />
  <ElEmpty v-else-if="teams.length === 0" :description="$t('teams.noTeams')" />
  <div v-else>
    <ElRow justify="space-between" align="middle" :gutter="20">
      <ElCol :xs="14" :sm="12" :md="16">
        <!-- Event selection -->
        <ElSelect v-model="selectedEventId" placeholder="Evento" class="is-margin-right-10">
          <ElOption v-for="event in events" :key="event.id" :label="event.name" :value="event.id">
          </ElOption>
        </ElSelect>
        <!-- Table view switch -->
        <ElSwitch v-model="tableView" :active-text="$t('general.tableView')" />
      </ElCol>
      <!-- Teams counter -->
      <ElCol :xs="10" :sm="12" :md="8">
        <div
          v-if="teams.length > 0"
          style="color: var(--el-text-color-regular)"
          class="is-text-right"
        >
          {{ $t('teams.registrationsCount', { msg: teams.length }, teams.length) }}
        </div>
      </ElCol>
    </ElRow>
    <!-- Teams -->
    <component
      :is="store.user.isAdmin && tableView ? RegistrationsAsTable : RegistrationsAsCards"
      :teams="teams"
      :event="currentEvent!"
      @team-confirmed="
        (teamId: number) => {
          refreshAndNotify(teamId, 'confirm');
        }
      "
      @team-deleted="
        (teamId: number) => {
          refreshAndNotify(teamId, 'delete');
        }
      "
      @error="store.setFeedback('error')"
    />
  </div>
  <!-- </div> -->
</template>
