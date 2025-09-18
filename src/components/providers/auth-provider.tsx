"use client";

import type { User, Role } from "@/lib/types";
import { mockUsers } from "@/lib/data";
import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  setRole: (role: Role) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In a real app, you'd use a library like next-auth
// or roll your own authentication.
// For this studio, we're mocking it.
const DEV_MODE_BYPASS_LOGIN = true;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (DEV_MODE_BYPASS_LOGIN) {
      const devUser = mockUsers.Admin;
      setUser(devUser);
      localStorage.setItem("ngo-hub-user", JSON.stringify(devUser));
      setLoading(false);
      return;
    }
    
    const storedUser = localStorage.getItem("ngo-hub-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
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
    // This is a mock login. In a real app, you'd validate credentials.
    const loggedInUser = mockUsers.Admin;
    handleAuth(loggedInUser);
  }, [handleAuth]);

  const googleLogin = useCallback(async () => {
    setLoading(true);
    const loggedInUser = mockUsers.Donor;
    handleAuth(loggedInUser);
  }, [handleAuth]);

  const logout = useCallback(async () => {
    setUser(null);
    localStorage.removeItem("ngo-hub-user");
    router.push("/login");
  }, [router]);

  const setRole = useCallback((role: Role) => {
    if (DEV_MODE_BYPASS_LOGIN) {
      const newUser = mockUsers[role];
      setUser(newUser);
      localStorage.setItem("ngo-hub-user", JSON.stringify(newUser));
    }
  }, []);

  const value = { user, loading, login, googleLogin, logout, setRole };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
