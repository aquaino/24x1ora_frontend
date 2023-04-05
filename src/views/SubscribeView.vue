<script setup lang="ts">
import { ref, reactive } from 'vue';
import AppPageTitle from '@/components/shared/AppPageTitle.vue';
import { useRoute } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { resetForm } from '@/utils';
import { eventsApi, type Runner } from '@/api/resources/events';
import { DateTime } from 'luxon';

const route = useRoute();
const formRef = ref<FormInstance>();

/* Data */

const form = reactive<Runner>({
  first_name: '',
  last_name: '',
  member_iuta: false,
  member_csm: false,
  fidal_id: '',
  csi_id: '',
  other_id: '',
  birth_date: '',
});

const requiredMessage = 'Questo campo è obbligatorio';

const formRules = reactive<FormRules>({
  first_name: [{ required: true, message: requiredMessage, trigger: 'none' }],
  last_name: [{ required: true, message: requiredMessage, trigger: 'none' }],
});

const alert = ref({
  type: 'error',
  text: '',
});

/* Methods */

async function subscribe(formRef: FormInstance | undefined) {
  if (!formRef) return;
  await formRef.validate(async (valid) => {
    if (valid) {
      try {
        await eventsApi.subscribe(
          parseInt(route.params.eventId as string),
          parseInt(route.params.raceId as string),
          form,
        );
        alert.value = { type: 'success', text: 'Iscrizione effettuata con successo.' };
      } catch (error) {
        console.log(error);
        alert.value = { type: 'error', text: 'Si è verificato un errore.' };
      }
    }
  });
}
</script>

<template>
  <AppPageTitle
    :title="`Iscrizione alla gara &quot;${route.query.raceName}&quot;`"
    subtitle="Compila il form sottostante per iscriverti alla gara"
  />
  <ElRow justify="center">
    <ElCol :xs="20" :sm="16" :md="12">
      <ElCard>
        <template #header>
          <div class="card-header">
            <h2>Informazioni partecipante</h2>
          </div>
        </template>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <ElForm
            ref="formRef"
            :model="form"
            status-icon
            :rules="formRules"
            label-width="auto"
            style="width: 100%"
          >
            <ElFormItem label="Nome" prop="first_name" required>
              <ElInput v-model="form.first_name" />
            </ElFormItem>
            <ElFormItem label="Cognome" prop="last_name" required>
              <ElInput v-model="form.last_name"> </ElInput>
            </ElFormItem>
            <ElFormItem label="Data di nascita" prop="birth_date">
              <ElDatePicker v-model="form.birth_date" type="date" style="width: 100%" />
            </ElFormItem>
            <ElFormItem label="Membro IUTA" prop="memberIUTA">
              <ElSwitch v-model="form.member_iuta" />
            </ElFormItem>
            <ElFormItem label="Membro CSM" prop="memberCSM">
              <ElSwitch v-model="form.member_csm" />
            </ElFormItem>
            <ElFormItem label="Tessera FIDAL" prop="fidalID">
              <ElInput v-model="form.fidal_id"> </ElInput>
            </ElFormItem>
            <ElFormItem label="Tessera CSI" prop="csiID">
              <ElInput v-model="form.csi_id"> </ElInput>
            </ElFormItem>
            <ElFormItem label="Altra tessera" prop="otherID">
              <ElInput v-model="form.other_id"> </ElInput>
            </ElFormItem>
            <ElFormItem>
              <ElButton
                type="primary"
                native-type="submit"
                title="Conferma iscrizione"
                @click.prevent="subscribe(formRef)"
                >Conferma</ElButton
              >
              <ElButton @click="resetForm(formRef)" title="Ripristina il form">Reset</ElButton>
              <ElButton
                @click="$router.push({ name: 'races', params: { id: route.params.eventId } })"
                text
                style="margin-left: auto"
                title="Torna indietro"
                >Indietro</ElButton
              >
            </ElFormItem>
          </ElForm>
        </div>
        <ElAlert
          v-show="alert.text"
          :type="alert.type"
          :title="alert.text"
          show-icon
          style="margin-top: 1.5rem"
        />
      </ElCard>
    </ElCol>
  </ElRow>
</template>
