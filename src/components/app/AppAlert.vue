<script setup lang="ts">
import { useAppStore } from '@/store';
import type { FeedbackType } from '@/store';

/* INTERFACES */

export interface IProps {
  type?: FeedbackType;
  text?: string | null;
}

/* DATA */

const store = useAppStore();

/* PROPS */

const props = withDefaults(defineProps<IProps>(), {
  type: 'error',
  text: null,
});
</script>

<template>
  <ElAlert
    v-if="store.navigation.feedback.text || props.text"
    :type="store.navigation.feedback.type || props.type || 'error'"
    :title="store.navigation.feedback.text || props.text || $t('api.generalError')"
    show-icon
    class="is-margin-top-15"
  />
</template>
