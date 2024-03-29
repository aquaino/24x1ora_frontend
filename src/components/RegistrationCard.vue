<script setup lang="ts">
import AppCard from '@/components/app/AppCard.vue';
import { formatDateTime } from '@/utils';
import type { TeamWithAttachmentStatus } from './interfaces';
import { useI18n } from 'vue-i18n';
import { Ticket, Document, Money, EditPen, Delete, Check } from '@element-plus/icons-vue';
import { ElPopconfirm } from 'element-plus';
import { useAppStore } from '@/store';
import { teamsApi } from '@/api/resources';
import type { RaceEvent } from '@/api/interfaces';

/* INTERFACES */

export interface TeamStatus {
  type: string;
  text: string;
}

/* PROPS */

const props = defineProps<{
  team: TeamWithAttachmentStatus;
  event: RaceEvent;
  individual: boolean;
}>();

/* DATA */

const { t } = useI18n();
const store = useAppStore();

const paymentDetails = {
  account: 'Circolo Culturale del Gruppo Alpini di Buttrio APS',
  iban: 'IT04 Q054 8463 6900 0000 0704 537',
};

/* EVENTS */

const emits = defineEmits(['team-confirmed', 'team-deleted', 'error']);

/* METHODS */

function getRegistrationStatus(): TeamStatus {
  const team = props.team;
  if (team.confirmed) {
    return { type: 'success', text: t('teams.states.confirmed') };
  } else if (
    team.attachments.length === 2 ||
    (!props.individual && team.attachments.length === 1)
  ) {
    return { type: 'warning', text: t('teams.states.waiting') };
  } else {
    return { type: 'danger', text: t('teams.states.inserted') };
  }
}

async function confirmTeam() {
  try {
    await teamsApi.confirmTeam(props.event.id, props.team.id);
    emits('team-confirmed', props.team.id);
  } catch (error) {
    emits('error');
  }
}

async function deleteTeam() {
  try {
    await teamsApi.deleteTeam(props.event.id, props.team.id);
    emits('team-deleted');
  } catch (error) {
    emits('error');
  }
}
</script>

<template>
  <AppCard shadow="hover" :title="props.team.name">
    <!-- Attachments status -->
    <template #right-header>
      <div class="is-flex">
        <ElIcon
          v-if="props.individual"
          size="24"
          :color="props.team.medcertUploaded ? 'var(--el-color-success)' : 'var(--el-color-error)'"
          :title="
            props.team.medcertUploaded
              ? $t('teams.medcertUploaded')
              : $t('teams.medcertNotUploaded')
          "
          ><Document
        /></ElIcon>
        <ElIcon
          size="24"
          :color="props.team.paymentUploaded ? 'var(--el-color-success)' : 'var(--el-color-error)'"
          :title="
            props.team.paymentUploaded
              ? $t('teams.paymentUploaded')
              : $t('teams.paymentNotUploaded')
          "
          style="margin-left: 0.25rem"
          ><Money
        /></ElIcon>
      </div>
    </template>
    <!-- Data -->
    <template #content>
      <div class="is-flex is-justify-space-between is-align-center">
        <ElDescriptions direction="vertical" :column="2">
          <ElDescriptionsItem :label="$t('general.state')">
            <span
              :style="{ color: `var(--el-color-${getRegistrationStatus().type})` }"
              class="is-bold"
              >{{ getRegistrationStatus().text }}</span
            >
          </ElDescriptionsItem>
          <ElDescriptionsItem :label="$t('teams.bibNumber')">
            {{ props.team.number || $t('general.undefined') }}
          </ElDescriptionsItem>
          <ElDescriptionsItem :label="$t('general.race')">{{
            props.team.type.name
          }}</ElDescriptionsItem>
          <ElDescriptionsItem :label="$t('teams.paymentCode')">{{
            props.team.payment_code
          }}</ElDescriptionsItem>
          <ElDescriptionsItem :label="$t('forms.phoneNumber')">{{
            props.team.manager_cell || '-'
          }}</ElDescriptionsItem>
          <ElDescriptionsItem :label="$t('teams.club')">{{
            props.team.club || '-'
          }}</ElDescriptionsItem>
          <ElDescriptionsItem :label="$t('general.date')">{{
            formatDateTime(event.date, 'L')
          }}</ElDescriptionsItem>
          <ElDescriptionsItem :label="$t('general.start')"
            >{{ event.start_hour + props.team.type.start_offset }}:00</ElDescriptionsItem
          >
          <ElDescriptionsItem :label="$t('general.duration')"
            >{{ props.team.type.duration / 60 }}
            {{
              props.team.type.duration / 60 === 1 ? $t('general.hour', 1) : $t('general.hour', 2)
            }}</ElDescriptionsItem
          >
          <ElDescriptionsItem :label="$t('general.created')">{{
            formatDateTime(props.team.created_at, 'L LT')
          }}</ElDescriptionsItem>
        </ElDescriptions>
        <div class="is-text-center" style="font-size: 20px; font-weight: 300">
          <ElIcon size="32" color="var(--el-color-info-light-5)"><Ticket /></ElIcon>
          <div>
            <div v-if="parseInt(props.team.discount) > 0" style="text-decoration: line-through">
              {{ parseInt(props.team.price) }}€
            </div>
            <div>{{ parseInt(props.team.price) - parseInt(props.team.discount) }}€</div>
          </div>
        </div>
      </div>
      <!-- Tent details -->
      <ElCollapse v-if="props.team.tent_request === 1">
        <ElCollapseItem :title="$t('teams.tentNotes')">
          <div>{{ props.team.tent_notes }}</div>
        </ElCollapseItem>
      </ElCollapse>
      <!-- Payment details -->
      <ElCollapse>
        <ElCollapseItem :title="$t('teams.paymentDetails')">
          <div class="is-margin-bottom-10">{{ $t('teams.viaBankTransfer') }}</div>
          <ElDescriptions direction="horizontal" :column="1">
            <ElDescriptionsItem label="IBAN">{{ paymentDetails.iban }}</ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('teams.registeredTo')">{{
              paymentDetails.account
            }}</ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('teams.paymentCausal')"
              >{{ props.team.payment_code }} {{ props.team.name }}
              {{ props.team.type.name }}</ElDescriptionsItem
            >
          </ElDescriptions>
        </ElCollapseItem>
      </ElCollapse>
    </template>
    <!-- Actions -->
    <template #footer>
      <ElRow justify="space-between" align="middle" class="is-margin-top-05">
        <ElButtonGroup>
          <ElButton
            type="primary"
            :title="$t('teams.editTeam')"
            @click="
              $router.push({
                name: individual ? 'update-individual-registration' : 'update-team-registration',
                params: { eventId: event.id, teamId: props.team.id },
                query: {
                  raceName: props.team.type.name,
                },
              })
            "
            :icon="EditPen"
          />
          <ElPopconfirm
            :title="$t('teams.askDeletion')"
            width="200"
            :confirm-button-text="$t('general.yes')"
            :cancel-button-text="$t('general.no')"
            hide-icon
            @confirm="deleteTeam()"
          >
            <template #reference>
              <ElButton
                type="danger"
                :disabled="team.paymentUploaded"
                :title="$t('teams.deleteTeam')"
                :icon="Delete"
              />
            </template>
          </ElPopconfirm>
        </ElButtonGroup>
        <ElPopconfirm
          v-if="store.user.isAdmin"
          :title="$t('teams.askConfirmation')"
          width="200"
          :confirm-button-text="$t('general.yes')"
          :cancel-button-text="$t('general.no')"
          hide-icon
          @confirm="confirmTeam()"
        >
          <template #reference>
            <ElButton
              type="success"
              :disabled="props.team.confirmed === 1"
              :title="$t('teams.confirmEnrollment')"
              :icon="Check"
            />
          </template>
        </ElPopconfirm>
      </ElRow>
    </template>
  </AppCard>
</template>

<style scoped>
:deep(.el-progress__text) {
  min-width: unset;
}

:deep(.el-progress__text) {
  font-size: 18px !important;
}
</style>
