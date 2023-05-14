<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import type { Ref } from 'vue';
import type { RaceEvent, Team } from '@/api/interfaces';
import { eventsApi } from '@/api/resources';
import AppPageTitle from '@/components/base/AppPageTitle.vue';
import AppCard from '@/components/base/AppCard.vue';
import { formatDateTime } from '@/utils';
import { Ticket, TrophyBase, Document, Money } from '@element-plus/icons-vue';
import { teamsApi } from '@/api/resources';
import { ElMessage, ElPopconfirm } from 'element-plus';
import { useRoute } from 'vue-router';
import { hasAttachment } from '@/utils';
import { useAppStore } from '@/store';
import { useI18n } from 'vue-i18n';

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

/* Interfaces */

interface TeamWithAttachmentStatus extends Team {
  medcertUploaded: boolean;
  paymentUploaded: boolean;
}

/* Data */

const eventIds: Ref<number[]> = ref(Array());
const subscriptions: Ref<{ event: RaceEvent; teams: TeamWithAttachmentStatus[] }[]> = ref(Array());

const loading = ref(true);

const route = useRoute();
const store = useAppStore();
const { t } = useI18n();

const message = ref({
  type: route.query.messageType as 'success' | 'warning' | 'error' | 'info',
  text: route.query.messageText as string,
});

/* Methods */

async function getEventIds() {
  try {
    const events = await eventsApi.getEvents();
    eventIds.value = (events as RaceEvent[]).map((event: RaceEvent) => {
      return event.id;
    });
  } catch (error) {
    console.log(error);
  }
}

async function getSubscriptions() {
  try {
    for (let index = 0; index < eventIds.value.length; index++) {
      const eventAndTeams = await teamsApi.getEventTeams(eventIds.value[index]);
      subscriptions.value.push(
        eventAndTeams as { event: RaceEvent; teams: TeamWithAttachmentStatus[] },
      );
    }
    subscriptions.value.forEach((subscription) => {
      subscription.teams.forEach((team: any) => {
        team['medcertUploaded'] = hasAttachment(/medcert.*/, team.attachments);
        team['paymentUploaded'] = hasAttachment(/payment.*/, team.attachments);
      });
    });
  } catch (error) {
    console.log(error);
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

function getTeamProgress(team: TeamWithAttachmentStatus): {
  percentage: Object;
  status: Object;
  title: string;
} {
  return !team.medcertUploaded && !team.paymentUploaded && !team.confirmed
    ? {
        percentage: 20,
        status: 'exception',
        title: t('teams.uploadMedcertAndPayment'),
      }
    : team.medcertUploaded && !team.paymentUploaded && !team.confirmed
    ? {
        percentage: 40,
        status: 'exception',
        title: t('teams.uploadPayment'),
      }
    : !team.medcertUploaded && team.paymentUploaded && !team.confirmed
    ? {
        percentage: 60,
        status: 'exception',
        title: t('teams.uploadMedcert'),
      }
    : team.medcertUploaded && team.paymentUploaded && !team.confirmed
    ? {
        percentage: 80,
        status: 'warning',
        title: t('teams.waitingForConfirmation'),
      }
    : {
        percentage: 100,
        status: 'success',
        title: t('teams.subscriptionConfirmed'),
      };
}

async function confirmTeam(eventId: number, teamId: number) {
  try {
    await teamsApi.confirmTeam(eventId, teamId);
    loading.value = true;
    await getEventIds();
    await getSubscriptions();
    loading.value = false;
    message.value = {
      type: 'success',
      text: t('teams.teamConfirmed', { msg: teamId }),
    };
  } catch (error) {
    console.log(error);
  }
}

/* Mounted */

onMounted(async () => {
  // Get user teams for each event
  if (store.user.email_verified_at) {
    await getEventIds();
    await getSubscriptions();
  }
  loading.value = false;
});

/* Watch */

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
    v-else-if="subscriptions.length === 0 || subscriptions[0].teams.length === 0"
    :description="$t('teams.noTeams')"
  />
  <div v-else>
    <div v-for="subscription in subscriptions" :key="`subscription-${subscription.teams[0].id}`">
      <div class="is-flex is-justify-center is-align-center is-margin-bottom-20">
        <ElIcon color="var(--el-color-primary)" size="32"><TrophyBase /></ElIcon>
        <h2 class="is-margin-left-05 is-margin-top-0" style="line-height: 32px">
          {{ subscription.event.name }}
        </h2>
      </div>
      <ElRow :justify="subscription.teams.length <= 3 ? 'center' : 'start'" :gutter="20">
        <ElCol
          v-for="team in subscription.teams"
          :key="`team-${team.id}`"
          :xs="24"
          :sm="12"
          :md="8"
        >
          <AppCard shadow="hover" :title="`#${team.id} - ${team.name}`">
            <template #right-header>
              <div class="is-flex">
                <ElIcon
                  size="24"
                  :color="
                    team.medcertUploaded ? 'var(--el-color-success)' : 'var(--el-color-error)'
                  "
                  :title="
                    team.medcertUploaded
                      ? $t('teams.medcertUploaded')
                      : $t('teams.medcertNotUploaded')
                  "
                  ><Document
                /></ElIcon>
                <ElIcon
                  size="24"
                  :color="
                    team.paymentUploaded ? 'var(--el-color-success)' : 'var(--el-color-error)'
                  "
                  :title="
                    team.paymentUploaded
                      ? $t('teams.paymentUploaded')
                      : $t('teams.paymentNotUploaded')
                  "
                  style="margin-left: 0.25rem"
                  ><Money
                /></ElIcon>
              </div>
            </template>
            <template #content>
              <ElProgress
                :percentage="getTeamProgress(team).percentage"
                :status="getTeamProgress(team).status"
                :stroke-width="10"
                :title="getTeamProgress(team).title"
                class="is-width-100 is-margin-bottom-10"
              />
              <div class="is-flex is-justify-space-between is-align-center">
                <ElDescriptions direction="vertical" :column="2">
                  <ElDescriptionsItem :label="$t('general.race')" width="150px">{{
                    team.type.name
                  }}</ElDescriptionsItem>
                  <ElDescriptionsItem :label="$t('teams.paymentCode')">{{
                    team.payment_code
                  }}</ElDescriptionsItem>
                  <ElDescriptionsItem :label="$t('general.date')">{{
                    formatDateTime(subscription.event.date, 'yyyy-MM-dd hh:mm:ss', 'DATE_SHORT')
                  }}</ElDescriptionsItem>
                  <ElDescriptionsItem :label="$t('general.start')"
                    >{{
                      subscription.event.start_hour + team.type.start_offset
                    }}:00</ElDescriptionsItem
                  >
                  <ElDescriptionsItem :label="$t('general.duration')"
                    >{{ team.type.duration / 60 }}
                    {{
                      team.type.duration / 60 === 1 ? $t('general.hour', 1) : $t('general.hour', 2)
                    }}</ElDescriptionsItem
                  >
                  <ElDescriptionsItem :label="$t('general.created')">{{
                    formatDateTime(team.created_at, 'ISO', 'DATETIME_SHORT')
                  }}</ElDescriptionsItem>
                </ElDescriptions>
                <div class="is-text-center" style="font-size: 20px; font-weight: 300">
                  <ElIcon size="32" color="var(--el-color-info-light-5)"><Ticket /></ElIcon>
                  <div>
                    <div v-if="parseInt(team.discount) > 0" style="text-decoration: line-through">
                      {{ parseInt(team.price) }}€
                    </div>
                    <div>{{ parseInt(team.price) - parseInt(team.discount) }}€</div>
                  </div>
                </div>
              </div>
              <ElCollapse>
                <ElCollapseItem :title="$t('teams.paymentDetails')">
                  <div class="is-margin-bottom-10">{{ $t('teams.viaBankTransfer') }}</div>
                  <ElDescriptions direction="horizontal" :column="1">
                    <ElDescriptionsItem label="IBAN"
                      >IT 59 O 05484 63690 CC0270704537</ElDescriptionsItem
                    >
                    <ElDescriptionsItem :label="$t('teams.registeredTo')"
                      >Circolo Culturale del Gruppo Alpini di Buttrio APS</ElDescriptionsItem
                    >
                    <ElDescriptionsItem :label="$t('teams.paymentCausal')"
                      >{{ team.payment_code }} {{ team.name }}
                      {{ team.type.name }}</ElDescriptionsItem
                    >
                  </ElDescriptions>
                </ElCollapseItem>
              </ElCollapse>
            </template>
            <template #footer>
              <div class="is-margin-top-05">
                <ElButton
                  type="primary"
                  :title="$t('teams.editTeam')"
                  @click="
                    $router.push({
                      name: 'update-subscription',
                      params: { eventId: subscription.event.id, teamId: team.id },
                      query: {
                        raceName: team.type.name,
                      },
                    })
                  "
                  >{{ $t('general.edit') }}</ElButton
                >
                <ElPopconfirm
                  v-if="
                    store.user.isAdmin &&
                    team.medcertUploaded &&
                    team.paymentUploaded &&
                    !team.confirmed
                  "
                  title="Confermare l'iscrizione?"
                  width="200"
                  confirm-button-text="Sì"
                  hide-icon
                  cancel-button-text="No"
                  @confirm="confirmTeam(subscription.event.id, team.id)"
                >
                  <template #reference>
                    <ElButton type="success" :title="$t('teams.confirmEnrollment')">{{
                      $t('general.confirm')
                    }}</ElButton>
                  </template>
                </ElPopconfirm>
              </div>
            </template>
          </AppCard>
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
