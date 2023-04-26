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

interface UserState {
  user: UserData;
}

export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    user: {
      id: null,
      name: null,
      email: null,
      isAdmin: null,
      email_verified_at: null,
      access: null,
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
      this.user.isAdmin = data.isAdmin;
      this.user.email_verified_at = data.email_verified_at;
    },
  },
  persist: true,
});
