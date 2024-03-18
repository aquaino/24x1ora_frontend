<script setup lang="ts">
import { ref, reactive } from 'vue';
import AppPageTitle from '@/components/app/AppPageTitle.vue';
import { useRoute, useRouter } from 'vue-router';
import AppCard from '@/components/app/AppCard.vue';
import { useI18n } from 'vue-i18n';
import type { FormInstance, FormRules } from 'element-plus';
import { teamsApi } from '@/api/resources';
import { onBeforeRouteLeave } from 'vue-router';
import { useAppStore } from '@/store';

const { t } = useI18n();
const router = useRouter();
const route = useRoute();
const store = useAppStore();

/* INTERFACES */

interface TeamBasicData {
  name: string;
  manager: string;
  manager_cell: string;
  tent_request: boolean;
  tent_notes: string;
}

/* DATA */

const raceName = route.query.raceName;
const eventId = parseInt(route.params.eventId as string);
const raceId = parseInt(route.params.raceId as string);

const formRef = ref<FormInstance>();
const form: TeamBasicData = reactive({
  name: '',
  manager: '',
  manager_cell: '',
  tent_request: false,
  tent_notes: '',
});
const formRules = reactive<FormRules>({
  name: [{ required: true, message: t('forms.requiredField'), trigger: 'none' }],
  manager: [{ required: true, message: t('forms.requiredField'), trigger: 'none' }],
  manager_cell: [{ required: true, message: t('forms.requiredField'), trigger: 'none' }],
});

/* BEFORE ROUTE LEAVE */

onBeforeRouteLeave(() => store.clearFeedback());

/* METHODS */

async function createTeam(formRef: FormInstance | undefined) {
  if (!formRef) return;
  await formRef.validate(async (valid: boolean) => {
    if (valid) {
      try {
        const newTeam = await teamsApi.createTeamRaceRegistration(eventId, raceId, form);
        router.push({
          name: 'update-team-registration',
          params: {
            eventId: eventId,
            teamId: newTeam.id,
          },
          query: {
            raceName: newTeam.type.name,
          },
        });
      } catch (error: any) {
        if (error.response.status === 400) {
          store.setFeedback('error', t('teams.alreadyRegistered'));
        } else {
          store.setFeedback('error');
        }
      }
    }
  });
}
</script>

<template>
  <AppPageTitle
    :title="$t('teams.subscriptionTitle', { msg: raceName })"
    :subtitle="$t('teams.multipleSubscriptionSubtitle')"
    :back-to="{ name: 'races', params: { id: route.params.eventId } }"
  />
  <ElRow justify="center" :gutter="20" class="is-margin-top-25 is-margin-bottom-15">
    <ElCol :xs="24" :sm="12" :md="8" :lg="6">
      <AppCard shadow="never" :title="$t('teams.teamInfo')">
        <template #content>
          <ElForm
            ref="formRef"
            :model="form"
            :rules="formRules"
            status-icon
            label-width="100px"
            class="is-width-100"
            @submit.prevent="createTeam(formRef)"
          >
            <ElFormItem :label="$t('forms.name')" prop="name" required>
              <ElInput v-model="form.name" />
            </ElFormItem>
            <ElFormItem :label="$t('teams.manager')" prop="manager" required>
              <ElInput v-model="form.manager" />
            </ElFormItem>
            <ElFormItem :label="$t('teams.managerCell')" prop="manager_cell" required>
              <ElInput v-model="form.manager_cell" />
            </ElFormItem>
            <ElFormItem prop="tent_request">
              <template #label>
                <span style="line-height: initial">{{ $t('teams.requestTent') }}</span>
              </template>
              <ElCheckbox v-model="form.tent_request" />
            </ElFormItem>
            <ElFormItem v-if="form.tent_request" prop="tent_notes">
              <template #label>
                <span style="line-height: initial">{{ $t('teams.tentNotes') }}</span>
              </template>
              <ElInput v-model="form.tent_notes" type="textarea" :rows="4" id="test" />
            </ElFormItem>
            <ElFormItem class="is-margin-bottom-0">
              <ElButton
                type="success"
                native-type="submit"
                :title="$t('teams.confirmEnrollment')"
                >{{ $t('general.confirm') }}</ElButton
              >
            </ElFormItem>
          </ElForm>
        </template>
      </AppCard>
    </ElCol>
  </ElRow>
</template>
