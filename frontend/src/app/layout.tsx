import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./charts.css";
import { CryptoProvider } from "@/app/context/cryptoContext";
import { StockProvider } from "@/app/context/stockContext";
import { AuthProvider } from "./context/AuthContext";

import ChatBot from "@/components/chatbot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WealthOne",
  description: "Unified platform to analyze funds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
        <StockProvider>
          <CryptoProvider>
            {children}
            <ChatBot />
          </CryptoProvider>
        </StockProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
