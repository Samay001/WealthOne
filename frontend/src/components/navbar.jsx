"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { auth, logout } = useAuth();
  const router = useRouter();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const displayName = auth?.user?.username || null;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="absolute top-2 left-0 right-0 z-10 p-4">
        <nav className="flex justify-between items-center max-w-6xl mx-auto">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-white">Wealth One</span>
          </div>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center space-x-6">
            <li>
              <Link href="#" className="text-white hover:text-gray-300 transition">
                About
              </Link>
            </li>
            <li>
              <Link href="#" className="text-white hover:text-gray-300 transition">
                Contact
              </Link>
            </li>
            {auth?.isAuthenticated && displayName ? (
              <>
                <li>
                  <button
                    onClick={handleLogout}
                    className="bg-blue-500 text-white px-4 py-1.5 rounded-md hover:bg-blue-700 transition duration-300"
                  >
                    Logout {displayName}
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  href="/login"
                  className="bg-blue-500 text-gray-200 px-5 py-1.5 rounded-md hover:bg-blue-600 transition duration-300"
                >
                  Login
                </Link>
              </li>
            )}
          </ul>

          {/* Hamburger Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden focus:outline-none z-50 relative"
            aria-label="Toggle Menu"
          >
            <div className="w-6 space-y-1.5 transform transition duration-300 ease-in-out">
              <div className={`h-0.5 w-6 bg-white ${isMenuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <div className={`h-0.5 w-6 bg-white ${isMenuOpen ? "opacity-0" : ""}`} />
              <div className={`h-0.5 w-6 bg-white ${isMenuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>

          {/* Mobile Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 0.3 }}
                className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-lg shadow-2xl z-40 md:hidden"
              >
                <div className="container mx-auto px-4 pt-24 pb-10">
                  <button
                    onClick={toggleMenu}
                    className="absolute top-6 right-4 text-gray-600 hover:text-gray-900 transition"
                    aria-label="Close Menu"
                  >
                    ✕
                  </button>

                  <div className="flex flex-col space-y-6 items-start">
                    <Link href="/about" onClick={toggleMenu} className="text-gray-800 text-xl hover:text-blue-600">
                      About
                    </Link>
                    <Link href="/contact" onClick={toggleMenu} className="text-gray-800 text-xl hover:text-blue-600">
                      Contact
                    </Link>
                    {auth?.isAuthenticated && displayName ? (
                      <>
                        <span className="text-lg text-gray-700">Hi, {displayName}</span>
                        <button
                          onClick={() => {
                            handleLogout();
                            toggleMenu();
                          }}
                          className="bg-red-500 text-white px-8 py-3 rounded-md hover:bg-red-600 transition"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link
                        href="/login"
                        onClick={toggleMenu}
                        className="bg-blue-500 text-white px-8 py-3 rounded-md hover:bg-blue-600 transition"
                      >
                        Login
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;