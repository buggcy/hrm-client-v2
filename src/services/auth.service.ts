import { AxiosResponse } from 'axios';

import { queryClient } from '@/libs';
import { baseAPI } from '@/utils';

export class CustomError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NonDeveloperError extends Error {}

// export const getUser = (): Promise<IUser> =>
//   portalApi
//     .get('/v3/users/me')
//     .then(schemaParse(IUser))
//     .then(user => {
//       if (user.role === UserRole.USER) {
//         logout();
//         throw new NonDeveloperError();
//       }

//       return user;
//     });

export const signInWithEmailAndPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<AxiosResponse> => {
  const res = await baseAPI.post('/login', { email, password });
  return res;
};

export const sendPasswordResetEmail = async ({
  email,
}: {
  email: string;
}): Promise<AxiosResponse> => {
  const res = await baseAPI.post('/forgot-password', { email });
  return res;
};

export const sendDataForResetPassword = async ({
  email,
  password,
  otp,
}: {
  email: string;
  password: string;
  otp: string;
}): Promise<AxiosResponse> => {
  const res = await baseAPI.post('/reset-password', { email, password, otp });
  return res;
};

export const getTypes = async (): Promise<AxiosResponse> => {
  const res = await baseAPI.get('/types');
  return res;
};

export const getToken = () => {
  const authStorage = sessionStorage.getItem('auth-storage');

  if (authStorage) {
    try {
      const parsedData = JSON.parse(authStorage);
      return parsedData?.state?.token || null;
    } catch (error) {
      console.error('Failed to parse auth-storage:', error);
      return null;
    }
  }

  return null;
};

export function logout() {
  queryClient.clear();
  localStorage.clear();
  sessionStorage.clear();
}
