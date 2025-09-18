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
    const storedUser = localStorage.getItem("aim-foundation-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (DEV_MODE_BYPASS_LOGIN) {
      const devUser = mockUsers.Admin;
      if (!user || user.id !== devUser.id) {
          setUser(devUser);
          localStorage.setItem("aim-foundation-user", JSON.stringify(devUser));
      }
      setLoading(false);
      return;
    }
  }, [user]);

  const handleAuth = useCallback((newUser: User) => {
    setUser(newUser);
    localStorage.setItem("aim-foundation-user", JSON.stringify(newUser));
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
    localStorage.removeItem("aim-foundation-user");
    router.push("/login");
  }, [router]);

  const setRole = useCallback((role: Role) => {
    if (user) {
      const newUser = { ...mockUsers[role], id: user.id };
      setUser(newUser);
      localStorage.setItem("aim-foundation-user", JSON.stringify(newUser));
    }
  }, [user]);

  const value = { user, loading, login, googleLogin, logout, setRole };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
