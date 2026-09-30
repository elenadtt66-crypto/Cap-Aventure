import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

export async function loginAdmin(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

export async function logoutAdmin(): Promise<void> {
  await signOut(auth);
}

export function subscribeToAuthState(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}
