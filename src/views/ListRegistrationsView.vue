<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import type { RaceEvent, Team } from '@/api/interfaces';
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

const route = useRoute();
const store = useAppStore();
const { t } = useI18n();

/* DATA */

const events: Ref<RaceEvent[]> = ref([]);
const currentEvent: Ref<RaceEvent | null> = ref(null);
const teams: Ref<TeamWithAttachmentStatus[]> = ref([]);

const tableView: Ref<boolean> = ref(store.user.isAdmin!);

const loading: Ref<boolean> = ref(true);

const message = ref({
  type: route.query.messageType as 'success' | 'warning' | 'error' | 'info',
  text: route.query.messageText as string,
});

/* MOUNTED */

onMounted(async () => {
  if (store.user.email_verified_at) {
    await getEvents();
    if (events.value.length > 0) {
      currentEvent.value = events.value[events.value.length - 1];
      await getEventTeams(currentEvent.value.id);
    }
  }
});

/* METHODS */

async function getEvents() {
  loading.value = true;
  try {
    events.value = await eventsApi.getEvents();
  } catch (error) {
    store.setFeedback('error');
  }
  loading.value = false;
}

async function getEventTeams(eventId: number) {
  loading.value = true;
  try {
    const eventAndTeams = await teamsApi.getEventTeams(eventId);
    teams.value = eventAndTeams.teams.map((team: Team) => {
      return {
        ...team,
        medcertUploaded: hasAttachment(/medcert.*/, team.attachments),
        paymentUploaded: hasAttachment(/payment.*/, team.attachments),
      };
    });
  } catch (error) {
    store.setFeedback('error');
  }
  loading.value = false;
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
  <div v-if="loading"></div>
  <ElEmpty v-else-if="events.length === 0" :description="$t('events.noEvents')" />
  <ElEmpty v-else-if="teams.length === 0" :description="$t('teams.noTeams')" />
  <div v-else>
    <ElRow justify="space-between" align="middle" :gutter="20">
      <!-- Table view switch -->
      <ElCol :xs="14" :sm="12" :md="8" :lg="6">
        <ElSwitch
          v-model="tableView"
          :active-text="$t('general.tableView')"
          class="is-margin-right-10"
        />
      </ElCol>
      <!-- Teams counter -->
      <ElCol :xs="10" :sm="12" :md="8" :lg="6">
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
