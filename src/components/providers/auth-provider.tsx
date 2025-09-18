"use client";

import type { User, Role } from "@/lib/types";
import { mockUsers } from "@/lib/data";
import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  setRole: (role: Role) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // DEV MODE: Bypass login and set a default user.
    const devUser = mockUsers.Admin;
    setUser(devUser);
    localStorage.setItem("ngo-hub-user", JSON.stringify(devUser));
    setLoading(false);
  }, []);

  const handleAuth = useCallback((newUser: User) => {
    setUser(newUser);
    localStorage.setItem("ngo-hub-user", JSON.stringify(newUser));
    router.push("/dashboard");
    setLoading(false);
  }, [router]);
  
  const login = useCallback(async (email: string, pass: string) => {
    setLoading(true);
    const loggedInUser = mockUsers.Admin;
    handleAuth(loggedInUser);
  }, [handleAuth]);

  const googleLogin = useCallback(async () => {
    setLoading(true);
    const loggedInUser = mockUsers.Donor;
    handleAuth(loggedInUser);
  }, [handleAuth]);

  const logout = useCallback(async () => {
    // In dev mode, logout will just re-set the default user.
    const devUser = mockUsers.Admin;
    setUser(devUser);
    localStorage.setItem("ngo-hub-user", JSON.stringify(devUser));
    router.push("/login"); // Still go to login for visual consistency, but app is not protected
  }, [router]);

  const setRole = useCallback((role: Role) => {
    const newUser = mockUsers[role];
    setUser(newUser);
    localStorage.setItem("ngo-hub-user", JSON.stringify(newUser));
  }, []);

  const value = { user, loading, login, googleLogin, logout, setRole };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
