<script setup lang="ts">
import AppCard from '../base/AppCard.vue';
import { useI18n } from 'vue-i18n';

/**
 * MAIN FUNCTION
 * Show team summary and confirm the subscription.
 */

/* Data */

const { t } = useI18n();

/* Events */

const emits = defineEmits(['step-completed']);
</script>

<template>
  <ElCol :xs="24" :sm="12" :lg="10">
    <AppCard shadow="never" :title="$t('general.confirm')">
      <template #content>
        {{ $t('teams.askConfirmMultipleTeam') }}
        <div class="is-margin-top-15">
          <ElButton type="success">{{ $t('general.confirm') }}</ElButton>
        </div>
      </template>
    </AppCard>
  </ElCol>
</template>
