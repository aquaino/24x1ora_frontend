<script setup lang="ts">
import type { RaceEvent } from '@/api/interfaces';
import type { TeamWithAttachmentStatus } from '@/views/ListRegistrationsView.vue';
import { useI18n } from 'vue-i18n';
import { formatDateTime } from '@/utils';
import type { TableColumnCtx } from 'element-plus';
import { EditPen, Delete, Check } from '@element-plus/icons-vue';
import { teamsApi } from '@/api/resources';
import type { TeamStatus } from './RegistrationCard.vue';

/* PROPS */

const props = defineProps<{
  event: RaceEvent;
  teams: TeamWithAttachmentStatus[];
}>();

/* EVENTS */

const emits = defineEmits(['team-confirmed', 'team-deleted', 'error']);

/* DATA */

const { t } = useI18n();

const columns = [
  {
    prop: 'id',
    label: 'ID',
    sortable: true,
    format: false,
    width: '70',
  },
  {
    prop: 'name',
    label: t('forms.name'),
    sortable: true,
    format: false,
    width: null,
  },
  {
    prop: 'type.name',
    label: t('general.race'),
    sortable: true,
    format: false,
    width: null,
  },
  {
    prop: 'payment_code',
    label: t('teams.paymentCode'),
    sortable: true,
    format: false,
    width: null,
  },
  {
    prop: 'created_at',
    label: t('general.created'),
    sortable: true,
    format: true,
    width: null,
  },
];

/* METHODS */

function format(format: boolean, cellValue: any) {
  if (format) {
    return formatDateTime(cellValue, 'ISO', 'DATETIME_SHORT');
  } else {
    return cellValue;
  }
}

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
</script>

<template>
  <ElTable :data="props.teams" stripe>
    <!-- Data columns -->
    <ElTableColumn
      v-for="col in columns"
      :key="col.prop"
      :prop="col.prop"
      :label="col.label"
      :sortable="col.sortable"
      :width="col.width"
      :formatter="(
        row: TeamWithAttachmentStatus, 
        column: TableColumnCtx<TeamWithAttachmentStatus>, 
        cellValue: any
      ) => format(col.format, cellValue)"
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
    <ElTableColumn width="130">
      <template #default="scope">
        <ElButtonGroup size="small">
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
            v-if="!scope.row.paymentUploaded"
            :title="$t('teams.askDeletion')"
            width="200"
            :confirm-button-text="$t('general.yes')"
            :cancel-button-text="$t('general.no')"
            hide-icon
            @confirm="deleteTeam(scope.row.id)"
          >
            <template #reference>
              <ElButton type="danger" :title="$t('teams.deleteTeam')" :icon="Delete" />
            </template>
          </ElPopconfirm>
          <ElPopconfirm
            v-if="!scope.row.confirmed"
            :title="$t('teams.askConfirmation')"
            width="200"
            :confirm-button-text="$t('general.yes')"
            :cancel-button-text="$t('general.no')"
            hide-icon
            @confirm="confirmTeam(scope.row.id)"
          >
            <template #reference>
              <ElButton type="success" :title="$t('teams.confirmEnrollment')" :icon="Check" />
            </template>
          </ElPopconfirm>
        </ElButtonGroup>
      </template>
    </ElTableColumn>
  </ElTable>
</template>
