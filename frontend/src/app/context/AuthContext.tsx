"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

interface User {
  username: string;
}

interface AuthData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface AuthContextType {
  auth: AuthData;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthData>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  // Parse JWT
  const parseToken = (token: string): User | null => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) return null;
      return {
        username:payload.sub,
      };
    } catch {
      return null;
    }
  };

  // Load token from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = parseToken(token);
      if (user) {
        setAuth({ user, token, isAuthenticated: true });
      } else {
        logout();
      }
    }
  }, []);

  const login = async (username: string, password: string) => {
    const res = await fetch("http://localhost:8080/auth/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) throw new Error("Login failed");

    const { token } = await res.json();
    const user = parseToken(token);
    if (!user) throw new Error("Invalid token");

    localStorage.setItem("token", token);
    setAuth({ user, token, isAuthenticated: true });
  };

  const register = async (username: string, email: string, password: string) => {
    const res = await fetch("http://localhost:8080/auth/v1/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (!res.ok) throw new Error("Registration failed");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuth({ user: null, token: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
