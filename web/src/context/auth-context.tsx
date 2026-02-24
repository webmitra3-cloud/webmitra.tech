import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearSession, getAccessToken } from "@/lib/auth-storage";
import { getCsrfTokenFromServer, loginRequest, logoutRequest, meRequest } from "@/lib/api";
import { User } from "@/types";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      if (!getAccessToken()) {
        setUser(null);
        return;
      }
      const me = await meRequest();
      setUser(me);
    } catch (error) {
      clearSession();
      setUser(null);
    }
  };

  useEffect(() => {
    Promise.all([getCsrfTokenFromServer(), refreshUser()]).finally(() => setLoading(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      login: async (email: string, password: string) => {
        const loggedInUser = await loginRequest({ email, password });
        setUser(loggedInUser);
      },
      logout: async () => {
        try {
          await logoutRequest();
        } finally {
          clearSession();
          setUser(null);
        }
      },
      refreshUser,
    }),
    [user, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
