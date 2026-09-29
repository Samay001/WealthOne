"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, ChevronDown, MessageCircle, Send, Sparkles, User, X } from "lucide-react";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
}

const starters = ["Review my allocation", "What is my biggest risk?", "Explain my portfolio return"];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: "Hi, I’m your **WealthOne AI advisor**. I can help you understand allocation, risk, and the positions in this portfolio." },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const sendMessage = async (question: string) => {
    const prompt = question.trim();
    if (!prompt || isLoading) return;
    setMessages((current) => [...current, { id: `${Date.now()}-user`, role: "user", content: prompt }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to reach the advisor");
      setMessages((current) => [...current, { id: `${Date.now()}-assistant`, role: "assistant", content: data.text }]);
    } catch {
      setMessages((current) => [...current, { id: `${Date.now()}-error`, role: "assistant", content: "I couldn’t complete that request. Please try again in a moment." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    void sendMessage(input);
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] sm:bottom-6 sm:right-6">
      {isOpen ? (
        <section className="flex h-[min(680px,calc(100vh-2rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[26px] border border-white/10 bg-[#0b1512]/95 text-white shadow-[0_28px_90px_rgba(0,0,0,.48)] backdrop-blur-2xl sm:h-[600px] sm:w-[400px]" aria-label="WealthOne AI assistant">
          <header className="border-b border-white/[0.07] px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="relative grid size-10 place-items-center rounded-2xl bg-[#c8ff62] text-[#07100d]"><Sparkles className="size-4" /><span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-[#0b1512] bg-[#6ee7a8]" /></div>
              <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="text-sm font-semibold">WealthOne AI</h2><span className="rounded-full bg-[#c8ff62]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#c8ff62]">Gemini 2.5 Flash</span></div><p className="mt-0.5 text-[11px] text-white/35">Portfolio intelligence, on demand</p></div>
              <button onClick={() => setIsOpen(false)} className="grid size-8 place-items-center rounded-xl text-white/35 transition hover:bg-white/[0.06] hover:text-white" aria-label="Close assistant"><ChevronDown className="size-4" /></button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-5" aria-live="polite">
            <div className="space-y-5">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" ? <div className="grid size-7 shrink-0 place-items-center rounded-xl bg-[#c8ff62]/10 text-[#c8ff62]"><Bot className="size-3.5" /></div> : null}
                  <div className={`max-w-[82%] rounded-2xl px-3.5 py-3 text-[13px] leading-6 ${message.role === "user" ? "rounded-br-md bg-[#c8ff62] text-[#07100d]" : "rounded-bl-md border border-white/[0.07] bg-white/[0.045] text-white/72"}`}>
                    <ReactMarkdown components={{ p: ({ children }) => <p>{children}</p>, strong: ({ children }) => <strong className="font-semibold text-inherit">{children}</strong>, ul: ({ children }) => <ul className="mt-2 list-disc space-y-1 pl-4">{children}</ul>, a: ({ children, href }) => <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-2">{children}</a> }}>{message.content}</ReactMarkdown>
                  </div>
                  {message.role === "user" ? <div className="grid size-7 shrink-0 place-items-center rounded-xl bg-[#a78bfa]/15 text-[#b9a4ff]"><User className="size-3.5" /></div> : null}
                </div>
              ))}
              {isLoading ? <div className="flex items-end gap-2"><div className="grid size-7 place-items-center rounded-xl bg-[#c8ff62]/10 text-[#c8ff62]"><Bot className="size-3.5" /></div><div className="flex gap-1 rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.045] px-4 py-4"><span className="size-1.5 animate-bounce rounded-full bg-white/35 [animation-delay:-.3s]" /><span className="size-1.5 animate-bounce rounded-full bg-white/35 [animation-delay:-.15s]" /><span className="size-1.5 animate-bounce rounded-full bg-white/35" /></div></div> : null}
              <div ref={endRef} />
            </div>
          </div>

          {messages.length === 1 ? <div className="flex gap-2 overflow-x-auto px-4 pb-3">{starters.map((starter) => <button key={starter} onClick={() => void sendMessage(starter)} className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[10px] text-white/45 transition hover:border-[#c8ff62]/30 hover:text-[#c8ff62]">{starter}</button>)}</div> : null}

          <form onSubmit={onSubmit} className="border-t border-white/[0.07] p-3">
            <div className="flex items-center gap-2 rounded-2xl border border-white/[0.09] bg-black/20 p-1.5 pl-3 focus-within:border-[#c8ff62]/35">
              <input value={input} onChange={(event) => setInput(event.target.value)} disabled={isLoading} placeholder="Ask about your portfolio…" className="h-9 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25" aria-label="Message the portfolio advisor" />
              <button type="submit" disabled={!input.trim() || isLoading} className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#c8ff62] text-[#07100d] transition hover:bg-[#d8ff91] disabled:cursor-not-allowed disabled:opacity-30" aria-label="Send message"><Send className="size-4" /></button>
            </div>
            <p className="mt-2 text-center text-[9px] text-white/20">AI guidance is educational, not financial advice.</p>
          </form>
        </section>
      ) : (
        <button onClick={() => setIsOpen(true)} className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0d1814]/95 p-2 pr-4 text-white shadow-[0_18px_60px_rgba(0,0,0,.4)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#c8ff62]/30" aria-label="Open WealthOne AI assistant">
          <span className="relative grid size-11 place-items-center rounded-xl bg-[#c8ff62] text-[#07100d]"><MessageCircle className="size-5" /><span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-[#0d1814] bg-[#72efb1]" /></span>
          <span className="hidden text-left sm:block"><span className="block text-xs font-semibold">Ask WealthOne</span><span className="mt-0.5 block text-[10px] text-white/35">AI portfolio advisor</span></span>
          <X className="hidden" />
        </button>
      )}
    </div>
  );
}

