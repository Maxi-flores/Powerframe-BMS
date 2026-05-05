import {
  signInWithEmailAndPassword as firebaseSignInWithEmail,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail as firebaseSendPasswordReset,
  signOut as firebaseSignOut,
} from "firebase/auth";
import { auth } from "./config.js";

const googleProvider = new GoogleAuthProvider();

export async function signInWithEmail(email, password) {
  return firebaseSignInWithEmail(auth, email, password);
}

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function sendPasswordReset(email) {
  return firebaseSendPasswordReset(auth, email);
}

export async function signOut() {
  return firebaseSignOut(auth);
}
