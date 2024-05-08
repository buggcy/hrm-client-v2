import { QueryClient } from '@tanstack/react-query';
// import axios, { AxiosError } from 'axios';
// import { API_BASE_URL } from '@/constants';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      retryDelay: 5000,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
    },
  },
});

// export const HttpService = axios.create({
//   baseURL: API_BASE_URL,
//   headers: { 'Content-Type': 'application/json' },
// });

// HttpService.interceptors.request.use(async config => {
//   const token = await firebase.getToken();

//   if (token) config.headers['Authorization'] = `Bearer ${token}`;

//   return config;
// });

// HttpService.interceptors.response.use(
//   res => res.data,
//   async (error: AxiosError) => {
//     const status = error.response?.status || 500;

//     if (status === 500) Logs.captureException(error);
//     if (status === 401) {
//       await firebase.logout();
//       localStorage.clear();
//       window.location.href = '/login';
//     }

//     throw error;
//   },
// );
