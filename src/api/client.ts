import axios from 'axios';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BACKEND_URL,
});

// Request interceptor to set token
apiClient.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    if (userStore.user) {
      const token = userStore.user.access;
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Interceptor to check token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const store = useUserStore();
    // If  token expired, logout
    if (error.response.status === 401) {
      store.$reset();
      const router = useRouter();
      router.push({ name: 'Login' });
      return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
