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

const tableView: Ref<boolean> = ref(store.user.isAdmin!);

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
  <div v-if="loading"></div>
  <ElEmpty v-else-if="teams && teams.length === 0" :description="$t('teams.noTeams')" />
  <div v-else>
    <ElRow v-if="alert.text" justify="center">
      <ElCol :xs="24" :sm="16" :md="14" :lg="10">
        <ElAlert type="error" show-icon :closable="false" :title="alert.text" />
      </ElCol>
    </ElRow>
    <ElRow justify="space-between" :gutter="20" class="is-align-center is-margin-bottom-05">
      <ElCol :xs="24" :sm="12" :md="8" :lg="6" style="margin-bottom: 0 !important">
        <ElFormItem :label="$t('general.event')">
          <ElSelect
            :placeholder="$t('forms.selectPlaceholder')"
            v-model="currentEvent!.id"
            @change="
        (value: number) => {
          getEventTeams(value);
        }
      "
            class="is-width-100"
          >
            <ElOption
              v-for="event in events"
              :key="`event-${event.id}`"
              :label="event.name"
              :value="event.id"
            />
          </ElSelect>
        </ElFormItem>
      </ElCol>
      <ElCol
        :xs="24"
        :sm="12"
        :md="8"
        :lg="6"
        class="is-flex is-align-center"
        style="justify-content: end"
      >
        <ElSwitch
          v-model="tableView"
          :active-text="$t('general.tableView')"
          class="is-margin-right-10"
        />
        <div
          v-if="teams && teams.length > 0"
          style="color: var(--el-text-color-regular)"
          class="is-margin-left-auto-mobile"
        >
          {{ $t('teams.registrationsCount', { msg: teams.length }, teams.length) }}
        </div>
      </ElCol>
    </ElRow>
    <component
      :is="store.user.isAdmin && tableView ? RegistrationsAsTable : RegistrationsAsCards"
      :teams="teams!"
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
      @error="alert.text = t('api.generalError')"
    />
  </div>
  <!-- </div> -->
</template>

<style scoped>
@media screen and (max-width: 768px) {
  .is-margin-left-auto-mobile {
    margin-left: auto;
  }
}
</style>
