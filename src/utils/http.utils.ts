import axios, {
  AxiosError,
  AxiosResponse,
  CanceledError,
  InternalAxiosRequestConfig,
} from 'axios';

import { API_BASE_URL, xApiKey } from '@/constants';
import { getToken, logout } from '@/services';

const defaultHeaders = {
  'Content-Type': 'application/json',
  'x-api-key': xApiKey,
};

const addBearerToken = (config: InternalAxiosRequestConfig) => {
  try {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Failed to get token:', error);
  }
  return config;
};

const onRequestFulfilled = (config: InternalAxiosRequestConfig) => {
  const token = getToken();

  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  if (config.data instanceof FormData)
    config.headers['Content-Type'] = 'multipart/form-data';

  return config;
};

const onResponseFulfilled = (res: AxiosResponse) => res.data as AxiosResponse;

const onResponseRejected = async (error: AxiosError) => {
  const status = error.response?.status ?? 500;

  if (status === 500 && !((error as unknown) instanceof CanceledError)) {
    console.error(error);
  }
  if (status === 401 || status === 440) await logout();

  throw error;
};

export const portalApi = axios.create({
  baseURL: API_BASE_URL,
  headers: defaultHeaders,
});

portalApi.interceptors.request.use(onRequestFulfilled);
portalApi.interceptors.response.use(onResponseFulfilled, onResponseRejected);

export const baseAPI = axios.create({
  baseURL: API_BASE_URL,
  headers: defaultHeaders,
});
baseAPI.interceptors.request.use(addBearerToken);
baseAPI.interceptors.request.use(onRequestFulfilled);
baseAPI.interceptors.response.use(onResponseFulfilled, onResponseRejected);

export const getErrorMessage = (error: Error) =>
  (error as AxiosError<{ message: string }>)?.response?.data?.message ||
  error.message;
