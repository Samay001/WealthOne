import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import AboutContent from "@/data/chatbot/wealth-one.json" assert { type: "json" };
import StocksContent from "@/data/sample/stock.json" assert { type: "json" };
import CryptoContent from "@/data/sample/crypto.json" assert { type: "json" };

// Validate Gemini Key
const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables");
}

const googleAI = new GoogleGenerativeAI(geminiApiKey);
const geminiModel = googleAI.getGenerativeModel({ model: "gemini-2.0-flash" });

// -- Utils --

function needsCMP(prompt: string): boolean {
  return /(cmp|current\s+price|price\s+of|live\s+value|portfolio\s+value|latest\s+price)/i.test(prompt);
}

function extractStockSymbols(prompt: string): string[] {
  const regex = /\b[A-Z]{3,10}\b/g;
  return [...prompt.matchAll(regex)].map(match => match[0]);
}

type StockAPIResponse = {
  currentPrice: {
    NSE: string;
    BSE: string;
  };
};

async function getStockPrice(stockName: string): Promise<StockAPIResponse | null> {
  try {
    const res = await fetch(`https://wealthone.onrender.com/api/v1/stock?name=${stockName}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

type CryptoAPIResponse = {
  data: Record<string, {
    quote: {
      INR: {
        price: number;
      };
    };
  }>;
};

async function getCryptoPrices(): Promise<Record<string, number>> {
  try {
    const res = await fetch("https://wealthone.onrender.com/api/crypto/prices?ids=bitcoin,solana,ripple,ethereum&vs_currencies=inr");
    if (!res.ok) return {};
    const json: CryptoAPIResponse = await res.json();
    const prices: Record<string, number> = {};

    for (const [symbol, info] of Object.entries(json.data)) {
      if (info.quote?.INR?.price !== undefined) {
        prices[symbol.toUpperCase()] = info.quote.INR.price;
      }
    }

    return prices;
  } catch {
    return {};
  }
}

// -- Main POST Handler --

export async function POST(req: Request) {
  try {
    const { prompt }: { prompt: string } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    let stockInfo = "";
    let cryptoInfo = "";

    if (needsCMP(prompt)) {
      const stockSymbols = extractStockSymbols(prompt);
      const processed = new Set<string>();

      for (const symbol of stockSymbols) {
        if (processed.has(symbol)) continue;
        const priceData = await getStockPrice(symbol);
        if (priceData?.currentPrice) {
          stockInfo += `- **${symbol}**: NSE ₹${priceData.currentPrice.NSE}, BSE ₹${priceData.currentPrice.BSE}\n`;
          processed.add(symbol);
        }
      }

      const cryptoPrices = await getCryptoPrices();
      for (const [symbol, price] of Object.entries(cryptoPrices)) {
        cryptoInfo += `- **${symbol}**: ₹${price.toFixed(2)}\n`;
      }
    }

      const contextualPrompt = `
      You are an intelligent AI financial advisor integrated into the Wealth One platform. Your goal is to assist users with queries about their investment portfolio, including live valuations, risk management, diversification, and market trends.

      📘 **About Wealth One:**  
      ${JSON.stringify(AboutContent, null, 2)}  

      📊 **User's Stock Holdings:**  
      ${JSON.stringify(StocksContent, null, 2)}  

      🪙 **User's Crypto Holdings:**  
      ${JSON.stringify(CryptoContent, null, 2)}  

      ${stockInfo ? "**📈 Live Stock Prices (INR):**\n" + stockInfo + "\n" : ""}
      ${cryptoInfo ? "**💰 Live Crypto Prices (INR):**\n" + cryptoInfo + "\n" : ""}

      📚 **Wealth One Philosophy & Guidelines:**  
      - Focus on *long-term growth*, not short-term trading.  
      - Encourage *diversified portfolios* across asset classes (stocks, crypto, etc.).  
      - Crypto holdings are considered **high risk** and should be capped based on the user’s risk tolerance.  
      - Recommend *rebalancing* portfolios if any asset class exceeds acceptable thresholds.  
      - Evaluate user risk profile using asset volatility and concentration.
      - Highlight the importance of emergency funds and liquidity for financial stability.
      - *Avoid giving financial guarantees.* Focus on educating and empowering the user.

      🧠 **Instructions:**
      - If the user asks about CMP or portfolio value, use live prices + holdings to calculate it.
      - If the user asks about **diversification, risk, strategy, or allocation**, provide a clear, educational answer.
      - Use **bold** for key terms and numbers, and *italic* for emphasis.
      - Never fabricate prices or financial advice. If data is missing, explain it gently.
      - Assume user is moderately informed but values clarity and directness.
      - Provide short and concise responses, ideally under 100 words.

      **User's Question:**
      ${prompt}

      **Response:**
      `;


    const result = await geminiModel.generateContent(contextualPrompt);
    return NextResponse.json({ text: result.response.text() });

  } catch (error) {
    console.error("Error generating response:", error);
    return NextResponse.json({ error: "Failed to generate response" }, { status: 500 });
  }
}
