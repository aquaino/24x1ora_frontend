<script setup lang="ts">
import { ref, reactive } from 'vue';
import AppPageTitle from '@/components/base/AppPageTitle.vue';
import { useRoute, useRouter } from 'vue-router';
import AppCard from '@/components/base/AppCard.vue';
import { useI18n } from 'vue-i18n';
import type { FormInstance, FormRules } from 'element-plus';
import { teamsApi } from '@/api/resources';

/* INTERFACES */

interface TeamBasicData {
  name: string;
  manager: string;
  manager_cell: string;
}

/* DATA */

const { t } = useI18n();

const router = useRouter();
const route = useRoute();
const raceName = route.query.raceName;
const eventId = parseInt(route.params.eventId as string);
const raceId = parseInt(route.params.raceId as string);

const formRef = ref<FormInstance>();
const form: TeamBasicData = reactive({
  name: '',
  manager: '',
  manager_cell: '',
});
const formRules = reactive<FormRules>({
  name: [{ required: true, message: t('forms.requiredField'), trigger: 'none' }],
  manager: [{ required: true, message: t('forms.requiredField'), trigger: 'none' }],
  manager_cell: [{ required: true, message: t('forms.requiredField'), trigger: 'none' }],
});

const alert = ref({
  type: 'error',
  text: '',
});

/* METHODS */

async function createTeam(formRef: FormInstance | undefined) {
  if (!formRef) return;
  await formRef.validate(async (valid) => {
    if (valid) {
      try {
        const newTeam = await teamsApi.createTeamRaceRegistration(eventId, raceId, form);
        router.push({
          name: 'race-registrations',
          query: {
            messageType: 'success',
            messageText: t('teams.teamInserted', { msg: newTeam.id }),
          },
        });
      } catch (error: any) {
        if (error.response.status === 400) {
          alert.value = { type: 'error', text: t('teams.alreadyRegistered') };
        } else {
          alert.value = { type: 'error', text: t('api.generalError') };
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
            label-width="auto"
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
            <ElFormItem class="is-margin-bottom-0">
              <ElButton
                type="success"
                native-type="submit"
                :title="$t('teams.confirmEnrollment')"
                >{{ $t('general.confirm') }}</ElButton
              >
            </ElFormItem>
          </ElForm>
          <ElAlert
            v-show="alert.text"
            :type="alert.type"
            :title="alert.text"
            show-icon
            class="is-margin-top-15"
          />
        </template>
      </AppCard>
    </ElCol>
  </ElRow>
</template>
