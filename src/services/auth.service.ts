import {
  GoogleAuthProvider,
  sendPasswordResetEmail as sendPasswordResetEmailFirebase,
  signInWithEmailAndPassword as signInWithEmailAndPasswordFirebase,
  signInWithPopup,
} from 'firebase/auth';

import { firebaseAuth, queryClient } from '@/libs';

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  // TODO: Confirm the scope
  provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
  provider.setCustomParameters({ login_hint: 'user@example.com' });

  return signInWithPopup(firebaseAuth, provider);
};

export const signInWithEmailAndPassword = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => signInWithEmailAndPasswordFirebase(firebaseAuth, email, password);

export const sendPasswordResetEmail = async (email: string) =>
  sendPasswordResetEmailFirebase(firebaseAuth, email);

export const getToken = () => firebaseAuth.currentUser?.getIdToken();

export const logout = async () => {
  await firebaseAuth.signOut();
  localStorage.clear();
  sessionStorage.clear();
  await queryClient.invalidateQueries();
};
