import apiClient from '../client';

const resource = 'users';

export interface User {
  name: string;
  email: string;
  isAdmin: boolean;
  id: number;
  updated_at: string;
  created_at: string;
  access?: string;
}

export interface UserInput {
  name: string;
  email: string;
  password: string;
}

export interface UserInputWihtConfirmPassword extends UserInput {
  confirmPassword: string;
}

export interface LoginData {
  status: boolean;
  token: string;
  token_type: string;
  expires_in: number;
}

export interface RegisterData {
  status: boolean;
  user: User;
}

export const usersApi = {
  async login(email: string, password: string): Promise<LoginData> {
    const response = await apiClient
      .post('/auth/login', {
        email: email,
        password: password,
      })
      .catch((error) => {
        throw error;
      });
    return response.data;
  },

  async register(user: UserInput | UserInputWihtConfirmPassword): Promise<RegisterData> {
    const response = await apiClient
      .post(`/${resource}/register`, {
        name: user.name,
        email: user.email,
        password: user.password,
      })
      .catch((error) => {
        throw error;
      });
    return response.data;
  },

  async getProfileDetails(): Promise<User> {
    const response = await apiClient.get(`/${resource}/profile`).catch((error) => {
      throw error;
    });
    return response.data.user;
  },
};
