<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue';
import { useAppStore } from '@/store';
import { hasAttachment } from '@/utils';

/* Data */
const store = useAppStore();

/* Props */
const props = defineProps<{
  action: string;
  filename: string;
  files: string[];
}>();

/* Events */
const emits = defineEmits(['show-file']);
</script>

<template>
  <ElUpload
    ref="medcertUploadRef"
    :action="props.action"
    :headers="{
      Authorization: `Bearer ${store.user.access}`,
    }"
    method="POST"
    :auto-upload="false"
    :limit="1"
  >
    <template #trigger>
      <ElButton :icon="UploadFilled">Carica</ElButton>
    </template>
    <div class="is-margin-top-05" v-if="props.files">
      <ElAlert
        v-if="hasAttachment(new RegExp(`${props.filename}.*`), props.files)"
        type="success"
        show-icon
        :closable="false"
      >
        <template #title
          >File caricato,
          <ElButton type="text" @click="emits('show-file')" class="file-link">clicca qui</ElButton>
          per visualizzarlo</template
        >
      </ElAlert>
      <ElAlert v-else title="Nessun file caricato" type="error" show-icon :closable="false" />
    </div>
  </ElUpload>
</template>

<style scoped>
.file-link {
  font-size: inherit;
  vertical-align: baseline;
  color: inherit;
  font-weight: bold;
}
</style>
