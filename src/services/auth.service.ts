import {
  GoogleAuthProvider,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
} from 'firebase/auth';

import { firebaseAuth } from '@/libs';

export const AuthService = {
  signInWithGoogle: async () => {
    const provider = new GoogleAuthProvider();
    // TODO: Confirm the scope
    provider.addScope('https://www.googleapis.com/auth/contacts.readonly');
    provider.setCustomParameters({ login_hint: 'user@example.com' });

    return signInWithPopup(firebaseAuth, provider);
  },
  signInWithEmailAndPassword: ({
    email,
    password,
  }: {
    email: string;
    password: string;
  }) => signInWithEmailAndPassword(firebaseAuth, email, password),
  sendPasswordResetEmail: async (email: string) =>
    sendPasswordResetEmail(firebaseAuth, email),
  getToken: () => firebaseAuth.currentUser?.getIdToken(),
  logout: async () => {
    await firebaseAuth.signOut();
  },
};
