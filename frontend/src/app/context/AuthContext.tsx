"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from "react";

interface User {
  username: string;
}

interface AuthData {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  upstoxApiKey: string;
  upstoxApiSecret: string;
  coindcxApiKey: string;
  coindcxApiSecret: string;
}

interface AuthContextType {
  auth: AuthData;
  login: (username: string, password: string) => Promise<void>;
  register: (data: RegisterPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthData>({
    user: null,
    token: null,
    isAuthenticated: false,
  });

  const parseToken = useCallback((token: string): User | null => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < currentTime) {
        return null;
      }
      return {
        username: payload.sub,
      };
    } catch {
      return null;
    }
  }, []);

  const logout = useCallback(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
    setAuth({ user: null, token: null, isAuthenticated: false });
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token) {
        const user = parseToken(token);
        if (user) {
          setAuth({ user, token, isAuthenticated: true });
        } else {
          logout();
        }
      }
    }
  }, [parseToken, logout]);

  const login = async (username: string, password: string) => {
    try {
      const res = await fetch("https://wealthone.onrender.com/auth/v1/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.message || "Login failed");
      }

      const { token } = await res.json();
      
      if (!token) {
        throw new Error("No token received from server");
      }

      const user = parseToken(token);
      if (!user) {
        throw new Error("Invalid token received");
      }

      if (typeof window !== "undefined") {
        localStorage.setItem("token", token);
      }
      setAuth({ user, token, isAuthenticated: true });
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  const register = async ({
    username,
    email,
    password,
    upstoxApiKey,
    upstoxApiSecret,
    coindcxApiKey,
    coindcxApiSecret,
  }: RegisterPayload) => {
    try {
      const res = await fetch("https://wealthone.onrender.com/auth/v1/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email,
          password,
          upstoxApiKey,
          upstoxApiSecret,
          coindcxApiKey,
          coindcxApiSecret,
        }),
      });
      //log the response status
      console.log("Registration response status:", res.status);

      if (!res.ok) {
        const errorBody = await res.json();
        throw new Error(errorBody.message || "Registration failed");
      }

      // Registration successful - the response might contain user data
      await res.json();
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
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