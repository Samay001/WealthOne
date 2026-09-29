"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { Bot, ChevronDown, MessageCircle, Send, Sparkles, User, X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useCrypto } from "@/app/context/cryptoContext";
import { useStock } from "@/app/context/stockContext";

interface Message {
  id: string;
  role: "assistant" | "user";
  content: string;
  sources?: Array<{ title: string; url: string }>;
}

type ContextAsset = {
  name: string;
  symbol: string;
  quantity: string | number;
  price: string | number;
  cmp?: number | null;
  investment?: number;
  currentValue?: number | null;
  returnAmount?: number | null;
  returnPercentage?: number | null;
  hasCurrentData?: boolean;
};

const starters = ["Review my portfolio today", "What is my biggest risk?", "How are my holdings moving today?"];

export default function ChatBot() {
  const { fetchAllCmpPrices, getStockData } = useStock() as {
    fetchAllCmpPrices: () => Promise<Record<string, number>>;
    getStockData: (prices?: Record<string, number>) => ContextAsset[];
  };
  const { fetchCmpData, getCryptoData } = useCrypto() as {
    fetchCmpData: () => Promise<Record<string, { inr: number }> | undefined>;
    getCryptoData: (prices?: Record<string, { inr: number }>, visible?: boolean) => ContextAsset[];
  };
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: "welcome", role: "assistant", content: "Hi, I’m your **WealthOne AI advisor**. I refresh portfolio prices before each answer and can explain today’s movement, allocation, returns, and risk." },
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
      const [stockRefresh, cryptoRefresh] = await Promise.allSettled([
        fetchAllCmpPrices(),
        fetchCmpData(),
      ]);
      const refreshedStockPrices = stockRefresh.status === "fulfilled"
        ? stockRefresh.value
        : {};
      const refreshedCryptoPrices = cryptoRefresh.status === "fulfilled" && cryptoRefresh.value
        ? cryptoRefresh.value
        : {};

      const stocks = getStockData(refreshedStockPrices).map((asset) => ({
        assetClass: "stock" as const,
        name: asset.name,
        symbol: asset.symbol,
        quantity: Number(asset.quantity),
        averagePrice: Number(asset.price),
        currentPrice: asset.cmp ?? null,
        investment: asset.investment ?? Number(asset.price) * Number(asset.quantity),
        currentValue: asset.currentValue ?? asset.investment ?? Number(asset.price) * Number(asset.quantity),
        returnAmount: asset.returnAmount ?? 0,
        returnPercentage: asset.returnPercentage ?? 0,
        hasLivePrice: Boolean(asset.hasCurrentData),
      }));
      const crypto = getCryptoData(refreshedCryptoPrices, Object.keys(refreshedCryptoPrices).length > 0).map((asset) => ({
        assetClass: "crypto" as const,
        name: asset.name,
        symbol: asset.symbol.replace("INR", ""),
        quantity: Number(asset.quantity),
        averagePrice: Number(asset.price),
        currentPrice: asset.cmp ?? null,
        investment: asset.investment ?? Number(asset.price) * Number(asset.quantity),
        currentValue: asset.currentValue ?? asset.investment ?? Number(asset.price) * Number(asset.quantity),
        returnAmount: asset.returnAmount ?? 0,
        returnPercentage: asset.returnPercentage ?? 0,
        hasLivePrice: Boolean(asset.hasCurrentData),
      }));
      const holdings = [...stocks, ...crypto];
      const investment = holdings.reduce((sum, asset) => sum + asset.investment, 0);
      const currentValue = holdings.reduce((sum, asset) => sum + asset.currentValue, 0);
      const stockValue = stocks.reduce((sum, asset) => sum + asset.currentValue, 0);
      const cryptoValue = crypto.reduce((sum, asset) => sum + asset.currentValue, 0);
      const returnAmount = currentValue - investment;

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt,
          portfolio: {
            currency: "INR",
            generatedAt: new Date().toISOString(),
            holdings,
            summary: {
              currentValue,
              investment,
              returnAmount,
              returnPercentage: investment ? (returnAmount / investment) * 100 : 0,
              stockValue,
              cryptoValue,
            },
            source: {
              holdings: "WealthOne frontend portfolio data",
              prices: "Freshly requested from the WealthOne Spring Boot market-price API immediately before this chat request",
            },
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to reach the advisor");
      setMessages((current) => [...current, {
        id: `${Date.now()}-assistant`,
        role: "assistant",
        content: data.text,
        sources: data.sources,
      }]);
    } catch (error) {
      const message = error instanceof Error && error.message.includes("OPENAI_API_KEY")
        ? "The AI advisor is temporarily unavailable because its server key has not been configured."
        : "I couldn’t complete that request. Please try again in a moment.";
      setMessages((current) => [...current, { id: `${Date.now()}-error`, role: "assistant", content: message }]);
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
        <section className="flex h-[min(680px,calc(100vh-2rem))] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[26px] border border-blue-200/15 bg-[#070b22]/95 text-white shadow-[0_28px_90px_rgba(0,0,0,.48)] backdrop-blur-2xl sm:h-[600px] sm:w-[400px]" aria-label="WealthOne AI assistant">
          <header className="border-b border-white/[0.07] px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="relative grid size-10 place-items-center rounded-2xl bg-[#60a5fa] text-[#00031c]"><Sparkles className="size-4" /><span className="absolute -right-0.5 -top-0.5 size-2.5 rounded-full border-2 border-[#070b22] bg-[#818cf8]" /></div>
              <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><h2 className="text-sm font-semibold">WealthOne AI</h2><span className="rounded-full bg-[#60a5fa]/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-[#60a5fa]">GPT-4.1</span></div><p className="mt-0.5 text-[11px] text-white/35">Portfolio intelligence, on demand</p></div>
              <button onClick={() => setIsOpen(false)} className="grid size-8 place-items-center rounded-xl text-white/35 transition hover:bg-white/[0.06] hover:text-white" aria-label="Close assistant"><ChevronDown className="size-4" /></button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto px-4 py-5" aria-live="polite">
            <div className="space-y-5">
              {messages.map((message) => (
                <div key={message.id} className={`flex items-end gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  {message.role === "assistant" ? <div className="grid size-7 shrink-0 place-items-center rounded-xl bg-[#60a5fa]/10 text-[#60a5fa]"><Bot className="size-3.5" /></div> : null}
                  <div className={`max-w-[82%] rounded-2xl px-3.5 py-3 text-[13px] leading-6 ${message.role === "user" ? "rounded-br-md bg-[#60a5fa] text-[#00031c]" : "rounded-bl-md border border-white/[0.07] bg-white/[0.045] text-white/72"}`}>
                    <ReactMarkdown components={{ p: ({ children }) => <p>{children}</p>, strong: ({ children }) => <strong className="font-semibold text-inherit">{children}</strong>, ul: ({ children }) => <ul className="mt-2 list-disc space-y-1 pl-4">{children}</ul>, a: ({ children, href }) => <a href={href} target="_blank" rel="noreferrer" className="underline underline-offset-2">{children}</a> }}>{message.content}</ReactMarkdown>
                    {message.sources?.length ? <div className="mt-3 border-t border-white/[0.07] pt-2"><p className="mb-1 text-[9px] font-semibold uppercase tracking-wider text-white/30">Live sources</p><div className="flex flex-wrap gap-1.5">{message.sources.map((source, index) => <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="max-w-full truncate rounded-full bg-white/[0.06] px-2 py-0.5 text-[9px] text-[#60a5fa] transition hover:bg-white/[0.1]" title={source.title}>{index + 1}. {source.title}</a>)}</div></div> : null}
                  </div>
                  {message.role === "user" ? <div className="grid size-7 shrink-0 place-items-center rounded-xl bg-[#a78bfa]/15 text-[#b9a4ff]"><User className="size-3.5" /></div> : null}
                </div>
              ))}
              {isLoading ? <div className="flex items-end gap-2"><div className="grid size-7 place-items-center rounded-xl bg-[#60a5fa]/10 text-[#60a5fa]"><Bot className="size-3.5" /></div><div className="flex gap-1 rounded-2xl rounded-bl-md border border-white/[0.07] bg-white/[0.045] px-4 py-4"><span className="size-1.5 animate-bounce rounded-full bg-white/35 [animation-delay:-.3s]" /><span className="size-1.5 animate-bounce rounded-full bg-white/35 [animation-delay:-.15s]" /><span className="size-1.5 animate-bounce rounded-full bg-white/35" /></div></div> : null}
              <div ref={endRef} />
            </div>
          </div>

          {messages.length === 1 ? <div className="flex gap-2 overflow-x-auto px-4 pb-3">{starters.map((starter) => <button key={starter} onClick={() => void sendMessage(starter)} className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.035] px-3 py-1.5 text-[10px] text-white/45 transition hover:border-[#60a5fa]/35 hover:text-[#60a5fa]">{starter}</button>)}</div> : null}

          <form onSubmit={onSubmit} className="border-t border-white/[0.07] p-3">
            <div className="flex items-center gap-2 rounded-2xl border border-white/[0.09] bg-black/20 p-1.5 pl-3 focus-within:border-[#60a5fa]/40">
              <input value={input} onChange={(event) => setInput(event.target.value)} disabled={isLoading} placeholder="Ask about your portfolio…" className="h-9 min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/25" aria-label="Message the portfolio advisor" />
              <button type="submit" disabled={!input.trim() || isLoading} className="grid size-9 shrink-0 place-items-center rounded-xl bg-[#3b82f6] text-white transition hover:bg-[#2563eb] disabled:cursor-not-allowed disabled:opacity-30" aria-label="Send message"><Send className="size-4" /></button>
            </div>
            <p className="mt-2 text-center text-[9px] text-white/20">AI guidance is educational, not financial advice.</p>
          </form>
        </section>
      ) : (
        <button onClick={() => setIsOpen(true)} className="group flex items-center gap-3 rounded-2xl border border-blue-200/15 bg-[#0f172a]/95 p-2 pr-4 text-white shadow-[0_18px_60px_rgba(0,0,0,.4)] backdrop-blur-xl transition hover:-translate-y-0.5 hover:border-[#60a5fa]/35" aria-label="Open WealthOne AI assistant">
          <span className="relative grid size-11 place-items-center rounded-xl bg-[#60a5fa] text-[#00031c]"><MessageCircle className="size-5" /><span className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-[#0f172a] bg-[#818cf8]" /></span>
          <span className="hidden text-left sm:block"><span className="block text-xs font-semibold">Ask WealthOne</span><span className="mt-0.5 block text-[10px] text-white/35">AI portfolio advisor</span></span>
          <X className="hidden" />
        </button>
      )}
    </div>
  );
}
