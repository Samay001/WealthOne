"use client";
import { useState, useEffect } from "react";
import { ArrowUpRight, CheckCircle, ArrowUp } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="h-screen flex flex-col relative overflow-hidden bg-[#050314]">
      {/* Background image with light streaks - increased brightness */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center opacity-90"
        style={{
          backgroundImage:
            "url('https://framerusercontent.com/images/oFP0q4fZtDXdgTseJflmzPeHDW4.webp')",
          filter: "brightness(0.95)",
        }}
      />

      {/* Header - takes up 50% of viewport */}
      <header className="relative z-10 w-full h-[50vh] flex flex-col justify-between py-6 px-4 md:px-8 lg:px-16 mt-10">
        <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          {/* Logo and tagline */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <CheckCircle className="text-blue-500 w-6 h-6" />
              <span className="text-white text-2xl font-bold">Wealth One</span>
            </div>
            <p className="text-gray-300 text-sm mt-1">
              Manage your funds in a single space
            </p>
          </div>

          {/* Contact info and CTA */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">Email</span>
              <span className="text-white">support@wealth-one.com</span>
            </div>

            <div className="flex flex-col">
              <span className="text-gray-400 text-sm">Location</span>
              <span className="text-white">Chhattisgarh, IND</span>
            </div>

            <Link
              href="#"
              className="flex items-center gap-2 px-6 py-2 rounded-full border border-gray-700 text-white hover:bg-white/10 transition-colors"
            >
              Get Started <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        <footer className="relative z-10 w-full py-4">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="text-white text-sm mb-4 md:mb-0">
              © 2024 Wealth One | All rights reserved.
            </div>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-2 text-white hover:text-gray-300 transition-colors"
            >
              Back to top <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </footer>
      </header>

      {/* Main content - takes up 50% of viewport */}
      <main className="relative z-10 h-[50vh] flex items-center justify-center px-4">
        <h1 className="text-white text-7xl md:text-9xl lg:text-[10rem] xl:text-[12rem] font-bold tracking-tighter leading-none">
          Wealth One
        </h1>
      </main>

      

      {/* Scroll to top button (fixed) */}
      {scrolled && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-50 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}
