"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { supabase, checkSubscription, checkAdmin } from "./supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [subscribed, setSubscribed] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        const [{ subscribed: sub }, admin] = await Promise.all([
          checkSubscription(session.user.id),
          checkAdmin(session.user.id),
        ]);
        setSubscribed(sub);
        setIsAdmin(admin);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const [{ subscribed: sub }, admin] = await Promise.all([
          checkSubscription(session.user.id),
          checkAdmin(session.user.id),
        ]);
        setSubscribed(sub);
        setIsAdmin(admin);
      } else {
        setUser(null);
        setSubscribed(false);
        setIsAdmin(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, subscribed, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
