import { defineStore } from 'pinia';

interface Navigation {
  rememberEmail: string | null;
  activeMenuItem: string;
}

export const useNavigationStore = defineStore('navigation', {
  state: (): Navigation => ({
    rememberEmail: null,
    activeMenuItem: '1',
  }),
  actions: {
    setRememberEmail(value: string | null) {
      this.rememberEmail = value;
    },
    setActiveMenuItem(value: string) {
      this.activeMenuItem = value;
    },
  },
  persist: true,
});
