<script setup lang="ts">
import { usersApi } from '@/api/resources';
import { logout } from '@/utils';
import { useRoute, useRouter } from 'vue-router';

/**
 * MAIN FUNCTION
 * Confirm new user email address.
 *
 * BEHAVIOR
 * Take user token from GET pars and use it for verifying email with a WS call.
 *
 * EXCEPTIONS
 * - User token not provided.
 */

/* Data */

const router = useRouter();
const route = useRoute();
const token = route.query.token as string;

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
  <div v-if="token" class="is-text-center">
    <ElButton type="primary" title="Conferma il tuo indirizzo email" @click="verifyEmail()"
      >Conferma email</ElButton
    >
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
