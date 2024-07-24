import { sendGTMEvent } from '@next/third-parties/google';
import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
  GoogleAuthProvider,
  sendPasswordResetEmail as sendPasswordResetEmailFirebase,
  signInWithEmailAndPassword as signInWithEmailAndPasswordFirebase,
  signInWithPopup,
  UserCredential,
} from 'firebase/auth';

import { firebaseAuth, queryClient } from '@/libs';
import { portalApi, schemaParse } from '@/utils';

import { IUser, UserRole } from '@/types';

export class CustomError extends Error {
  constructor(message: string) {
    super(message);
  }
}

export class NonDeveloperError extends Error {}

export const getUser = async (): Promise<IUser> =>
  portalApi
    .get('/v3/users/me')
    .then(schemaParse(IUser))
    .then(async user => {
      if (user.role === UserRole.USER) {
        await logout();
        throw new NonDeveloperError();
      }

      return user;
    });

const signUp = async ({
  firstName,
  lastName,
  ...data
}: {
  email: string;
  firstName: string;
  lastName: string;
  signupType: 'google' | 'email';
}): Promise<IUser> =>
  portalApi.post('/v2/users/signup', {
    ...data,
    first_name: firstName,
    last_name: lastName,
    agreement: true,
  });

const getUserDataFromCredentials = (
  userCredential: UserCredential,
): {
  email: string;
  firstName: string;
  lastName: string;
} => {
  const additionalUserInfo = getAdditionalUserInfo(userCredential);
  const profile = additionalUserInfo?.profile;

  return {
    email: userCredential.user.email!,
    firstName:
      (profile?.given_name as string) ||
      userCredential.user.displayName?.split(' ')?.[0] ||
      'User',
    lastName:
      (profile?.family_name as string) ||
      userCredential.user.displayName?.split(' ')?.[1] ||
      'User',
  };
};

export const signInWithGoogle = async (isNewUser = false): Promise<IUser> => {
  const provider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(firebaseAuth, provider);
  const additionalUserInfo = getAdditionalUserInfo(userCredential);

  if (isNewUser || additionalUserInfo?.isNewUser)
    await signUp({
      ...getUserDataFromCredentials(userCredential),
      signupType: 'google',
    })
      .then(() => {
        sendGTMEvent({
          event: 'signup',
          method: 'google',
        });
      })
      .catch();

  return getUser();
};

export const signUpWithEmailAndPassword = async ({
  password,
  ...data
}: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}): Promise<IUser> => {
  await createUserWithEmailAndPassword(
    firebaseAuth,
    data.email.toLowerCase(),
    password,
  );
  await signUp({ ...data, signupType: 'email' });

  return getUser();
};

export const signInWithEmailAndPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}): Promise<IUser> => {
  await signInWithEmailAndPasswordFirebase(firebaseAuth, email, password);

  return getUser();
};

export const sendPasswordResetEmail = async (email: string) =>
  sendPasswordResetEmailFirebase(firebaseAuth, email);

export const getToken = () => firebaseAuth.currentUser?.getIdToken();

export async function logout() {
  await firebaseAuth.signOut();
  queryClient.clear();
  localStorage.clear();
  sessionStorage.clear();
}
