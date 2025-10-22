import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

// api
import api from "./api";
// alert
import { toast } from "react-toastify";

interface User {
  email: string;
  username: string;
  avatar: string;
  last_login: string;
}

// user state checker
type AuthStatus = "checking" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  status: AuthStatus;

  refreshUser: () => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

const AuthContext = createContext<AuthContextValue | null>(null);

// provider
export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("checking");

  // returns a boolean
  const isAuthenticated = status === "authenticated";

  const refreshUser = async () => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    if (!token) {
      setUser(null);
      setStatus("unauthenticated");
      return;
    }

    try {
      setStatus("checking");
      const { data } = await api.get<User>("/user/user/");
      setUser(data);
      setStatus("authenticated");
    } catch (e: any) {
      setUser(null);
      setStatus("unauthenticated");
      toast.error("Login expired");
    }
  };

  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    setUser(null);
    setStatus("unauthenticated");
  };

  useEffect(() => {
    void refreshUser();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      status,
      refreshUser,
      logout,
      setUser,
    }),
    [user, isAuthenticated, status]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// error to the programmer
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used withibn an authProvider");
  return ctx;
};
