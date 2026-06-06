"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

type AuthContextType = {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  async function fetchMe() {
    try {
      const res = await fetch("/api/auth/me");
      const { data, error } = await res.json();

      if (error) {
        setUser(null);
        localStorage.removeItem("knowlet-user");
        if (error.message !== "NO_TOKEN") router.push(`/signin`);
        return;
      }

      if (!data) {
        console.log("Data Not Found");
        return;
      }

      setUser(data);
      localStorage.setItem("knowlet-user", JSON.stringify(data));
    } catch {}
  }

  useEffect(() => {
    const stored = localStorage.getItem("knowlet-user");

    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (error) {
        console.error(error);
        toast.error((error as Error).message);
        localStorage.removeItem("knowlet-user");
      }
    }

    fetchMe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);

  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return ctx;
}
