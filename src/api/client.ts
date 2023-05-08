import axios from 'axios';
import { useUserStore } from '@/stores/user';
import router from '@/router';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
});

// Request interceptor to set token
apiClient.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const token = userStore.access;
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to check token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const userStore = useUserStore();
    // If  token expired, logout
    if (error.response.status === 401) {
      userStore.$reset();
      router.push({ name: 'login' });
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
