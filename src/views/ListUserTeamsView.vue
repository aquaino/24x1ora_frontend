<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import type { RaceEvent, Team } from '@/api/interfaces';
import { eventsApi } from '@/api/resources';
import AppPageTitle from '@/components/base/AppPageTitle.vue';
import AppCard from '@/components/base/AppCard.vue';
import { formatDateTime } from '@/utils';
import { Ticket, TrophyBase, Document, Money } from '@element-plus/icons-vue';
import { teamsApi } from '@/api/resources';
import { ElMessage } from 'element-plus';
import { useRoute } from 'vue-router';
import { hasAttachment } from '@/utils';
import { useUserStore } from '@/stores/user';

/**
 * FUNCTION
 * List user teams.
 *
 * LOGIC
 * Display user teams for all events and allow him to update them.
 *
 * EXCEPTIONS
 * Nothing to report.
 */

/* Interfaces */

interface TeamExtended extends Team {
  medcertUploaded: boolean;
  paymentUploaded: boolean;
}

/* Data */

const eventIds: Ref<number[]> = ref(Array());
const subscriptions: Ref<{ event: RaceEvent; teams: TeamExtended[] }[]> = ref(Array());

const loading = ref(true);

const route = useRoute();
const userStore = useUserStore();

const message = {
  type: route.query.messageType as 'success' | 'warning' | 'error' | 'info',
  text: route.query.messageText as string,
};

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
      subscriptions.value.push(eventAndTeams as { event: RaceEvent; teams: TeamExtended[] });
    }
    subscriptions.value.forEach((subscription) => {
      subscription.teams.forEach((team: any) => {
        team['paymentUploaded'] = hasAttachment(/medcert.*/, team.attachments);
        team['medcertUploaded'] = hasAttachment(/payment.*/, team.attachments);
      });
    });
  } catch (error) {
    console.log(error);
  }
}

function showMessage() {
  ElMessage({
    type: message.type,
    showClose: true,
    dangerouslyUseHTMLString: true,
    message: message.text,
  });
}

/* Mounted */

onMounted(async () => {
  // Get user teams for each event
  if (userStore.user.email_verified_at) {
    await getEventIds();
    await getSubscriptions();
  }
  loading.value = false;

  if (message.type && message.text) {
    showMessage();
  }
});
</script>

<template>
  <AppPageTitle
    title="Iscrizioni attive"
    subtitle="Elenco di tutte le iscrizioni attive per ogni evento"
    :back-to="{ name: 'events' }"
  />
  <div v-if="loading" v-loading="loading"></div>
  <ElEmpty
    v-else-if="subscriptions.length === 0 || subscriptions[0].teams.length === 0"
    description="Nessuna iscrizione inserita"
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
                      ? 'Certificato medico caricato'
                      : 'Certificato medico non caricato'
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
                      ? 'Ricevuta di bonifico caricata'
                      : 'Ricevuta di bonifico non caricata'
                  "
                  style="margin-left: 0.25rem"
                  ><Money
                /></ElIcon>
              </div>
            </template>
            <template #content>
              <ElProgress
                :percentage="
                  !team.medcertUploaded && !team.paymentUploaded
                    ? 33
                    : !(team.medcertUploaded && team.paymentUploaded)
                    ? 67
                    : 100
                "
                :status="
                  !team.medcertUploaded && !team.paymentUploaded
                    ? 'exception'
                    : !(team.medcertUploaded && team.paymentUploaded)
                    ? 'warning'
                    : 'success'
                "
                :stroke-width="10"
                :title="
                  !team.medcertUploaded && !team.paymentUploaded
                    ? 'Caricare certificato medico e ricevuta di bonifico'
                    : !team.medcertUploaded && team.paymentUploaded
                    ? 'Caricare certificato medico'
                    : team.medcertUploaded && !team.paymentUploaded
                    ? 'Caricare ricevuta di pagamento'
                    : 'Tutti i dati sono stati inseriti'
                "
                class="is-width-100 is-margin-bottom-10"
              />
              <div class="is-flex is-justify-space-between is-align-center">
                <ElDescriptions direction="vertical" :column="2">
                  <ElDescriptionsItem label="Gara" width="150px">{{
                    team.type.name
                  }}</ElDescriptionsItem>
                  <ElDescriptionsItem label="Codice pagamento">{{
                    team.payment_code
                  }}</ElDescriptionsItem>
                  <ElDescriptionsItem label="Data">{{
                    formatDateTime(subscription.event.date, 'yyyy-MM-dd hh:mm:ss', 'DATE_SHORT')
                  }}</ElDescriptionsItem>
                  <ElDescriptionsItem label="Partenza"
                    >{{
                      subscription.event.start_hour + team.type.start_offset
                    }}:00</ElDescriptionsItem
                  >
                  <ElDescriptionsItem label="Durata"
                    >{{ team.type.duration / 60 }} ore</ElDescriptionsItem
                  >
                  <ElDescriptionsItem label="Inserita">{{
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
                <ElCollapseItem title="Dettagli pagamento">
                  <div class="is-margin-bottom-10">Pagamento tramite bonifico bancario</div>
                  <ElDescriptions direction="horizontal" :column="1">
                    <ElDescriptionsItem label="IBAN"
                      >IT 59 O 05484 63690 CC0270704537</ElDescriptionsItem
                    >
                    <ElDescriptionsItem label="Intestato a"
                      >Circolo Culturale del Gruppo Alpini di Buttrio APS</ElDescriptionsItem
                    >
                    <ElDescriptionsItem label="Causale"
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
                  title="Modifica iscrizione"
                  @click="
                    $router.push({
                      name: 'update-subscription',
                      params: { eventId: subscription.event.id, teamId: team.id },
                      query: {
                        raceName: team.type.name,
                      },
                    })
                  "
                  >Modifica</ElButton
                >
                <ElButton type="danger" title="Elimina iscrizione" disabled>Elimina</ElButton>
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
