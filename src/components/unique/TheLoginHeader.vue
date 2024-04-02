<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import logo from '/logo.png';
import type { StatisticsData } from '@/api/interfaces';
import { useAppStore } from '@/store';
import { eventsApi } from '@/api/resources';
import { dayjs } from 'element-plus';

/* DATA */

const statisticsData: Ref<StatisticsData | null> = ref(null);
const store = useAppStore();

/* COMPUTED */

const countdown = computed(() => {
  if (statisticsData.value) {
    return dayjs(statisticsData.value.date);
  } else {
    return 0;
  }
});

/* MOUNTED */

onMounted(async () => {
  try {
    statisticsData.value = await eventsApi.getEventStatistics();
  } catch (error) {
    store.setFeedback('error');
  }
});
</script>

<template>
  <div class="logo-wrapper">
    <ElImage :src="logo" :alt="$t('general.logoAlt')" />
    <h1>{{ $t('general.portal') }}</h1>
  </div>
  <ElRow v-loading="statisticsData === null" class="is-text-center">
    <ElCol :span="7">
      <ElStatistic
        :title="$t('general.participants')"
        :value="statisticsData ? statisticsData.runners : 0"
      />
    </ElCol>
    <ElCol :span="10" class="main-column">
      <ElCountdown :title="$t('general.hoursFromStart')" format="HH:mm:ss" :value="countdown" />
    </ElCol>
    <ElCol :span="7">
      <ElStatistic
        :title="$t('general.teams')"
        :value="statisticsData ? statisticsData.teams : 0"
      />
    </ElCol>
  </ElRow>
</template>

<style scoped lang="scss">
.logo-wrapper {
  margin-bottom: 2rem;
  text-align: center;
}

:deep(.main-column .el-statistic__head) {
  font-size: calc(var(--el-statistic-head-font-size) * 1.25);
}
:deep(.main-column .el-statistic__content) {
  font-size: calc(var(--el-statistic-content-font-size) * 1.25);
}
</style>
