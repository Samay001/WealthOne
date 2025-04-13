import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import AboutContent from "@/data/chatbot/wealth-one.json" assert { type: "json" };
import StocksContent from "@/data/sample/stock.json" assert { type: "json" };
import CryptoContent from "@/data/sample/crypto.json" assert { type: "json" };

const geminiApiKey = process.env.GEMINI_API_KEY;
if (!geminiApiKey) {
  throw new Error("GEMINI_API_KEY is not defined in the environment variables");
}

const googleAI = new GoogleGenerativeAI(geminiApiKey);
const geminiModel = googleAI.getGenerativeModel({ model: "gemini-2.0-flash" });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const contextualPrompt = `
      You are an AI assistant responding to queries about portfolio.  
      Below is relevant portfolio information:  

      **About Wealth One:**  
      ${JSON.stringify(AboutContent, null, 2)}  

      **Stocks Holdings:**  
      ${JSON.stringify(StocksContent, null, 2)} 

      **Crypto Holdings:**  
      ${JSON.stringify(CryptoContent, null, 2)} 

      **Instructions:**  
      - Provide a **short and concise** response.  
      - Use **bold** text for key points and *italic* text for emphasis.  
      - Format the response properly for readability.  
      - Keep answers direct and relevant to the question.  

      **User's Question:**  
      ${prompt}  

      **Response:** (Generate a well-structured, formatted answer)
    `;

    const result = await geminiModel.generateContent(contextualPrompt);
    const response = result.response;
    return NextResponse.json({ text: response.text() });
  } 
  catch (error) {
    console.error("Error generating content:", error);
    return NextResponse.json({ error: "Failed to generate content" }, { status: 500 });
  }
}