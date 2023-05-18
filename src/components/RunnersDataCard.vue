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
      <ElRow v-for="(runner, index) in runners" :key="`runner-row-${index}`">
        <ElForm ref="formRef" status-icon label-position="top" class="is-width-100" @submit.prevent>
          <ElRow :gutter="10">
            <ElCol :sm="8">
              <ElFormItem :label="$t('forms.firstname')" required>
                <ElInput v-model="runner.first_name" />
              </ElFormItem>
            </ElCol>
            <ElCol :sm="8">
              <ElFormItem :label="$t('forms.lastname')" required>
                <ElInput v-model="runner.last_name" />
              </ElFormItem>
            </ElCol>
            <ElCol :sm="8">
              <ElFormItem :label="$t('forms.birthDate')">
                <ElDatePicker
                  v-model="runner.birth_date"
                  type="date"
                  value-format="YYYY-MM-DD"
                  class="is-width-100"
                />
              </ElFormItem>
            </ElCol>
          </ElRow>
        </ElForm>
        <ElDivider
          v-if="index !== runners.length - 1"
          class="is-margin-top-0 is-margin-bottom-05"
        />
      </ElRow>
    </template>
  </AppCard>
</template>

<style scoped>
.el-row .el-col {
  margin-bottom: 0 !important;
}
</style>
