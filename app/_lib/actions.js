'use server';

// import { signOut } from 'next-auth/react';
import { signIn, signOut } from './auth';

export async function signinAction() {
  await signIn('google', { redirectTo: '/account' });
}

export async function signOutAction() {
  await signOut({ redirectTo: '/' });
}
