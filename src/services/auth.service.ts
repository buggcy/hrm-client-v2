import { AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

import { queryClient } from '@/libs';
import { baseAPI } from '@/utils';

import { VerifyCodeResponseType } from '@/types/auth.types';

type AuthResponse = {
  token: string;
};
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
}): Promise<AuthResponse> => {
  const { token }: AuthResponse = await baseAPI.post('/login', {
    email: email.toLowerCase(),
    password,
  });

  return { token };
};

export const sendPasswordResetEmail = async ({
  email,
}: {
  email: string;
}): Promise<AxiosResponse> => {
  const res = await baseAPI.post('/forgot-password', {
    email: email.toLowerCase(),
  });
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
  const res = await baseAPI.post('/reset-password', {
    email: email.toLowerCase(),
    password,
    otp,
  });
  return res;
};

export const getTypes = async (): Promise<AxiosResponse> => {
  const res = await baseAPI.get('/types');
  return res;
};

export const verifyRegisterCode = async ({
  code,
}: {
  code: string;
}): Promise<VerifyCodeResponseType> => {
  const {
    employee,
    educationExperiences,
    additionalDocuments,
    kyc,
  }: VerifyCodeResponseType = await baseAPI.post('/verify', {
    uniqueCode: code,
  });
  return { employee, educationExperiences, additionalDocuments, kyc };
};

export const registerEmployee = async (
  formData: FormData,
): Promise<AxiosResponse> => {
  const res = await baseAPI.post(
    '/Signup/update-details-add-experience',
    formData,
  );
  return res;
};

export const getToken = () => {
  const token = Cookies.get('hrmsToken');
  return token || null;
};

export function logout(): Promise<void> {
  return new Promise(resolve => {
    queryClient.clear();
    localStorage.clear();
    sessionStorage.clear();
    resolve();
  });
}
