"use client";

import React, { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function BookAndCredentialsForm() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    upstoxApiKey: "",
    upstoxApiSecret: "",
    coindcxApiKey: "",
    coindcxApiSecret: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const url = "http://localhost:8080/api/v1/user-credentials";

    try {
      const res = await axios.put(url, formData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      alert("Submitted successfully");
      router.push("/dashboard");
    } catch (error) {
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-white text-black dark:bg-black dark:text-white p-4">
      <div className="w-full max-w-md rounded-xl border border-black dark:border-white p-6 md:p-8">
        <h2 className="text-2xl font-bold">API Credentials</h2>
        <p className="mt-2 text-sm">
            Your credentials are encrypted and securely stored.
        </p>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>        
          <Divider />
          <Section title="Upstox">
            <LabeledInput
              id="upstoxApiKey"
              label="API Key"
              placeholder="Upstox API Key"
              value={formData.upstoxApiKey}
              onChange={handleChange}
            />
            <LabeledInput
              id="upstoxApiSecret"
              label="API Secret"
              placeholder="Upstox API Secret"
              type="password"
              value={formData.upstoxApiSecret}
              onChange={handleChange}
            />
          </Section>

          <Divider />

          <Section title="CoinDCX">
            <LabeledInput
              id="coindcxApiKey"
              label="API Key"
              placeholder="CoinDCX API Key"
              value={formData.coindcxApiKey}
              onChange={handleChange}
            />
            <LabeledInput
              id="coindcxApiSecret"
              label="API Secret"
              placeholder="CoinDCX API Secret"
              type="password"
              value={formData.coindcxApiSecret}
              onChange={handleChange}
            />
          </Section>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 h-11 rounded-md bg-black text-white dark:bg-white dark:text-black font-medium hover:opacity-80 transition"
            >
              Save
            </button>
            <Link
              href="/dashboard"
              className="flex-1 h-11 rounded-md border border-black dark:border-white flex items-center justify-center font-medium hover:opacity-80 transition"
            >
              Skip
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

const Divider = () => (
  <div className="h-px w-full bg-black dark:bg-white my-2" />
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-4">
    <h3 className="text-lg font-semibold">{title}</h3>
    {children}
  </div>
);

const LabeledInput = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
}) => (
  <div className="flex flex-col space-y-1">
    <Label htmlFor={id}>{label}</Label>
    <Input
      id={id}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      type={type}
      className="bg-white text-black dark:bg-black dark:text-white border border-black dark:border-white focus-visible:ring-0 focus-visible:ring-offset-0"
    />
  </div>
);
