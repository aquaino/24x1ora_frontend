<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import AppPageTitle from '@/components/app/AppPageTitle.vue';
import { eventsApi } from '@/api/resources';
import type { RaceEvent } from '@/api/interfaces';
import { formatDateTime } from '@/utils';
import AppCard from '@/components/app/AppCard.vue';
import partenza_2019 from '/partenza_2019.jpg';
import { useI18n } from 'vue-i18n';

/* DATA */

const { t } = useI18n();

const loading = ref(true);
const events: Ref<RaceEvent[]> = ref(Array());

const alert = ref({
  type: 'error',
  text: '',
});

/* METHODS */

async function getEvents() {
  try {
    events.value = await eventsApi.getEvents();
    loading.value = false;
  } catch (error) {
    alert.value.text = t('api.generalError');
  }
}

/* MOUNTED */

onMounted(async () => {
  await getEvents();
});
</script>

<template>
  <AppPageTitle :title="$t('general.event', 2)" :subtitle="$t('general.availableEvents')" />

  <ElEmpty v-if="events.length === 0 && !loading" :description="$t('events.noEvents')" />
  <ElRow v-else :justify="events.length <= 3 ? 'center' : 'start'" :gutter="20" v-loading="!events">
    <ElCol v-for="event in events" :key="`event-${event.id}`" :xs="24" :sm="12" :md="8" :lg="6">
      <ElBadge :value="event.date.substring(0, 4)" type="primary">
        <AppCard
          :image="partenza_2019"
          :image-alt="$t('general.eventImageAlt')"
          shadow="hover"
          :title="event.name"
          :subtitle="formatDateTime(event.date, 'L')"
        >
          <template #content>
            <ElDescriptions direction="vertical">
              <ElDescriptionsItem :label="$t('events.subscriptionsStart')"
                >{{
                  event.subscription_from
                    ? formatDateTime(event.subscription_from, 'L')
                    : $t('general.undefined')
                }}
              </ElDescriptionsItem>
              <ElDescriptionsItem :label="$t('events.subscriptionsEnd')">{{
                event.subscription_to
                  ? formatDateTime(event.subscription_to, 'L')
                  : $t('general.undefined')
              }}</ElDescriptionsItem>
            </ElDescriptions>
          </template>
          <template #footer>
            <ElButton
              @click="
                $router.push({
                  name: 'races',
                  params: { id: event.id },
                })
              "
              :title="$t('events.showEventRaces')"
              type="primary"
              >{{ $t('events.showRaces') }}</ElButton
            >
          </template>
        </AppCard>
      </ElBadge>
      <ElAlert
        v-show="alert.text"
        :type="alert.type"
        :title="alert.text"
        show-icon
        class="is-margin-top-15"
      />
    </ElCol>
  </ElRow>
</template>

<style scoped>
:deep(.el-badge__content) {
  right: calc(18px + var(--el-badge-size) / 2);
}
</style>
