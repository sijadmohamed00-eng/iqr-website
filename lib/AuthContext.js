"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthChange, getUserData, checkSubscription, isAdmin } from "./firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthChange(async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        const [sub, adm] = await Promise.all([
          checkSubscription(fbUser.uid),
          isAdmin(fbUser.uid),
        ]);
        setSubscribed(sub);
        setAdmin(adm);
      } else {
        setUser(null);
        setSubscribed(false);
        setAdmin(false);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  return (
    <AuthContext.Provider value={{ user, subscribed, admin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
