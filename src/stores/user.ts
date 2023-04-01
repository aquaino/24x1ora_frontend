import { defineStore } from 'pinia';
import type { User } from '@/api/resources/users';

interface UserState {
  user: User | null;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: null,
  }),
  actions: {
    setAccessToken(token: string) {
      if (this.user) {
        this.user.access = token;
      }
    },
    setUserData(data: User) {
      if (this.user) {
        this.user.name = 'test';
        this.user.email = 'test';
        this.user.isAdmin = true;
        this.user.updated_at = 'test';
        this.user.created_at = 'test';
        this.user.id = 9;
      }
    },
  },
  persist: true,
});
