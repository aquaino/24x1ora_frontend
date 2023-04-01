import axios from 'axios';
import { useUserStore } from '@/stores/user';

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

// Interceptor to refresh access token
// apiClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalRequest = error.config;
//     const store = useAppStore();
//     // If refresh token expired, logout
//     if (error.response.status === 401 && originalRequest.url.includes('/token/refresh')) {
//       store.$reset();
//       router.push({ name: 'Login' });
//       return Promise.reject(error);
//     }
//     // Else if access token expired and it's not a retry, refresh
//     else if (error.response.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;
//       if (store.user.refresh) {
//         await store.refreshToken();
//         return apiClient(originalRequest);
//       }
//     }

//     return Promise.reject(error);
//   },
// );

export default apiClient;
