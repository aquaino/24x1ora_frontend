<script setup lang="ts">
import { usersApi } from '@/api/resources';
import { useUserStore } from '@/stores/user';
import { logout } from '@/utils';
import { useRoute, useRouter } from 'vue-router';

/**
 * FUNCTION
 * Confirm new user email address.
 *
 * LOGIC
 * Take user token from GET pars and use it for verifying email with a WS call.
 *
 * EXCEPTIONS
 * - User token not provided -> Feedback to retry
 * - User email already verified -> Feedback
 */

/* Data */

const router = useRouter();
const route = useRoute();
const token = route.query.token as string;

const store = useUserStore();
const alreadyVerified = store.user.email_verified_at !== null;

/* Methods */

async function verifyEmail() {
  try {
    await usersApi.verifyEmail(token);
    logout(false);
    router.push({
      name: 'login',
      query: { alertType: 'success', alertText: 'Indirizzo email verificato con successo' },
    });
  } catch (error) {
    console.log(error);
  }
}
</script>

<template>
  <div v-if="token && !alreadyVerified" class="is-text-center">
    <ElButton type="primary" title="Verifica il tuo indirizzo email" @click="verifyEmail()"
      >Verifica email</ElButton
    >
  </div>
  <div v-else-if="alreadyVerified">
    <ElResult
      icon="success"
      class="is-padding-top-0"
      title="Indirizzo email già verificato"
      sub-title="Il tuo indirizzo email risulta già verificato"
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
    via email"
    >
      <template #extra>
        <ElButton @click="$router.push({ name: 'home' })" title="Torna alla home" type="primary"
          >Home</ElButton
        >
      </template>
    </ElResult>
  </div>
</template>
