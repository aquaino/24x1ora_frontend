import { defineStore } from 'pinia';
import type { User } from '@/api/interfaces';

interface UserData {
  id: number | null;
  name: string | null;
  email: string | null;
  isAdmin: boolean | null;
  email_verified_at: string | null;
  access: string | null;
}

interface PreferencesData {
  rememberEmail: string | null;
}

export type FeedbackType = 'success' | 'warning' | 'error' | 'info';

interface Feedback {
  type: FeedbackType | null;
  text: string | null;
}

interface NavigationData {
  activeMenuItem: string;
  RegistrationsAsTable: {
    filters: { race: string[] };
  };
  feedback: Feedback;
}

interface StoreData {
  user: UserData;
  preferences: PreferencesData;
  navigation: NavigationData;
}

export const useAppStore = defineStore('store', {
  state: (): StoreData => ({
    user: {
      id: null,
      name: null,
      email: null,
      isAdmin: null,
      email_verified_at: null,
      access: null,
    },
    preferences: {
      rememberEmail: null,
    },
    navigation: {
      activeMenuItem: '1',
      RegistrationsAsTable: {
        filters: { race: [] },
      },
      feedback: {
        type: null,
        text: null,
      },
    },
  }),
  actions: {
    setAccessToken(token: string) {
      this.user.access = token;
    },
    setUserData(data: User) {
      this.user.id = data.id;
      this.user.name = data.name;
      this.user.email = data.email;
      this.user.isAdmin = data.isAdmin === 1;
      this.user.email_verified_at = data.email_verified_at;
    },
    setRememberEmail(value: string | null) {
      this.preferences.rememberEmail = value;
    },
    setActiveMenuItem(value: string) {
      this.navigation.activeMenuItem = value;
    },
    clearUserData() {
      this.user = {
        id: null,
        name: null,
        email: null,
        isAdmin: null,
        email_verified_at: null,
        access: null,
      };
    },
    setFeedback(type: FeedbackType, text?: string) {
      this.navigation.feedback = {
        type: type,
        text: text || null,
      };
    },
    clearFeedback() {
      this.navigation.feedback = {
        type: null,
        text: null,
      };
    },
  },
  persist: true,
});
