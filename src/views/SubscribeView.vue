<script setup lang="ts">
import { ref, reactive } from 'vue';
import AppPageTitle from '@/components/shared/AppPageTitle.vue';
import { useRoute } from 'vue-router';
import type { FormInstance, FormRules } from 'element-plus';
import { resetForm } from '@/utils';
import { eventsApi, type Runner } from '@/api/resources/events';

const route = useRoute();
const formRef = ref<FormInstance>();

/* Data */

const eventId = route.params.eventId as string;
const raceId = route.params.raceId as string;
const availableDiscount = route.query.availableDiscount
  ? Math.round(parseInt(route.query.availableDiscount as string))
  : 0;
const raceName = route.query.raceName;

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
        await eventsApi.subscribe(parseInt(eventId), parseInt(raceId), form);
        resetForm(formRef);
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
    :title="`Iscrizione alla gara &quot;${raceName}&quot;`"
    subtitle="Compila il form sottostante per iscriverti alla gara"
    :back-to="{ name: 'races', params: { id: route.params.eventId } }"
  />
  <ElRow justify="center">
    <ElCol :xs="20" :sm="16" :md="12">
      <ElCard shadow="never">
        <template #header>
          <h2>Informazioni partecipante</h2>
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
              <ElDatePicker
                v-model="form.birth_date"
                type="date"
                value-format="YYYY-MM-DD"
                style="width: 100%"
              />
            </ElFormItem>
            <ElFormItem label="Membro IUTA" prop="memberIUTA">
              <ElSwitch v-model="form.member_iuta" />
              <div v-if="availableDiscount" class="small-text">
                Attivare se si è membri dell'Associazione Italiana Ultramaratona e Trail per avere
                diritto al <strong>{{ availableDiscount }}% di sconto</strong> sul costo
                dell'iscrizione.
              </div>
            </ElFormItem>
            <ElFormItem label="Membro CSMI" prop="member_csm">
              <ElSwitch v-model="form.member_csm" />
              <div v-if="availableDiscount" class="small-text">
                Attivare se si è membri del Club Super Marathon Italia per avere diritto al
                <strong>{{ availableDiscount }}% di sconto</strong> sul costo dell'iscrizione.
              </div>
            </ElFormItem>
            <ElFormItem label="Tessera FIDAL" prop="fidal_id">
              <ElInput v-model="form.fidal_id"> </ElInput>
            </ElFormItem>
            <ElFormItem label="Tessera CSI" prop="csi_id">
              <ElInput v-model="form.csi_id"> </ElInput>
            </ElFormItem>
            <ElFormItem label="Altra tessera" prop="other_id">
              <ElInput v-model="form.other_id"> </ElInput>
            </ElFormItem>
            <ElFormItem>
              <ElButton
                type="success"
                native-type="submit"
                title="Conferma iscrizione"
                @click.prevent="subscribe(formRef)"
                >Conferma</ElButton
              >
              <ElButton @click="resetForm(formRef)" title="Ripristina il form">Reset</ElButton>
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
