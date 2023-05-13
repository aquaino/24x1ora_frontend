<script setup lang="ts">
import { ref } from 'vue';
import { UploadFilled } from '@element-plus/icons-vue';
import { useAppStore } from '@/store';
import { hasAttachment } from '@/utils';
import type { UploadInstance } from 'element-plus';

/* Data */
const store = useAppStore();
const uploadRef = ref<UploadInstance>();

/* Props */
const props = defineProps<{
  action: string;
  filename: string;
  files: string[];
}>();

/* Events */
const emits = defineEmits(['show-file']);

/* Methods */
const submit = () => {
  uploadRef.value!.submit();
};

/* Expose */
defineExpose({ submit });
</script>

<template>
  <ElUpload
    ref="uploadRef"
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
          <ElButton type="link" @click="emits('show-file')" class="file-link">clicca qui</ElButton>
          per visualizzarlo</template
        >
      </ElAlert>
      <ElAlert v-else title="Nessun file caricato" type="error" show-icon :closable="false" />
    </div>
  </ElUpload>
</template>

<style scoped>
.file-link {
  background-color: transparent;
  border: none;
  color: inherit;
  font-size: inherit;
  font-weight: bold;
  padding: 0;
  vertical-align: baseline;
}
</style>
