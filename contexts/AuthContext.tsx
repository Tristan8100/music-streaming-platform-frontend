
"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

export type User = {
  id: number;
  name: string;
  email: string;
};

//define type for context
type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (user: User, token: string) => void;
  logout: () => void;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  // login function to set user and token, can also be used in cookie based auth
  const login = (user: User, token: string) => {
    setUser(user);
    localStorage.setItem("token", token);
    console.log(token);
  };

  // logout function to clear user and token, can also be used in cookie based auth
  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    router.push("/auth/login");
  };

  return (
    // pass the value to the context to use in other components
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};