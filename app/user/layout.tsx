'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { NavigationMenu } from "@radix-ui/react-navigation-menu";
import { NavigationMenuDemo } from "./menu";
import { Input } from "@/components/ui/input";
import SearchPage from "./search";

export default function UserLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { user, setUser, logout } = useAuth();
    const pathname = usePathname();

    // On mount, verify token and fetch user info, diy middleware for every refresh
    useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const verifyUser = async () => {
      try {
        const res = await api.get("/api/verify-user", { //RETURN THE IMAGE PATH IF EXIST AH
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(res.data.user_info);
        console.log("User set:", res.data.user_info); // for debugging again
      } catch (error) {
        console.error("Verification failed:", error);
        localStorage.removeItem("token");
        setUser(null);
        router.push("/auth/login");
      }
    };

    verifyUser();
  }, [pathname]);// Added pathname to re-verify on route change

  // for debugging
  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  if (!user) {
    // This will trigger if verification fails
    return null;
  }
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="flex h-16 items-center justify-between px-6 bg-primary text-primary-foreground shadow-md border border-red-500 md:px-[50px]">
          <h1 className="md:text-2xl text-md font-semibold">Mu - So</h1>
          <SearchPage />

        
        <NavigationMenuDemo />
      </header>


      {/* Main Content */}
      <main className="flex-1 overflow-y-auto rounded-xl">
        {children}
      </main>
    </div>
  );
}
