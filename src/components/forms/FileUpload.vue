<script setup lang="ts">
import { ref } from 'vue';
import { UploadFilled } from '@element-plus/icons-vue';
import { useAppStore } from '@/store';
import { hasAttachment } from '@/utils';
import type { UploadInstance } from 'element-plus';

/* PROPS */
const props = defineProps<{
  action: string;
  filename: string;
  files?: string[];
}>();

/* DATA */
const store = useAppStore();
const uploadRef = ref<UploadInstance>();

/* EVENTS */
const emits = defineEmits(['show-file']);

/* METHODS */
const submit = () => {
  uploadRef.value!.submit();
};

/* EXPOSE */
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
    class="is-width-100"
  >
    <template #trigger>
      <ElButton :icon="UploadFilled">{{ $t('forms.upload') }}</ElButton>
    </template>
    <div class="is-margin-top-05" v-if="typeof props.files !== 'undefined'">
      <ElAlert
        v-if="hasAttachment(new RegExp(`${props.filename}.*`), props.files)"
        type="success"
        show-icon
        :closable="false"
      >
        <template #title>
          {{ $t('forms.fileUploadedComma') }}
          <ElButton type="success" @click="emits('show-file')" class="file-button" link>{{
            $t('forms.clickHere')
          }}</ElButton>
          {{ $t('forms.toShowIt') }}
        </template>
      </ElAlert>
      <ElAlert
        v-else
        :title="$t('forms.fileNotUploaded')"
        type="error"
        show-icon
        :closable="false"
      />
    </div>
  </ElUpload>
</template>

<style scoped>
.file-button {
  padding: 0;
  vertical-align: baseline;
}
</style>
