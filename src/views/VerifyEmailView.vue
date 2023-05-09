<script setup lang="ts">
import { usersApi } from '@/api/resources';
import { useAppStore } from '@/store';
import { logout } from '@/utils';
import { useRoute, useRouter } from 'vue-router';

/**
 * MAIN FUNCTION
 * Confirm new user e-mail address.
 *
 * LOGIC
 * Take user token from GET pars and use it for verifying e-mail with a WS call.
 *
 * EXCEPTIONS
 * - User token not provided -> Feedback to retry
 * - User e-mail already verified -> Feedback
 */

/* Data */

const router = useRouter();
const route = useRoute();
const token = route.query.token as string;

const appStore = useAppStore();
const alreadyVerified = appStore.user.email_verified_at !== null;

/* Methods */

async function verifyEmail() {
  try {
    await usersApi.verifyEmail(token);
    logout(false);
    router.push({
      name: 'login',
      query: { alertType: 'success', alertText: 'Indirizzo e-mail verificato con successo' },
    });
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <div v-if="token && !alreadyVerified" class="is-text-center">
    <ElButton type="primary" title="Verifica il tuo indirizzo e-mail" @click="verifyEmail()"
      >Verifica e-mail</ElButton
    >
  </div>
  <div v-else-if="alreadyVerified">
    <ElResult
      icon="success"
      class="is-padding-top-0"
      title="Indirizzo e-mail già verificato"
      sub-title="Il tuo indirizzo e-mail risulta già verificato"
    >
      <template #extra>
        <ElButton @click="$router.push({ name: 'home' })" title="Torna alla home" type="primary"
          >Home</ElButton
        >
      </template>
    </ElResult>
  </div>
  <div v-else>
    <ElResult
      icon="error"
      class="is-padding-top-0"
      title="Si è verificato un problema"
      sub-title="Verifica nuovamente l'indirizzo con le istruzioni ricevute
    via e-mail"
    >
      <template #extra>
        <ElButton @click="$router.push({ name: 'home' })" title="Torna alla home" type="primary"
          >Home</ElButton
        >
      </template>
    </ElResult>
  </div>
</template>
