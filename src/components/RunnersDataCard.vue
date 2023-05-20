<script setup lang="ts">
import { ref, type Ref, watch, computed } from 'vue';
import type { Runner, Team } from '@/api/interfaces';
import AppCard from './base/AppCard.vue';

/* PROPS */

const props = defineProps<{
  team: Team;
}>();

/* DATA */

const runners: Ref<Runner[]> = ref(props.team.runners);

/* COMPUTED */

const completedRunnersCount = computed(() => {
  let count = 0;
  runners.value.forEach((runner) => {
    if (runner.first_name && runner.last_name) count++;
  });
  return count;
});

/* EVENTS */

const emits = defineEmits(['data-updated']);

/* WATCH */

watch(
  runners,
  () => {
    emits('data-updated', runners);
  },
  { deep: true },
);
</script>

<template>
  <AppCard shadow="never" :title="$t('teams.teamRunners')">
    <template #right-header>
      <span style="color: var(--el-text-color-regular)"
        >{{ completedRunnersCount }} /
        {{ team.runners.length }}
      </span>
    </template>
    <template #content>
      <ElForm ref="formRef" status-icon @submit.prevent>
        <table class="is-width-100">
          <thead>
            <tr>
              <td class="hidden-xs-only"></td>
              <td class="is-required">{{ $t('forms.firstname') }}</td>
              <td class="is-required">{{ $t('forms.lastname') }}</td>
              <td>{{ $t('forms.birthDate') }}</td>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(runner, index) in runners" :key="`runner-row-${index}`">
              <td class="hidden-xs-only">{{ index + 1 }}</td>
              <td>
                <ElInput v-model="runner.first_name" />
              </td>
              <td>
                <ElInput v-model="runner.last_name" />
              </td>
              <td>
                <ElDatePicker
                  v-model="runner.birth_date"
                  type="date"
                  value-format="YYYY-MM-DD"
                  class="is-width-100"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </ElForm>
    </template>
  </AppCard>
</template>

<style scoped>
thead td {
  color: var(--el-text-color-regular);
  line-height: 22px;
}

tbody td:not(:last-child) {
  padding-right: 16px;
}

tbody tr:not(:first-child) td {
  padding-top: 14px;
}

tbody tr:first-child td {
  padding-top: 10px;
}

.is-required::before {
  content: '*';
  color: var(--el-color-danger);
  margin-right: 4px;
}
</style>
