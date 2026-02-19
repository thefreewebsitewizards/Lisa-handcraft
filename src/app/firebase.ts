import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? 'AIzaSyCqAoxETs_gyv_HWVa6O1jx0nCFZfRBdQA',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ?? 'multi-tanent-projects.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID ?? 'multi-tanent-projects',
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ?? 'multi-tanent-projects.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '994746165516',
  appId: import.meta.env.VITE_FIREBASE_APP_ID ?? '1:994746165516:web:7a2422e6ad6b0d3c41c129',
};

export const STORE_ID = import.meta.env.VITE_STORE_ID ?? "lisa_handmade_craft";

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const storage = getStorage(app);

export async function callFunction<TResponse>(
  functionName: string,
  data: Record<string, unknown> = {},
  storeId: string = STORE_ID,
): Promise<TResponse> {
  const fn = httpsCallable(functions, functionName);
  const response = await fn({ ...data, storeId });
  return response.data as TResponse;
}
