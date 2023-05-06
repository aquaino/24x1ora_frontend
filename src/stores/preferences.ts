import { defineStore } from 'pinia';

interface Preferences {
  rememberEmail: string | null;
}

interface StoreState {
  preferences: Preferences;
}

export const usePreferencesStore = defineStore('preferences', {
  state: (): StoreState => ({
    preferences: {
      rememberEmail: null,
    },
  }),
  actions: {
    setRememberEmail(value: string | null) {
      this.preferences.rememberEmail = value;
    },
  },
  persist: true,
});
