"use client";
import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import axios from "axios";

export default function CredentialsForm() {
  const [formData, setState] = useState({
    upstoxApiKey: "",
    upstoxApiSecret: "",
    coindcxApiKey: "",
    coindcxApiSecret: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setState(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const url = "http://localhost:8080/auth/v1/";
    try {
      const res = await axios.post(url, formData, {
        headers: { "Content-Type": "application/json" }
      });
      console.log("Response:", res.data);
    } 
    catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="shadow-lg w-full max-w-md rounded-xl bg-white p-6 md:p-8 dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold dark:text-white">API Credentials</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Your credentials are encrypted and securely stored.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Upstox</h3>
            <LabelInputContainer>
              <Label htmlFor="upstoxApiKey">API Key</Label>
              <Input
                id="upstoxApiKey"
                placeholder="Enter your Upstox API key"
                type="text"
                value={formData.upstoxApiKey}
                onChange={handleChange}
                className="focus-visible:ring-blue-500"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="upstoxApiSecret">API Secret</Label>
              <Input
                id="upstoxApiSecret"
                placeholder="Enter your Upstox API secret"
                type="password"
                value={formData.upstoxApiSecret}
                onChange={handleChange}
                className="focus-visible:ring-blue-500"
              />
            </LabelInputContainer>
          </div>

          <div className="h-px w-full bg-gray-200 dark:bg-gray-700" />

          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">CoinDCX</h3>
            <LabelInputContainer>
              <Label htmlFor="coindcxApiKey">API Key</Label>
              <Input
                id="coindcxApiKey"
                placeholder="Enter your CoinDCX API key"
                type="text"
                value={formData.coindcxApiKey}
                onChange={handleChange}
                className="focus-visible:ring-blue-500"
              />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label htmlFor="coindcxApiSecret">API Secret</Label>
              <Input
                id="coindcxApiSecret"
                placeholder="Enter your CoinDCX API secret"
                type="password"
                value={formData.coindcxApiSecret}
                onChange={handleChange}
                className="focus-visible:ring-blue-500"
              />
            </LabelInputContainer>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              className="group relative flex-1 h-11 items-center justify-center rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              type="submit"
            >
              Save Credentials
              <BottomGradient />
            </button>
            <Link 
              href="/dashboard" 
              className="group relative flex-1 h-11 rounded-md bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600 transition-colors flex items-center justify-center font-medium focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Skip for Now
              <BottomGradient />
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};