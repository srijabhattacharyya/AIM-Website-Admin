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
    // try {
    //   const storedUser = localStorage.getItem("ngo-hub-user");
    //   if (storedUser) {
    //     setUser(JSON.parse(storedUser));
    //   }
    // } catch (error) {
    //   console.error("Failed to parse user from localStorage", error);
    //   localStorage.removeItem("ngo-hub-user");
    // }
    // setLoading(false);
    setUser(mockUsers.Admin);
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
    // This is mock logic. In a real app, you'd verify credentials.
    // Here we default to Admin or find a user by email if needed.
    const loggedInUser = mockUsers.Admin;
    handleAuth(loggedInUser);
  }, [handleAuth]);

  const googleLogin = useCallback(async () => {
    setLoading(true);
    // Mock Google login, defaults to Donor role for variety
    const loggedInUser = mockUsers.Donor;
    handleAuth(loggedInUser);
  }, [handleAuth]);

  const logout = useCallback(async () => {
    // setUser(null);
    // localStorage.removeItem("ngo-hub-user");
    // router.push("/login");
    console.log("Logout disabled in dev mode");
  }, []);

  const setRole = useCallback((role: Role) => {
    if (user) {
      const newUser = mockUsers[role];
      setUser(newUser);
      localStorage.setItem("ngo-hub-user", JSON.stringify(newUser));
    }
  }, [user]);

  const value = { user, loading, login, googleLogin, logout, setRole };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
