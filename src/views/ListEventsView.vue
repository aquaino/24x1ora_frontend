<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import AppPageTitle from '@/components/base/AppPageTitle.vue';
import { eventsApi } from '@/api/resources';
import type { RaceEvent } from '@/api/interfaces';
import { formatDateTime } from '@/utils';
import AppCard from '@/components/base/AppCard.vue';
import partenza_2019 from '/partenza_2019.jpg';
import { useI18n } from 'vue-i18n';

/**
 * MAIN FUNCTION
 * Show available events.
 *
 * LOGIC
 * Get and show events list.
 *
 * EXCEPTIONS
 * - WS call failure -> Error alert
 */

/* Data */

const { t } = useI18n();

const loading = ref(true);
const events: Ref<RaceEvent[]> = ref(Array());

const alert = ref({
  type: 'error',
  text: '',
});

/* Methods */

async function getEvents() {
  try {
    events.value = await eventsApi.getEvents();
    loading.value = false;
  } catch (error) {
    alert.value.text = t('api.generalError');
  }
}

/* Mounted */
onMounted(async () => {
  await getEvents();
});
</script>

<template>
  <AppPageTitle :title="$t('general.event', 2)" :subtitle="$t('general.availableEvents')" />

  <ElEmpty v-if="events.length === 0 && !loading" :description="$t('events.noEvents')" />
  <ElRow v-else :justify="events.length <= 3 ? 'center' : 'start'" :gutter="20" v-loading="loading">
    <ElCol v-for="event in events" :key="`event-${event.id}`" :xs="24" :sm="12" :md="8">
      <AppCard
        :image="partenza_2019"
        :image-alt="$t('general.eventImageAlt')"
        shadow="hover"
        :title="event.name"
        :subtitle="formatDateTime(event.date, 'yyyy-MM-dd hh:mm:ss', 'DATE_SHORT')"
      >
        <template #content>
          <ElDescriptions direction="vertical">
            <ElDescriptionsItem :label="$t('events.subscriptionsStart')"
              >{{
                event.subscription_from
                  ? formatDateTime(event.subscription_from, 'yyyy-MM-dd hh:mm:ss', 'DATE_SHORT')
                  : $t('general.undefined')
              }}
            </ElDescriptionsItem>
            <ElDescriptionsItem :label="$t('events.subscriptionsEnd')">{{
              event.subscription_to
                ? formatDateTime(event.subscription_to, 'yyyy-MM-dd hh:mm:ss', 'DATE_SHORT')
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
