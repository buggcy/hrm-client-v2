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
import { portalApi } from '@/utils';

import { IUser } from '@/types';

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
  // TODO: Confirm the scope
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
  provider.setCustomParameters({ login_hint: 'user@example.com' });

  const userCredential = await signInWithPopup(firebaseAuth, provider);
  const additionalUserInfo = getAdditionalUserInfo(userCredential);

  if (isNewUser || additionalUserInfo?.isNewUser)
    await signUp({
      ...getUserDataFromCredentials(userCredential),
      signupType: 'google',
    }).catch();

  return queryClient.fetchQuery({ queryKey: ['user'] });
};

export const signUpWithEmailAndPassword = async ({
  password,
  ...data
}: {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}) => {
  await createUserWithEmailAndPassword(
    firebaseAuth,
    data.email.toLowerCase(),
    password,
  );
  await signUp({ ...data, signupType: 'email' });

  return queryClient.fetchQuery({ queryKey: ['user'] });
};

export const signInWithEmailAndPassword = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  await signInWithEmailAndPasswordFirebase(firebaseAuth, email, password);

  return queryClient.fetchQuery({ queryKey: ['user'] });
};

export const sendPasswordResetEmail = async (email: string) =>
  sendPasswordResetEmailFirebase(firebaseAuth, email);

export const getToken = () => firebaseAuth.currentUser?.getIdToken();

export const logout = async () => {
  await firebaseAuth.signOut();
  queryClient.clear();
  localStorage.clear();
  sessionStorage.clear();
};
