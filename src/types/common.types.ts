import { QueryKey, UseQueryOptions } from '@tanstack/react-query';

declare global {
  interface Window {
    toggleDevtools: () => void;
  }
}

export interface ParentReactNode extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
}

export type UseQueryConfig<T = unknown> = {
  queryKey?: QueryKey;
  queryParams?: Record<string, unknown>;
} & Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>;

export interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export interface SuccessResponse {
  message?: string;
  email?: string;
}

export interface MessageErrorResponse {
  message: string;
}

export interface MessageErrorResponseWithError {
  error: string;
}
