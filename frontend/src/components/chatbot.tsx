'use client';

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

interface Message {
  id: number;
  role: "bot" | "user";
  message: string;
}

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [typedMessage, setTypedMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, role: "bot", message: "**Hello!** 🤖 How can I assist you today?" },
  ]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleOnClick = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!typedMessage.trim()) return;

    const userMessage: Message = { id: messages.length + 1, role: "user", message: typedMessage };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const response = await axios.post("/api/gemini", {
        prompt: typedMessage,
      });

      const botMessage: Message = {
        id: messages.length + 2,
        role: "bot",
        message: response.data.text,
      };
      setMessages((prevMessages) => [...prevMessages, botMessage]);
    } catch (err) {
      console.error("Error calling API:", err);
      setMessages((prevMessages) => [...prevMessages, {
        id: messages.length + 2, role: "bot", message: "**Oops!** Something went wrong. Please try again."
      }]);
    } finally {
      setIsLoading(false);
    }

    setTypedMessage("");
  };

  return (
    <div className="fixed bottom-5 right-5" style={{ zIndex: 1000 }}>
      {/* Chat Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gray-900 hover:bg-gray-800 text-white rounded-full flex items-center justify-center shadow-lg border border-gray-700 transition-all duration-300"
        aria-label={isOpen ? "Close chat" : "Open chat"}
      >
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2C7.03 2 3 6.03 3 11c0 2.6 1.08 4.96 2.83 6.65l-.68 2.75a1 1 0 0 0 1.23 1.23l2.75-.68A9.01 9.01 0 0 0 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9z"></path>
          </svg>
        )}
      </button>
      
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-[90vw] sm:w-[30rem] h-[32rem] bg-gray-900 rounded-lg shadow-xl border border-gray-700 flex flex-col overflow-hidden transition-all duration-300">
          {/* Chat Header */}
          <div className="p-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-400 mr-2"></div>
              <h3 className="text-white font-medium">Portfolio Manager</h3>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-200"
              aria-label="Close chat"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          
          {/* Messages Container - Hidden Scrollbar */}
          <div className="flex-1 p-4 overflow-y-auto bg-gray-900 scrollbar-hide">
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
            <div className="scrollbar-hide">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`mb-4 flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div 
                    className={`max-w-3/4 p-3 rounded-lg ${
                      message.role === "user" 
                        ? "bg-blue-600 text-white rounded-br-none" 
                        : "bg-gray-800 text-gray-100 rounded-bl-none"
                    }`}
                  >
                    <span className="block text-sm font-bold mb-1">
                      {message.role === "bot" ? "Bot" : "You"}
                    </span>
                    <ReactMarkdown>{message.message}</ReactMarkdown>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Input Box and Send Button */}
          <form onSubmit={handleOnClick} className="p-3 bg-gray-800 border-t border-gray-700 flex items-center">
            <input
              type="text"
              value={typedMessage}
              onChange={(e) => setTypedMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="ml-2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              {isLoading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ChatBot;