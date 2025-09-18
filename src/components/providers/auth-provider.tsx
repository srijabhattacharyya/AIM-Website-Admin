"use client";

import type { User, Role } from "@/lib/types";
import { allMockUsers, mockUsers } from "@/lib/data";
import { createContext, useState, useEffect, ReactNode, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  googleLogin: () => Promise<void>;
  logout: () => Promise<void>;
  setRole: (role: Role) => void;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = "aim-foundation-users";
const CURRENT_USER_STORAGE_KEY = "aim-foundation-user";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const storedUser = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // Ensure the user is still active on page load
      const allUsersString = localStorage.getItem(USERS_STORAGE_KEY);
      const allUsers: User[] = allUsersString ? JSON.parse(allUsersString) : allMockUsers;
      const liveUser = allUsers.find(u => u.id === parsedUser.id);
      
      if (liveUser && liveUser.status === 'Active') {
        setUser(liveUser);
      } else {
        // If user is not found or inactive, log them out
        localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const handleAuth = useCallback((newUser: User) => {
    if (newUser.status === 'Inactive') {
        toast({
          variant: "destructive",
          title: "Login Failed",
          description: "This account is inactive. Please contact an administrator.",
        });
        setLoading(false);
        return;
    }
    setUser(newUser);
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(newUser));
    router.push("/dashboard");
    setLoading(false);
  }, [router, toast]);
  
  const login = useCallback(async (email: string, pass: string) => {
    setLoading(true);
    
    const allUsersString = localStorage.getItem(USERS_STORAGE_KEY);
    const allUsers : User[] = allUsersString ? JSON.parse(allUsersString) : allMockUsers;
    
    // In a real app, you'd validate credentials against a backend
    const foundUser = allUsers.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (foundUser) {
      handleAuth(foundUser);
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "Invalid credentials. Please try again.",
      });
      setLoading(false);
    }
  }, [handleAuth, toast]);

  const googleLogin = useCallback(async () => {
    setLoading(true);
    // This is mock, finds the first donor
    const allUsersString = localStorage.getItem(USERS_STORAGE_KEY);
    const allUsers : User[] = allUsersString ? JSON.parse(allUsersString) : allMockUsers;
    const donorUser = allUsers.find(u => u.role === "Donor");
    
    if (donorUser) {
      handleAuth(donorUser);
    } else {
       toast({
        variant: "destructive",
        title: "Login Failed",
        description: "No donor account available for Google Sign-In.",
      });
      setLoading(false);
    }
  }, [handleAuth, toast]);

  const logout = useCallback(async () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    router.push("/login");
  }, [router]);

  const setRole = (role: Role) => {
    if (user) {
      const switchedUser = { ...user, role };
  
      // Update the current user state + storage
      setUser(switchedUser);
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(switchedUser));
  
      // Update the users list in localStorage
      const allUsersString = localStorage.getItem(USERS_STORAGE_KEY);
      let allUsers: User[] = allUsersString ? JSON.parse(allUsersString) : allMockUsers;
  
      allUsers = allUsers.map(u => 
        u.id === switchedUser.id ? switchedUser : u
      );
  
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(allUsers));
    }
  };

  const value = { user, loading, login, googleLogin, logout, setRole };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
