"use client";

import { usePathname } from "next/navigation";
import ChatBot from "@/components/chatbot";

const chatbotRoutes = new Set(["/dashboard", "/stocks", "/crypto"]);

export function ChatBotGate() {
  const pathname = usePathname();

  return chatbotRoutes.has(pathname) ? <ChatBot /> : null;
}
