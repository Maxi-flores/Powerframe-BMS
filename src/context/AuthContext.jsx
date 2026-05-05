import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config.js";
import {
  signInWithEmail,
  signInWithGoogle,
  sendPasswordReset,
  signOut as firebaseSignOut,
} from "../firebase/auth.js";

const AuthContext = createContext();

function savePowerframeSession(user, name) {
  localStorage.setItem(
    "powerframe_user",
    JSON.stringify({
      id: user.uid,
      email: user.email,
      name: name || user.displayName || user.email,
      provider: "firebase",
      token: "TEMP_TOKEN",
      expiresAt: Date.now() + 1000 * 60 * 60 * 24,
    })
  );
}

function clearPowerframeSession() {
  localStorage.removeItem("powerframe_user");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        savePowerframeSession(currentUser);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  async function login(email, password) {
    const result = await signInWithEmail(email, password);
    savePowerframeSession(result.user);
    return result;
  }

  async function loginWithGoogle() {
    const result = await signInWithGoogle();
    savePowerframeSession(result.user);
    return result;
  }

  async function logout() {
    await firebaseSignOut();
    clearPowerframeSession();
  }

  async function resetPassword(email) {
    return sendPasswordReset(email);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        loginWithGoogle,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
