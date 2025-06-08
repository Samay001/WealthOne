"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";

interface LoginFormProps extends React.ComponentProps<"form"> {
  type: "login" | "register";
}

export function LoginForm({ type, className, ...props }: LoginFormProps) {
  const isLogin = type === "login";
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [upstoxApiKey, setUpstoxApiKey] = useState("");
  const [upstoxApiSecret, setUpstoxApiSecret] = useState("");
  const [coindcxApiKey, setCoindcxApiKey] = useState("");
  const [coindcxApiSecret, setCoindcxApiSecret] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (isLogin) {
        await login(username, password);
        router.push("/");
      } else {
        await register({
          username,
          email,
          password,
          upstoxApiKey,
          upstoxApiSecret,
          coindcxApiKey,
          coindcxApiSecret,
        });
        router.push("/login");
      }
    } catch (error: any) {
      setError(error.message || "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          {isLogin ? "Login to your account" : "Create an account"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {isLogin
            ? "Enter your credentials below to login to your account"
            : "Enter your details below to create your account"}
        </p>
      </div>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      <div className="grid gap-6">
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            type="text"
            placeholder="johndoe"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {!isLogin && (
          <>
            <div className="grid gap-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="upstoxApiKey">Upstox API Key</Label>
              <Input
                id="upstoxApiKey"
                type="text"
                placeholder="Enter Upstox API Key"
                required
                value={upstoxApiKey}
                onChange={(e) => setUpstoxApiKey(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="upstoxSecretKey">Upstox Secret Key</Label>
              <Input
                id="upstoxSecretKey"
                type="password"
                placeholder="Enter Upstox Secret Key"
                required
                value={upstoxApiSecret}
                onChange={(e) => setUpstoxApiSecret(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="coindcxApiKey">CoinDCX API Key</Label>
              <Input
                id="coindcxApiKey"
                type="text"
                placeholder="Enter CoinDCX API Key"
                required
                value={coindcxApiKey}
                onChange={(e) => setCoindcxApiKey(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div className="grid gap-3">
              <Label htmlFor="coindcxSecretKey">CoinDCX Secret Key</Label>
              <Input
                id="coindcxSecretKey"
                type="password"
                placeholder="Enter CoinDCX Secret Key"
                required
                value={coindcxApiSecret}
                onChange={(e) => setCoindcxApiSecret(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </>
        )}

        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {isLogin && (
              <a href="#" className="ml-auto text-sm underline-offset-4 hover:underline">
                Forgot your password?
              </a>
            )}
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Processing..." : isLogin ? "Login" : "Sign Up"}
        </Button>

        <div className="text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <a href={isLogin ? "/register" : "/login"} className="underline underline-offset-4">
            {isLogin ? "Sign up" : "Login"}
          </a>
        </div>
      </div>
    </form>
  );
}