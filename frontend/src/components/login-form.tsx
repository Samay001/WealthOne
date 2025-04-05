"use client"
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from 'axios';
import { useRouter } from "next/navigation";

export function LoginForm({
  type, // "login" or "register"
  className,
  ...props
}: {
  type: "login" | "register";
} & React.ComponentProps<"form">) {
  const isLogin = type === "login";

  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Fixed: added parentheses to call the function

    try {
      const url = isLogin ? "http://localhost:8080/auth/v1/login" : "http://localhost:8080/auth/v1/register";
      const data = isLogin ? { username, password } : { username, email, password };
      ;
      const res = await axios.post(url, data, { withCredentials: true });
      
      const jwt_token = res.data.token;
      //store in local storage
      

      if (res.status === 200) {
        if(isLogin){
          alert("Login Successful");
          router.push("/credential")
        }
        else{
          alert("Register Successful");
          router.push("/login");
        }   
      }
    }
    catch (error) {
      console.error("Error:", error);
      alert("Something went wrong");
    }
  }
  
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">
          {isLogin ? "Login to your account" : "Create an account"}
        </h1>
        <p className="text-muted-foreground text-sm">
          {isLogin
            ? "Enter your email below to login to your account"
            : "Enter your details below to create your account"}
        </p>
      </div>
      <div className="grid gap-6">
        {/* Fixed: Add username field for login too */}
        <div className="grid gap-3">
          <Label htmlFor="username">Username</Label>
          <Input 
            id="username" 
            type="text" 
            placeholder="johndoe" 
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        {!isLogin && (
          <div className="grid gap-3">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="m@example.com" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
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
          />
        </div>
        <Button type="submit" className="w-full">
          {isLogin ? "Login" : "Sign Up"}
        </Button>
        <div className="text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"} {" "}
          <a href={isLogin ? "/register" : "/login"} className="underline underline-offset-4">
            {isLogin ? "Sign up" : "Login"}
          </a>
        </div>
      </div>
    </form>
  );
}