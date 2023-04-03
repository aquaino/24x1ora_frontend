import { defineStore } from 'pinia';
import type { User } from '@/api/resources/users';

interface UserData {
  id: number | null;
  name: string | null;
  email: string | null;
  isAdmin: boolean | null;
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
      access: null,
    },
  }),
  actions: {
    setAccessToken(token: string) {
      this.user.access = token;
    },
    setUserData(data: User) {
      this.user.name = data.name;
      this.user.email = data.email;
      this.user.isAdmin = data.isAdmin;
      this.user.id = data.id;
    },
  },
  persist: true,
});
