<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import AppPageTitle from '@/components/base/AppPageTitle.vue';
import { eventsApi } from '@/api/resources';
import type { Race, RaceEventDetails } from '@/api/interfaces';
import { useRoute } from 'vue-router';
import AppCard from '@/components/base/AppCard.vue';
import { formatDateTime } from '@/utils';
import { Ticket } from '@element-plus/icons-vue';
import { useAppStore } from '@/store';
import { useI18n } from 'vue-i18n';

/* DATA */

const route = useRoute();
const eventId = route.params.id as string;

const event: Ref<RaceEventDetails> | Ref<null> = ref(null);
const loading = ref(true);
const races: Ref<Race[]> = ref(Array());

const store = useAppStore();
const { t } = useI18n();

const alert = ref({
  type: 'error',
  text: '',
});

/* METHODS */

async function getRaces() {
  try {
    event.value = await eventsApi.getEventDetails(parseInt(eventId));
    races.value = event.value.races;
    loading.value = false;
  } catch (error) {
    alert.value.text = t('api.generalError');
  }
}

/* MOUNTED */
onMounted(async () => {
  await getRaces();
});
</script>

<template>
  <div>
    <AppPageTitle
      :title="$t('races.racesOfEvent', { msg: event ? `&quot;${event['name']}&quot;` : '' })"
      :subtitle="t('races.availableEventRaces')"
      :back-to="{ name: 'events' }"
    />
    <ElEmpty v-if="races.length === 0 && !loading" :description="$t('races.noRaces')" />
    <div v-else>
      <ElRow v-if="!store.user.email_verified_at" justify="center">
        <ElCol :xs="24" :sm="16" :md="14" :lg="10" class="is-margin-bottom-15">
          <ElAlert type="error" show-icon :closable="false">
            <template #title>
              {{ $t('general.isNecessary') }}
              <RouterLink
                :to="{
                  name: 'verify',
                  query: {
                    token: store.user.access,
                  },
                }"
                class="is-bold"
                style="color: var(--el-color-error)"
                >{{ $t('general.confirmEmailAddress') }}</RouterLink
              >
              {{ $t('general.toSubscribeToRaces') }}
            </template>
          </ElAlert>
        </ElCol>
      </ElRow>
      <ElRow :justify="races.length <= 4 ? 'center' : 'start'" :gutter="20" v-loading="loading">
        <ElCol v-for="race in races" :key="`race-${race.id}`" :xs="24" :sm="12" :md="8" :lg="6">
          <AppCard v-if="event" shadow="hover" :title="race.type.name">
            <template #content>
              <div class="is-flex is-justify-space-between is-align-center">
                <ElDescriptions direction="vertical" :column="2">
                  <ElDescriptionsItem :label="$t('general.type')" :span="2">
                    {{
                      race.type.class[0] === 'i'
                        ? $t('races.individualRace') // race.type.class[0] === 's'
                        : $t('races.teamRace')
                    }}
                  </ElDescriptionsItem>
                  <ElDescriptionsItem :label="$t('general.date')" width="100px">{{
                    formatDateTime(event['date'], 'yyyy-MM-dd hh:mm:ss', 'DATE_SHORT')
                  }}</ElDescriptionsItem>
                  <ElDescriptionsItem :label="$t('general.start')"
                    >{{ event['start_hour'] + race['type']['start_offset'] }}:00</ElDescriptionsItem
                  >
                  <ElDescriptionsItem :label="$t('general.duration')"
                    >{{ race.type.duration / 60 }}
                    {{
                      race.type.duration / 60 === 1 ? $t('general.hour', 1) : $t('general.hour', 2)
                    }}</ElDescriptionsItem
                  >
                  <ElDescriptionsItem :label="$t('general.runnersPerTeam')">{{
                    race.type.runners_per_team
                  }}</ElDescriptionsItem>
                </ElDescriptions>
                <div class="is-text-center" style="font-size: 20px; font-weight: 300">
                  <ElIcon size="32" color="var(--el-color-info-light-5)"><Ticket /></ElIcon>
                  <div>{{ race.price }}€</div>
                </div>
              </div>
            </template>
            <template #footer>
              <ElButton
                @click="
                  if (race.type.class[0] === 'i') {
                    $router.push({
                      name: 'individual-race-registration',
                      params: {
                        eventId: event!['id'],
                        raceId: race.id,
                      },
                      query: {
                        raceName: race.type.name,
                        availableDiscount: race.available_discount,
                      },
                    });
                    // race.type.class[0] === 's'
                  } else {
                    $router.push({
                      name: 'team-race-registration',
                      params: {
                        eventId: event!['id'],
                        raceId: race.id,
                      },
                      query: {
                        raceName: race.type.name,
                      },
                    });
                  }
                "
                :title="$t('races.subscribeToRace')"
                :disabled="!store.user.email_verified_at"
                type="primary"
                >{{ $t('races.subscribe') }}</ElButton
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
    </div>
  </div>
</template>
