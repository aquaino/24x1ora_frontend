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

export const useUserStore = defineStore('user', {
  state: (): UserData => ({
    id: null,
    name: null,
    email: null,
    isAdmin: null,
    email_verified_at: null,
    access: null,
  }),
  actions: {
    setAccessToken(token: string) {
      this.access = token;
    },
    setUserData(data: User) {
      this.id = data.id;
      this.name = data.name;
      this.email = data.email;
      this.isAdmin = data.isAdmin;
      this.email_verified_at = data.email_verified_at;
    },
  },
  persist: true,
});
