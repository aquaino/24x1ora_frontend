<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import logo from '/logo.png';
import type { StatisticsData } from '@/api/interfaces';
import { useAppStore } from '@/store';
import { eventsApi } from '@/api/resources';
import { dayjs } from 'element-plus';
import { useI18n } from 'vue-i18n';

/* DATA */

const statisticsData: Ref<StatisticsData | null> = ref(null);
const store = useAppStore();
const { t } = useI18n();

/* COMPUTED */

const countdown = computed(() => {
  if (statisticsData.value) {
    return dayjs(statisticsData.value.date);
  } else {
    return 0;
  }
});

const countdownFormat = computed(() => {
  return `DD[${t('general.dayShortening')}] HH[h] mm[m] ss[s]`;
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
    <ElCol :span="6">
      <ElStatistic
        :title="$t('general.participants')"
        :value="statisticsData ? statisticsData.runners : 0"
      />
    </ElCol>
    <ElCol :span="12">
      <ElCountdown :title="$t('general.fromStart')" :format="countdownFormat" :value="countdown" />
    </ElCol>
    <ElCol :span="6">
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
</style>
