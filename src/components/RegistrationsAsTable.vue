<script setup lang="ts">
import type { Race, RaceEventDetails } from '@/api/interfaces';
import type { TeamWithAttachmentStatus } from './interfaces';
import { useI18n } from 'vue-i18n';
import { formatDateTime } from '@/utils';
import type { TableColumnCtx } from 'element-plus';
import {
  EditPen,
  Delete,
  Check,
  CircleCloseFilled,
  CircleCheckFilled,
} from '@element-plus/icons-vue';
import { teamsApi } from '@/api/resources';
import type { TeamStatus } from './RegistrationCard.vue';
import { computed } from 'vue';
import { useAppStore } from '@/store';

const { t } = useI18n();
const store = useAppStore();

/* PROPS */

const props = defineProps<{
  event: RaceEventDetails;
  teams: TeamWithAttachmentStatus[];
}>();

/* COMPUTED */

const defaultRaceFilter = computed(() => {
  const raceFilters = store.navigation.RegistrationsAsTable.filters.race;
  console.log(store.navigation.RegistrationsAsTable);

  return raceFilters.length > 0 ? raceFilters : null;
});

/* EVENTS */

const emits = defineEmits(['team-confirmed', 'team-deleted', 'error']);

/* COMPUTED */

const racesForFilter = computed(() => {
  return props.event.races.map((race: Race) => {
    return {
      text: race.type.name,
      value: race.type.name,
    };
  });
});

/* METHODS */

async function confirmTeam(teamId: number) {
  try {
    await teamsApi.confirmTeam(props.event.id, teamId);
    emits('team-confirmed', teamId);
  } catch (error) {
    emits('error');
  }
}

async function deleteTeam(teamId: number) {
  try {
    await teamsApi.deleteTeam(props.event.id, teamId);
    emits('team-deleted');
  } catch (error) {
    emits('error');
  }
}

function getRegistrationStatus(team: TeamWithAttachmentStatus, individual: boolean): TeamStatus {
  if (team.confirmed) {
    return { type: 'success', text: t('teams.states.confirmed') };
  } else if (team.attachments.length === 2 || (!individual && team.attachments.length === 1)) {
    return { type: 'warning', text: t('teams.states.waiting') };
  } else {
    return { type: 'danger', text: t('teams.states.inserted') };
  }
}

async function downloadAttachment(
  fileName: string,
  team: TeamWithAttachmentStatus,
  raceName: string,
) {
  try {
    const file = await teamsApi.getAttachmentFile(props.event.id, team.id, fileName);
    // Create file link in browser's memory
    const href = URL.createObjectURL(file);
    // Create "a" HTML element with href to file & click
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.setAttribute('download', `${raceName}_${team.name}_${fileName}`);
    document.body.appendChild(link);
    link.click();
    // Clean up "a" element and remove ObjectURL
    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  } catch (error) {
    console.log(error);
  }
}

const raceFilter = (value: string, row: TeamWithAttachmentStatus) => {
  return row.type.name === value;
};
</script>

<template>
  <ElTable
    :data="props.teams"
    stripe
    :default-sort="{ prop: 'created_at', order: 'descending' }"
    table-layout="auto"
    @filter-change="
        (filters: any) => {
          store.navigation.RegistrationsAsTable.filters = filters;
        }
      "
  >
    <!-- Record columns -->
    <ElTableColumn v-if="store.user.isAdmin" prop="id" label="ID" />
    <ElTableColumn prop="name" :label="t('forms.name')" />
    <ElTableColumn
      prop="type.name"
      :label="t('general.race')"
      sortable
      :filters="racesForFilter"
      :filter-method="raceFilter"
      :filtered-value="defaultRaceFilter"
      column-key="race"
    />
    <ElTableColumn
      prop="number"
      :label="$t('teams.bibNumber')"
      :formatter="
        (
          row: TeamWithAttachmentStatus, 
          column: TableColumnCtx<TeamWithAttachmentStatus>, 
          cellValue: number
        ) => {
          return cellValue || $t('general.undefined');
        }
      "
    />
    <ElTableColumn prop="payment_code" :label="t('teams.paymentCode')" />
    <!-- Attachments -->
    <ElTableColumn :label="$t('teams.medcert')">
      <template #default="scope">
        <span v-if="scope.row.type.class[0] === 's'">-</span>
        <ElButton
          v-else-if="scope.row.medcertUploaded"
          link
          @click="downloadAttachment('medcert', scope.row, scope.row.type.name)"
        >
          <ElIcon color="var(--el-color-success)"><CircleCheckFilled /></ElIcon>
          <span class="is-small">{{ $t('general.show') }}</span>
        </ElButton>
        <ElIcon v-else style="color: var(--el-color-danger)"><CircleCloseFilled /></ElIcon>
      </template>
    </ElTableColumn>
    <ElTableColumn :label="$t('teams.paymentCertificate')">
      <template #default="scope">
        <ElButton
          v-if="scope.row.paymentUploaded"
          link
          @click="downloadAttachment('payment', scope.row, scope.row.type.name)"
        >
          <ElIcon color="var(--el-color-success)"><CircleCheckFilled /></ElIcon>
          <span class="is-small">{{ $t('general.show') }}</span>
        </ElButton>
        <ElIcon v-else style="color: var(--el-color-danger)"><CircleCloseFilled /></ElIcon>
      </template>
    </ElTableColumn>
    <!-- Price -->
    <ElTableColumn :label="$t('teams.amountToPay')">
      <template #default="scope">
        {{ parseInt(scope.row.price) - parseInt(scope.row.discount) }}€
      </template>
    </ElTableColumn>
    <ElTableColumn :label="$t('teams.phoneNumber')">
      <template #default="scope">
        {{ scope.row.manager_cell || '-'}}
      </template>
    </ElTableColumn>
    <ElTableColumn :label="$t('teams.club')">
      <template #default="scope">
        {{ scope.row.club || '-'}}
      </template>
    </ElTableColumn>
    <ElTableColumn
      prop="created_at"
      :label="t('general.created')"
      :formatter="(
        row: TeamWithAttachmentStatus, 
        column: TableColumnCtx<TeamWithAttachmentStatus>, 
        cellValue: string
      ) => { return formatDateTime(cellValue, 'ISO', 'DATETIME_SHORT') }"
      sortable
    />
    <!-- State -->
    <ElTableColumn :label="$t('general.state')">
      <template #default="scope">
        <span
          :style="{
            color: `var(--el-color-${
              getRegistrationStatus(scope.row, scope.row.type.class[0] === 'i').type
            })`,
          }"
          class="is-bold"
          >{{ getRegistrationStatus(scope.row, false).text }}</span
        >
      </template>
    </ElTableColumn>
    <!-- Actions -->
    <ElTableColumn>
      <template #default="scope">
        <ElButtonGroup size="small" class="is-flex">
          <ElButton
            type="primary"
            :title="$t('teams.editTeam')"
            @click="
              $router.push({
                name:
                  scope.row.type.class[0] === 'i'
                    ? 'update-individual-registration'
                    : 'update-team-registration',
                params: { eventId: event.id, teamId: scope.row.id },
                query: {
                  raceName: scope.row.type.name,
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
            @confirm="deleteTeam(scope.row.id)"
          >
            <template #reference>
              <ElButton
                type="danger"
                :disabled="scope.row.paymentUploaded"
                :title="$t('teams.deleteTeam')"
                :icon="Delete"
              />
            </template>
          </ElPopconfirm>
          <ElPopconfirm
            :title="$t('teams.askConfirmation')"
            width="200"
            :confirm-button-text="$t('general.yes')"
            :cancel-button-text="$t('general.no')"
            hide-icon
            @confirm="confirmTeam(scope.row.id)"
          >
            <template #reference>
              <ElButton
                type="success"
                :disabled="scope.row.confirmed === 1"
                :title="$t('teams.confirmEnrollment')"
                :icon="Check"
              />
            </template>
          </ElPopconfirm>
        </ElButtonGroup>
      </template>
    </ElTableColumn>
  </ElTable>
</template>
