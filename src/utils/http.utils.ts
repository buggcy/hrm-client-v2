import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';

import { PORTAL_API_BASE_URL, RQH_API_BASE_URL } from '@/constants';
import { getToken, logout } from '@/services';

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const onRequestFulfilled = async (config: InternalAxiosRequestConfig) => {
  const token = await getToken();

  if (token) config.headers['Authorization'] = `Bearer ${token}`;

  return config;
};

const onResponseFulfilled = (res: AxiosResponse) => res.data as AxiosResponse;

const onResponseRejected = async (error: AxiosError) => {
  const status = error.response?.status ?? 500;

  if (status === 500) console.error(error);
  if (status === 401) await logout();

  throw error;
};

export const portalApi = axios.create({
  baseURL: PORTAL_API_BASE_URL,
  headers: defaultHeaders,
});

portalApi.interceptors.request.use(onRequestFulfilled);
portalApi.interceptors.response.use(onResponseFulfilled, onResponseRejected);

export const rqhApi = axios.create({
  baseURL: RQH_API_BASE_URL,
  headers: defaultHeaders,
});

rqhApi.interceptors.request.use(onRequestFulfilled);
rqhApi.interceptors.response.use(onResponseFulfilled, onResponseRejected);
